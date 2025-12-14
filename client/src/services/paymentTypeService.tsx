import api from "../lib/api";
import { PaymentType } from "../types";

export const PaymentTypeService = {
  getPaymentTypes(params?: { page?: number; limit?: number }) {
    return api.get("/payment-types", { params });
  },

  getPaymentTypeById(id: string) {
    return api.get(`/payment-types/${id}`);
  },

  addPaymentType(data: PaymentType) {
    return api.post("/payment-types", {
      name: data.name,
      paymentType: data.paymentType, // enum bắt buộc
      amountPerPerson: data.amountPerPerson,
      description: data.description,
      createdAt: data.createdAt,
      startDate: data.startDate,
      dateExpired: data.dateExpired,
    });
  },

  updatePaymentType(data: PaymentType) {
    console.log("Updating PaymentType:", data);
    return api.patch(`/payment-types/${data.id}`, {
      name: data.name,
      paymentType: data.paymentType,
      amountPerPerson: data.amountPerPerson,
      description: data.description,
      createdAt: data.createdAt,
      startDate: data.startDate,
      dateExpired: data.dateExpired,
    });
  },

  deletePaymentType(id: string) {
    return api.delete(`/payment-types/${id}`);
  },

  restorePaymentType(id: string) {
    return api.patch(`/payment-types/${id}/restore`);
  },
};
