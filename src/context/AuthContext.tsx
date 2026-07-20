"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMe } from "@/services/api";

interface AuthUser {
  id: string;
  name?: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refresh: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refresh() {
    const token = localStorage.getItem("accessToken");
    if (!token) { setUser(null); setIsLoading(false); return; }
    try {
      const u = await getMe();
      setUser(u);
    } catch { setUser(null); } finally { setIsLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  function logout() {
    localStorage.removeItem("accessToken");
    setUser(null);
    import("@/services/api").then((m) => m.default.post("/auth/logout").catch(() => {}));
  }

  return <AuthContext.Provider value={{ user, isLoading, refresh, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
