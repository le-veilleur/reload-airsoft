/**
 * Configuration centralisée des APIs - Reload Airsoft Frontend
 * Utilise les variables d'environnement du fichier .env
 */

// =============================================================================
// CONFIGURATION DES ENVIRONNEMENTS
// =============================================================================

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  REACT_APP_ENV: process.env.REACT_APP_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

// =============================================================================
// URLS DES MICROSERVICES
// =============================================================================

export const API_ENDPOINTS = {
  // API Gateway (Point d'entrée principal)
  API_GATEWAY: {
    URL: process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8080',
    VERSION: process.env.REACT_APP_API_GATEWAY_VERSION || '/api/v1',
    GRPC_URL: process.env.REACT_APP_API_GATEWAY_GRPC_URL || 'localhost:50053',
    HEALTH: process.env.REACT_APP_GATEWAY_HEALTH_URL || 'http://localhost:8080/health',
  },

  // User Service (Authentification)
  USER_SERVICE: {
    URL: process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8181',
    GRPC_URL: process.env.REACT_APP_USER_SERVICE_GRPC_URL || 'localhost:50051',
    AUTH_BASE: process.env.REACT_APP_AUTH_API_URL || 'http://localhost:8181/user',
  },

  // Services gRPC
  GRPC_SERVICES: {
    EVENT: process.env.REACT_APP_EVENT_SERVICE_GRPC_URL || 'localhost:50052',
    PAYMENT: process.env.REACT_APP_PAYMENT_SERVICE_GRPC_URL || 'localhost:50054',
    ANALYTICS: process.env.REACT_APP_ANALYTICS_SERVICE_GRPC_URL || 'localhost:50055',
  },
};

// =============================================================================
// ENDPOINTS SPÉCIFIQUES
// =============================================================================

export const ENDPOINTS = {
  // Événements
  EVENTS: {
    BASE: process.env.REACT_APP_EVENTS_API_URL || `${API_ENDPOINTS.API_GATEWAY.URL}${API_ENDPOINTS.API_GATEWAY.VERSION}/events`,
    LIST: '/events',
    BY_ID: (id: string) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
  },

  // Réservations
  BOOKINGS: {
    BASE: process.env.REACT_APP_BOOKINGS_API_URL || `${API_ENDPOINTS.API_GATEWAY.URL}${API_ENDPOINTS.API_GATEWAY.VERSION}/events`,
    BOOK: (eventId: string) => `/events/${eventId}/book`,
    CANCEL: (eventId: string) => `/events/${eventId}/book`,
    STATUS: (eventId: string) => `/events/${eventId}/booking-status`,
    WAITING_LIST: (eventId: string) => `/events/${eventId}/waiting-list`,
  },

  // Authentification (via API Gateway)
  AUTH: {
    BASE: `${API_ENDPOINTS.API_GATEWAY.URL}${API_ENDPOINTS.API_GATEWAY.VERSION}/users`,
    LOGIN: '/login',
    REGISTER: '/register',
    REFRESH_TOKEN: '/refresh-token',
    LOGOUT: '/logout',
  },
};

// =============================================================================
// CONFIGURATION DES TIMEOUTS ET RETRY
// =============================================================================

export const API_CONFIG = {
  TIMEOUTS: {
    DEFAULT: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
    AUTH: parseInt(process.env.REACT_APP_AUTH_TIMEOUT || '10000'),
    UPLOAD: parseInt(process.env.REACT_APP_UPLOAD_TIMEOUT || '120000'),
  },

  RETRY: {
    MAX_RETRIES: parseInt(process.env.REACT_APP_MAX_RETRIES || '3'),
    DELAY: parseInt(process.env.REACT_APP_RETRY_DELAY || '1000'),
  },

  CACHE: {
    EVENTS_TTL: parseInt(process.env.REACT_APP_EVENTS_CACHE_TTL || '300000'),
    AUTO_REFRESH_INTERVAL: parseInt(process.env.REACT_APP_AUTO_REFRESH_INTERVAL || '60000'),
    FORCE_REFRESH_INTERVAL: parseInt(process.env.REACT_APP_FORCE_REFRESH_INTERVAL || '1800000'),
  },
};

// =============================================================================
// CONFIGURATION JWT
// =============================================================================

