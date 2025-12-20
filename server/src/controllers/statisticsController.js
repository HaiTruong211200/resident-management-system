const {getSupabase} = require('../config/db');
const {sendSuccess, sendError} = require('../utils/response');

async function getDashboardStatistics(req, res) {
  try {
    const supabase = getSupabase();

    // Get total households (excluding soft deleted)
    const {count: totalHouseholds, error: householdsError} =
        await supabase.from('households')
            .select('*', {count: 'exact', head: true})
            .is('deletedAt', null);

    if (householdsError) throw householdsError;

    // Get total residents (excluding soft deleted)
    const {count: totalResidents, error: residentsError} =
        await supabase.from('residents')
            .select('*', {count: 'exact', head: true})
            .is('deletedAt', null);

    if (residentsError) throw residentsError;

    // Get all payment types to categorize fees vs funds
    const {data: paymentTypes, error: ptError} =
        await supabase.from('paymentTypes').select('paymentTypeId, type');

    if (ptError) throw ptError;

    const paymentTypeMap = {};
    paymentTypes.forEach((pt) => {
      paymentTypeMap[pt.paymentTypeId] = pt.type;
    });

    // Get all payments with amounts
    const {data: payments, error: paymentsError} =
        await supabase.from('householdPayments').select('*');

    if (paymentsError) throw paymentsError;

    let totalFees = 0;
    let totalFunds = 0;

    payments.forEach((payment) => {
      const amount = parseFloat(payment.amountPaid) || 0;
      const type = paymentTypeMap[payment.paymentTypeId];

      if (type === 'Bắt buộc') {
        totalFees += amount;
      } else if (type === 'Tự nguyện') {
        totalFunds += amount;
      }
    });

    // Get age distribution of residents
    const {data: residentsWithAge, error: ageError} =
        await supabase.from('residents')
            .select('dateOfBirth')
            .is('deletedAt', null)
            .not('dateOfBirth', 'is', null);

    if (ageError) throw ageError;

    const ageDistribution = {
      '0-17': 0,
      '18-30': 0,
      '31-45': 0,
      '46-60': 0,
      '60+': 0,
    };

    const currentYear = new Date().getFullYear();
    residentsWithAge.forEach((resident) => {
      const birthYear = new Date(resident.dateOfBirth).getFullYear();
      const age = currentYear - birthYear;

      if (age < 18)
        ageDistribution['0-17']++;
      else if (age <= 30)
        ageDistribution['18-30']++;
      else if (age <= 45)
        ageDistribution['31-45']++;
      else if (age <= 60)
        ageDistribution['46-60']++;
      else
        ageDistribution['60+']++;
    });

    // Get monthly collection data (last 12 months)
    const monthlyCollection = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;

      const startDate =
          new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endDate =
          new Date(year, month, 0).toISOString().split('T')[0];  // Last day

      const {data: monthPayments, error: monthError} =
          await supabase.from('householdPayments')
              .select('amountPaid, paymentTypeId')
              .gte('paymentDate', startDate)
              .lte('paymentDate', endDate);

      if (monthError) throw monthError;

      let monthFees = 0;
      let monthFunds = 0;

      monthPayments.forEach((payment) => {
        const amount = parseFloat(payment.amountPaid) || 0;
        const type = paymentTypeMap[payment.paymentTypeId];

        if (type === 'Bắt buộc') {
          monthFees += amount;
        } else if (type === 'Tự nguyện') {
          monthFunds += amount;
        }
      });

      monthlyCollection.push({
        month: monthStr,
        fees: monthFees,
        funds: monthFunds,
        total: monthFees + monthFunds,
      });
    }

    // Get recent transactions
    const {data: recentTransactions, error: recentError} =
        await supabase.from('householdPayments')
            .select('*')
            .order('paymentDate', {ascending: false})
            .limit(10);

    if (recentError) throw recentError;

    return sendSuccess(res, {
      statistics: {
        totalHouseholds: totalHouseholds || 0,
        totalResidents: totalResidents || 0,
        totalFees,
        totalFunds,
        totalCollection: totalFees + totalFunds,
        ageDistribution,
        monthlyCollection,
        recentTransactions,
      },
    });
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
