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

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  postal_code?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  location: Location;
  start_date: string;
  end_date: string;
  max_participants: number;
  organizer_id: string;
  category_ids: string[];
  image_urls: string[];
  price: string;
  equipment_required: string;
  difficulty_level: string;
  is_private: boolean;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: Location;
  max_participants: number;
  status: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateEventResponse {
  event: Event;
  message: string;
}