export const JWT_CONFIG = {
  COOKIE_NAME: process.env.REACT_APP_JWT_COOKIE_NAME || 'JWT-Reload-airsoft',
  EXPIRY_DAYS: parseInt(process.env.REACT_APP_JWT_EXPIRY_DAYS || '7'),
  REFRESH_INTERVAL: parseInt(process.env.REACT_APP_REFRESH_TOKEN_INTERVAL || '300000'),
  SECURE_COOKIES: process.env.REACT_APP_SECURE_COOKIES === 'true',
  SAME_SITE: process.env.REACT_APP_SAME_SITE_COOKIES || 'lax',
};

// =============================================================================
// CONFIGURATION DES UPLOADS
// =============================================================================

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '10485760'), // 10MB
  ALLOWED_TYPES: (process.env.REACT_APP_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,image/gif').split(','),
};

// =============================================================================
// CONFIGURATION DES NOTIFICATIONS
// =============================================================================

export const NOTIFICATION_CONFIG = {
  DEFAULT_TIMEOUT: parseInt(process.env.REACT_APP_NOTIFICATION_TIMEOUT || '5000'),
  ERROR_TIMEOUT: parseInt(process.env.REACT_APP_ERROR_NOTIFICATION_TIMEOUT || '10000'),
  SUCCESS_TIMEOUT: parseInt(process.env.REACT_APP_SUCCESS_NOTIFICATION_TIMEOUT || '3000'),
};

// =============================================================================
// CONFIGURATION DES GÉOSERVICES
// =============================================================================

export const GEO_CONFIG = {
  NOMINATIM_URL: process.env.REACT_APP_NOMINATIM_URL || 'https://nominatim.openstreetmap.org',
  USER_AGENT: process.env.REACT_APP_GEOCODING_USER_AGENT || 'ReloadAirsoft/1.0',
  COUNTRY_CODES: process.env.REACT_APP_GEOCODING_COUNTRY_CODES || 'fr',
};

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export const FEATURES = {
  ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  PAYMENTS: process.env.REACT_APP_ENABLE_PAYMENTS === 'true',
  MAPS: process.env.REACT_APP_ENABLE_MAPS === 'true',
  REAL_TIME_UPDATES: process.env.REACT_APP_ENABLE_REAL_TIME_UPDATES === 'true',
  OFFLINE_MODE: process.env.REACT_APP_ENABLE_OFFLINE_MODE === 'true',
};

// =============================================================================
// CONFIGURATION DEBUG
// =============================================================================

export const DEBUG_CONFIG = {
  ENABLED: process.env.REACT_APP_DEBUG_MODE === 'true',
  LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
  DEVTOOLS: process.env.REACT_APP_ENABLE_DEVTOOLS === 'true',
};

// =============================================================================
// URLS COMPLÈTES CONSTRUITES
// =============================================================================

export const FULL_URLS = {
  API_BASE: `${API_ENDPOINTS.API_GATEWAY.URL}${API_ENDPOINTS.API_GATEWAY.VERSION}`,
  AUTH_BASE: API_ENDPOINTS.USER_SERVICE.AUTH_BASE,
  
  // URLs de production
  PROD_API_BASE: process.env.REACT_APP_PROD_API_GATEWAY_URL || API_ENDPOINTS.API_GATEWAY.URL,
  PROD_AUTH_BASE: process.env.REACT_APP_PROD_USER_SERVICE_URL || API_ENDPOINTS.USER_SERVICE.URL,
};

// =============================================================================
// FONCTION UTILITAIRE POUR OBTENIR L'URL CORRECTE SELON L'ENVIRONNEMENT
// =============================================================================

export const getApiUrl = (endpoint: string = ''): string => {
  const baseUrl = ENV.IS_PRODUCTION ? FULL_URLS.PROD_API_BASE : FULL_URLS.API_BASE;
  return `${baseUrl}${endpoint}`;
};

export const getAuthUrl = (endpoint: string = ''): string => {
  const baseUrl = ENV.IS_PRODUCTION ? 
    `${FULL_URLS.PROD_API_BASE}/users` : 
    `${FULL_URLS.API_BASE}/users`;
  return `${baseUrl}${endpoint}`;
};

// =============================================================================
// EXPORT DEFAULT DE LA CONFIGURATION COMPLÈTE
// =============================================================================

export default {
  ENV,
  API_ENDPOINTS,
  ENDPOINTS,
  API_CONFIG,
  JWT_CONFIG,
  UPLOAD_CONFIG,
  NOTIFICATION_CONFIG,
  GEO_CONFIG,
  FEATURES,
  DEBUG_CONFIG,
  FULL_URLS,
  getApiUrl,
  getAuthUrl,
}; 