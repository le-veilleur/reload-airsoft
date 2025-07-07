import axios from "axios";
import Cookies from "js-cookie";
import { LoginData, RegisterData, CompleteRegisterData, AuthResponse } from "../Interfaces/types";
import { 
  getAuthUrl, 
  API_CONFIG, 
  JWT_CONFIG, 
  ENDPOINTS,
  DEBUG_CONFIG 
} from "../config/api.config";

// Configuration de l'API avec les variables d'environnement
const api = axios.create({
  baseURL: getAuthUrl(),
  timeout: API_CONFIG.TIMEOUTS.AUTH,
  headers: {
    "Content-Type": "application/json"
  }
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`Auth Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.error("Auth Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`Auth Response: ${response.status}`, response.config.url);
    }
    return response;
  },
  (error) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.error("Auth Response Error:", {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data
      });
    }
    return Promise.reject(error);
  }
);

const AuthService = {
  // Méthode pour la connexion
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, data);
      
      if (response.data && response.data.access_token) {
        Cookies.set(JWT_CONFIG.COOKIE_NAME, response.data.access_token, {
          expires: JWT_CONFIG.EXPIRY_DAYS,
          secure: JWT_CONFIG.SECURE_COOKIES,
          sameSite: JWT_CONFIG.SAME_SITE as any
        });
        
        if (DEBUG_CONFIG.ENABLED) {
          console.log("Utilisateur connecté avec succès");
        }
      } else {
        console.error("Token indéfini dans la réponse de connexion");
      }

      return response.data as AuthResponse;
    } catch (error) {
      handleAuthError(error, "connexion");
      throw error;
    }
  },

  // Méthode pour l'enregistrement simple
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, data);
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Utilisateur enregistré avec succès");
      }
      
      return response.data as AuthResponse;
    } catch (error) {
      handleAuthError(error, "enregistrement");
      throw error;
    }
  },

  // Méthode pour l'enregistrement complet avec toutes les informations
  registerComplete: async (data: CompleteRegisterData): Promise<AuthResponse> => {
    try {
      // Transformation des données pour correspondre au format attendu par l'API
      const registerPayload = {
        firstname: data.firstname,
        lastname: data.lastname,
        pseudonyme: data.pseudonyme,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
        bio: data.bio,
        location: data.location,
        marketing_consent: data.marketing_consent,
        terms_accepted_at: new Date().toISOString(),
        privacy_accepted_at: new Date().toISOString()
      };

      if (DEBUG_CONFIG.ENABLED) {
        console.log("Tentative d'inscription complète pour:", data.email);
      }

      const response = await api.post(ENDPOINTS.AUTH.REGISTER, registerPayload);
      
      // Si l'inscription est réussie et qu'un token est fourni, on le stocke
      if (response.data && response.data.access_token) {
        Cookies.set(JWT_CONFIG.COOKIE_NAME, response.data.access_token, {
          expires: JWT_CONFIG.EXPIRY_DAYS,
          secure: JWT_CONFIG.SECURE_COOKIES,
          sameSite: JWT_CONFIG.SAME_SITE as any
        });
        
        if (DEBUG_CONFIG.ENABLED) {
          console.log("Inscription complète réussie avec connexion automatique");
        }
      }
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Utilisateur enregistré avec profil complet");
      }
      
      return response.data as AuthResponse;
    } catch (error) {
      handleAuthError(error, "enregistrement complet");
      throw error;
    }
  },

  // Méthode pour le rafraîchissement du token
  refreshToken: async (): Promise<string> => {
    try {
      const response = await api.get(ENDPOINTS.AUTH.REFRESH_TOKEN);
      
      if (response.data.access_token) {
        Cookies.set(JWT_CONFIG.COOKIE_NAME, response.data.access_token, {
          expires: JWT_CONFIG.EXPIRY_DAYS,
          secure: JWT_CONFIG.SECURE_COOKIES,
          sameSite: JWT_CONFIG.SAME_SITE as any
        });
        
        if (DEBUG_CONFIG.ENABLED) {
          console.log("Token rafraîchi avec succès");
        }
      }
      
      return response.data.access_token;
    } catch (error) {
      handleAuthError(error, "rafraîchissement du token");
      throw error;
    }
  },

  // Méthode pour la déconnexion
  logout: async (): Promise<void> => {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT, {});
      Cookies.remove(JWT_CONFIG.COOKIE_NAME);
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Utilisateur déconnecté avec succès");
      }
    } catch (error) {
      // En cas d'erreur, on supprime quand même le cookie local
      Cookies.remove(JWT_CONFIG.COOKIE_NAME);
      handleAuthError(error, "déconnexion");
      throw error;
    }
  },

  // Méthode pour vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    const token = Cookies.get(JWT_CONFIG.COOKIE_NAME);
    return !!token;
  },

  // Méthode pour obtenir le token actuel
  getToken: (): string | undefined => {
    return Cookies.get(JWT_CONFIG.COOKIE_NAME);
  },

  // Validation des données d'inscription complète
  validateCompleteRegisterData: (data: CompleteRegisterData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validation des champs obligatoires
    if (!data.firstname || data.firstname.trim().length < 2) {
      errors.push("Le prénom doit contenir au moins 2 caractères");
    }

    if (!data.lastname || data.lastname.trim().length < 2) {
      errors.push("Le nom doit contenir au moins 2 caractères");
    }

    if (!data.pseudonyme || data.pseudonyme.trim().length < 3) {
      errors.push("Le pseudonyme doit contenir au moins 3 caractères");
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.push("L'adresse email n'est pas valide");
    }

    // Validation mot de passe
    if (!data.password || data.password.length < 8) {
      errors.push("Le mot de passe doit contenir au moins 8 caractères");
    }

    // Validation numéro de téléphone français
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
    if (!data.phone_number || !phoneRegex.test(data.phone_number.replace(/\s/g, ''))) {
      errors.push("Le numéro de téléphone n'est pas valide (format français attendu)");
    }

    // Validation bio
    if (!data.bio || data.bio.trim().length < 10) {
      errors.push("La biographie doit contenir au moins 10 caractères");
    }

    if (data.bio && data.bio.length > 500) {
      errors.push("La biographie ne peut pas dépasser 500 caractères");
    }

    // Validation localisation
    if (!data.location || data.location.trim().length < 3) {
      errors.push("La localisation doit contenir au moins 3 caractères");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Formatage des données d'inscription
  formatCompleteRegisterData: (data: CompleteRegisterData): CompleteRegisterData => {
    return {
      firstname: data.firstname.trim(),
      lastname: data.lastname.trim(),
      pseudonyme: data.pseudonyme.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password,
      phone_number: data.phone_number.replace(/\s/g, ''), // Supprimer les espaces
      bio: data.bio.trim(),
      location: data.location.trim(),
      marketing_consent: data.marketing_consent
    };
  }
};

// Fonction de gestion des erreurs d'authentification
const handleAuthError = (error: any, action: string) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    if (DEBUG_CONFIG.ENABLED) {
      console.error(`Erreur ${status} lors de la ${action}:`, {
        url: error.config?.url,
        method: error.config?.method,
        status,
        message,
        data: error.response?.data
      });
    }
    
    // Gestion spécifique selon le code d'erreur
    switch (status) {
      case 400:
        console.error(`Données invalides lors de la ${action}`);
        break;
      case 401:
        console.error(`Identifiants incorrects lors de la ${action}`);
        Cookies.remove(JWT_CONFIG.COOKIE_NAME);
        break;
      case 403:
        console.error(`Accès interdit lors de la ${action}`);
        break;
      case 409:
        console.error(`Conflit lors de la ${action} (utilisateur déjà existant)`);
        break;
      case 429:
        console.error(`Limite de taux atteinte lors de la ${action}`);
        break;
      case 500:
        console.error(`Erreur serveur lors de la ${action}`);
        break;
      default:
        console.error(`Erreur ${status} lors de la ${action}:`, message);
    }
  } else {
    console.error(`Erreur inconnue lors de la ${action}:`, error);
  }
};

export default AuthService;
