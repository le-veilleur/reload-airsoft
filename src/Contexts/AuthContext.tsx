import React, { createContext, useState, useContext, ReactNode } from "react";
import Cookies from "js-cookie";
import AuthService from "../Services/AuthService";
import {
  AuthResponse,
  LoginData,
  RegisterData,
  User
} from "../Interfaces/types";

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

  const login = async (data: LoginData): Promise<void> => {
    try {
      const response: AuthResponse = await AuthService.login(data);

      if (response.access_token && response.first_name) {
        setToken(response.access_token);
        setUser({
          first_name: response.first_name,
          last_name: response.last_name,
          username: response.username,
          email: response.email,
          teams: response.roles,
          avatarUrl: null // L'avatarUrl n'est pas encore retourné par l'API
        });
        Cookies.set("JWT-Reload-airsoft", response.access_token, {
          expires: 7,
          secure: true
        });
      } else {
        throw new Error("Données utilisateur incomplètes dans la réponse");
      }
    } catch (error) {
      console.error("Échec de la connexion :", error);
      // Tu pourrais également gérer un état d'erreur ici pour l'afficher dans l'UI
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      await AuthService.register(data);
      // Tu pourrais aussi connecter automatiquement l'utilisateur après l'inscription
    } catch (error) {
      console.error("Échec de l'inscription :", error);
      // Gérer l'erreur d'inscription ici si nécessaire
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
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};
