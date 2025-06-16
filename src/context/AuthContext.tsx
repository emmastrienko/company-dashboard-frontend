import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const [authLoading, setAuthLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const { data, isFetching} = useQuery({
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
    if (!isFetching) {
      setAuthLoading(false);
    }
  }, [isFetching]);

  useEffect(() => {
    if (data) {
      setUser(data);
      setRole(data.role);
    } else {
      setUser(null);
      setRole(null);
    }
  }, [data]);

  const isAuthenticated = !!user;

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setRole(null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading: authLoading,
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
