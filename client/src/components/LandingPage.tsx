import React from "react";
import {
  Users,
  Home,
  DollarSign,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <span className="font-bold text-lg">HUST</span>
              </div>
              <span className="text-xl font-bold text-slate-800">
                Huster Resident<span className="text-blue-600">Manager</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                Tính năng
              </a>
              <a
                href="#solutions"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                Giải pháp
              </a>
              <a
                href="#contact"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                Liên hệ
              </a>
            </div>
            <button
              onClick={onLogin}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg shadow-slate-900/20"
            >
              Truy cập Hệ thống
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Giải pháp Quản lý Cư dân 4.0
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
            Quản lý{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Đô thị & Cư dân
            </span>{" "}
            <br />
            Hiệu quả & Minh bạch
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-10">
            Hệ thống toàn diện giúp Ban quản lý theo dõi thông tin hộ khẩu, nhân
            khẩu và quản lý thu phí một cách chính xác, hiện đại và bảo mật.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-600/30 flex items-center"
            >
              Bắt đầu ngay <ArrowRight className="ml-2" size={20} />
            </button>
            <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-lg transition-all">
              Xem Demo
            </button>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="mt-16 relative mx-auto max-w-5xl">
            <div className="bg-slate-900 rounded-xl p-2 shadow-2xl shadow-slate-400/50">
              <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <div className="flex items-center px-4 py-2 bg-slate-800 border-b border-slate-700 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                {/* Abstract placeholder for screenshot */}
                <div className="h-64 md:h-96 bg-slate-50 w-full flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-white opacity-50"></div>
                  <div className="grid grid-cols-3 gap-4 p-8 w-full opacity-80">
                    <div className="col-span-2 space-y-4">
                      <div className="h-32 bg-white rounded-lg shadow-sm border border-slate-200"></div>
                      <div className="h-48 bg-white rounded-lg shadow-sm border border-slate-200"></div>
                    </div>
                    <div className="col-span-1 space-y-4">
                      <div className="h-20 bg-blue-500 rounded-lg shadow-lg"></div>
                      <div className="h-20 bg-emerald-500 rounded-lg shadow-lg"></div>
                      <div className="h-36 bg-white rounded-lg shadow-sm border border-slate-200"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={onLogin}
                      className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg font-semibold text-slate-800 hover:scale-105 transition-transform"
                    >
                      Xem Giao diện Quản trị
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Tính năng vượt trội
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Giải quyết triệt để các bài toán quản lý thủ công
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Home className="w-8 h-8 text-blue-600" />,
                title: "Quản lý Hộ khẩu",
                desc: "Lưu trữ chi tiết thông tin chủ hộ, địa chỉ, và các thành viên trong gia đình một cách khoa học.",
              },
              {
                icon: <Users className="w-8 h-8 text-purple-600" />,
                title: "Quản lý Nhân khẩu",
                desc: "Theo dõi biến động dân cư, tạm trú, tạm vắng, CMND/CCCD và thông tin cá nhân.",
              },
              {
                icon: <DollarSign className="w-8 h-8 text-emerald-600" />,
                title: "Thu phí & Đóng góp",
                desc: "Tự động tính toán phí vệ sinh, quản lý các khoản đóng góp tự nguyện minh bạch.",
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-amber-600" />,
                title: "Báo cáo & Thống kê",
                desc: "Biểu đồ trực quan về tình hình dân cư, thu chi ngân sách theo thời gian thực.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="mb-4 bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security / Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Bảo mật & Chính xác là ưu tiên hàng đầu
              </h2>
              <div className="space-y-4">
                {[
                  "Dữ liệu được mã hóa và lưu trữ an toàn",
                  "Phân quyền truy cập chi tiết cho cán bộ quản lý",
                  "Lịch sử giao dịch và chỉnh sửa được ghi lại đầy đủ",
                  "Tuân thủ các quy định về quản lý cư dân hiện hành",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2
                      className="text-emerald-500 flex-shrink-0"
                      size={24}
                    />
                    <span className="text-lg text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-100 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-500 rounded-full opacity-10"></div>
              <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-purple-500 rounded-full opacity-10"></div>
              <div className="relative z-10 bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <div className="flex items-center gap-4 mb-4 border-b pb-4">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Trạng thái Hệ thống
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      Đang hoạt động • Bảo mật cấp cao
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-slate-100 rounded w-full">
                    <div className="h-full bg-blue-500 rounded w-3/4"></div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded w-full">
                    <div className="h-full bg-blue-500 rounded w-1/2"></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Mã hóa dữ liệu</span>
                    <span>AES-256</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng để hiện đại hóa công tác quản lý?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Tham gia cùng hàng trăm tổ dân phố và khu chung cư đang sử dụng
            Huster Resident Manager để nâng cao chất lượng cuộc sống.
          </p>
          <button
            onClick={onLogin}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/50"
          >
            Truy cập Hệ thống ngay
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-xs font-bold">
                V
              </div>
              <span className="font-bold text-slate-700">
                Huster Resident Manager
              </span>
            </div>
            <div className="text-slate-500 text-sm">
              © 2024 Huster Resident Inc. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-blue-600">
                Điều khoản
              </a>
              <a href="#" className="hover:text-blue-600">
                Bảo mật
              </a>
              <a href="#" className="hover:text-blue-600">
                Hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
