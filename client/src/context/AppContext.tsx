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

import {
  Household,
  Resident,
  PaymentType,
  HouseholdPayment,
  User,
} from "../types";
import {
  INITIAL_HOUSEHOLDS,
  INITIAL_RESIDENTS,
  INITIAL_PAYMENT_TYPES,
  INITIAL_PAYMENTS,
  MOCK_USER,
} from "../services/mockData";

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
  addPayment: (p: HouseholdPayment) => void;

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
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>(
    INITIAL_PAYMENT_TYPES
  );
  const [payments, setPayments] =
    useState<HouseholdPayment[]>(INITIAL_PAYMENTS);

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
      const resp = await ResidentService.addResident(data);
      setResidents((prev) => [resp.data.data, ...prev]);
      toast.success("Thêm cư dân thành công");
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
    try {
      const resp = await ResidentService.updateResident(data);
      setResidents((prev) =>
        prev.map((r) => (r.id === data.id ? resp.data.data : r))
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

  const householdsWithOwnerName = useMemo(() => {
    return households.map((h) => {
      let ownerName = "";

      // Cách 1: dùng householdHeaderId (CHUẨN NHẤT)
      if (h.householdHeaderId) {
        const head = residents.find((r) => r.id === h.householdHeaderId);
        ownerName = head?.fullName || "";
      }

      // Cách 2 (fallback): relationship_to_head === "Chủ hộ"
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

  useEffect(() => {
    HouseholdService.getHouseholds()
      .then((resp) => setHouseholds(resp.data.data.households))
      .catch((err) => toast.error(err.message));

    ResidentService.getResidents({ page: 1, limit: 100 })
      .then((resp) => setResidents(resp.data.data.residents))
      .catch((err) => toast.error(err.message));
  }, []);

  const addPaymentType = (p: PaymentType) =>
    setPaymentTypes([...paymentTypes, p]);
  const addPayment = (p: HouseholdPayment) => setPayments([p, ...payments]);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        households: householdsWithOwnerName,
        residents,
        paymentTypes,
        payments,
        addHousehold,
        editHousehold,
        deleteHousehold,
        addResident,
        editResident,
        deleteResident,
        addPaymentType,
        addPayment,
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
