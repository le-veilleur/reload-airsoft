import axios from "axios";
import Cookies from "js-cookie";
import { CreateEventData, CreateEventResponse } from "../Interfaces/types";
import { 
  getApiUrl, 
  API_CONFIG, 
  JWT_CONFIG, 
  ENDPOINTS,
  DEBUG_CONFIG 
} from "../config/api.config";
import { EventFilters } from '../Components/Events/EventFilters';

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
    
    // Debug logging si activé
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.error("Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`API Response: ${response.status}`, {
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    if (DEBUG_CONFIG.ENABLED) {
      console.error(`API Response Error:`, {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data
      });
    }
    return Promise.reject(error);
  }
);

// Types pour les événements
export interface Event {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    postalCode: string;
  };
  startDate: string;
  endDate: string;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  status: string;
  organizer: {
    id: string;
    name: string;
  };
  categories: Array<{
    id: string;
    name: string;
  }>;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  startDate: string;
  endDate: string;
  maxParticipants: number;
  price: number;
  categoryIds: string[];
  isPrivate: boolean;
  organizerId: string;
}

// Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8080';

class EventService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/events${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
      throw error;
    }
  }

  // Récupérer tous les événements
  async getEvents(): Promise<Event[]> {
    return this.makeRequest<Event[]>('');
  }

  // Récupérer les événements avec filtres
  async getFilteredEvents(filters: EventFilters): Promise<Event[]> {
    const queryParams = new URLSearchParams();
    
    // Ajouter les filtres à la requête
    if (filters.searchTerm) {
      queryParams.append('search_term', filters.searchTerm);
    }
    if (filters.startDate) {
      queryParams.append('start_date', filters.startDate);
    }
    if (filters.endDate) {
      queryParams.append('end_date', filters.endDate);
    }
    if (filters.locationText) {
      queryParams.append('location_text', filters.locationText);
    }
    if (filters.city) {
      queryParams.append('city', filters.city);
    }
    if (filters.country) {
      queryParams.append('country', filters.country);
    }
    if (filters.minPrice !== undefined) {
      queryParams.append('min_price', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      queryParams.append('max_price', filters.maxPrice.toString());
    }
    if (filters.freeOnly) {
      queryParams.append('free_only', 'true');
    }
    if (filters.paidOnly) {
      queryParams.append('paid_only', 'true');
    }
    if (filters.excludeFull) {
      queryParams.append('exclude_full', 'true');
    }
    if (filters.isPrivate) {
      queryParams.append('is_private', 'true');
    }
    if (filters.isPublic) {
      queryParams.append('is_public', 'true');
    }
    if (filters.statuses && filters.statuses.length > 0) {
      filters.statuses.forEach(status => {
        queryParams.append('statuses', status);
      });
    }
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filters.categoryIds.forEach(categoryId => {
        queryParams.append('category_ids', categoryId);
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `?${queryString}` : '';
    
    return this.makeRequest<Event[]>(endpoint);
  }

  // Récupérer un événement par ID
  async getEventById(id: string): Promise<Event> {
    return this.makeRequest<Event>(`/${id}`);
  }

  // Créer un nouvel événement
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    return this.makeRequest<Event>('', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Mettre à jour un événement
  async updateEvent(id: string, eventData: Partial<CreateEventRequest>): Promise<Event> {
    return this.makeRequest<Event>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  // Supprimer un événement
  async deleteEvent(id: string): Promise<void> {
    return this.makeRequest<void>(`/${id}`, {
      method: 'DELETE',
    });
  }

  // S'inscrire à un événement
  async registerToEvent(eventId: string, userId: string, role: string = 'player'): Promise<void> {
    return this.makeRequest<void>(`/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    });
  }

  // Se désinscrire d'un événement
  async unregisterFromEvent(eventId: string, userId: string): Promise<void> {
    return this.makeRequest<void>(`/${eventId}/unregister`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Récupérer les participants d'un événement
  async getEventParticipants(eventId: string): Promise<any[]> {
    return this.makeRequest<any[]>(`/${eventId}/participants`);
  }

  // Vérifier si un utilisateur est inscrit à un événement
  async isUserRegisteredToEvent(eventId: string, userId: string): Promise<boolean> {
    return this.makeRequest<boolean>(`/${eventId}/participants/${userId}/check`);
  }
}

// Instance singleton du service
export const eventService = new EventService();
export default eventService;

// Fonction pour obtenir tous les événements
export const getAllEvents = async (forceRefresh: boolean = false) => {
  try {
    const url = forceRefresh ? `${ENDPOINTS.EVENTS.LIST}?refresh=${Date.now()}` : ENDPOINTS.EVENTS.LIST;
    const response = await api.get(url);
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log("Événements récupérés:", response.data);
    }
    
    return response.data;
  } catch (error) {
    handleAxiosError(error, "récupération des événements");
    throw error;
  }
};

// Fonction pour obtenir un événement spécifique par ID
export const getEventById = async (id: string, forceRefresh: boolean = false) => {
  try {
    const endpoint = ENDPOINTS.EVENTS.BY_ID(id);
    const url = forceRefresh ? `${endpoint}?refresh=${Date.now()}` : endpoint;
    const response = await api.get(url);
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`Événement ${id} récupéré:`, response.data);
    }
    
    return response.data;
  } catch (error) {
    handleAxiosError(error, "récupération de l'événement");
    throw error;
  }
};

// Fonction pour créer un nouvel événement (FormData - ancienne version)
export const createEvent = async (eventData: FormData) => {
  try {
    const response = await api.post("/event/evenement/new", eventData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      timeout: API_CONFIG.TIMEOUTS.UPLOAD
    });
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log("Événement créé:", response.data);
    }
    
    return response.data;
  } catch (error) {
    handleAxiosError(error, "création de l'événement");
    throw error;
  }
};

// Fonction pour créer un nouvel événement (JSON - nouvelle version)
export const createEventWithJson = async (eventData: CreateEventData): Promise<CreateEventResponse> => {
  try {
    const response = await api.post(ENDPOINTS.EVENTS.CREATE, eventData, {
      timeout: API_CONFIG.TIMEOUTS.UPLOAD
    });
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log("Événement créé (JSON):", response.data);
    }
    
    return response.data;
  } catch (error) {
    handleAxiosError(error, "création de l'événement");
    throw error;
  }
};

// Fonction pour mettre à jour un événement spécifique par ID (JSON)
export const updateEventWithJson = async (id: string, eventData: any) => {
  try {
    const response = await api.put(ENDPOINTS.EVENTS.UPDATE(id), eventData, {
      timeout: API_CONFIG.TIMEOUTS.UPLOAD
    });
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`Événement ${id} mis à jour:`, response.data);
    }
    
    return response.data;
  } catch (error) {
    handleAxiosError(error, "mise à jour de l'événement");
    throw error;
  }
};

// Fonction pour mettre à jour un événement spécifique par ID (FormData - ancienne version)
export const updateEvent = async (id: string, eventData: FormData) => {
  try {
    const response = await api.put(`/event/evenements/${id}`, eventData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      timeout: API_CONFIG.TIMEOUTS.UPLOAD
    });
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`Événement ${id} mis à jour (FormData):`, response.data);
    }
    
    return response.data;
  } catch (error) {
    handleAxiosError(error, "mise à jour de l'événement");
    throw error;
  }
};

// Fonction pour supprimer un événement spécifique par ID
export const deleteEvent = async (id: string) => {
  try {
    const response = await api.delete(ENDPOINTS.EVENTS.DELETE(id));
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log(`Événement ${id} supprimé:`, response.data);
    }
    
    return response.data;
  } catch (error) {
    handleAxiosError(error, "suppression de l'événement");
    throw error;
  }
};

// Fonction pour forcer le rafraîchissement du cache
export const clearEventCache = () => {
  const timestamp = Date.now();
  
  // Ajouter un timestamp pour forcer le rafraîchissement
  api.defaults.params = { ...api.defaults.params, _cache_bust: timestamp };
  
  // Nettoyer après le délai configuré
  setTimeout(() => {
    if (api.defaults.params && api.defaults.params._cache_bust) {
      delete api.defaults.params._cache_bust;
    }
  }, API_CONFIG.CACHE.EVENTS_TTL);
  
  if (DEBUG_CONFIG.ENABLED) {
    console.log("Cache des événements vidé, timestamp:", timestamp);
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

// Fonction de gestion des erreurs Axios améliorée
const handleAxiosError = (error: any, action: string) => {
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
      case 401:
        // Token expiré ou invalide
        Cookies.remove(JWT_CONFIG.COOKIE_NAME);
        if (DEBUG_CONFIG.ENABLED) {
          console.log("Token supprimé - redirection vers login nécessaire");
        }
        break;
      case 403:
        console.error(`Accès interdit lors de la ${action}`);
        break;
      case 404:
        console.error(`Ressource non trouvée lors de la ${action}`);
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
export const getAllEventsWithRetry = (forceRefresh?: boolean) => 
  retryRequest(() => getAllEvents(forceRefresh));

export const getEventByIdWithRetry = (id: string, forceRefresh?: boolean) => 
  retryRequest(() => getEventById(id, forceRefresh));

// Nouvelle fonction pour récupérer les événements avec filtres
export const getFilteredEvents = async (filters: EventFilters): Promise<Event[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Ajouter les filtres à la requête
    if (filters.searchTerm) {
      queryParams.append('search_term', filters.searchTerm);
    }
    if (filters.startDate) {
      queryParams.append('start_date', filters.startDate);
    }
    if (filters.endDate) {
      queryParams.append('end_date', filters.endDate);
    }
    if (filters.locationText) {
      queryParams.append('location_text', filters.locationText);
    }
    if (filters.city) {
      queryParams.append('city', filters.city);
    }
    if (filters.country) {
      queryParams.append('country', filters.country);
    }
    if (filters.minPrice !== undefined) {
      queryParams.append('min_price', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      queryParams.append('max_price', filters.maxPrice.toString());
    }
    if (filters.freeOnly) {
      queryParams.append('free_only', 'true');
    }
    if (filters.paidOnly) {
      queryParams.append('paid_only', 'true');
    }
    if (filters.excludeFull) {
      queryParams.append('exclude_full', 'true');
    }
    if (filters.isPrivate) {
      queryParams.append('is_private', 'true');
    }
    if (filters.isPublic) {
      queryParams.append('is_public', 'true');
    }
    if (filters.statuses && filters.statuses.length > 0) {
      filters.statuses.forEach(status => {
        queryParams.append('statuses', status);
      });
    }
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filters.categoryIds.forEach(categoryId => {
        queryParams.append('category_ids', categoryId);
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${ENDPOINTS.EVENTS.LIST}?${queryString}` : ENDPOINTS.EVENTS.LIST;
    
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'récupération des événements filtrés');
    throw error;
  }
};

export const getFilteredEventsWithRetry = (filters: EventFilters) => 
  retryRequest(() => getFilteredEvents(filters));
