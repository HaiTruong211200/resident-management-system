import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export const Unknown: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-100">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-amber-500 w-10 h-10" />
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Trang không tồn tại
        </h2>

        <p className="text-slate-500 mb-8">
          Đường dẫn bạn đang truy cập không đúng hoặc trang đã bị xóa. Vui lòng
          kiểm tra lại.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors w-full"
        >
          <Home className="w-5 h-5 mr-2" />
          Về Trang chủ
        </Link>
      </div>

      <p className="mt-8 text-slate-400 text-sm">
        Huster Resident Manager System
      </p>
    </div>
  );
};
