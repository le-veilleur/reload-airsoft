import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Interface définissant les props du composant EventMap
interface EventMapProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

// Création de l'icône personnalisée avec le SVG dans le dossier public
const CustomMarkerIcon = new L.Icon({
  iconUrl: "/line-md--map-marker-filled.svg", // Chemin correct vers le fichier SVG dans le dossier public
  iconSize: [32, 32], // Taille du SVG
  iconAnchor: [16, 32], // Position de l'ancre du marqueur (pointe en bas au centre)
  popupAnchor: [0, -32] // Position du popup par rapport au marqueur
});

const EventMap: React.FC<EventMapProps> = ({
  latitude,
  longitude,
  locationName
}) => {
  // Vérification si les coordonnées sont disponibles
  if (latitude === undefined || longitude === undefined) {
    return <p>Coordonnées de l'événement non disponibles</p>;
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      key={`${latitude}-${longitude}`} // Ajout de la clé pour forcer le re-rendu de la carte
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[latitude, longitude]} icon={CustomMarkerIcon}>
        <Popup>{locationName}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default EventMap;
