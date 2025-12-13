import api from "../lib/api";
import { Household } from "../types";

export const HouseholdService = {
  getHouseholds(params?: { page?: number; limit?: number }) {
    return api.get("/households", { params });
  },

  getHouseholdById(id: string) {
    return api.get(`/households/${id}`);
  },

  addHousehold(data: Household) {
    return api.post("/households", {
      id: data.id,
      householdHeaderId: data.householdHeaderId, // Mã hộ cũ (Legacy/Extra)
      houseNumber: data.houseNumber, // Số nhà
      street: data.street, // Đường phố (Ấp)
      ward: data.ward, // Phường (Xã, Thị trấn)
      district: data.district, // Quận (Huyện)
    });
  },

  updateHousehold(data: Household) {
    return api.put(`/households/${data.id}`, {
      householdHeaderId: data.householdHeaderId, // Mã hộ cũ (Legacy/Extra)
      houseNumber: data.houseNumber, // Số nhà
      street: data.street, // Đường phố (Ấp)
      ward: data.ward, // Phường (Xã, Thị trấn)
      district: data.district, // Quận (Huyện)
    });
  },

  deleteHousehold(id: string) {
    return api.delete(`/households/${id}`);
  },

  restoreHousehold(id: string) {
    return api.patch(`/households/${id}/restore`);
  },
};
