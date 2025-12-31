const { getSupabase } = require("../config/db");
const { sendSuccess, sendError } = require("../utils/response");

async function getDashboardStatistics(req, res) {
  try {
    const supabase = getSupabase();
    const currentYear = new Date().getFullYear();

    // Tính toán ngày bắt đầu cho biểu đồ 12 tháng (Start date 11 tháng trước)
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const startDateStr = oneYearAgo.toISOString().split("T")[0];

    // 1. CHẠY SONG SONG CÁC QUERY ĐỘC LẬP
    // Thay vì await từng cái, ta gom lại chạy 1 lần
    const [
      householdsRes,
      residentsRes,
      paymentTypesRes,
      paymentsRes,
      residentsAgeRes,
    ] = await Promise.all([
      // Tổng hộ khẩu
      supabase.from("households").select("id", { count: "exact", head: true }),

      // Tổng nhân khẩu (chỉ những người chưa bị xóa)
      supabase
        .from("residents")
        .select("id", { count: "exact", head: true })
        .is("deletedAt", null),

      // Các loại phí (để map tên/loại)
      supabase.from("paymentTypes").select("paymentTypeId, type"),

      // Lấy TẤT CẢ các khoản thanh toán (chỉ lấy cột cần thiết để tính toán)
      // Lưu ý: Nếu dữ liệu quá lớn (hàng triệu dòng), cần dùng RPC (Database Function) thay vì xử lý ở JS.
      supabase
        .from("householdPayments")
        .select("amountPaid, paymentTypeId, paymentDate")
        .order("paymentDate", { ascending: false }), // Order để lấy 10 giao dịch gần nhất luôn

      // Lấy ngày sinh để tính độ tuổi (chỉ những người chưa bị xóa)
      supabase
        .from("residents")
        .select("dateOfBirth")
        .is("deletedAt", null)
        .not("dateOfBirth", "is", null),
    ]);

    // Kiểm tra lỗi chung
    if (householdsRes.error) throw householdsRes.error;
    if (residentsRes.error) throw residentsRes.error;
    if (paymentTypesRes.error) throw paymentTypesRes.error;
    if (paymentsRes.error) throw paymentsRes.error;
    if (residentsAgeRes.error) throw residentsAgeRes.error;

    // 2. XỬ LÝ DỮ LIỆU TRÊN RAM (JS)

    // --- Map Payment Types ---
    const paymentTypeMap = {}; // { id: 'Bắt buộc' | 'Tự nguyện' }
    paymentTypesRes.data.forEach((pt) => {
      paymentTypeMap[pt.paymentTypeId] = pt.type;
    });

    // --- Xử lý Payments (Tổng tiền & Biểu đồ tháng) ---
    let totalFees = 0;
    let totalFunds = 0;

    // Khởi tạo map cho 12 tháng
    const monthlyStats = {};
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`; // Key: YYYY-MM
      monthlyStats[key] = {
        month: `T${String(d.getMonth() + 1).padStart(2, "0")}`,
        fees: 0,
        funds: 0,
      };
    }

    const allPayments = paymentsRes.data;

    allPayments.forEach((payment) => {
      const amount = parseFloat(payment.amountPaid) || 0;
      const type = paymentTypeMap[payment.paymentTypeId];

      // 1. Tính tổng toàn cục
      if (type === "Bắt buộc") totalFees += amount;
      else if (type === "Tự nguyện") totalFunds += amount;

      // 2. Tính biểu đồ tháng (chỉ nếu paymentDate nằm trong khoảng 12 tháng gần đây)
      if (payment.paymentDate && payment.paymentDate >= startDateStr) {
        const monthKey = payment.paymentDate.substring(0, 7); // Lấy YYYY-MM
        if (monthlyStats[monthKey]) {
          if (type === "Bắt buộc") monthlyStats[monthKey].fees += amount;
          else if (type === "Tự nguyện") monthlyStats[monthKey].funds += amount;
        }
      }
    });

    // Chuyển object monthlyStats thành array và đảo ngược cho đúng thứ tự thời gian
    const monthlyCollection = Object.values(monthlyStats)
      .reverse()
      .map((m) => ({ ...m, total: m.fees + m.funds }));

    // --- Xử lý Age Distribution ---
    const ageDistribution = {
      "0-5": 0,
      "6-18": 0,
      "19-35": 0,
      "36-60": 0,
      "60+": 0,
    };

    residentsAgeRes.data.forEach((resident) => {
      const birthDate = new Date(resident.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Nếu chưa qua sinh nhật trong năm nay thì trừ 1 tuổi
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age <= 5) ageDistribution["0-5"]++;
      else if (age <= 18) ageDistribution["6-18"]++;
      else if (age <= 35) ageDistribution["19-35"]++;
      else if (age <= 60) ageDistribution["36-60"]++;
      else ageDistribution["60+"]++;
    });

    // --- Recent Transactions ---
    // Vì ta đã order ở query, chỉ cần slice 10 phần tử đầu
    const recentTransactions = allPayments.slice(0, 10);

    return sendSuccess(res, {
      statistics: {
        totalHouseholds: householdsRes.count || 0,
        totalResidents: residentsRes.count || 0,
        totalFees,
        totalFunds,
        totalCollection: totalFees + totalFunds,
        ageDistribution,
        monthlyCollection,
        recentTransactions,
      },
    });
  } catch (err) {
    console.error("Error fetching statistics:", err);
    return sendError(res, {
      status: 500,
      message: "Failed to fetch statistics",
      code: "STATISTICS_ERROR",
    });
  }
}

async function getPaymentTypeStatistics(req, res) {
  try {
    const supabase = getSupabase();

    // CHẠY SONG SONG: Lấy danh sách loại phí VÀ toàn bộ payments
    const [typesRes, paymentsRes] = await Promise.all([
      supabase.from("paymentTypes").select("*"),
      supabase
        .from("householdPayments")
        .select("amountPaid, status, paymentTypeId, paymentDate"),
    ]);

    if (typesRes.error) throw typesRes.error;
    if (paymentsRes.error) throw paymentsRes.error;

    // Tạo map để gom nhóm dữ liệu
    // Key: paymentTypeId, Value: Object thống kê
    const statsMap = {};

    // Khởi tạo map
    typesRes.data.forEach((pt) => {
      statsMap[pt.paymentTypeId] = {
        paymentTypeId: pt.paymentTypeId,
        name: pt.name,
        type: pt.type,
        totalCollected: 0,
        totalPayments: 0,
        paidCount: 0,
        unpaidCount: 0,
        partialCount: 0,
      };
    });

    // Build a helper map from paymentTypeId -> type label (e.g. 'Bắt buộc' | 'Tự nguyện')
    const paymentTypeMap = {};
    typesRes.data.forEach((pt) => {
      paymentTypeMap[pt.paymentTypeId] = pt.type;
    });

    // Loop 1 lần duy nhất qua bảng Payments (O(n)) thay vì Loop lồng nhau (O(n*m))
    paymentsRes.data.forEach((p) => {
      const stats = statsMap[p.paymentTypeId];
      if (stats) {
        stats.totalPayments++;
        stats.totalCollected += parseFloat(p.amountPaid) || 0;

        if (p.status === "Đã đóng") stats.paidCount++;
        else if (p.status === "Chưa đóng" || p.status === "Quá hạn")
          stats.unpaidCount++;
        else if (p.status === "Một phần") stats.partialCount++;
      }
    });

    // --- Monthly aggregation (group by paymentDate's YYYY-MM) ---
    // Aggregate totals per month and split by payment `type` ("Bắt buộc" vs "Tự nguyện")
    const monthlyMap = {};
    paymentsRes.data.forEach((p) => {
      if (!p.paymentDate) return; // skip if no date
      const monthKey = String(p.paymentDate).substring(0, 7); // YYYY-MM
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          month: monthKey,
          totalCollected: 0,
          totalPayments: 0,
          fees: 0,
          funds: 0,
          byType: {},
        };
      }

      const amt = parseFloat(p.amountPaid) || 0;
      monthlyMap[monthKey].totalCollected += amt;
      monthlyMap[monthKey].totalPayments++;

      const pTypeLabel = paymentTypeMap[p.paymentTypeId];
      if (pTypeLabel === "Bắt buộc") monthlyMap[monthKey].fees += amt;
      else if (pTypeLabel === "Tự nguyện") monthlyMap[monthKey].funds += amt;

      const typeId = p.paymentTypeId;
      if (!monthlyMap[monthKey].byType[typeId]) {
        monthlyMap[monthKey].byType[typeId] = {
          paymentTypeId: typeId,
          totalCollected: 0,
          totalPayments: 0,
        };
      }
      monthlyMap[monthKey].byType[typeId].totalCollected += amt;
      monthlyMap[monthKey].byType[typeId].totalPayments++;
    });

    // Convert monthlyMap to sorted array (ascending by month)
    const monthlyAggregation = Object.keys(monthlyMap)
      .sort()
      .map((k) => ({
        month: k,
        totalCollected: monthlyMap[k].totalCollected,
        totalPayments: monthlyMap[k].totalPayments,
        fees: monthlyMap[k].fees,
        funds: monthlyMap[k].funds,
        byType: Object.values(monthlyMap[k].byType),
      }));

    return sendSuccess(res, {
      statistics: Object.values(statsMap),
      monthlyAggregation,
    });
  } catch (err) {
    console.error("Error fetching payment type statistics:", err);
    return sendError(res, {
      status: 500,
      message: "Failed to fetch payment type statistics",
      code: "PAYMENT_TYPE_STATISTICS_ERROR",
    });
  }
}

async function getHouseholdStatistics(req, res) {
  try {
    const supabase = getSupabase();
    const { householdId } = req.params;

    if (!householdId) {
      return sendError(res, {
        status: 400,
        message: "Household ID is required",
        code: "MISSING_HOUSEHOLD_ID",
      });
    }

    // CHẠY SONG SONG 3 REQUEST
    const [householdRes, paymentsRes, residentsRes] = await Promise.all([
      supabase.from("households").select("*").eq("id", householdId).single(),

      supabase
        .from("householdPayments")
        .select("amountPaid, status") // Chỉ select cột cần thiết
        .eq("householdId", householdId),

      supabase
        .from("residents")
        .select("id", { count: "exact", head: true })
        .eq("householdId", householdId)
        .is("deletedAt", null),
    ]);

    if (householdRes.error) throw householdRes.error;
    if (paymentsRes.error) throw paymentsRes.error;
    if (residentsRes.error) throw residentsRes.error;

    let totalPaid = 0;
    let paidCount = 0;
    let unpaidCount = 0;

    paymentsRes.data.forEach((payment) => {
      totalPaid += parseFloat(payment.amountPaid) || 0;
      if (payment.status === "Đã đóng") paidCount++;
      else unpaidCount++;
    });

    return sendSuccess(res, {
      statistics: {
        household: householdRes.data,
        totalPaid,
        totalPayments: paymentsRes.data.length,
        paidCount,
        unpaidCount,
        residentsCount: residentsRes.count || 0,
      },
    });
  } catch (err) {
    console.error("Error fetching household statistics:", err);
    return sendError(res, {
      status: 500,
      message: "Failed to fetch household statistics",
      code: "HOUSEHOLD_STATISTICS_ERROR",
    });
  }
}

module.exports = {
  getDashboardStatistics,
  getPaymentTypeStatistics,
  getHouseholdStatistics,
};
