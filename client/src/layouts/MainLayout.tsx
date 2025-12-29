import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext"; // Import thêm useAuth
import { LogOut, Settings, UserIcon, ChevronDown } from "lucide-react";

export const MainLayout = () => {
  // Tách biệt logic: Auth lấy từ useAuth, Data lấy từ useAppContext
  const { user, logout } = useAuth();
  const { currentView, setCurrentView } = useAppContext();

  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleOnChangeView = (view: string) => {
    setCurrentView(view);
    navigate(`/${view}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar
        onChangeView={handleOnChangeView}
        currentView={currentView || "dashboard"}
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Hệ thống Quản lý Dân cư & Thu phí
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-600">
                Hoạt động
              </span>
            </div>
            <div className="relative pl-4 border-l border-slate-200">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 hover:bg-white p-1.5 rounded-full pr-3 transition-all outline-none focus:ring-2 focus:ring-blue-100 group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:shadow-lg transition-shadow">
                  {user?.username?.substring(0, 2).toUpperCase() || "AD"}
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-700 leading-tight">
                    {user?.fullName || user?.username || "Admin"}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                    {user?.role || "Quản trị viên"}
                  </div>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isUserMenuOpen && (
                <>
                  {/* Backdrop to close */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  ></div>

                  <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-xs text-slate-400 font-semibold uppercase mb-1">
                        Đang đăng nhập
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {user?.username}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        ID: {user?.id}
                      </p>
                    </div>

                    <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center transition-colors">
                      <UserIcon size={16} className="mr-3 text-slate-400" /> Hồ
                      sơ cá nhân
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center transition-colors">
                      <Settings size={16} className="mr-3 text-slate-400" /> Cài
                      đặt hệ thống
                    </button>

                    <div className="h-px bg-slate-100 my-1 mx-2"></div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors font-medium"
                    >
                      <LogOut size={16} className="mr-3" /> Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* WHERE ROUTES RENDER */}
        <div className="animate-in fade-in duration-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
