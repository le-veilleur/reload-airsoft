import React, { createContext, useState, useContext, ReactNode } from "react";
import Cookies from "js-cookie";
import AuthService from "../Services/AuthService";
import { AuthResponse, LoginData, RegisterData, User } from "../Interfaces/types";

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  register: (userData: RegisterData) => Promise<void>;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    Cookies.get("JWT-Reload-airsoft") || null
  );

  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!token;

  const login = async (data: LoginData) => {
    try {
      const response: AuthResponse = await AuthService.login(data);
      console.log("Response from API:", response);

      if (response.first_name && response.roles) {
        setToken(response.access_token);
        setUser({
          first_name: response.first_name,
          last_name: response.last_name,
          username: response.username,
          email: response.email,
          teams: response.roles,
          avatarUrl: null
        });
        Cookies.set("JWT-Reload-airsoft", response.access_token, { expires: 7 });
      } else {
        console.error("User data is undefined in response.");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await AuthService.register(data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("JWT-Reload-airsoft");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, register, logout }}
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
