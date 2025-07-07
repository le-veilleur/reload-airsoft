import { GEO_CONFIG, DEBUG_CONFIG } from "../config/api.config";

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  city?: string;
  country?: string;
}

/**
 * Service de géocodage utilisant Nominatim (même API que le backend)
 */
export const geocodeLocation = async (location: string): Promise<GeocodingResult | null> => {
  if (!location || location.trim() === '') {
    if (DEBUG_CONFIG.ENABLED) {
      console.log("Géocodage ignoré: localisation vide");
    }
    return null;
  }

  try {
    const encodedLocation = encodeURIComponent(location.trim());
    const url = `${GEO_CONFIG.NOMINATIM_URL}/search?q=${encodedLocation}&format=json&limit=1&countrycodes=${GEO_CONFIG.COUNTRY_CODES}&addressdetails=1`;
    
    if (DEBUG_CONFIG.ENABLED) {
      console.log("Géocodage de la localisation:", location);
    }
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': GEO_CONFIG.USER_AGENT,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur de géocodage: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      const geocodingResult: GeocodingResult = {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
        city: result.address?.city || result.address?.town || result.address?.village,
        country: result.address?.country
      };
      
      if (DEBUG_CONFIG.ENABLED) {
        console.log("Géocodage réussi:", geocodingResult);
      }
      
      return geocodingResult;
    }

    if (DEBUG_CONFIG.ENABLED) {
      console.log("Aucun résultat de géocodage trouvé pour:", location);
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors du géocodage:', error);
    return null;
  }
};

/**
 * Fonction pour obtenir les coordonnées par défaut selon la région
 */
export const getDefaultCoordinates = (location?: string): [number, number] => {
  const locationLower = location?.toLowerCase() || '';
  
  // Coordonnées des principales villes françaises
  const cityCoordinates: { [key: string]: [number, number] } = {
    'paris': [48.8566, 2.3522],
    'marseille': [43.3965, 5.3698],
    'lyon': [45.7640, 4.8357],
    'toulouse': [43.6043, 1.4437],
    'nice': [43.7102, 7.2620],
    'nantes': [47.2184, -1.5536],
    'strasbourg': [48.5734, 7.7521],
    'montpellier': [43.6119, 3.8772],
    'bordeaux': [44.8378, -0.5792],
    'lille': [50.6292, 3.0573],
    'rennes': [48.1173, -1.6778],
    'reims': [49.2583, 4.0317],
    'caen': [49.1831, -0.3707],
    'rouen': [49.4431, 1.0993],
    'orleans': [47.9029, 1.9093]
  };

  // Chercher une correspondance
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (locationLower.includes(city)) {
      if (DEBUG_CONFIG.ENABLED) {
        console.log(`Coordonnées par défaut trouvées pour ${city}:`, coords);
      }
      return coords;
    }
  }

  // Retourner Paris par défaut
  if (DEBUG_CONFIG.ENABLED) {
    console.log("Utilisation des coordonnées par défaut (Paris)");
  }
  return [48.8566, 2.3522];
};

/**
 * Fonction pour valider les coordonnées
 */
export const validateCoordinates = (latitude: number, longitude: number): boolean => {
  const isValid = latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  
  if (DEBUG_CONFIG.ENABLED && !isValid) {
    console.error("Coordonnées invalides:", { latitude, longitude });
  }
  
  return isValid;
};

/**
 * Fonction pour calculer la distance entre deux points (en km)
 */
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  if (DEBUG_CONFIG.ENABLED) {
    console.log(`Distance calculée: ${distance.toFixed(2)} km`);
  }
  
  return distance;
};

/**
 * Fonction pour formater une adresse pour l'affichage
 */
export const formatAddress = (geocodingResult: GeocodingResult): string => {
  if (!geocodingResult) return '';
  
  // Extraire les parties importantes de l'adresse
  const parts = geocodingResult.displayName.split(',');
  
  // Prendre les 2-3 premiers éléments qui sont généralement les plus pertinents
  const relevantParts = parts.slice(0, 3).map(part => part.trim());
  
  const formatted = relevantParts.join(', ');
  
  if (DEBUG_CONFIG.ENABLED) {
    console.log("Adresse formatée:", formatted);
  }
  
  return formatted;
}; 