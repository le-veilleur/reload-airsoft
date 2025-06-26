import axios from "axios";
import Cookies from "js-cookie";
import { BookingRequest } from "../Interfaces/types";

const API_BASE_URL = "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
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

// Fonction pour réserver une place à un événement
export const bookEvent = async (bookingData: BookingRequest) => {
  try {
    const response = await api.post(`events/${bookingData.event_id}/book`, bookingData);
    console.log("Réservation créée avec succès :", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "réservation de l'événement");
    throw error;
  }
};

// Fonction pour annuler une réservation
export const cancelBooking = async (eventId: string) => {
  try {
    const response = await api.delete(`events/${eventId}/book`);
    console.log("Réservation annulée avec succès :", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "annulation de la réservation");
    throw error;
  }
};

// Fonction pour vérifier le statut de réservation de l'utilisateur
export const getBookingStatus = async (eventId: string) => {
  try {
    const response = await api.get(`events/${eventId}/booking-status`);
    console.log("Statut de réservation :", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "vérification du statut de réservation");
    throw error;
  }
};

// Fonction pour obtenir la liste d'attente
export const getWaitingList = async (eventId: string) => {
  try {
    const response = await api.get(`events/${eventId}/waiting-list`);
    console.log("Liste d'attente :", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "récupération de la liste d'attente");
    throw error;
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