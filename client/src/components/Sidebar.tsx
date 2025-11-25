import React from "react";
import {
  LayoutDashboard,
  Users,
  Home,
  DollarSign,
  Settings,
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onChangeView,
}) => {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Tổng quan" },
    { id: "households", icon: Home, label: "Quản lý Hộ khẩu" },
    { id: "residents", icon: Users, label: "Quản lý Nhân khẩu" },
    { id: "fees", icon: DollarSign, label: "Quản lý Thu phí" },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full fixed left-0 top-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-6 flex items-center gap-3">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <span className="font-bold text-lg">HUST</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
            Huster Resident
          </h1>
          <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
            Manager
          </span>
        </div>
      </div>

      <div className="px-6 mb-2 mt-2">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Menu chính
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-bold shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></div>
              )}
              <item.icon
                size={20}
                className={`mr-3 transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 mx-2 mb-2">
        <button className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors group">
          <Settings
            size={20}
            className="mr-3 text-slate-400 group-hover:text-slate-600"
          />
          <span className="font-medium text-sm">Cấu hình hệ thống</span>
        </button>
        <div className="mt-4 px-4 flex justify-between items-center text-[10px] text-slate-400 font-medium">
          <span>v1.2.0 Stable</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </div>
    </div>
  );
};
