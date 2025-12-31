import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext"; // Dùng useAuth thay vì useAppContext
import { useAppContext } from "../context/AppContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "../layouts/MainLayout";

import { LandingPage } from "../components/LandingPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { HouseholdPage } from "../pages/household/HouseholdPage";
import { ResidentPage } from "../pages/resident/ResidentPage";
import { FeePage } from "../pages/fees/FeePage";
import { StatisticsPage } from "../pages/StatisticsPage";
import { Unknown } from "../pages/unknown/Unknown";

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth(); // Lấy từ AuthContext
  const navigate = useNavigate();

  // Tạo một component wrapper nhỏ để sử dụng AppContext một cách an toàn
  // Chỉ những route nằm trong ProtectedRoute mới được gọi useAppContext
  const ProtectedRoutesContainer = () => {
    const { householdSelectedId, setHouseholdSelectedId, setCurrentView } =
      useAppContext();

    const handleHouseholdSelect = (id: string): void => {
      if (!id || id === "") {
        setHouseholdSelectedId(null);
        setCurrentView(null);
        navigate(`/residents`);
        return;
      }
      setHouseholdSelectedId(id);
      setCurrentView("residents");
      navigate(`/residents/${id}`);
    };

    const handleBack = (): void => {
      setHouseholdSelectedId(null);
      setCurrentView("households");
      navigate("/households");
    };

    return (
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<StatisticsPage />} />
          <Route
            path="households"
            element={
              <HouseholdPage onSelectHousehold={handleHouseholdSelect} />
            }
          />
          <Route
            path="residents/:householdId?"
            element={
              <ResidentPage
                onBack={handleBack}
                filterHouseholdId={householdSelectedId}
                onSelectHousehold={handleHouseholdSelect}
              />
            }
          />
          <Route path="fees" element={<FeePage />} />
          <Route path="dashboard" element={<StatisticsPage />} />
          <Route path="*" element={<Unknown />} />
        </Route>
      </Routes>
    );
  };

  return (
    <Routes>
      {/* Các Route công khai (Public) */}
      {!isAuthenticated && (
        <Route
          path="/"
          element={<LandingPage onLogin={() => navigate("/login")} />}
        />
      )}

      <Route path="/login" element={<LoginPage />} />

      {/* Các Route bảo mật (Private) */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            {/* Component này sẽ nằm trong AppProvider (đã bọc ở App.tsx) */}
            <ProtectedRoutesContainer />
          </ProtectedRoute>
        }
      />

      {/* Fallback cho trường hợp không khớp route nào và chưa login */}
      {!isAuthenticated && <Route path="*" element={<Unknown />} />}
    </Routes>
  );
};
