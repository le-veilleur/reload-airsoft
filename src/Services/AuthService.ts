import axios from "axios";
import Cookies from "js-cookie";
import { LoginData, RegisterData, AuthResponse } from "../Interfaces/types";

const API_URL = "http://127.0.0.1:8181/user/";

const AuthService = {
  // Méthode pour la connexion
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}login`, data);
      if (response.data && response.data.access_token) {
        Cookies.set("JWT-Reload-airsoft", response.data.access_token, {
          expires: 7
        });
      } else {
        console.error("Token est indéfini dans la réponse");
      }

      return response.data as AuthResponse;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error; // Vous pouvez gérer les erreurs comme vous le souhaitez
    }
  },

  // Méthode pour l'enregistrement
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}register`, data);
      return response.data as AuthResponse;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      throw error; // Gérer les erreurs
    }
  },

  // Méthode pour le rafraîchissement du token
  refreshToken: async (): Promise<string> => {
    try {
      const response = await axios.get(`${API_URL}refresh-token`, {
        withCredentials: true
      });
      return response.data.access_token;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
      throw error; // Gérer les erreurs
    }
  },

  // Méthode pour la déconnexion
  logout: async (): Promise<void> => {
    try {
      await axios.post(`${API_URL}logout`, {}, { withCredentials: true });
      Cookies.remove("JWT-Reload-airsoft");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error; // Gérer les erreurs
    }
  }
};

export default AuthService; // Export de l'objet AuthService
