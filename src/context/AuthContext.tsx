import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type RoleType = "User" | "Admin" | "SuperAdmin";

type AuthContextType = {
  user: any;
  role: RoleType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState<RoleType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const response = await api.get("/auth/me");
        return response.data;
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return null;
      }
    },
    retry: false,
    enabled: !!localStorage.getItem("accessToken"),
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      setRole(data.role);
      setIsAuthenticated(true);
    }
  }, [data]);

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{ user, role, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
