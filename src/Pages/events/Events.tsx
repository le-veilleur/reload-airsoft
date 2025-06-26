// src/pages/EventsPage.tsx

import React, { useEffect, useState } from "react";
import { getAllEvents } from "../../Services/eventService";
import { geocodeLocation, getDefaultCoordinates } from "../../Services/geocodingService";
import SearchBar from "../../common/SearchBar";
import EventMap from "../../Components/Maps/EventMap";
import EventCard from "../../Components/Events/EventCard";
import { Event } from "../../Interfaces/types";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleSearch = async (searchParams: {
    date?: string;
    time?: string;
    location?: string;
  }) => {
    setLoading(true);
    
    try {
      // Géocoder la ville recherchée si fournie
      if (searchParams.location && searchParams.location.trim() !== "") {
        setSearchLocation(searchParams.location);
        
        // Tenter le géocodage
        const geocodeResult = await geocodeLocation(searchParams.location);
        
        if (geocodeResult) {
          console.log(`Ville "${searchParams.location}" géocodée:`, geocodeResult);
          setMapCenter({
            latitude: geocodeResult.latitude,
            longitude: geocodeResult.longitude
          });
        } else {
          // Utiliser les coordonnées par défaut
          console.log(`Géocodage échoué pour "${searchParams.location}", utilisation des coordonnées par défaut`);
          const defaultCoords = getDefaultCoordinates(searchParams.location);
          setMapCenter({
            latitude: defaultCoords[0],
            longitude: defaultCoords[1]
          });
        }
      } else {
        // Reset du centre si pas de location
        setSearchLocation("");
        setMapCenter(null);
      }

      // Récupérer les événements (pour l'instant, pas de filtrage backend)
      const data = await getAllEvents();
      console.log("Events fetched successfully:", data);
      const eventsArray = data.events || [];
      setEvents(eventsArray);
      setError(null);
    } catch (error) {
      console.error("Error during search:", error);
      setError("Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await getAllEvents();
        console.log("Events fetched successfully:", data);
        const eventsArray = data.events || [];
        setEvents(eventsArray);
        setError(null);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Erreur lors de la récupération des événements.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  // Préparer les événements pour la carte (filtrer ceux qui ont des coordonnées)
  const mapEvents = events
    .filter((event: any) => 
      event.location?.latitude !== undefined && 
      event.location?.longitude !== undefined &&
      !isNaN(event.location.latitude) &&
      !isNaN(event.location.longitude)
    )
    .map((event: any) => ({
      id: event.id,
      title: event.title || 'Événement sans titre',
      latitude: event.location.latitude,
      longitude: event.location.longitude,
      address: event.location?.address || 'Adresse non spécifiée'
    }));

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-gris-bleute">
      {/* Barre de recherche en haut - hauteur fixe */}
      <div className="flex-shrink-0 p-4 bg-gris-bleute border-b border-gray-200">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Contenu principal : Liste + Carte - prend tout l'espace restant */}
      <div className="flex flex-1 min-h-0">
        {/* Liste des événements à gauche - scroll uniquement ici */}
        <div className="w-1/3 flex flex-col border-r border-gray-200 h-full">
          {/* Header de la liste - fixe */}
          <div className="flex-shrink-0 p-4 bg-white border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Événements ({events.length})
            </h2>
            {searchLocation && (
              <p className="text-sm text-blue-600 mt-1">
                🔍 Zone de recherche: {searchLocation}
              </p>
            )}
          </div>
          
          {/* Contenu scrollable de la liste */}
          <div className="flex-1 overflow-y-auto bg-gris-bleute" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            <div className="p-4">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              {loading && (
                <div className="flex items-center justify-center p-8">
                  <div className="text-gray-500">Chargement des événements...</div>
                </div>
              )}
            
            {!loading && events.length === 0 && !error && (
                <div className="flex items-center justify-center p-8">
                  <div className="text-gray-500">Aucun événement trouvé.</div>
                </div>
            )}
            
              {/* Liste des cartes d'événements */}
              <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                    className={`cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                      selectedEvent?.id === event.id 
                        ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg' 
                        : 'hover:shadow-md'
                  }`}
                  onClick={() => handleEventClick(event)}
                >
                                      <EventCard
                        id={event.id}
                      title={(event as any).title || 'Titre non spécifié'}
                      date={(event as any).date || 'Date non spécifiée'}
                      time={(event as any).created_at ? new Date((event as any).created_at).toLocaleTimeString() : "Non spécifié"}
                      location={(event as any).location || { address: 'Lieu non spécifié', latitude: 0, longitude: 0 }}
                      images={[]}
                      description={(event as any).description || 'Description non disponible'}
                      price={(event as any).price}
                    />
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>

        {/* Carte à droite - position fixe, ne bouge pas */}
        <div className="w-2/3 relative h-full">
          {mapEvents.length > 0 || mapCenter ? (
            <div className="absolute inset-0">
            <EventMap
              events={mapEvents}
                centerLatitude={mapCenter?.latitude}
                centerLongitude={mapCenter?.longitude}
                centerZoom={mapCenter ? 12 : undefined}
              height="100%"
              zoom={12}
            />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-gray-600 text-lg mb-2">
                  🗺️ Recherchez une ville pour centrer la carte
                </div>
                <div className="text-gray-400 text-sm">
                  Les événements géolocalisés apparaîtront ici
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
