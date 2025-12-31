import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { AppRoutes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

const RootContainer: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Đang tải ứng dụng...</div>;

  // Nếu ĐÃ đăng nhập: Bọc AppProvider để load dữ liệu (Cư dân, Hộ khẩu...)
  if (isAuthenticated) {
    return (
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    );
  }

  // Nếu CHƯA đăng nhập: Chỉ render Routes (Trang Login/Register)
  // AppProvider sẽ không bao giờ được khởi tạo -> Không bị gọi API lỗi 401
  return <AppRoutes />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <RootContainer />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
