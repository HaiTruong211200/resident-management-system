const {getSupabase} = require('../config/db');
const {sendSuccess, sendError} = require('../utils/response');

const DASHBOARD_CACHE_TTL_MS = Number(process.env.DASHBOARD_CACHE_TTL_MS || 60_000);

/** @type {{ value: any, expiresAt: number, inFlight: Promise<any> | null }} */
const dashboardCache = {
  value: null,
  expiresAt: 0,
  inFlight: null,
};

const shouldLogTimings = () => process.env.STATISTICS_TIMING === '1';

async function time(label, fn) {
  if (!shouldLogTimings()) return fn();
  const start = Date.now();
  try {
    return await fn();
  } finally {
    const ms = Date.now() - start;
    console.log(`[statistics] ${label}: ${ms}ms`);
  }
}

async function computeDashboardStatistics() {
  const supabase = getSupabase();

  const now = new Date();
  const startRange = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const endRange = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startRangeStr = startRange.toISOString().split('T')[0];
  const endRangeStr = endRange.toISOString().split('T')[0];

  const [
    householdsRes,
    residentsRes,
    paymentTypesRes,
    allPaymentsRes,
    residentsWithAgeRes,
    paymentsInRangeRes,
    recentTransactionsRes,
  ] = await Promise.all([
    time('count households', () => supabase.from('households').select('id', {count: 'estimated', head: true})),
    time('count residents', () => supabase.from('residents').select('id', {count: 'estimated', head: true})),
    time('paymentTypes', () => supabase.from('paymentTypes').select('paymentTypeId, type')),
    time('all payments totals', () => supabase.from('householdPayments').select('amountPaid, paymentTypeId')),
    time('residents dob', () => supabase.from('residents').select('dateOfBirth').not('dateOfBirth', 'is', null)),
    time('payments in range', () => supabase.from('householdPayments')
      .select('amountPaid, paymentTypeId, paymentDate')
      .gte('paymentDate', startRangeStr)
      .lte('paymentDate', endRangeStr)),
    time('recent transactions', () => supabase.from('householdPayments')
      .select('paymentId, householdId, paymentTypeId, amountPaid, paymentDate, notes, startDate, dueDate, status, amountExpected')
      .order('paymentDate', {ascending: false})
      .limit(10)),
  ]);

  if (householdsRes.error) throw householdsRes.error;
  if (residentsRes.error) throw residentsRes.error;
  if (paymentTypesRes.error) throw paymentTypesRes.error;
  if (allPaymentsRes.error) throw allPaymentsRes.error;
  if (residentsWithAgeRes.error) throw residentsWithAgeRes.error;
  if (paymentsInRangeRes.error) throw paymentsInRangeRes.error;
  if (recentTransactionsRes.error) throw recentTransactionsRes.error;

  const paymentTypeMap = {};
  (paymentTypesRes.data || []).forEach((pt) => {
    paymentTypeMap[pt.paymentTypeId] = pt.type;
  });

  let totalFees = 0;
  let totalFunds = 0;
  (allPaymentsRes.data || []).forEach((payment) => {
    const amount = parseFloat(payment.amountPaid) || 0;
    const type = paymentTypeMap[payment.paymentTypeId];
    if (type === 'Bắt buộc') totalFees += amount;
    else if (type === 'Tự nguyện') totalFunds += amount;
  });

  const ageDistribution = {
    '0-17': 0,
    '18-30': 0,
    '31-45': 0,
    '46-60': 0,
    '60+': 0,
  };

  const currentYear = new Date().getFullYear();
  (residentsWithAgeRes.data || []).forEach((resident) => {
    const birthYear = new Date(resident.dateOfBirth).getFullYear();
    const age = currentYear - birthYear;

    if (age < 18) ageDistribution['0-17']++;
    else if (age <= 30) ageDistribution['18-30']++;
    else if (age <= 45) ageDistribution['31-45']++;
    else if (age <= 60) ageDistribution['46-60']++;
    else ageDistribution['60+']++;
  });

  const monthAgg = new Map();
  (paymentsInRangeRes.data || []).forEach((payment) => {
    if (!payment.paymentDate) return;
    const d = new Date(payment.paymentDate);
    if (Number.isNaN(d.getTime())) return;

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const current = monthAgg.get(key) || {fees: 0, funds: 0};
    const amount = parseFloat(payment.amountPaid) || 0;
    const type = paymentTypeMap[payment.paymentTypeId];

    if (type === 'Bắt buộc') current.fees += amount;
    else if (type === 'Tự nguyện') current.funds += amount;

    monthAgg.set(key, current);
  });

  const monthlyCollection = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const month = date.getMonth() + 1;
    const monthStr = `T${String(month).padStart(2, '0')}`;
    const sums = monthAgg.get(key) || {fees: 0, funds: 0};
    monthlyCollection.push({
      month: monthStr,
      fees: sums.fees,
      funds: sums.funds,
      total: sums.fees + sums.funds,
    });
  }

  return {
    totalHouseholds: householdsRes.count || 0,
    totalResidents: residentsRes.count || 0,
    totalFees,
    totalFunds,
    totalCollection: totalFees + totalFunds,
    ageDistribution,
    monthlyCollection,
    recentTransactions: recentTransactionsRes.data || [],
  };
}

