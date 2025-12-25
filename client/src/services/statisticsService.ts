import api from "../lib/api";

export interface AgeDistribution {
  "0-17": number;
  "18-30": number;
  "31-45": number;
  "46-60": number;
  "60+": number;
}

export interface MonthlyCollection {
  month: string;
  fees: number;
  funds: number;
  total: number;
}

export interface DashboardStatistics {
  totalHouseholds: number;
  totalResidents: number;
  totalFees: number;
  totalFunds: number;
  totalCollection: number;
  ageDistribution: AgeDistribution;
  monthlyCollection: MonthlyCollection[];
  recentTransactions: any[];
}

export interface PaymentTypeStatistics {
  paymentTypeId: string;
  name: string;
  type: string;
  totalCollected: number;
  totalPayments: number;
  paidCount: number;
  unpaidCount: number;
  partialCount: number;
}

export interface HouseholdStatistics {
  household: any;
  totalPaid: number;
  totalPayments: number;
  paidCount: number;
  unpaidCount: number;
  residentsCount: number;
}

/**
 * Service quản lý các API thống kê
 */
export const StatisticsService = {
  /**
   * Lấy thống kê tổng quan cho dashboard
   */
  async getDashboardStatistics() {
    const response = await api.get("/statistics/dashboard", { timeout: 30000 });
    // Backend trả về: {data: {statistics: {...}}}
    // Axios wraps nó thành: {data: {data: {statistics: {...}}}, status: 200, ...}
    const statistics = response.data.data?.statistics || response.data.statistics || response.data;
    return statistics;
  },

  /**
   * Lấy thống kê theo từng loại khoản thu
   */
  async getPaymentTypeStatistics() {
    const response = await api.get("/statistics/payment-types");
    return response;
  },

  /**
   * Lấy thống kê cho một hộ gia đình cụ thể
   */
  async getHouseholdStatistics(householdId: string) {
    const response = await api.get(`/statistics/household/${householdId}`);
    return response;
  },
};
