import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./EventMap.css";

// Configuration des icônes par défaut de Leaflet avec CDN
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Configuration d'icônes pour éviter les erreurs de nettoyage

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
  
  // Callback pour la sélection d'événement
  onEventSelect?: (eventId: string) => void;
  selectedEventId?: string;
  
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
  const [lastCenterKey, setLastCenterKey] = useState<string>('');
  
  useEffect(() => {
    // Créer une clé unique pour le centre actuel
    const currentCenterKey = `${centerLatitude}_${centerLongitude}_${events?.length || 0}`;
    
    // Ne changer la vue que si on a un nouveau centre ou de nouveaux événements
    if (lastCenterKey === currentCenterKey) return;
    
    // Priorité 1: Centrage personnalisé (ville recherchée)
    if (centerLatitude !== undefined && centerLongitude !== undefined) {
      map.setView([centerLatitude, centerLongitude], centerZoom || zoom);
      setLastCenterKey(currentCenterKey);
      return;
    }
    
    // Priorité 2: Ajuster la vue pour tous les événements (uniquement au premier chargement)
    if (events && events.length > 0 && lastCenterKey === '') {
      const group = new L.FeatureGroup(
        events.map(event => L.marker([event.latitude, event.longitude]))
      );
      map.fitBounds(group.getBounds().pad(0.1));
      setLastCenterKey(currentCenterKey);
      return;
    }
    
    // Priorité 3: Mode événement unique (uniquement au premier chargement)
    if (latitude !== undefined && longitude !== undefined && lastCenterKey === '') {
      map.setView([latitude, longitude], zoom);
      setLastCenterKey(currentCenterKey);
    }
  }, [map, events, latitude, longitude, centerLatitude, centerLongitude, centerZoom, zoom, lastCenterKey]);
  
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
  onEventSelect,
  selectedEventId,
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
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
        zoomControl={true}
        minZoom={2}
        maxZoom={18}
        tapTolerance={15}
        bounceAtZoomLimits={false}
        fadeAnimation={false}
        markerZoomAnimation={false}
        zoomAnimation={false}
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
          events.map((event) => {
            return (
              <Marker 
                key={event.id}
                position={[event.latitude, event.longitude]}
              >
                <Popup
                  closeButton={true}
                  autoClose={true}
                  closeOnEscapeKey={true}
                  closeOnClick={true}
                  maxWidth={280}
                  minWidth={220}
                  className="custom-popup"
                  autoPan={false}
                  keepInView={false}
                  autoPanPadding={[5, 5]}
                >
                  <div className="text-center p-2" onClick={(e) => e.stopPropagation()}>
                    <h3 className="event-popup-title text-sm text-gray-900 font-bold mb-3 leading-tight">
                      🎯 {event.title}
                    </h3>
                    {event.address && (
                      <div className="event-popup-address text-xs text-gray-600 mb-4 bg-gray-50 p-2 rounded">
                        📍 {event.address}
                      </div>
                    )}
                    <div className="space-y-2">
                      <button 
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (onEventSelect) {
                            onEventSelect(event.id);
                          }
                        }}
                        className="w-full px-4 py-2 text-xs font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-md active:scale-95 transition-transform duration-100"
                      >
                        📍 Voir dans la liste
                      </button>
                      <button 
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          // Redirection immédiate via replace
                          const url = `/event/evenements/${event.id}`;
                          window.location.replace(url);
                        }}
                        className="w-full px-4 py-2 text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 rounded-lg shadow-md active:scale-95 transition-transform duration-100"
                      >
                        🔍 Voir détails complets
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })
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
