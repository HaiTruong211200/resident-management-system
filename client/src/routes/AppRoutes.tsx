import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

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
  const { isAuthenticated } = useAppContext();
  // const isAuthenticated = true;
  const navigate = useNavigate();
  const {
    householdSelectedId,
    setHouseholdSelectedId,
    currentView,
    setCurrentView,
  } = useAppContext();

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
    navigate("/households");
  };

  return (
    <Routes>
      {/* Landing */}
      {!isAuthenticated && (
        <Route
          path="/"
          element={
            <LandingPage
              onLogin={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
      )}

      {/* Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StatisticsPage />} />
        <Route
          path="households"
          element={<HouseholdPage onSelectHousehold={handleHouseholdSelect} />}
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
      </Route>

      {/* Redirect unknown routes */}
      <Route path="*" element={<Unknown />} />
    </Routes>
  );
};
