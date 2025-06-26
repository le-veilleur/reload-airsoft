import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Configuration des icônes par défaut de Leaflet avec CDN
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Interface pour un événement sur la carte
interface MapEvent {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  address?: string;
}

interface EventMapProps {
  // Props pour un seul événement (mode actuel)
  latitude?: number;
  longitude?: number;
  locationName?: string;
  
  // Props pour plusieurs événements (nouveau mode)
  events?: MapEvent[];
  
  // Props pour centrage personnalisé (nouveau)
  centerLatitude?: number;
  centerLongitude?: number;
  centerZoom?: number;
  
  // Props optionnelles
  height?: string;
  zoom?: number;
}

// Composant pour ajuster la vue de la carte
const MapController: React.FC<{ 
  events?: MapEvent[], 
  latitude?: number, 
  longitude?: number, 
  centerLatitude?: number,
  centerLongitude?: number,
  centerZoom?: number,
  zoom: number 
}> = ({ events, latitude, longitude, centerLatitude, centerLongitude, centerZoom, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    // Priorité 1: Centrage personnalisé (ville recherchée)
    if (centerLatitude !== undefined && centerLongitude !== undefined) {
      map.setView([centerLatitude, centerLongitude], centerZoom || zoom);
      return;
    }
    
    // Priorité 2: Ajuster la vue pour tous les événements
    if (events && events.length > 0) {
      const group = new L.FeatureGroup(
        events.map(event => L.marker([event.latitude, event.longitude]))
      );
      map.fitBounds(group.getBounds().pad(0.1));
      return;
    }
    
    // Priorité 3: Mode événement unique
    if (latitude !== undefined && longitude !== undefined) {
      map.setView([latitude, longitude], zoom);
    }
  }, [map, events, latitude, longitude, centerLatitude, centerLongitude, centerZoom, zoom]);
  
  return null;
};

const EventMap: React.FC<EventMapProps> = ({ 
  latitude, 
  longitude, 
  locationName, 
  events, 
  centerLatitude,
  centerLongitude,
  centerZoom,
  height = "100%",
  zoom = 15 
}) => {
  // Déterminer le centre par défaut
  const defaultCenter: [number, number] = [48.8566, 2.3522]; // Paris par défaut
  
  // Priorité pour le centre de la carte
  let mapCenter: [number, number];
  
  if (centerLatitude !== undefined && centerLongitude !== undefined) {
    // Centre personnalisé (ville recherchée)
    mapCenter = [centerLatitude, centerLongitude];
  } else if (latitude !== undefined && longitude !== undefined) {
    // Événement unique
    mapCenter = [latitude, longitude];
  } else if (events && events.length > 0) {
    // Premier événement de la liste
    mapCenter = [events[0].latitude, events[0].longitude];
  } else {
    // Paris par défaut
    mapCenter = defaultCenter;
  }

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={mapCenter}
        zoom={centerZoom || zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController 
          events={events} 
          latitude={latitude} 
          longitude={longitude} 
          centerLatitude={centerLatitude}
          centerLongitude={centerLongitude}
          centerZoom={centerZoom}
          zoom={zoom} 
        />
        
        {/* Affichage des marqueurs */}
        {events ? (
          // Mode multiple événements
          events.map((event) => (
            <Marker 
              key={event.id} 
              position={[event.latitude, event.longitude]}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-sm">{event.title}</h3>
                  {event.address && (
                    <p className="text-xs text-gray-600 mt-1">{event.address}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))
        ) : (
          // Mode événement unique
          latitude !== undefined && longitude !== undefined && (
            <Marker position={[latitude, longitude]}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-sm">📍 Événement</h3>
                  {locationName && (
                    <p className="text-xs text-gray-600 mt-1">{locationName}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        )}
        
        {/* Marqueur pour la ville recherchée (optionnel) */}
        {centerLatitude !== undefined && centerLongitude !== undefined && !events?.length && (
          <Marker position={[centerLatitude, centerLongitude]}>
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-sm">🔍 Zone de recherche</h3>
                <p className="text-xs text-gray-600 mt-1">Centre de la recherche</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default EventMap;
