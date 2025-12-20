import api from "../lib/api";
import { PaymentType } from "../types";

// Helper to map backend response to frontend type
const mapPaymentType = (data: any): PaymentType => ({
  ...data,
  id: data.paymentTypeId?.toString() || data.id,
  paymentType: data.type || data.paymentType,
});

export const PaymentTypeService = {
  async getPaymentTypes(params?: { page?: number; limit?: number }) {
    const response = await api.get("/payment-types", { params });
    // Map paymentTypeId to id
    if (response.data.data.paymentTypes) {
      response.data.data.paymentTypes = response.data.data.paymentTypes.map(mapPaymentType);
    }
    return response;
  },

  async getPaymentTypeById(id: string) {
    const response = await api.get(`/payment-types/${id}`);
    // Map paymentTypeId to id
    if (response.data.data.paymentType) {
      response.data.data.paymentType = mapPaymentType(response.data.data.paymentType);
    }
    return response;
  },

  async addPaymentType(data: PaymentType) {
    const response = await api.post("/payment-types", {
      name: data.name,
      paymentType: data.paymentType, // enum bắt buộc
      amountPerPerson: data.amountPerPerson,
      description: data.description,
      createdAt: data.createdAt,
      startDate: data.startDate,
      dateExpired: data.dateExpired,
    });
    // Map paymentTypeId to id
    if (response.data.data.paymentType) {
      response.data.data.paymentType = mapPaymentType(response.data.data.paymentType);
    }
    return response;
  },

  async updatePaymentType(data: PaymentType) {
    console.log("Updating PaymentType:", data);
    const response = await api.patch(`/payment-types/${data.id}`, {
      name: data.name,
      paymentType: data.paymentType,
      amountPerPerson: data.amountPerPerson,
      description: data.description,
      createdAt: data.createdAt,
      startDate: data.startDate,
      dateExpired: data.dateExpired,
    });
    // Map paymentTypeId to id
    if (response.data.data.paymentType) {
      response.data.data.paymentType = mapPaymentType(response.data.data.paymentType);
    }
    return response;
  },

  deletePaymentType(id: string) {
    return api.delete(`/payment-types/${id}`);
  },

  restorePaymentType(id: string) {
    return api.patch(`/payment-types/${id}/restore`);
  },
};
