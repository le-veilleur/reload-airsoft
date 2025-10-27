import axios from "axios";
import { UpdateUserData, UserProfile } from "../Interfaces/types";
import { 
  getAuthUrl, 
  API_CONFIG, 
  JWT_CONFIG, 
  DEBUG_CONFIG 
} from "../config/api.config";
import Cookies from "js-cookie";
import { imageUploadService } from "./imageUploadService";

// Configuration de l'API avec les variables d'environnement
const api = axios.create({
  baseURL: getAuthUrl(),
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  headers: {
    "Content-Type": "application/json",
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

const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL || "http://localhost:8080";
console.log("[DEBUG] API_GATEWAY_URL =", API_GATEWAY_URL);

export function mapAvatarUrl(avatarUrl: string | null | undefined): string | null {
  if (!avatarUrl) return null;

  // Si l'URL est déjà absolue mais pointe sur le mauvais host (localhost:3000), on la remplace
  if (avatarUrl.startsWith('http://localhost:3000/')) {
    // On extrait juste le chemin après le host
    const path = avatarUrl.replace('http://localhost:3000', '');
    if (path.startsWith('/api/v1/avatars') || path.startsWith('/avatars/')) {
      return `${API_GATEWAY_URL}${path}`;
    }
  }

  if (avatarUrl.startsWith('/avatars/')) {
    return `${API_GATEWAY_URL}/api/v1${avatarUrl}`;
  }
  if (avatarUrl.startsWith('/api/v1/avatars')) {
    return `${API_GATEWAY_URL}${avatarUrl}`;
  }
  return avatarUrl;
}

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
      
      // DEBUG: Afficher les données brutes avant mapping
      console.log("🔍 DEBUG - Données brutes de l'API:", userData);
      console.log("🔍 DEBUG - Structure de userData:", {
        firstname: userData.firstname,
        lastname: userData.lastname,
        pseudonyme: userData.pseudonyme,
        email: userData.email,
        role: userData.role,
        avatar_url: userData.avatar_url,
        phone: userData.phone,
        phone_number: userData.phone_number
      });
      
      // Mapper les données du protobuf vers notre interface TypeScript
      const mappedProfile: UserProfile = {
        id: userData.id || userID, // Utiliser l'ID de l'API ou le userID du token
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        pseudonyme: userData.pseudonyme || userData.pseudoname || "",
        email: userData.email || "",
        role: (() => {
          // Priorité au rôle du token JWT
          try {
            const token = Cookies.get(JWT_CONFIG.COOKIE_NAME);
            if (token) {
              const payload = JSON.parse(atob(token.split('.')[1]));
              if (payload.role) {
                console.log("DEBUG: Rôle extrait du token JWT:", payload.role);
                return payload.role;
              }
            }
          } catch (e) {
            console.warn("Impossible d'extraire le rôle du token JWT:", e);
          }
          // Fallback sur le rôle de l'API
          console.log("DEBUG: Rôle de l'API Gateway:", userData.role);
          return userData.role || "";
        })(),
        avatar_url: (() => {
          const avatarUrl = userData.avatar_url;
          if (!avatarUrl) return null;
          
          // Si l'URL commence par /avatars/, la transformer pour pointer vers l'API Gateway
          if (avatarUrl.startsWith('/avatars/')) {
            return `${API_GATEWAY_URL}/api/v1${avatarUrl}`;
          }
          
          return avatarUrl;
        })(),
        phone_number: userData.phone || userData.phone_number || null,
        preferences: {
          notifications: userData.preferences?.email_notifications ?? true,
          language: userData.preferences?.language || "fr"
        }
      };
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Profil mappé:", mappedProfile);
      }
      
      // DEBUG: Afficher le profil final
      console.log("🔍 DEBUG - Profil final mappé:", mappedProfile);
      
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
      
      // DEBUG: Afficher le contenu du token JWT
      console.log("🔍 DEBUG - Token JWT payload:", payload);
      console.log("🔍 DEBUG - Champs du token:", {
        userID: payload.userID,
        sub: payload.sub,
        email: payload.email,
        firstname: payload.firstname,
        lastname: payload.lastname,
        pseudonyme: payload.pseudonyme,
        role: payload.role,
        roles: payload.roles,
        authorities: payload.authorities
      });
      
      // Extraire l'email depuis le token
      const tokenEmail = payload.email || payload.sub;
      const emailUsername = tokenEmail?.includes('@') ? tokenEmail.split('@')[0] : null;
      
      // Créer un profil à partir des données du token
      const profile: UserProfile = {
        id: payload.userID || payload.sub || payload.user_id || payload.id, // Extraire l'ID du token
        firstname: payload.firstname || payload.given_name || payload.name?.split(' ')[0] || "Utilisateur",
        lastname: payload.lastname || payload.family_name || payload.name?.split(' ').slice(1).join(' ') || "", 
        pseudonyme: payload.pseudonyme || payload.username || payload.preferred_username || emailUsername || "utilisateur",
        email: tokenEmail || "user@example.com",
        role: payload.role || payload.roles?.[0] || payload.authorities?.[0],
        avatar_url: (() => {
          const avatarUrl = payload.picture || payload.avatar_url;
          if (!avatarUrl) return null;
          
          // Si l'URL commence par /avatars/, la transformer pour pointer vers l'API Gateway
          if (avatarUrl.startsWith('/avatars/')) {
            return `${API_GATEWAY_URL}/api/v1${avatarUrl}`;
          }
          
          return avatarUrl;
        })(),
        phone_number: payload.phone_number || payload.phone || null,
        preferences: {
          notifications: payload.notifications ?? true,
          language: payload.locale || payload.lang || "fr"
        }
      };

      if (DEBUG_CONFIG.ENABLED) {
        console.log("Profil créé depuis le token JWT:", profile);
      }
      
      // DEBUG: Afficher le profil créé depuis le token
      console.log("🔍 DEBUG - Profil créé depuis le token JWT:", profile);

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
        avatar_url: null,
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
        role: updatedUser.role,
        avatar_url: (() => {
          const avatarUrl = updatedUser.avatar_url;
          if (!avatarUrl) return null;
          
          // Si l'URL commence par /avatars/, la transformer pour pointer vers l'API Gateway
          if (avatarUrl.startsWith('/avatars/')) {
            return `${API_GATEWAY_URL}/api/v1${avatarUrl}`;
          }
          
          return avatarUrl;
        })(),
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
   * Envoie l'image au backend sous forme { avatar_data, avatar_filename }
   */
  uploadProfilePicture: async (file: File): Promise<string> => {
    try {
      // Optimiser l'image avant conversion
      const optimizedFile = await imageUploadService.optimizeImage(file, 400, 400, 0.8);
      // Convertir en base64
      const base64String: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // On retire le préfixe data:image/...;base64,
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => {
          reject(new Error("Erreur lors de la lecture du fichier"));
        };
        reader.readAsDataURL(optimizedFile);
      });
      // Appel API pour upload
      const userID = UserService.getUserIDFromToken();
      if (!userID) throw new Error("Impossible de récupérer l'ID utilisateur pour l'upload d'avatar");
      const response = await api.post(`/${userID}/avatar`, {
        avatar_data: base64String,
        avatar_filename: optimizedFile.name
      });
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Réponse upload avatar:", response.data);
      }
      // Retourner l'URL de l'avatar en s'assurant qu'elle pointe vers l'API Gateway
      const avatarUrl = response.data.avatar_url || response.data.url;
      if (avatarUrl && avatarUrl.startsWith('/avatars/')) {
        return `${API_GATEWAY_URL}/api/v1${avatarUrl}`;
      }
      return avatarUrl;
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
      await UserService.updateUserProfile({ avatar_url: "" });
      
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
        role: userData.role,
        avatar_url: mapAvatarUrl(userData.avatar_url || userData.profile_picture_url),
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
        role: userData.role,
        avatar_url: mapAvatarUrl(userData.avatar_url || userData.profile_picture_url),
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
        pseudonyme: createdUser.pseudonyme || createdUser.pseudoname || "",
        email: createdUser.email || "",
        role: createdUser.role,
        avatar_url: mapAvatarUrl(createdUser.avatar_url),
        phone_number: createdUser.phone || createdUser.phone_number || null,
        preferences: {
          notifications: createdUser.preferences?.email_notifications ?? true,
          language: createdUser.preferences?.language || "fr"
        }
      };
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      throw error;
    }
  }
};

export default UserService; 