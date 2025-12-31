import api from "../lib/api";
import { HouseholdPayment } from "../types";

// Helper to map backend response to frontend type
const mapHouseholdPayment = (data: any): HouseholdPayment => ({
  ...data,
  id: data.paymentId?.toString() || data.id,
  paymentTypeId: data.paymentTypeId?.toString() || data.paymentTypeId,
  householdId: data.householdId?.toString() || data.householdId,
});

/**
 * Service quản lý các khoản thu / đóng phí của hộ dân
 */
export const HouseholdPaymentService = {
  /**
   * Lấy danh sách các khoản thanh toán
   */
  async getHouseholdPayments(params?: {
    page?: number;
    limit?: number;
    householdId?: string;
    paymentTypeId?: string;
    status?: string;
    category?: string;
  }) {
    const response = await api.get("/household-payments", { params });
    // Map paymentId to id
    if (response.data.data.payments) {
      response.data.data.payments = response.data.data.payments.map(mapHouseholdPayment);
    }
    return response;
  },

  /**
   * Lấy chi tiết 1 khoản thanh toán theo id
   */
  async getHouseholdPaymentById(id: string) {
    const response = await api.get(`/household-payments/${id}`);
    // Map paymentId to id
    if (response.data.data.payment) {
      response.data.data.payment = mapHouseholdPayment(response.data.data.payment);
    }
    return response;
  },

  /**
   * Tạo mới khoản thanh toán
   */
  async addHouseholdPayment(data: HouseholdPayment) {
    const response = await api.post("/household-payments", {
      paymentTypeId: Number(data.paymentTypeId),
      householdId: Number(data.householdId),
      amountPaid: Number(data.amountPaid),
      amountExpected: Number(data.amountExpected || 0),
      status: data.status,
      category: data.category,
      startDate: data.startDate,
      paymentDate: data.paymentDate,
      dueDate: data.dueDate,
      payerName: data.payerName,
      notes: data.notes,
    });
    // Map paymentId to id
    if (response.data.data.payment) {
      response.data.data.payment = mapHouseholdPayment(response.data.data.payment);
    }
    return response;
  },

  /**
   * Cập nhật khoản thanh toán
   */
  async updateHouseholdPayment(data: HouseholdPayment) {
    const response = await api.patch(`/household-payments/${data.id}`, {
      amountPaid: Number(data.amountPaid),
      amountExpected: Number(data.amountExpected || 0),
      status: data.status,
      startDate: data.startDate,
      paymentDate: data.paymentDate,
      dueDate: data.dueDate,
      notes: data.notes,
    });
    // Map paymentId to id
    if (response.data.data.payment) {
      response.data.data.payment = mapHouseholdPayment(response.data.data.payment);
    }
    return response;
  },

  /**
   * Xóa (soft delete) khoản thanh toán
   */
  deleteHouseholdPayment(id: string) {
    return api.delete(`/household-payments/${id}`);
  },

  /**
   * Khôi phục khoản thanh toán đã xóa
   */
  restoreHouseholdPayment(id: string) {
    return api.patch(`/household-payments/${id}/restore`);
  },
};
