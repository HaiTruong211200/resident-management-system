import api from "../lib/api";
import { User } from "../types";

const TOKEN_KEY = "auth_token";

export interface AuthPayload {
  account: User;
  token?: string;
  accessToken?: string;
  expiresIn?: string | number;
}

function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
  }
}

function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// initialize axios header if token exists
const existing = getStoredToken();
if (existing) setAuthToken(existing);

export const AuthService = {
  async login(email: string, password: string): Promise<User> {
    const resp = await api.post("/auth/login", { email, password });
    const payload: AuthPayload = resp.data.data || resp.data;
    const token = payload.accessToken || payload.token || null;
    if (token) setAuthToken(token);
    return payload.account;
  },

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    console.log(username, email, password);
    const resp = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    const payload: AuthPayload = resp.data.data || resp.data;
    const token = payload.accessToken || payload.token || null;
    if (token) setAuthToken(token);
    return payload.account;
  },

  async me(): Promise<User | null> {
    try {
      const resp = await api.get("/me");
      const payload = resp.data.data || resp.data;
      return payload.account || null;
    } catch (err: any) {
      // if unauthorized or any error, clear token
      if (err && err.message && /401|Unauthorized/i.test(err.message)) {
        setAuthToken(null);
      }
      return null;
    }
  },

  logout() {
    setAuthToken(null);
  },

  getToken(): string | null {
    return getStoredToken();
  },

  setToken(token: string) {
    setAuthToken(token);
  },
};

export default AuthService;
