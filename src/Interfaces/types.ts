// ===== ENUMS =====
export enum EventStatus {
  PENDING = 0,
  OPEN = 1,
  FULL = 2,
  CANCELLED = 3,
  ENDED = 4
}

export enum ParticipantStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  REJECTED = "rejected"
}

export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert"
}

export enum GeocodingSource {
  GOOGLE = "google",
  NOMINATIM = "nominatim",
  MANUAL = "manual"
}

export enum GeocodingAccuracy {
  EXACT = "exact",
  APPROXIMATE = "approximate",
  CITY = "city"
}

// ===== INTERFACES DE BASE =====

export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  phone_number?: string;
  terms_accepted_at?: string;
  privacy_accepted_at?: string;
  marketing_consent?: boolean;
}

export interface AuthResponse {
  ID: number;
  updatedAt: string;
  deletedAt: string | null;
  last_name: string;
  first_name: string;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
  access_token: string;
  refresh_token: string;
  message: string;
}

// ===== USER =====
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  pseudonyme: string;
  email: string;
  password?: string; // Ne pas exposer côté client
  role: string;
  phone_number?: string | null;
  email_verified_at?: string | null;
  verification_token?: string | null;
  verification_token_expires_at?: string | null;
  last_login_at?: string | null;
  reset_token?: string | null;
  profile_picture_url?: string | null;
  preferences: Record<string, any>;
  terms_accepted_at?: string | null;
  privacy_accepted_at?: string | null;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface UserProfile {
  firstname: string;
  lastname: string;
  pseudonyme: string;
  email: string;
  role: string;
  phone_number?: string | null;
  profile_picture_url?: string | null;
  preferences: Record<string, any>;
}

// ===== COORDINATE/LOCATION =====
export interface Coordinate {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  postal_code?: string;
  region?: string;
  geocoded_at?: string | null;
  geocoding_source?: GeocodingSource;
  geocoding_accuracy?: GeocodingAccuracy;
  created_at: string;
  updated_at: string;
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  postal_code?: string;
  region?: string;
}

// ===== CATEGORY =====
export interface Category {
  id: string;
  name: string;
  color?: string;
}

// ===== PARTICIPANT =====
export interface Participant {
  id: string;
  event_id: string;
  user_id: string;
  status: ParticipantStatus;
  created_at: string;
  updated_at: string;
  // Données enrichies (jointures)
  name?: string;
  username?: string;
  avatar_url?: string;
  role?: string;
}

// ===== PLAYER STATS =====
export interface PlayerStats {
  id: string;
  user_id: string;
  events_played: number;
  winrate: number;
  badges: string[]; // Parsed from JSON
  created_at: string;
  updated_at: string;
}

// ===== EVENT =====
export interface Event {
  id: string;
  title: string;
  organizer_id: string;
  description: string;
  coordinate_id?: string | null;
  coordinate?: Coordinate;
  date: string;
  event_datetime: string;
  max_participants: number;
  price?: number; // Prix en centimes (ex: 2500 = 25€)
  created_at: string;
  updated_at: string;
  status: EventStatus;
  image_urls: string[];
  category: Category[];
  // Données enrichies
  organizer_name?: string;
  participants?: Participant[];
  participant_count?: number;
  available_spots?: number;
}

// ===== CREATE EVENT =====
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
  price?: number; // Prix en centimes (ex: 2500 = 25€)
  equipment_required?: string;
  difficulty_level?: DifficultyLevel;
  is_private?: boolean;
}

export interface CreateEventResponse {
  event: Event;
  message: string;
}

// ===== INTERFACES AVANCÉES =====

export interface Team {
  ID: number;
  name: string;
  color?: string;
  max_players?: number;
  current_players?: number;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  rules: string[];
  duration_minutes: number;
  difficulty_level: DifficultyLevel;
}

export interface Equipment {
  ID: number;
  name: string;
  description?: string;
  is_required: boolean;
  rental_price?: number;
  available_quantity?: number;
}

export interface EventImage {
  ID: number;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
}

export interface EventStats {
  confirmed_participants: number;
  pending_participants: number;
  available_spots: number;
  revenue?: number;
  average_rating?: number;
}

// ===== DETAILED EVENT =====
export interface DetailedEvent {
  id: string;
  title: string;
  description: string;
  scenario?: Scenario;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time?: string;
  coordinate?: Coordinate;
  location: Location; // Pour rétrocompatibilité
  price?: number; // Prix en centimes (ex: 2500 = 25€)
  max_participants: number;
  min_participants?: number;
  status: EventStatus;
  difficulty_level?: DifficultyLevel;
  age_restriction?: number;
  equipment_required?: string;
  equipment_provided?: Equipment[];
  equipment_rentals?: Equipment[];
  organizer_id: string;
  organizer_name?: string;
  organizer_contact?: string;
  categories: Category[];
  teams?: Team[];
  participants: Participant[];
  images: EventImage[];
  stats: EventStats;
  booking_deadline?: string;
  cancellation_policy?: string;
  safety_instructions?: string[];
  meeting_point?: string;
  parking_info?: string;
  amenities?: string[];
  weather_requirements?: string;
  created_at: string;
  updated_at: string;
}

// ===== BOOKING =====
export interface BookingRequest {
  event_id: string;
  user_id: string;
  team_preference?: string;
  special_requirements?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface BookingResponse {
  participant: Participant;
  message: string;
  success: boolean;
}

// ===== API RESPONSES =====
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface EventListResponse extends PaginatedResponse<Event> {}

// ===== FILTERS & QUERIES =====
export interface EventFilters {
  status?: EventStatus;
  category_ids?: string[];
  start_date_from?: string;
  start_date_to?: string;
  location?: {
    latitude: number;
    longitude: number;
    radius_km: number;
  };
  difficulty_level?: DifficultyLevel;
  max_participants_min?: number;
  max_participants_max?: number;
  organizer_id?: string;
  search?: string;
}

export interface UserFilters {
  role?: string;
  email_verified?: boolean;
  created_from?: string;
  created_to?: string;
  search?: string;
}

// ===== FORM DATA =====
export interface UpdateUserData {
  firstname?: string;
  lastname?: string;
  pseudonyme?: string;
  email?: string;
  phone_number?: string;
  profile_picture_url?: string;
  preferences?: Record<string, any>;
  marketing_consent?: boolean;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordData {
  token: string;
  new_password: string;
  confirm_password: string;
}