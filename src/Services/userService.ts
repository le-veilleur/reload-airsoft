import axios from "axios";
import { UpdateUserData, UserProfile } from "../Interfaces/types";
import { 
  getAuthUrl, 
  API_CONFIG, 
  JWT_CONFIG, 
  DEBUG_CONFIG 
} from "../config/api.config";
import Cookies from "js-cookie";

// Configuration de l'API avec les variables d'environnement
const api = axios.create({
  baseURL: getAuthUrl(),
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  headers: {
    "Content-Type": "application/json"
  }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(JWT_CONFIG.COOKIE_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`User Service Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.error("User Service Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`User Service Response: ${response.status}`, response.config?.url);
    }
    return response;
  },
  (error) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.error("User Service Response Error:", {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data
      });
    }
    
    // Gestion spécifique des erreurs d'authentification
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      Cookies.remove(JWT_CONFIG.COOKIE_NAME);
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

const UserService = {
  /**
   * Récupère le profil de l'utilisateur actuel
   */
  getCurrentUserProfile: async (): Promise<UserProfile> => {
    try {
      // Récupérer l'userID depuis le token JWT
      const userID = UserService.getUserIDFromToken();
      
      if (!userID) {
        console.warn("Aucun userID trouvé dans le token, utilisation du profil depuis le token");
        return UserService.createBasicProfileFromToken();
      }

      // Utiliser la vraie route API : GET /users/:id
      const response = await api.get(`/${userID}`);
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Profil utilisateur récupéré:", response.data);
      }
      
      // L'API retourne { user: UserProfile } selon le proto
      const userData = response.data.user || response.data;
      
      // Mapper les données du protobuf vers notre interface TypeScript
      const mappedProfile: UserProfile = {
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        pseudonyme: userData.pseudonyme || userData.pseudoname || "",
        email: userData.email || "",
        role: userData.role || "player",
        profile_picture_url: userData.avatar_url || userData.profile_picture_url || null,
        phone_number: userData.phone || userData.phone_number || null,
        preferences: {
          notifications: userData.preferences?.email_notifications ?? true,
          language: userData.preferences?.language || "fr"
        }
      };
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Profil mappé:", mappedProfile);
      }
      
      return mappedProfile;
      
    } catch (error: any) {
      console.warn("Impossible de récupérer le profil via l'API, utilisation du token JWT");
      // Fallback : créer un profil depuis le token JWT
      return UserService.createBasicProfileFromToken();
    }
  },

  /**
   * Extrait l'userID depuis le token JWT
   */
  getUserIDFromToken: (): string | null => {
    try {
      const token = Cookies.get(JWT_CONFIG.COOKIE_NAME);
      if (!token) return null;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userID || payload.sub || payload.user_id || null;
    } catch (error) {
      console.error("Erreur lors de l'extraction de l'userID:", error);
      return null;
    }
  },

  /**
   * Crée un profil basique à partir du token JWT décodé
   */
  createBasicProfileFromToken: (): UserProfile => {
    try {
      const token = Cookies.get(JWT_CONFIG.COOKIE_NAME);
      
      if (!token) {
        throw new Error("Aucun token disponible");
      }

      // Décoder le token JWT (partie payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Extraire l'email depuis le token
      const tokenEmail = payload.email || payload.sub;
      const emailUsername = tokenEmail?.includes('@') ? tokenEmail.split('@')[0] : null;
      
      // Créer un profil à partir des données du token
      const profile: UserProfile = {
        firstname: payload.firstname || payload.given_name || payload.name?.split(' ')[0] || "Utilisateur",
        lastname: payload.lastname || payload.family_name || payload.name?.split(' ').slice(1).join(' ') || "", 
        pseudonyme: payload.pseudonyme || payload.username || payload.preferred_username || emailUsername || "utilisateur",
        email: tokenEmail || "user@example.com",
        role: payload.role || payload.roles?.[0] || payload.authorities?.[0] || "player",
        profile_picture_url: payload.picture || payload.avatar_url || null,
        phone_number: payload.phone_number || payload.phone || null,
        preferences: {
          notifications: payload.notifications ?? true,
          language: payload.locale || payload.lang || "fr"
        }
      };

      if (DEBUG_CONFIG.ENABLED) {
        console.log("Profil créé depuis le token JWT:", profile);
      }

      return profile;
      
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      
      // Profil par défaut générique
      const defaultProfile: UserProfile = {
        firstname: "Utilisateur",
        lastname: "",
        pseudonyme: "utilisateur", 
        email: "user@example.com",
        role: "player",
        profile_picture_url: null,
        phone_number: null,
        preferences: {
          notifications: true,
          language: "fr"
        }
      };
      
      return defaultProfile;
    }
  },

  /**
   * Met à jour le profil de l'utilisateur en utilisant l'API Gateway
   */
  updateUserProfile: async (data: UpdateUserData): Promise<UserProfile> => {
    try {
      // Récupérer l'userID depuis le token JWT
      const userID = UserService.getUserIDFromToken();
      
      if (!userID) {
        throw new Error("Impossible de récupérer l'ID utilisateur pour la mise à jour");
      }

      // Utiliser la route PUT /users/:id de l'API Gateway
      const response = await api.put(`/${userID}`, data);
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Profil utilisateur mis à jour:", response.data);
      }
      
      // L'API Gateway retourne { user: UserProfile, message: string }
      const updatedUser = response.data.user || response.data;
      
      // Mapper les données du protobuf vers notre interface TypeScript
      const mappedProfile: UserProfile = {
        firstname: updatedUser.firstname || "",
        lastname: updatedUser.lastname || "",
        pseudonyme: updatedUser.pseudonyme || updatedUser.pseudoname || "",
        email: updatedUser.email || "",
        role: updatedUser.role || "player",
        profile_picture_url: updatedUser.avatar_url || updatedUser.profile_picture_url || null,
        phone_number: updatedUser.phone || updatedUser.phone_number || null,
        preferences: {
          notifications: updatedUser.preferences?.email_notifications ?? true,
          language: updatedUser.preferences?.language || "fr"
        }
      };
      
      return mappedProfile;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    }
  },

  /**
   * Change le mot de passe de l'utilisateur
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      const response = await api.put('/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Mot de passe changé avec succès");
      }
      
      return response.data;
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      throw error;
    }
  },

  /**
   * Upload d'une photo de profil
   * Solution temporaire : conversion en base64
   * TODO: Implémenter un vrai service d'upload (Cloudinary, AWS S3, etc.)
   */
  uploadProfilePicture: async (file: File): Promise<string> => {
    try {
      // Solution temporaire : convertir l'image en base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = () => {
          reject(new Error("Erreur lors de la lecture du fichier"));
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error("Erreur lors de l'upload de la photo:", error);
      throw error;
    }
  },

  /**
   * Supprime la photo de profil
   * Solution temporaire : retourne null pour indiquer qu'il n'y a plus d'avatar
   */
  deleteProfilePicture: async (): Promise<void> => {
    try {
      // Récupérer l'userID depuis le token JWT
      const userID = UserService.getUserIDFromToken();
      
      if (!userID) {
        throw new Error("Impossible de récupérer l'ID utilisateur pour la suppression");
      }

      // Mettre à jour le profil avec avatar_url = ""
      await UserService.updateUserProfile({ profile_picture_url: "" });
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Photo de profil supprimée");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo:", error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques de l'utilisateur
   */
  getUserStats: async (): Promise<any> => {
    try {
      const response = await api.get('/profile/stats');
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Statistiques utilisateur récupérées:", response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }
  },

  /**
   * Met à jour les préférences de l'utilisateur
   */
  updateUserPreferences: async (preferences: Record<string, any>): Promise<void> => {
    try {
      const response = await api.put('/profile/preferences', { preferences });
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Préférences mises à jour:", response.data);
      }
      
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      throw error;
    }
  },

  /**
   * Récupère un utilisateur par son ID via l'API Gateway
   */
  getUserById: async (userID: string): Promise<UserProfile> => {
    try {
      const response = await api.get(`/${userID}`);
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Utilisateur récupéré:", response.data);
      }
      
      // L'API Gateway retourne { user: UserProfile }
      const userData = response.data.user || response.data;
      
      // Mapper les données du protobuf vers notre interface TypeScript
      const mappedProfile: UserProfile = {
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        pseudonyme: userData.pseudonyme || userData.pseudoname || "",
        email: userData.email || "",
        role: userData.role || "player",
        profile_picture_url: userData.avatar_url || userData.profile_picture_url || null,
        phone_number: userData.phone || userData.phone_number || null,
        preferences: {
          notifications: userData.preferences?.email_notifications ?? true,
          language: userData.preferences?.language || "fr"
        }
      };
      
      return mappedProfile;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      throw error;
    }
  },

  /**
   * Récupère la liste de tous les utilisateurs (pour les admins)
   */
  getAllUsers: async (): Promise<UserProfile[]> => {
    try {
      const response = await api.get('');
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Liste des utilisateurs récupérée:", response.data);
      }
      
      // L'API Gateway retourne { users: UserProfile[], total: number }
      const users = response.data.users || [];
      
      // Mapper chaque utilisateur
      return users.map((userData: any) => ({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        pseudonyme: userData.pseudonyme || userData.pseudoname || "",
        email: userData.email || "",
        role: userData.role || "player",
        profile_picture_url: userData.avatar_url || userData.profile_picture_url || null,
        phone_number: userData.phone || userData.phone_number || null,
        preferences: {
          notifications: userData.preferences?.email_notifications ?? true,
          language: userData.preferences?.language || "fr"
        }
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération de la liste des utilisateurs:", error);
      throw error;
    }
  },

  /**
   * Supprime le compte utilisateur via l'API Gateway
   */
  deleteAccount: async (password?: string): Promise<void> => {
    try {
      // Récupérer l'userID depuis le token JWT
      const userID = UserService.getUserIDFromToken();
      
      if (!userID) {
        throw new Error("Impossible de récupérer l'ID utilisateur pour la suppression");
      }

      // Utiliser la route DELETE /users/:id de l'API Gateway
      await api.delete(`/${userID}`, {
        data: password ? { password } : undefined
      });
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Compte supprimé avec succès");
      }
      
      // Nettoyer les données locales
      Cookies.remove(JWT_CONFIG.COOKIE_NAME);
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      throw error;
    }
  },

  /**
   * Créer un nouvel utilisateur (pour les admins)
   */
  createUser: async (userData: {
    firstname: string;
    lastname: string;
    pseudonyme: string;
    email: string;
    password: string;
    phone_number?: string;
    bio?: string;
    location?: string;
    marketing_consent?: boolean;
  }): Promise<UserProfile> => {
    try {
      const response = await api.post('', userData);
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Utilisateur créé:", response.data);
      }
      
      // L'API Gateway retourne { user: UserProfile, message: string }
      const createdUser = response.data.user || response.data;
      
      // Mapper les données
      return {
        firstname: createdUser.firstname || "",
        lastname: createdUser.lastname || "",
        pseudonyme: createdUser.pseudonyme || "",
        email: createdUser.email || "",
        role: createdUser.role || "player",
        profile_picture_url: createdUser.avatar_url || null,
        phone_number: createdUser.phone || null,
        preferences: {
          notifications: true,
          language: "fr"
        }
      };
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      throw error;
    }
  }
};

export default UserService; 