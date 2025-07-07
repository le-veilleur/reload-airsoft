import axios from "axios";
import Cookies from "js-cookie";
import { BookingRequest } from "../Interfaces/types";
import { 
  getApiUrl, 
  API_CONFIG, 
  JWT_CONFIG, 
  ENDPOINTS,
  DEBUG_CONFIG 
} from "../config/api.config";

// Configuration de l'API avec les variables d'environnement
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  headers: {
    "Content-Type": "application/json"
  }
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(JWT_CONFIG.COOKIE_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`Booking Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.error("Booking Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`Booking Response: ${response.status}`, response.config.url);
    }
    return response;
  },
  (error) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.error("Booking Response Error:", {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data
      });
    }
    return Promise.reject(error);
  }
);

// Fonction pour réserver une place à un événement
export const bookEvent = async (bookingData: BookingRequest) => {
  try {
    const response = await api.post(ENDPOINTS.BOOKINGS.BOOK(bookingData.event_id), bookingData);
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log("Réservation créée avec succès:", response.data);
    }
    
    return response.data;
  } catch (error) {
    handleBookingError(error, "réservation de l'événement");
    throw error;
  }
};

// Fonction pour annuler une réservation
export const cancelBooking = async (eventId: string) => {
  try {
    const response = await api.delete(ENDPOINTS.BOOKINGS.CANCEL(eventId));
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log("Réservation annulée avec succès:", response.data);
    }
    
    return response.data;
  } catch (error) {
    handleBookingError(error, "annulation de la réservation");
    throw error;
  }
};

// Fonction pour vérifier le statut de réservation de l'utilisateur
export const getBookingStatus = async (eventId: string) => {
  try {
    const response = await api.get(ENDPOINTS.BOOKINGS.STATUS(eventId));
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log("Statut de réservation récupéré:", response.data);
    }
    
    return response.data;
  } catch (error) {
    handleBookingError(error, "vérification du statut de réservation");
    throw error;
  }
};

// Fonction pour obtenir la liste d'attente
export const getWaitingList = async (eventId: string) => {
  try {
    const response = await api.get(ENDPOINTS.BOOKINGS.WAITING_LIST(eventId));
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log("Liste d'attente récupérée:", response.data);
    }
    
    return response.data;
  } catch (error) {
    handleBookingError(error, "récupération de la liste d'attente");
    throw error;
  }
};

// Fonction pour obtenir toutes les réservations de l'utilisateur
export const getUserBookings = async () => {
  try {
    const response = await api.get('/user/bookings');
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log("Réservations utilisateur récupérées:", response.data);
    }
    
    return response.data;
  } catch (error) {
    handleBookingError(error, "récupération des réservations utilisateur");
    throw error;
  }
};

// Fonction de retry avec backoff exponentiel
const retryRequest = async (fn: () => Promise<any>, retries: number = API_CONFIG.RETRY.MAX_RETRIES): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && axios.isAxiosError(error)) {
      const isRetryableError = (error.response?.status && error.response.status >= 500) || error.code === 'NETWORK_ERROR';
      
      if (isRetryableError) {
        const delay = API_CONFIG.RETRY.DELAY * (API_CONFIG.RETRY.MAX_RETRIES - retries + 1);
        
        if (DEBUG_CONFIG.ENABLED) {
          console.log(`Retry dans ${delay}ms, tentatives restantes: ${retries}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryRequest(fn, retries - 1);
      }
    }
    throw error;
  }
};

// Fonction de gestion des erreurs de réservation
const handleBookingError = (error: any, action: string) => {
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
        console.error(`Données de réservation invalides lors de la ${action}`);
        break;
      case 401:
        console.error(`Non autorisé lors de la ${action}`);
        Cookies.remove(JWT_CONFIG.COOKIE_NAME);
        break;
      case 403:
        console.error(`Accès interdit lors de la ${action}`);
        break;
      case 404:
        console.error(`Événement non trouvé lors de la ${action}`);
        break;
      case 409:
        console.error(`Conflit lors de la ${action} (places épuisées ou déjà réservé)`);
        break;
      case 422:
        console.error(`Réservation impossible lors de la ${action}`);
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

// Export avec retry pour les fonctions critiques
export const bookEventWithRetry = (bookingData: BookingRequest) => 
  retryRequest(() => bookEvent(bookingData));

export const getBookingStatusWithRetry = (eventId: string) => 
  retryRequest(() => getBookingStatus(eventId)); 