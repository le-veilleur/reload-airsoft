import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import AuthService from "../Services/AuthService";
import UserService from "../Services/userService";
import {
  AuthResponse,
  LoginData,
  RegisterData,
  UserProfile
} from "../Interfaces/types";

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
  register: (userData: RegisterData) => Promise<void>;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    Cookies.get("JWT-Reload-airsoft") || null
  );
  const [user, setUser] = useState<UserProfile | null>(null);
  const isAuthenticated = !!token;

  // Charger le profil utilisateur au démarrage si un token existe
  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !user) {
        try {
          console.log("Chargement automatique du profil utilisateur...");
          const userProfile = await UserService.getCurrentUserProfile();
          setUser(userProfile);
          console.log("Profil utilisateur chargé automatiquement:", userProfile.email);
        } catch (error) {
          console.warn("Impossible de charger le profil automatiquement, tentative avec le token JWT...");
          try {
            const userProfileFromToken = UserService.createBasicProfileFromToken();
            setUser(userProfileFromToken);
            console.log("Profil extrait du token JWT:", userProfileFromToken.email);
          } catch (tokenError) {
            console.error("Échec du chargement automatique du profil:", tokenError);
            // Nettoyer le token invalide
            setToken(null);
            Cookies.remove("JWT-Reload-airsoft");
          }
        }
      }
    };

    initializeAuth();
  }, [token, user]);

  const login = async (data: LoginData): Promise<void> => {
    try {
      const response: AuthResponse = await AuthService.login(data);
      
      // Log pour debugging - voir exactement ce que renvoie l'API
      console.log(" Réponse de connexion reçue:", {
        access_token: response.access_token ? " Présent" : " Manquant",
        firstname: response.firstname ? " Présent" : " Manquant",
        lastname: response.lastname ? " Présent" : " Manquant",
        email: response.email ? " Présent" : " Manquant", 
        roles: response.roles ? ` ${response.roles.length} rôle(s)` : " Manquant",
        pseudonyme: response.pseudonyme ? " Présent" : " Manquant"
      });

      // Vérification essentielle : seul access_token est obligatoire
      if (!response.access_token) {
        throw new Error("Token d'accès manquant dans la réponse du serveur");
      }

      // Définir le token
      setToken(response.access_token);
      
      // Sauvegarder le token en cookie
      Cookies.set("JWT-Reload-airsoft", response.access_token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      // Récupérer le profil complet depuis l'API
      try {
        const fullProfile = await UserService.getCurrentUserProfile();
        setUser(fullProfile);
        console.log("Connexion réussie, profil chargé pour:", fullProfile.email);
      } catch (profileError) {
        // L'API profile ne fonctionne pas, extraire les données du token JWT
        try {
          const userProfileFromToken = UserService.createBasicProfileFromToken();
          setUser(userProfileFromToken);
          console.log("Connexion réussie, profil extrait du token pour:", userProfileFromToken.email);
        } catch (tokenError) {
          // Fallback avec données de base seulement si le token échoue aussi
          const userProfile: UserProfile = {
            firstname: response.firstname || "Utilisateur",
            lastname: response.lastname || "",
            pseudonyme: response.pseudonyme || response.email?.split('@')[0] || "utilisateur",
            email: response.email || data.email,
            role: (response.roles && response.roles.length > 0) ? response.roles[0] : "",
            avatar_url: null,
            phone_number: null,
            preferences: {
              notifications: true,
              language: "fr"
            }
          };
          
          setUser(userProfile);
          console.log("Connexion réussie avec données limitées pour:", userProfile.email);
        }
      }
      
    } catch (error) {
      console.error(" Échec de la connexion :", error);
      
      // Nettoyer les états en cas d'erreur
      setToken(null);
      setUser(null);
      Cookies.remove("JWT-Reload-airsoft");
      
      // Re-lancer l'erreur pour que le composant Login puisse la gérer
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      await AuthService.register(data);
      console.log("Inscription réussie pour:", data.email);
    } catch (error) {
      console.error("Échec de l'inscription :", error);
      // Re-lancer l'erreur pour que le composant Register puisse la gérer
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    Cookies.remove("JWT-Reload-airsoft");
    console.log(" Déconnexion effectuée");
  };

  const refreshUserProfile = async (): Promise<void> => {
    if (!token) {
      console.warn("Impossible de rafraîchir le profil : non authentifié");
      return;
    }

    try {
      const fullProfile = await UserService.getCurrentUserProfile();
      setUser(fullProfile);
      console.log(" Profil utilisateur rafraîchi");
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du profil:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, register, logout, refreshUserProfile }}
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
