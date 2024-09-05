import React, { createContext, useState, useContext, ReactNode } from "react";
import Cookies from "js-cookie";
import AuthService, { AuthResponse } from "../Services/AuthService";
import { LoginFormProps } from "../auth/Login"; // Assurez-vous que le chemin est correct
import { RegisterFormProps } from "../auth/Register";

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  avatarUrl: string | null;
  register: (userData: RegisterFormProps) => Promise<void>;
  login: (credentials: LoginFormProps) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    Cookies.get("JWT-Reload-airsoft") || null
  );

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const isAuthenticated = !!token;

  const login = async (data: LoginFormProps) => {
    try {
      const response: AuthResponse = await AuthService.login(data);
      setToken(response.access_token);
      setAvatarUrl(response.avatarUrl ?? null);

      Cookies.set("JWT-Reload-airsoft", response.access_token, { expires: 7 });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const register = async (data: RegisterFormProps) => {
    try {
      await AuthService.register(data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const logout = () => {
    setToken(null);
    setAvatarUrl(null);
    Cookies.remove("JWT-Reload-airsoft");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, avatarUrl, login, register, logout }}
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
