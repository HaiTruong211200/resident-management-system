import React, { createContext, useContext, useState, ReactNode } from "react";
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
  deleteResident: (id: string) => void;

  // addPaymentType: (p: PaymentType) => void;
  // addPayment: (p: HouseholdPayment) => void;

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
  const [households, setHouseholds] = useState<Household[]>(INITIAL_HOUSEHOLDS);
  const [residents, setResidents] = useState<Resident[]>(INITIAL_RESIDENTS);
  // const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>(
  //   INITIAL_PAYMENT_TYPES
  // );
  // const [payments, setPayments] =
  //   useState<HouseholdPayment[]>(INITIAL_PAYMENTS);

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
  const addHousehold = (h: Household) => setHouseholds([...households, h]);
  const editHousehold = (h: Household) =>
    setHouseholds(households.map((item) => (item.id === h.id ? h : item)));
  const deleteHousehold = (id: string) => {
    setHouseholds(households.filter((h) => h.id !== id));
    setResidents(residents.filter((r) => r.householdId !== id));
  };

  const addResident = (r: Resident) => setResidents([...residents, r]);
  const editResident = (r: Resident) =>
    setResidents(residents.map((item) => (item.id === r.id ? r : item)));
  const deleteResident = (id: string) =>
    setResidents(residents.filter((r) => r.id !== id));

  // const addPaymentType = (p: PaymentType) =>
  //   setPaymentTypes([...paymentTypes, p]);
  // const addPayment = (p: HouseholdPayment) => setPayments([p, ...payments]);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        households,
        residents,
        // paymentTypes,
        // payments,
        addHousehold,
        editHousehold,
        deleteHousehold,
        addResident,
        editResident,
        deleteResident,
        // addPaymentType,
        // addPayment,
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
