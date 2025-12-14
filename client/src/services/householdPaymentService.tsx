import api from "../lib/api";
import { HouseholdPayment } from "../types";

/**
 * Service quản lý các khoản thu / đóng phí của hộ dân
 */
export const HouseholdPaymentService = {
  /**
   * Lấy danh sách các khoản thanh toán
   */
  getHouseholdPayments(params?: {
    page?: number;
    limit?: number;
    householdId?: string;
    paymentTypeId?: string;
    status?: string;
    category?: string;
  }) {
    return api.get("/household-payments", { params });
  },

  /**
   * Lấy chi tiết 1 khoản thanh toán theo id
   */
  getHouseholdPaymentById(id: string) {
    return api.get(`/household-payments/${id}`);
  },

  /**
   * Tạo mới khoản thanh toán
   */
  addHouseholdPayment(data: HouseholdPayment) {
    return api.post("/household-payments", {
      paymentTypeId: data.paymentTypeId,
      householdId: data.householdId,
      amountPaid: data.amountPaid,
      amountExpected: data.amountExpected,
      status: data.status,
      category: data.category,
      startDate: data.startDate,
      paymentDate: data.paymentDate,
      dueDate: data.dueDate,
      payerName: data.payerName,
      notes: data.notes,
    });
  },

  /**
   * Cập nhật khoản thanh toán
   */
  updateHouseholdPayment(data: HouseholdPayment) {
    return api.patch(`/household-payments/${data.id}`, {
      amountPaid: data.amountPaid,
      amountExpected: data.amountExpected,
      status: data.status,
      startDate: data.startDate,
      paymentDate: data.paymentDate,
      dueDate: data.dueDate,
      notes: data.notes,
    });
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
