
import { Household, Resident, PaymentType, FeeCategory, HouseholdPayment, User } from '../types';

export const MOCK_USER: User = {
  id: 'U001',
  username: 'admin',
  fullName: 'Quản trị viên',
  role: 'ADMIN',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
};

export const INITIAL_HOUSEHOLDS: Household[] = [
  { 
    id: 'HK001', 
    ownerName: 'Nguyễn Văn An', 
    houseNumber: '12B', 
    street: 'Nguyễn Trãi', 
    ward: 'Thanh Xuân Trung', 
    district: 'Thanh Xuân',
    areaCode: 'Tổ 5' 
  },
  { 
    id: 'HK002', 
    ownerName: 'Trần Thị Bích', 
    houseNumber: '45', 
    street: 'Lê Văn Lương', 
    ward: 'Nhân Chính', 
    district: 'Thanh Xuân', 
    areaCode: 'Tổ 3' 
  },
  { 
    id: 'HK003', 
    ownerName: 'Lê Văn Cường', 
    houseNumber: '88', 
    street: 'Láng Hạ', 
    ward: 'Láng Hạ', 
    district: 'Đống Đa', 
    areaCode: 'Tổ 1' 
  },
];

export const INITIAL_RESIDENTS: Resident[] = [
  // HK001 Residents
  { 
    id: 'R001', householdId: 'HK001', fullName: 'Nguyễn Văn An', dateOfBirth: '1980-05-15', gender: 'Nam',
    placeOfBirth: 'Hà Nội', hometown: 'Nam Định', ethnicity: 'Kinh', occupation: 'Kỹ sư', 
    idCardNumber: '001088123456', idCardIssuePlace: 'CA Hà Nội', idCardIssueDate: '2015-05-15',
    registrationDate: '2020-01-01', relationshipToHead: 'Chủ hộ' 
  },
  { 
    id: 'R002', householdId: 'HK001', fullName: 'Phạm Thị Hoa', dateOfBirth: '1982-08-20', gender: 'Nữ',
    placeOfBirth: 'Hà Nội', hometown: 'Hà Nam', ethnicity: 'Kinh', occupation: 'Giáo viên', 
    idCardNumber: '001090654321', idCardIssuePlace: 'CA Hà Nội', idCardIssueDate: '2015-08-20',
    registrationDate: '2020-01-01', relationshipToHead: 'Vợ' 
  },
  { 
    id: 'R003', householdId: 'HK001', fullName: 'Nguyễn Minh Đức', dateOfBirth: '2010-02-10', gender: 'Nam',
    placeOfBirth: 'Hà Nội', hometown: 'Nam Định', ethnicity: 'Kinh', occupation: 'Học sinh', 
    registrationDate: '2020-01-01', relationshipToHead: 'Con' 
  },
  // HK002 Residents
  { 
    id: 'R004', householdId: 'HK002', fullName: 'Trần Thị Bích', dateOfBirth: '1975-11-02', gender: 'Nữ',
    placeOfBirth: 'Hải Phòng', hometown: 'Hải Phòng', ethnicity: 'Kinh', occupation: 'Kinh doanh', 
    idCardNumber: '001085987654', idCardIssuePlace: 'CA Hải Phòng', idCardIssueDate: '2010-11-02',
    registrationDate: '2019-06-15', previousAddress: '12 Cầu Đất, Hải Phòng', relationshipToHead: 'Chủ hộ' 
  }
];

export const INITIAL_PAYMENT_TYPES: PaymentType[] = [
  { 
    id: 'PT001', name: 'Phí Vệ Sinh 2023', category: FeeCategory.MANDATORY_SANITATION, 
    amountPerPerson: 6000, dateCreated: '2023-01-01', description: 'Thu phí vệ sinh môi trường năm 2023 (6000đ/người/tháng)' 
  },
  { 
    id: 'PT002', name: 'Ủng hộ Quỹ Vì Người Nghèo 2023', category: FeeCategory.VOLUNTARY_CONTRIBUTION, 
    dateCreated: '2023-05-01', description: 'Vận động ủng hộ người nghèo' 
  },
  { 
    id: 'PT003', name: 'Tết Thiếu Nhi 1/6', category: FeeCategory.VOLUNTARY_CONTRIBUTION, 
    dateCreated: '2023-06-01', description: 'Tổ chức vui chơi cho trẻ em' 
  }
];

export const INITIAL_PAYMENTS: HouseholdPayment[] = [
  { id: 'PAY001', paymentTypeId: 'PT001', householdId: 'HK001', amountPaid: 216000, paymentDate: '2023-01-05', payerName: 'Nguyễn Văn An', notes: 'Đóng cả năm (3 người x 6000 x 12)' },
  { id: 'PAY002', paymentTypeId: 'PT002', householdId: 'HK001', amountPaid: 500000, paymentDate: '2023-05-10', payerName: 'Nguyễn Văn An', notes: 'Ủng hộ' },
];
