export interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  city?: string;
  country?: string;
}

// Service de géocodage utilisant Nominatim (même API que le backend)
export const geocodeLocation = async (location: string): Promise<GeocodingResult | null> => {
  if (!location || location.trim() === '') {
    return null;
  }

  try {
    const encodedLocation = encodeURIComponent(location.trim());
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedLocation}&format=json&limit=1&countrycodes=fr&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ReloadAirsoft/1.0 (frontend géolocalisation)',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur de géocodage: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
        city: result.address?.city || result.address?.town || result.address?.village,
        country: result.address?.country
      };
    }

    return null;
  } catch (error) {
    console.error('Erreur lors du géocodage:', error);
    return null;
  }
};

// Fonction pour obtenir les coordonnées par défaut selon la région
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
      return coords;
    }
  }

  // Retourner Paris par défaut
  return [48.8566, 2.3522];
}; 