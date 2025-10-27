// src/pages/EventsPage.tsx

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { geocodeLocation, getDefaultCoordinates } from "../../Services/geocodingService";
import SearchBar from "../../common/SearchBar";
import EventMap from "../../Components/Maps/EventMap";
import EventCard from "../../Components/Events/EventCard";
import { AutoRefreshStatus } from "../../Components/Events/AutoRefreshStatus";
import { useEvents } from "../../hooks/useEvents";
import ClearCacheWidget from "../../Components/Admin/ClearCacheWidget";
import EventFilters, { EventFilters as EventFiltersType } from "../../Components/Events/EventFilters";
import AddEventButton from "../../Components/Events/AddEventButton";
import { getFilteredEvents } from "../../Services/eventService";
import { formatDateToFrench, extractTimeFromDate } from "../../utils/dateUtils";

const EventsPage: React.FC = () => {
  const location = useLocation();
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [mapCenter, setMapCenter] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeFilters, setActiveFilters] = useState<EventFiltersType>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // État pour afficher/masquer le widget de cache (dev mode)
  const [showCacheWidget, setShowCacheWidget] = useState(false);
  
  // Utilisation du hook personnalisé pour les événements avec rafraîchissement auto et cooldown
  const { 
    events, 
    loading, 
    error, 
    lastRefresh, 
    refreshEvents, 
    forceRefreshEvents,
    autoRefresh 
  } = useEvents({ 
    autoRefresh: true, 
    refreshInterval: 120000, // 2 minutes
    cooldownTime: 5000 // 5 secondes de cooldown pour éviter la surcharge
  });

  const handleSearch = async (searchParams: {
    date?: string;
    time?: string;
    location?: string;
  }) => {
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

      // Rafraîchir les événements après la recherche
      await refreshEvents();
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleMapEventSelect = (eventId: string) => {
    // Scroll automatique vers l'annonce correspondante dans la liste - SANS délai
    const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
    const container = document.getElementById('events-list-container');
    
    if (eventElement && container) {
      // Calculer la position relative de l'élément dans le conteneur
      const containerRect = container.getBoundingClientRect();
      const elementRect = eventElement.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      const targetScrollTop = scrollTop + elementRect.top - containerRect.top - (containerRect.height / 2) + (elementRect.height / 2);
      
      // Scroll fluide vers l'élément
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
      
      // Effet de highlight pour attirer l'attention
      eventElement.classList.add('animate-pulse', 'ring-4', 'ring-blue-400', 'ring-opacity-75');
      setTimeout(() => {
        eventElement.classList.remove('animate-pulse', 'ring-4', 'ring-blue-400', 'ring-opacity-75');
      }, 2000);
    }
  };

  const handleFiltersChange = async (filters: EventFiltersType) => {
    setActiveFilters(filters);
    console.log("Filtres appliqués:", filters);
    
    try {
      // Appliquer les filtres aux événements
      const filteredEvents = await getFilteredEvents(filters);
      console.log("Événements filtrés:", filteredEvents);
      // TODO: Mettre à jour l'état des événements avec les résultats filtrés
      // Pour l'instant, on utilise refreshEvents() comme fallback
      refreshEvents();
    } catch (error) {
      console.error("Erreur lors du filtrage des événements:", error);
      // En cas d'erreur, on rafraîchit normalement
      refreshEvents();
    }
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    console.log("Filtres effacés");
    // TODO: Recharger tous les événements
    refreshEvents();
  };

  // Gérer les messages de succès depuis la navigation
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Nettoyer le state de navigation
      window.history.replaceState({}, document.title);
      // Masquer le message après 5 secondes
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [location.state]);

  const handleEventCreated = () => {
    console.log("Nouvel événement créé, rafraîchissement de la liste");
    refreshEvents();
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
    <div className="flex h-[calc(100vh-200px)] bg-gris-bleute">
      {/* Widget de cache temporaire pour dev (peut être retiré en production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-40">
          <button
            onClick={() => setShowCacheWidget(!showCacheWidget)}
            className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full shadow-lg"
            title="Gestion du cache (dev)"
          >
            🗑️
          </button>
          
          {showCacheWidget && (
            <div className="absolute bottom-12 left-0">
              <ClearCacheWidget />
            </div>
          )}
        </div>
      )}

      {/* Menu latéral gauche avec recherche et filtres - responsive */}
      <div className="w-64 lg:w-72 flex flex-col border-r border-gray-200 bg-white">
        {/* Header du menu */}
        <div className="flex-shrink-0 p-2 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 mb-1">
            Recherche & Filtres
          </h2>
          {searchLocation && (
            <p className="text-xs text-blue-600">
              🔍 Zone: {searchLocation}
            </p>
          )}
        </div>

        {/* Barre de recherche */}
        <div className="flex-shrink-0 p-2 border-b border-gray-100">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Filtres */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <EventFilters onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />
          </div>
        </div>

        {/* Statut du rafraîchissement automatique */}
        <div className="flex-shrink-0 p-2 border-t border-gray-100">
          <AutoRefreshStatus
            isActive={autoRefresh.isActive}
            lastRefresh={lastRefresh}
            errorCount={autoRefresh.errorCount}
            onToggle={autoRefresh.toggle}
            onRefresh={() => refreshEvents(false)}
            onForceRefresh={() => forceRefreshEvents()}
            onReset={autoRefresh.reset}
          />
        </div>
      </div>

      {/* Zone principale : Liste des événements */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header de la liste */}
        <div className="flex-shrink-0 p-2 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">
              Événements ({events.length})
            </h2>
          </div>
          
          {/* Message de succès */}
          {successMessage && (
            <div className="mt-2 p-2 bg-green-100 border border-green-400 text-green-700 rounded text-xs">
              ✅ {successMessage}
            </div>
          )}
        </div>
        
        {/* Liste scrollable des événements */}
        <div 
          id="events-list-container"
          className="flex-1 overflow-y-auto bg-gris-bleute scroll-smooth"
        >
          <div className="p-2">
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
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  data-event-id={event.id}
                  className="transition-all duration-200"
                >
                  <EventCard
                    id={event.id}
                    title={(event as any).title || 'Titre non spécifié'}
                    date={formatDateToFrench((event as any).start_date || (event as any).date) || 'Date non spécifiée'}
                    time={extractTimeFromDate((event as any).start_date || "") || "Heure non spécifiée"}
                    endTime={extractTimeFromDate((event as any).end_date || "")}
                    location={(event as any).location || { address: 'Lieu non spécifié', latitude: 0, longitude: 0 }}
                    images={(event as any).image_urls || []}
                    description={(event as any).description || 'Description non disponible'}
                    price={(event as any).price}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Carte à droite - responsive */}
      <div className="w-1/2 lg:w-3/5 xl:w-2/3 relative h-[calc(100vh-200px)]">
        {mapEvents.length > 0 || mapCenter ? (
          <div className="absolute inset-0">
            <EventMap
              events={mapEvents}
              centerLatitude={mapCenter?.latitude}
              centerLongitude={mapCenter?.longitude}
              centerZoom={mapCenter ? 12 : undefined}
              onEventSelect={handleMapEventSelect}
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

      {/* Bouton d'ajout d'événement */}
      <AddEventButton onEventCreated={handleEventCreated} />
    </div>
  );
};

export default EventsPage;
