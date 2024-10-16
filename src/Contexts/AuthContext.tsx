import React, { createContext, useState, useContext, ReactNode } from "react";
import Cookies from "js-cookie";
import AuthService, {
  AuthResponse,
  LoginData,
  RegisterData
} from "../Services/AuthService";

export interface User {
  FirstName: string;
  LastName: string;
  username: string; // Nouveau champ pour le pseudo
  email: string;
  teams: string[];
  avatarUrl: string | null;
}

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
      console.log("Response from API:", response); // Log la réponse complète ici

      // Assurez-vous que 'Roles' et 'email' sont présents
      if (response.email && response.Roles) {
        setToken(response.access_token);
        setUser({
          FirstName: "", // Définit par défaut ou récupérez d'une autre source si nécessaire
          LastName: "", // Définit par défaut ou récupérez d'une autre source si nécessaire
          username: response.email.split("@")[0], // Exemple de génération du pseudo à partir de l'email
          email: response.email,
          teams: response.Roles, // Utilisez directement Roles
          avatarUrl: null // Vous pouvez définir une URL par défaut si vous en avez une
        });
        Cookies.set("JWT-Reload-airsoft", response.access_token, {
          expires: 7
        });
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
