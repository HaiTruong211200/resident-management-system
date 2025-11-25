import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { User, Lock, Mail, CheckCircle2 } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login, showToast } = useAppContext();
  const navigate = useNavigate();

  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "LOGIN" | "REGISTER"
  ) => {
    const { name, value } = e.target;
    if (type === "LOGIN") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      // showToast("Vui lòng nhập email và mật khẩu", "error");
      return;
    }

    setIsLoading(true);
    // Simulate login logic -> Extract username from email for demo
    const username = loginData.email.split("@")[0];
    await login(username);
    setIsLoading(false);
    navigate("/");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !registerData.username ||
      !registerData.email ||
      !registerData.password
    ) {
      showToast("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp", "error");
      return;
    }

    // Simulate Registration
    showToast("Đăng ký tài khoản thành công! Vui lòng đăng nhập.", "success");
    setLoginData({ email: registerData.email, password: "" });
    setIsSignUpActive(false); // Switch back to login
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* CSS Styles for Sliding Animation */}
      <style>{`
        .container-custom {
          background-color: #fff;
          border-radius: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
          position: relative;
          overflow: hidden;
          width: 768px;
          max-width: 100%;
          min-height: 550px;
        }

        .container-custom p {
          font-size: 14px;
          line-height: 20px;
          letter-spacing: 0.3px;
          margin: 20px 0;
        }

        .container-custom span {
          font-size: 12px;
        }

        .container-custom a {
          color: #333;
          font-size: 13px;
          text-decoration: none;
          margin: 15px 0 10px;
        }

        .container-custom button.btn-primary {
          background-color: #2563eb; /* Blue-600 */
          color: #fff;
          font-size: 12px;
          padding: 10px 45px;
          border: 1px solid transparent;
          border-radius: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .container-custom button.btn-primary:hover {
            background-color: #1d4ed8; /* Blue-700 */
        }

        .container-custom button.hidden-btn {
          background-color: transparent;
          border-color: #fff;
          color: #fff;
          border-radius: 8px;
          padding: 10px 45px;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 10px;
          cursor: pointer;
        }

        .container-custom form {
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          height: 100%;
        }

        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
        }

        .sign-in {
          left: 0;
          width: 50%;
          z-index: 2;
        }

        .container-custom.active .sign-in {
          transform: translateX(100%);
        }

        .sign-up {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }

        .container-custom.active .sign-up {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: move 0.6s;
        }

        @keyframes move {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }

        .toggle-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: all 0.6s ease-in-out;
          border-radius: 150px 0 0 100px;
          z-index: 1000;
        }

        .container-custom.active .toggle-container {
          transform: translateX(-100%);
          border-radius: 0 150px 100px 0;
        }

        .toggle {
          background-color: #2563eb;
          background: linear-gradient(to right, #4f46e5, #2563eb);
          color: #fff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: all 0.6s ease-in-out;
        }

        .container-custom.active .toggle {
          transform: translateX(50%);
        }

        .toggle-panel {
          position: absolute;
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 30px;
          text-align: center;
          top: 0;
          transform: translateX(0);
          transition: all 0.6s ease-in-out;
        }

        .toggle-left {
          transform: translateX(-200%);
        }

        .container-custom.active .toggle-left {
          transform: translateX(0);
        }

        .toggle-right {
          right: 0;
          transform: translateX(0);
        }

        .container-custom.active .toggle-right {
          transform: translateX(200%);
        }
      `}</style>

      <div
        className={`container-custom ${isSignUpActive ? "active" : ""}`}
        id="container"
      >
        {/* SIGN UP FORM */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1 className="text-2xl font-bold mb-4 text-slate-800">
              Tạo tài khoản
            </h1>
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                className="border border-slate-300 rounded-lg p-2 hover:bg-slate-50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 256 262"
                  preserveAspectRatio="xMidYMid"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  ></path>
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
              </button>
            </div>
            <span className="text-slate-500 mb-2">
              hoặc sử dụng email để đăng ký
            </span>
            <input
              className="bg-slate-100 border-none my-2 py-3 px-4 text-sm rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              type="text"
              placeholder="Họ tên"
              name="username"
              value={registerData.username}
              onChange={(e) => handleInputChange(e, "REGISTER")}
            />
            <input
              className="bg-slate-100 border-none my-2 py-3 px-4 text-sm rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              type="email"
              placeholder="Email"
              name="email"
              value={registerData.email}
              onChange={(e) => handleInputChange(e, "REGISTER")}
            />
            <input
              className="bg-slate-100 border-none my-2 py-3 px-4 text-sm rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              type="password"
              placeholder="Mật khẩu"
              name="password"
              value={registerData.password}
              onChange={(e) => handleInputChange(e, "REGISTER")}
            />
            <input
              className="bg-slate-100 border-none my-2 py-3 px-4 text-sm rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              type="password"
              placeholder="Xác nhận mật khẩu"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={(e) => handleInputChange(e, "REGISTER")}
            />
            <button
              type="submit"
              className="btn-primary mt-4 shadow-lg shadow-blue-500/30"
            >
              Đăng ký ngay
            </button>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <h1 className="text-2xl font-bold mb-4 text-slate-800">
              Đăng nhập
            </h1>
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                className="border border-slate-300 rounded-lg p-2 hover:bg-slate-50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 256 262"
                  preserveAspectRatio="xMidYMid"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  ></path>
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
              </button>
            </div>
            <span className="text-slate-500 mb-2">
              hoặc đăng nhập bằng tài khoản
            </span>
            <input
              className="bg-slate-100 border-none my-2 py-3 px-4 text-sm rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              type="email"
              placeholder="Email"
              name="email"
              value={loginData.email}
              onChange={(e) => handleInputChange(e, "LOGIN")}
            />
            <input
              className="bg-slate-100 border-none my-2 py-3 px-4 text-sm rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              type="password"
              placeholder="Mật khẩu"
              name="password"
              value={loginData.password}
              onChange={(e) => handleInputChange(e, "LOGIN")}
            />
            <div className="w-full flex justify-between items-center text-xs mt-1 px-1">
              <label className="flex items-center text-slate-500 cursor-pointer">
                <input type="checkbox" className="mr-1 accent-blue-600" /> Ghi
                nhớ
              </label>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary mt-6 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              Đăng nhập
            </button>
          </form>
        </div>

        {/* OVERLAY / TOGGLE */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 className="text-3xl font-bold mb-4">Chào mừng trở lại!</h1>
              <p className="mb-6">
                Nhập thông tin cá nhân của bạn để tiếp tục sử dụng các tính năng
                quản lý
              </p>
              <button
                className="hidden-btn border border-white"
                onClick={() => setIsSignUpActive(false)}
              >
                Đăng nhập ngay
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="text-3xl font-bold mb-4">Xin chào, Bạn mới!</h1>
              <p className="mb-6">
                Đăng ký tài khoản mới để bắt đầu trải nghiệm hệ thống quản lý cư
                dân Huster Resident
              </p>
              <button
                className="hidden-btn border border-white"
                onClick={() => setIsSignUpActive(true)}
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
