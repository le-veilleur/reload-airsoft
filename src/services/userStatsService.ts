import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface UserStats {
  eventsPlayed: number;
  winRate: number;
  level: string;
  totalPoints: number;
  upcomingEvents: number;
  completedEvents: number;
  favoriteWeapon?: string;
  teamRole?: string;
  achievements?: string[];
}

export interface UserEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  image_url?: string;
  description?: string;
  price?: number;
  organizer?: string;
}

export interface UserProfile {
  stats: UserStats;
  events: UserEvent[];
  recentActivity: any[];
}

class UserStatsService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      throw error;
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/stats`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      throw error;
    }
  }

  async getUserEvents(): Promise<UserEvent[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/events`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      throw error;
    }
  }

  async updateUserProfile(profileData: Partial<UserProfile>): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/api/users/profile`, profileData, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }

  async updateUserPreferences(preferences: {
    favoriteWeapon?: string;
    teamRole?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      newsletter?: boolean;
    };
    privacy?: {
      publicProfile?: boolean;
      showStats?: boolean;
    };
  }): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/api/users/preferences`, preferences, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      throw error;
    }
  }

  // Méthodes pour les données simulées (à supprimer quand l'API sera prête)
  getMockUserStats(): UserStats {
    return {
      eventsPlayed: 15,
      winRate: 75,
      level: "Intermédiaire",
      totalPoints: 1250,
      upcomingEvents: 3,
      completedEvents: 12,
      favoriteWeapon: "M4A1",
      teamRole: "Assault",
      achievements: ["Premier événement", "5 événements", "Équipe gagnante", "10 événements", "Vainqueur de tournoi"]
    };
  }

  getMockUserEvents(): UserEvent[] {
    return [
      {
        id: "1",
        title: "CQB Perfectionnement",
        date: "2025-07-15",
        location: "Paris",
        status: "upcoming",
        price: 30,
        organizer: "John Doe",
        description: "Entraînement intensif en CQB"
      },
      {
        id: "2",
        title: "Tournoi Speedsoft",
        date: "2025-07-20",
        location: "Lyon",
        status: "upcoming",
        price: 25,
        organizer: "Jane Smith",
        description: "Compétition de speedsoft"
      },
      {
        id: "3",
        title: "Entraînement Tactical",
        date: "2025-06-30",
        location: "Marseille",
        status: "completed",
        price: 35,
        organizer: "Mike Johnson",
        description: "Entraînement tactique avancé"
      }
    ];
  }

  getMockRecentActivity() {
    return [
      { id: 1, type: 'event_registration', message: 'Inscrit à "CQB Perfectionnement"', date: '2025-07-07' },
      { id: 2, type: 'event_completed', message: 'A participé à "Entraînement Tactical"', date: '2025-06-30' },
      { id: 3, type: 'profile_update', message: 'Mis à jour le profil', date: '2025-06-25' },
      { id: 4, type: 'event_registration', message: 'Inscrit à "Tournoi Speedsoft"', date: '2025-06-20' },
      { id: 5, type: 'achievement_unlocked', message: 'Débloqué: "10 événements"', date: '2025-06-15' }
    ];
  }
}

export default new UserStatsService(); 