import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://127.0.0.1:8181/user/";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  LastName: string;
  FirstName: string;
  username: string; // Nouveau champ pour le pseudo
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    AvatarURL: null;
    FirstName: string;
    LastName: string;
    username: string; // Nouveau champ pour le pseudo
    Email: string;
    Roles: string[]; // Si c'est un tableau de chaînes
  };
  access_token: string;
  refresh_token: string;
  email: string;
  message: string;
  Roles: string[];
  avatarUrl?: string; // Assurez-vous que l'URL de l'avatar est incluse ici avec le nom correct
}

// Méthode pour la connexion
const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}login`, data);
    console.log("API Response:", response.data); // Ajoutez ceci

    if (response.data && response.data.access_token) {
      Cookies.set("JWT-Reload-airsoft", response.data.access_token, {
        expires: 7
      });
      console.log(
        "Token stocké dans les cookies: ",
        Cookies.get("JWT-Reload-airsoft")
      );
    } else {
      console.error("Token est indéfini dans la réponse");
    }

    return response.data as AuthResponse;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
};

// Méthode pour l'inscription
const register = async (data: RegisterData): Promise<AuthResponse> => {
  // console.log("Register Data:", data); // Log des données d'inscription
  const response = await axios.post(`${API_URL}register`, data);
  return response.data;
};

// Nouvelle méthode pour la réinitialisation du mot de passe
const forgotPassword = async (email: string): Promise<void> => {
  // // console.log("Forgot Password Email:", email); // Log de l'email pour réinitialisation du mot de passe
  await axios.post(`${API_URL}forgot-password`, { email });
};

const AuthService = {
  login,
  register,
  forgotPassword
};

export default AuthService;
