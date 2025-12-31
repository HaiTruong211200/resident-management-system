import api from "../lib/api";

export interface AgeDistribution {
  "0-5": number;
  "6-18": number;
  "19-35": number;
  "36-60": number;
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
// Simple in-memory cache to avoid refetching when switching pages
const CACHE_TTL = 0; // No cache for statistics

const cache: {
  paymentTypes: { timestamp: number; data: PaymentTypeStatistics[] | null };
  dashboard: { timestamp: number; data: DashboardStatistics | null };
  household: Map<
    string,
    { timestamp: number; data: HouseholdStatistics | null }
  >;
} = {
  paymentTypes: { timestamp: 0, data: null },
  dashboard: { timestamp: 0, data: null },
  household: new Map(),
};

export const StatisticsService = {
  /**
   * Xóa cache để force refresh dữ liệu
   */
  clearCache() {
    cache.dashboard = { timestamp: 0, data: null };
    cache.paymentTypes = { timestamp: 0, data: null };
    cache.household.clear();
  },

  /**
   * Lấy thống kê tổng quan cho dashboard
   */
  async getDashboardStatistics({ force = false } = {}) {
    if (
      !force &&
      cache.dashboard.data &&
      Date.now() - cache.dashboard.timestamp < CACHE_TTL
    ) {
      return cache.dashboard.data;
    }

    const response = await api.get("/statistics/dashboard");
    const statistics =
      response.data.data?.statistics ||
      response.data.statistics ||
      response.data;
    cache.dashboard = { timestamp: Date.now(), data: statistics };
    return statistics;
  },

  /**
   * Lấy thống kê theo từng loại khoản thu
   */
  async getPaymentTypeStatistics({ force = false } = {}): Promise<
    PaymentTypeStatistics[]
  > {
    if (
      !force &&
      cache.paymentTypes.data &&
      Date.now() - cache.paymentTypes.timestamp < CACHE_TTL
    ) {
      return cache.paymentTypes.data as PaymentTypeStatistics[];
    }

    const response = await api.get("/statistics/payment-types");
    const data =
      response.data.data?.statistics ||
      response.data.statistics ||
      response.data;
    cache.paymentTypes = { timestamp: Date.now(), data };
    return data;
  },

  /**
   * Lấy thống kê cho một hộ gia đình cụ thể
   */
  async getHouseholdStatistics(
    householdId: string,
    { force = false } = {}
  ): Promise<HouseholdStatistics> {
    const entry = cache.household.get(householdId);
    if (!force && entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data as HouseholdStatistics;
    }

    const response = await api.get(`/statistics/household/${householdId}`);
    const data =
      response.data.data?.statistics ||
      response.data.statistics ||
      response.data;
    cache.household.set(householdId, { timestamp: Date.now(), data });
    return data;
  },

  clearStatisticsCache() {
    cache.paymentTypes = { timestamp: 0, data: null };
    cache.dashboard = { timestamp: 0, data: null };
    cache.household.clear();
  },
};
