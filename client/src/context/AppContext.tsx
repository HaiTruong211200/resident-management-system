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

import {
  Household,
  Resident,
  PaymentType,
  HouseholdPayment,
  User,
} from "../types";
import { MOCK_USER } from "../services/mockData";

const SERVER_URL = "http://localhost:4000";

interface AppContextType {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;

  // Data State
  households: Household[];
  residents: Resident[];
  paymentTypes: PaymentType[];
  payments: HouseholdPayment[];
  householdSelectedId: string | null;
  currentView: string | null;

  // Actions
  addHousehold: (h: Household) => void;
  editHousehold: (h: Household) => void;
  deleteHousehold: (id: string) => void;

  addResident: (r: Resident) => void;
  editResident: (r: Resident) => void;
  deleteResident: (id: number) => void;

  addPaymentType: (p: PaymentType) => void;
  editPaymentType: (p: PaymentType) => void;
  deletePaymentType: (id: string) => void;

  addPayment: (p: HouseholdPayment) => void;
  editPayment: (p: HouseholdPayment) => void;

  setHouseholdSelectedId: (h: string | null) => void;
  setCurrentView: (v: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Auth
  const [user, setUser] = useState<User | null>(null);

  // Data
  const [households, setHouseholds] = useState<Household[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [payments, setPayments] = useState<HouseholdPayment[]>([]);

  const [householdSelectedId, setHouseholdSelectedId] = useState<string | null>(
    null
  );

  const [currentView, setCurrentView] = useState<string | null>(null);

  const login = async (username: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({ ...MOCK_USER, username });
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
  };

  // Actions
  const addHousehold = async (h: Household) => {
    try {
      const resp = await HouseholdService.addHousehold(h);
      setHouseholds((prev) => [...prev, resp.data.data.household]);
      toast.success("Thêm hộ khẩu thành công");
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const editHousehold = async (h: Household) => {
    try {
      const resp = await HouseholdService.updateHousehold(h);
      setHouseholds((prev) =>
        prev.map((item) => (item.id === h.id ? resp.data.data.household : item))
      );
      toast.success("Cập nhật hộ khẩu thành công");
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const deleteHousehold = async (id: string) => {
    try {
      await HouseholdService.deleteHousehold(id);

      setHouseholds((prev) => prev.filter((h) => h.id !== id));
      setResidents((prev) => prev.filter((r) => r.householdId !== id));

      toast.success("Đã xóa hộ khẩu");
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  // const addResident = (r: Resident) => setResidents([...residents, r]);
  const addResident = async (data: Resident) => {
    try {
      console.log("hello");
      console.log(typeof data.dateOfBirth);
      const resp = await ResidentService.addResident(data);
      console.log("Add Resident response:", resp);
      setResidents((prev) => [resp.data.data.resident, ...prev]);
      toast.success("Thêm cư dân thành công");
      return resp.data.data.resident;
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  // const editResident = (r: Resident) =>
  //   setResidents(residents.map((item) => (item.id === r.id ? r : item)));
  // const deleteResident = (id: string) =>
  //   setResidents(residents.filter((r) => r.id !== id));
  const editResident = async (data: Resident) => {
    console.log("Updating resident:", data);
    console.log(residents);
    try {
      const resp = await ResidentService.updateResident(data);
      console.log("Edit Resident response:", resp);
      setResidents((prev) =>
        prev.map((r) => (r.id === data.id ? resp.data.data.resident : r))
      );
      toast.success("Cập nhật cư dân thành công");
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const deleteResident = async (id: number) => {
    try {
      await ResidentService.deleteResident(id);
      setResidents((prev) => prev.filter((r) => r.id !== id));
      toast.success("Đã xóa cư dân");
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const addPaymentType = async (p: PaymentType) => {
    try {
      const resp = await PaymentTypeService.addPaymentType(p);
      setPaymentTypes([...paymentTypes, resp.data.data.paymentType]);
      toast.success("Thêm khoản thu thành công");
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const editPaymentType = async (p: PaymentType) => {
    try {
      const resp = await PaymentTypeService.updatePaymentType(p);
      setPaymentTypes((prev) =>
        prev.map((item) =>
          item.id === p.id ? resp.data.data.paymentType : item
        )
      );
      toast.success("Cập nhật khoản thu thành công");
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const deletePaymentType = async (id: string) => {
    try {
      await PaymentTypeService.deletePaymentType(id);
      setPaymentTypes((prev) => prev.filter((p) => p.id !== id));
      toast.success("Đã xóa khoản thu");
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  // const deleteHousehold = async (id: string) => {
  //   try {
  //     await HouseholdService.deleteHousehold(id);

  //     setHouseholds((prev) => prev.filter((h) => h.id !== id));
  //     setResidents((prev) => prev.filter((r) => r.householdId !== id));

  //     toast.success("Đã xóa hộ khẩu");
  //   } catch (err: any) {
  //     toast.error(err.message);
  //     throw err;
  //   }
  // };

  const householdsWithOwnerName = useMemo(() => {
    return households.map((h) => {
      let ownerName = "";

      // Cách 1: dùng householdHeadId (CHUẨN NHẤT)
      if (h.householdHeadId) {
        const head = residents.find((r) => r.id === h.householdHeadId);
        ownerName = head?.fullName || "";
      }

      // Cách 2 (fallback): relationshipToHead === "Chủ hộ"
      if (!ownerName) {
        const head = residents.find(
          (r) => r.householdId === h.id && r.relationshipToHead === "Chủ hộ"
        );
        ownerName = head?.fullName || "";
      }

      return {
        ...h,
        ownerName,
      };
    });
  }, [households, residents]);

  const paymentTypesWithCanEdit = useMemo(() => {
    console.log(paymentTypes);
    return paymentTypes.map((p) => ({
      ...p,
      canEdit: new Date(p.startDate).getTime() > Date.now(),
    }));
  }, [paymentTypes]);

  useEffect(() => {
    HouseholdService.getHouseholds()
      .then((resp) => setHouseholds(resp.data.data.households))
      .catch((err) => toast.error(err.message));

    ResidentService.getResidents({ page: 1, limit: 100 })
      .then((resp) => setResidents(resp.data.data.residents))
      .catch((err) => toast.error(err.message));

    PaymentTypeService.getPaymentTypes()
      .then((resp) => setPaymentTypes(resp.data.data.paymentTypes))
      .catch((err) => toast.error(err.message));

    HouseholdPaymentService.getHouseholdPayments()
      .then((resp) => setPayments(resp.data.data.payments))
      .catch((err) => toast.error(err.message));
  }, []);

  // const addPaymentType = (p: PaymentType) =>
  //   setPaymentTypes([...paymentTypes, p]);
  // const addPayment = (p: HouseholdPayment) => setPayments([p, ...payments]);
  const addPayment = async (data: HouseholdPayment) => {
    try {
      const resp = await HouseholdPaymentService.addHouseholdPayment(data);
      setPayments([...payments, resp.data.data.payment]);
      toast.success("Thêm khoản thu thành công");
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const editPayment = async (data: HouseholdPayment) => {
    try {
      const resp = await HouseholdPaymentService.updateHouseholdPayment(data);
      console.log("Edit Payment response:", resp);
      setPayments((prev) =>
        prev.map((p) => (p.id === data.id ? resp.data.data.payment : p))
      );
      toast.success("Cập nhật khoản thu thành công");
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        households: householdsWithOwnerName,
        residents,
        paymentTypes: paymentTypesWithCanEdit,
        payments,
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
        householdSelectedId,
        setHouseholdSelectedId,
        currentView,
        setCurrentView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
