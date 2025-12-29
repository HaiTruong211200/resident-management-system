import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import toast from "react-hot-toast";
import { ResidentService } from "../services/residentService";
import { HouseholdService } from "../services/householdService";
import { PaymentTypeService } from "../services/paymentTypeService";
import { HouseholdPaymentService } from "../services/householdPaymentService";

import { Household, Resident, PaymentType, HouseholdPayment } from "../types";

interface AppContextType {
  // Data State
  households: Household[];
  residents: Resident[];
  paymentTypes: PaymentType[];
  payments: HouseholdPayment[];
  householdSelectedId: string | null;
  currentView: string | null;

  // Actions
  addHousehold: (h: Household) => Promise<void>;
  editHousehold: (h: Household) => Promise<void>;
  deleteHousehold: (id: string) => Promise<void>;
  addResident: (r: Resident) => Promise<any>;
  editResident: (r: Resident) => Promise<void>;
  deleteResident: (id: number) => Promise<void>;
  addPaymentType: (p: PaymentType) => Promise<void>;
  editPaymentType: (p: PaymentType) => Promise<void>;
  deletePaymentType: (id: string) => Promise<void>;
  addPayment: (p: HouseholdPayment) => Promise<void>;
  editPayment: (p: HouseholdPayment) => Promise<void>;
  setHouseholdSelectedId: (h: string | null) => void;
  setCurrentView: (v: string | null) => void;
  refreshData: () => void; // Thêm hàm để chủ động load lại dữ liệu
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [payments, setPayments] = useState<HouseholdPayment[]>([]);
  const [householdSelectedId, setHouseholdSelectedId] = useState<string | null>(
    null
  );
  const [currentView, setCurrentView] = useState<string | null>(null);

  // Hàm load dữ liệu tổng thể
  const fetchData = async () => {
    try {
      const [resH, resR, resPT, resP] = await Promise.all([
        HouseholdService.getHouseholds(),
        ResidentService.getResidents({ page: 1, limit: 100 }),
        PaymentTypeService.getPaymentTypes(),
        HouseholdPaymentService.getHouseholdPayments(),
      ]);

      console.log("🔍 Debug Response Structure:");
      console.log("Households Raw:", resH.data);
      console.log("Residents Raw:", resR.data);
      console.log("PaymentTypes Raw:", resPT.data);
      console.log("Payments Raw:", resP.data);

      setHouseholds(resH.data.data.households);
      setResidents(resR.data.data.residents);
      setPaymentTypes(resPT.data.data.paymentTypes);
      setPayments(resP.data.data.payments);
    } catch (err: any) {
      toast.error("Không thể tải dữ liệu: " + err.message);
    }
  };

  // Chỉ chạy khi AppProvider được mount (lúc này chắc chắn đã đăng nhập)
  useEffect(() => {
    fetchData();
  }, []);

  // --- Actions Logic (Giữ nguyên các hàm xử lý API của bạn nhưng bọc trong async/await sạch sẽ hơn) ---

  const addHousehold = async (h: Household) => {
    const resp = await HouseholdService.addHousehold(h);
    setHouseholds((prev) => [...prev, resp.data.data.household]);
    toast.success("Thêm hộ khẩu thành công");
  };

  const editHousehold = async (h: Household) => {
    const resp = await HouseholdService.updateHousehold(h);
    setHouseholds((prev) =>
      prev.map((item) => (item.id === h.id ? resp.data.data.household : item))
    );
    toast.success("Cập nhật hộ khẩu thành công");
  };

  const deleteHousehold = async (id: string) => {
    await HouseholdService.deleteHousehold(id);
    setHouseholds((prev) => prev.filter((h) => h.id !== id));
    toast.success("Đã xóa hộ khẩu");
  };

  const addResident = async (data: Resident) => {
    const resp = await ResidentService.addResident(data);
    setResidents((prev) => [resp.data.data.resident, ...prev]);
    toast.success("Thêm cư dân thành công");
    return resp.data.data.resident;
  };

  const editResident = async (data: Resident) => {
    const resp = await ResidentService.updateResident(data);
    setResidents((prev) =>
      prev.map((r) => (r.id === data.id ? resp.data.data.resident : r))
    );
    toast.success("Cập nhật cư dân thành công");
  };

  const deleteResident = async (id: number) => {
    await ResidentService.deleteResident(id);
    setResidents((prev) => prev.filter((r) => r.id !== id));
    toast.success("Đã xóa cư dân");
  };

  const addPaymentType = async (p: PaymentType) => {
    const resp = await PaymentTypeService.addPaymentType(p);
    setPaymentTypes((prev) => [...prev, resp.data.data.paymentType]);
    toast.success("Thêm khoản thu thành công");
  };

  const editPaymentType = async (p: PaymentType) => {
    const resp = await PaymentTypeService.updatePaymentType(p);
    setPaymentTypes((prev) =>
      prev.map((item) => (item.id === p.id ? resp.data.data.paymentType : item))
    );
    toast.success("Cập nhật khoản thu thành công");
  };

  const deletePaymentType = async (id: string) => {
    await PaymentTypeService.deletePaymentType(id);
    setPaymentTypes((prev) => prev.filter((p) => p.id !== id));
    toast.success("Đã xóa khoản thu");
  };

  const addPayment = async (data: HouseholdPayment) => {
    const resp = await HouseholdPaymentService.addHouseholdPayment(data);
    setPayments((prev) => [...prev, resp.data.data.payment]);
    toast.success("Thêm thanh toán thành công");
  };

  const editPayment = async (data: HouseholdPayment) => {
    const resp = await HouseholdPaymentService.updateHouseholdPayment(data);
    setPayments((prev) =>
      prev.map((p) => (p.id === data.id ? resp.data.data.payment : p))
    );
    toast.success("Cập nhật thanh toán thành công");
  };

  // --- Computed States ---
  const householdsWithOwnerName = useMemo(() => {
    return households.map((h) => {
      const head =
        residents.find((r) => r.id === h.householdHeadId) ||
        residents.find(
          (r) => r.householdId === h.id && r.relationshipToHead === "Chủ hộ"
        );
      return { ...h, ownerName: head?.fullName || "Chưa rõ" };
    });
  }, [households, residents]);

  const paymentTypesWithCanEdit = useMemo(() => {
    return paymentTypes.map((p) => ({
      ...p,
      canEdit: new Date(p.startDate).getTime() > Date.now(),
    }));
  }, [paymentTypes]);

  return (
    <AppContext.Provider
      value={{
        households: householdsWithOwnerName,
        residents,
        paymentTypes: paymentTypesWithCanEdit,
        payments,
        householdSelectedId,
        setHouseholdSelectedId,
        currentView,
        setCurrentView,
        addHousehold,
        editHousehold,
        deleteHousehold,
        addResident,
        editResident,
        deleteResident,
        addPaymentType,
        editPaymentType,
        deletePaymentType,
        addPayment,
        editPayment,
        refreshData: fetchData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
