import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";

type RoleType = "User" | "Admin" | "SuperAdmin";

type AuthContextType = {
  user: any;
  role: RoleType | null;
  isAuthenticated: boolean;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (token: string, refreshToken: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<RoleType | null>(null);
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  const queryClient = useQueryClient();

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token");
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const res = await api.get("/auth/me");
    return res.data;
  };

  const { refetch } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    enabled: false,
    retry: false,
  });

  const login = async (token: string, refreshToken: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const res = await refetch();
      if (res.data) {
        setUser(res.data);
        setRole(res.data.role);
        setStatus("authenticated");
      } else {
        throw new Error("No user data");
      }
    } catch {
      logout();
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setRole(null);
    setStatus("unauthenticated");
    queryClient.removeQueries({ queryKey: ["currentUser"] });
  }, [queryClient]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      refetch()
        .then((res) => {
          setUser(res.data);
          setRole(res.data.role);
          setStatus("authenticated");
        })
        .catch(() => {
          logout();
        });
    } else {
      setStatus("unauthenticated");
    }
  }, [logout, refetch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        status,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
