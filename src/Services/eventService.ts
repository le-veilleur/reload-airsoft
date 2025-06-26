import axios from "axios";
import Cookies from "js-cookie";
import { CreateEventData, CreateEventResponse } from "../Interfaces/types";

// TEMPORAIRE : URL directe vers le backend pour tester sans proxy
const API_BASE_URL = "http://localhost:8080/api/v1";

// Configuration globale d'Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
  // withCredentials retiré car il cause des problèmes CORS
  // Le token sera envoyé via l'en-tête Authorization
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("JWT-Reload-airsoft");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fonction pour obtenir tous les événements
export const getAllEvents = async () => {
  try {
    const response = await api.get("events");
    console.log("Réponse des événements : ", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "récupération des événements");
  }
};

// Fonction pour obtenir un événement spécifique par ID
export const getEventById = async (id: string) => {
  try {
    const response = await api.get(`events/${id}`);
    console.log("Réponse des événements getEventById : ", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "récupération de l'événement");
  }
};

// Fonction pour créer un nouvel événement (FormData - ancienne version)
export const createEvent = async (eventData: FormData) => {
  try {
    const response = await api.post("/event/evenement/new", eventData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, "création de l'événement");
  }
};

// Fonction pour créer un nouvel événement avec JSON
export const createEventWithJson = async (eventData: CreateEventData): Promise<CreateEventResponse> => {
  try {
    const response = await api.post("events", eventData);
    console.log("Événement créé avec succès :", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "création de l'événement");
    throw error;
  }
};

// Fonction pour mettre à jour un événement spécifique par ID
export const updateEvent = async (id: string, eventData: FormData) => {
  try {
    const response = await api.put(`/event/evenements/${id}`, eventData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, "mise à jour de l'événement");
  }
};

// Fonction pour supprimer un événement spécifique par ID
export const deleteEvent = async (id: string) => {
  try {
    const response = await api.delete(`/event/evenements/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "suppression de l'événement");
  }
};

// Fonction de gestion des erreurs Axios
const handleAxiosError = (error: any, action: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(`Erreur Axios lors de la ${action}:`, error.response.data);
    } else {
      console.error(`Erreur Axios lors de la ${action}:`, error.message);
    }
  } else {
    console.error(`Erreur inconnue lors de la ${action}:`, error);
  }
  throw error;
};
