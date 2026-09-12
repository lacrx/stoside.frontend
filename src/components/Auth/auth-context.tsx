import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const STRAPI_URL = process.env.GATSBY_STRAPI_URL || "";
const LS_KEY = "sto_admin";

type AuthState = {
  ready: boolean;
  isAdmin: boolean;
  userName: string | null;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
};

const AuthContext = createContext<AuthState>({
  ready: false,
  isAdmin: false,
  userName: null,
  login: async () => "No auth provider",
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem(LS_KEY) === "true");
    setUserName(localStorage.getItem(`${LS_KEY}_name`));
    setReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    if (!STRAPI_URL) return "Admin login not configured";
    try {
      const res = await fetch(`${STRAPI_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        return err?.error?.message || "Invalid email or password";
      }
      const data = await res.json();
      const name = data.data?.user?.firstname || data.data?.user?.email || email;
      localStorage.setItem(LS_KEY, "true");
      localStorage.setItem(`${LS_KEY}_name`, name);
      setIsAdmin(true);
      setUserName(name);
      return null;
    } catch {
      return "Could not reach the server";
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(`${LS_KEY}_name`);
    setIsAdmin(false);
    setUserName(null);
  }, []);

  return (
    <AuthContext.Provider value={{ ready, isAdmin, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
