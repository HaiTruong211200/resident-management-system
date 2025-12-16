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
      householdHeadId: data.householdHeadId,
      houseNumber: data.houseNumber,
      street: data.street,
      ward: data.ward,
      district: data.district,
    });
  },

  updateHousehold(data: Household) {
    return api.put(`/households/${data.id}`, {
      householdHeadId: data.householdHeadId,
      houseNumber: data.houseNumber,
      street: data.street,
      ward: data.ward,
      district: data.district,
    });
  },

  deleteHousehold(id: string) {
    return api.delete(`/households/${id}`);
  },

  restoreHousehold(id: string) {
    return api.patch(`/households/${id}/restore`);
  },
};