async function getDashboardStatistics(req, res) {
  try {
    const nowMs = Date.now();
    if (dashboardCache.value && dashboardCache.expiresAt > nowMs) {
      return sendSuccess(res, {statistics: dashboardCache.value});
    }

    if (dashboardCache.inFlight) {
      const statistics = await dashboardCache.inFlight;
      return sendSuccess(res, {statistics});
    }

    dashboardCache.inFlight = time('dashboard total', () => computeDashboardStatistics());

    try {
      const statistics = await dashboardCache.inFlight;
      dashboardCache.value = statistics;
      dashboardCache.expiresAt = Date.now() + DASHBOARD_CACHE_TTL_MS;
      return sendSuccess(res, {statistics});
    } finally {
      dashboardCache.inFlight = null;
    }
  } catch (err) {
    console.error('Error fetching statistics:', err);
    return sendError(res, {
      status: 500,
      message: 'Failed to fetch statistics',
      code: 'STATISTICS_ERROR',
    });
  }
}

async function getPaymentTypeStatistics(req, res) {
  try {
    const supabase = getSupabase();

    const {data: paymentTypes, error: ptError} =
        await supabase.from('paymentTypes').select('*');

    if (ptError) throw ptError;

    const statistics = [];

    for (const pt of paymentTypes) {
      const {data: payments, error: paymentsError} =
          await supabase.from('householdPayments')
              .select('amountPaid, status')
              .eq('paymentTypeId', pt.paymentTypeId);

      if (paymentsError) throw paymentsError;

      let totalCollected = 0;
      let paidCount = 0;
      let unpaidCount = 0;
      let partialCount = 0;

      payments.forEach((payment) => {
        totalCollected += parseFloat(payment.amountPaid) || 0;

        if (payment.status === 'Đã đóng')
          paidCount++;
        else if (payment.status === 'Chưa đóng' || payment.status === 'Quá hạn')
          unpaidCount++;
        else if (payment.status === 'Một phần')
          partialCount++;
      });

      statistics.push({
        paymentTypeId: pt.paymentTypeId,
        name: pt.name,
        type: pt.type,
        totalCollected,
        totalPayments: payments.length,
        paidCount,
        unpaidCount,
        partialCount,
      });
    }

    return sendSuccess(res, {statistics});
  } catch (err) {
    console.error('Error fetching payment type statistics:', err);
    return sendError(res, {
      status: 500,
      message: 'Failed to fetch payment type statistics',
      code: 'PAYMENT_TYPE_STATISTICS_ERROR',
    });
  }
}

async function getHouseholdStatistics(req, res) {
  try {
    const supabase = getSupabase();
    const {householdId} = req.params;

    if (!householdId) {
      return sendError(res, {
        status: 400,
        message: 'Household ID is required',
        code: 'MISSING_HOUSEHOLD_ID',
      });
    }

    const {data: household, error: householdError} =
        await supabase.from('households')
            .select('*')
            .eq('id', householdId)
            .single();

    if (householdError) throw householdError;

    const {data: payments, error: paymentsError} =
        await supabase.from('householdPayments')
            .select('*')
            .eq('householdId', householdId);

    if (paymentsError) throw paymentsError;

    let totalPaid = 0;
    let paidCount = 0;
    let unpaidCount = 0;

    payments.forEach((payment) => {
      totalPaid += parseFloat(payment.amountPaid) || 0;
      if (payment.status === 'Đã đóng')
        paidCount++;
      else
        unpaidCount++;
    });

    const {count: residentsCount, error: residentsError} =
        await supabase.from('residents')
            .select('*', {count: 'exact', head: true})
            .eq('householdId', householdId)
            .is('deletedAt', null);

    if (residentsError) throw residentsError;

    return sendSuccess(res, {
      statistics: {
        household,
        totalPaid,
        totalPayments: payments.length,
        paidCount,
        unpaidCount,
        residentsCount: residentsCount || 0,
      },
    });
  } catch (err) {
    console.error('Error fetching household statistics:', err);
    return sendError(res, {
      status: 500,
      message: 'Failed to fetch household statistics',
      code: 'HOUSEHOLD_STATISTICS_ERROR',
    });
  }
}

module.exports = {
  getDashboardStatistics,
  getPaymentTypeStatistics,
  getHouseholdStatistics,
};
