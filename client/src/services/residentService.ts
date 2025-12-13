import api from "../lib/api";
import { Resident } from "../types";

export const ResidentService = {
  getResidents(params: { page: number; limit: number; householdId?: number }) {
    return api.get("/residents", { params });
  },

  addResident(data: Resident) {
    return api.post("/residents", {
      householdId: data.householdId,
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      placeOfBirth: data.placeOfBirth,
      hometown: data.hometown,
      ethnicity: data.ethnicity,
      occupation: data.occupation,
      workplace: data.workplace,
      idCardNumber: data.idCardNumber,
      idCardIssuePlace: data.idCardIssuePlace,
      idCardIssueDate: data.idCardIssueDate,
      residenceRegistrationDate: data.residenceRegistrationDate,
      relationshipToHead: data.relationshipToHead,
    });
  },

  updateResident(data: Resident) {
    return api.put(`/residents/${data.id}`, {
      householdId: data.householdId,
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      placeOfBirth: data.placeOfBirth,
      hometown: data.hometown,
      ethnicity: data.ethnicity,
      occupation: data.occupation,
      workplace: data.workplace,
      idCardNumber: data.idCardNumber,
      idCardIssuePlace: data.idCardIssuePlace,
      idCardIssueDate: data.idCardIssueDate,
      residenceRegistrationDate: data.residenceRegistrationDate,
      relationshipToHead: data.relationshipToHead,
    });
  },

  deleteResident(id: number) {
    return api.delete(`/residents/${id}`);
  },
};
