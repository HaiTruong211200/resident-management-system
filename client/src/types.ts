// Enum for Fee Types
export enum FeeCategory {
  MANDATORY_SANITATION = "Bắt buộc", // 6000 VND/month/person
  VOLUNTARY_CONTRIBUTION = "Tự nguyện", // Support funds
}

export type Gender = "Nam" | "Nữ" | "Khác";

export type PaymentStatus = "Đã đóng" | "Một phần" | "Chưa đóng" | "Quá hạn";

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: "ADMIN" | "ACCOUNTANT";
  avatar?: string;
}

// Hộ khẩu (Household)
export interface Household {
  id: string; // Mã hộ (integer in schema, string here for uuid)
  householdHeaderId: number; // Mã hộ cũ (Legacy/Extra)
  ownerName?: string; // Tên chủ hộ (Not in schema, useful for UI)
  houseNumber: string; // Số nhà
  street: string; // Đường phố (Ấp)
  ward: string; // Phường (Xã, Thị trấn)
  district: string; // Quận (Huyện)
  areaCode?: string; // Khu vực/Tổ dân phố (Legacy/Extra)
}

// Nhân khẩu (Resident)
export interface Resident {
  id: number; // Internal ID
  householdId: string; // FK to Household
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  placeOfBirth: string; // Nơi sinh
  hometown: string; // Nguyên quán
  ethnicity: string; // Dân tộc
  occupation?: string; // Nghề nghiệp
  workplace?: string; // Nơi làm việc

  // ID Card Info
  idCardNumber?: string; // Số CMND/CCCD
  idCardIssuePlace?: string; // Nơi cấp
  idCardIssueDate?: string; // Ngày cấp

  // Registration Info
  residenceRegistrationDate: string; // Ngày đăng ký thường trú
  previousAddress?: string; // Địa chỉ trước khi chuyển đến
  relationshipToHead: string; // Quan hệ với chủ hộ

  alias?: string; // Bí danh
}

// Loại khoản thu (PaymentType)
export interface PaymentType {
  id: string; // payment_type_id
  name: string;
  paymentType: FeeCategory; // type Enum
  amountPerPerson?: number; // amount_per_person (nullable)
  createdAt: string;
  startDate: string;
  dateExpired?: string;
  description?: string;
  canEdit?: boolean; // Not in schema but useful for UI
}

// Giao dịch nộp tiền (HouseholdPayment)
export interface HouseholdPayment {
  id: string; // payment_id
  householdId: string; // FK
  paymentTypeId: string; // FK to PaymentType

  amountPaid: number; // Số tiền thực đóng
  amountExpected: number; // Số tiền phải đóng (hoặc dự kiến)

  paymentDate: string; // Ngày nộp
  dueDate?: string; // Hạn nộp
  updatedAt?: string; // Ngày cập nhật trạng thái cuối cùng

  status: PaymentStatus; // Trạng thái
  category?: FeeCategory; // Denormalized for easier filtering

  payerName?: string; // Not in schema but useful for UI
  notes?: string;
}

export interface DashboardStats {
  totalHouseholds: number;
  totalResidents: number;
  totalCollections: number;
  recentTransactions: HouseholdPayment[];
}
