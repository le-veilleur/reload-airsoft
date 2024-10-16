export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    first_name: string; // Champ ajusté pour correspondre au back-end
    last_name: string;  // Champ ajusté pour correspondre au back-end
    username: string;   // Champ pour le pseudo
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    ID: number; // ID de l'utilisateur
    updatedAt: string; // Date de mise à jour
    deletedAt: string | null; // Date de suppression
    last_name: string; // Nom de famille
    first_name: string; // Prénom
    username: string; // Pseudo
    email: string;
    roles: string[]; // Rôles de l'utilisateur
    createdAt: string; // Date de création
    access_token: string; // Token d'accès
    refresh_token: string; // Token de rafraîchissement
    message: string; // Message de retour
  }
  
  export interface User {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    teams: string[];
    avatarUrl: string | null;
  }