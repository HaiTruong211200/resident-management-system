import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import { AuthService } from "../services/authService";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra session khi load trang (Hàm me)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const account = await AuthService.me();
        if (account) setUser(account);
      } catch (err) {
        // Token hết hạn hoặc không hợp lệ, giữ user = null
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const account = await AuthService.login(email, password);
      setUser(account);
      toast.success("Đăng nhập thành công!");
    } catch (err: any) {
      toast.error(err.message || "Đăng nhập thất bại");
      throw err;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const account = await AuthService.register(username, email, password);
      setUser(account);
      toast.success("Đăng ký thành công!");
    } catch (err: any) {
      toast.error(err.message || "Đăng ký thất bại");
      throw err;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    toast.success("Đã đăng xuất");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
export default AuthContext;
