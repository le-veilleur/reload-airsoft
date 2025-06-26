// src/Components/Events/EventDetails.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../Services/eventService";
import EventMap from "../Maps/EventMap";
import { Location } from "../../Interfaces/types";

// Définir les interfaces ici
interface Image {
  ID: number;
  url: string;
}

interface Category {
  ID: number;
  name: string;
}

interface MapType {
  ID: number;
  type: string;
}

interface Participant {
  ID: number;
  name: string;
}

interface OnSiteMeal {
  ID: number;
  description: string;
}

interface EquipmentRental {
  ID: number;
  name: string;
}

interface Team {
  ID: number;
  name: string;
}

interface EventDetailsProps {
  id: string;
  title: string;
  description: string;
  start_date: string;
  start_time: string;
  location: Location;
  price: number;
  images: Image[];
  categories: Category[];
  map_types: MapType[];
  participants: Participant[];
  on_site_meals: OnSiteMeal[];
  equipment_rentals: EquipmentRental[];
  teams: Team[];
}

// Composant
const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError("Event ID is missing");
        setLoading(false);
        return;
      }

      try {
        console.log("🔍 Récupération de l'événement avec ID:", id);
        const data = await getEventById(id);
        console.log("📡 Données brutes reçues de l'API:", data);
        console.log("📍 Structure de location:", data?.location);
        console.log("🗺️ Type de location:", typeof data?.location);
        console.log("📊 Coordonnées disponibles?", {
          hasLatitude: data?.location?.latitude !== undefined,
          hasLongitude: data?.location?.longitude !== undefined,
          latitude: data?.location?.latitude,
          longitude: data?.location?.longitude
        });
        setEvent(data);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des détails de l'événement:", err);
        setError("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">🔄 Chargement de l'événement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 text-red-500 bg-red-50 rounded-lg">
          <h3 className="font-bold">❌ Erreur</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-4 text-yellow-600 bg-yellow-50 rounded-lg">
          <h3 className="font-bold">⚠️ Événement non trouvé</h3>
          <p>L'événement avec l'ID {id} n'existe pas.</p>
        </div>
      </div>
    );
  }

  const {
    location,
    images,
    categories,
    map_types,
    participants,
    on_site_meals,
    equipment_rentals,
    teams
  } = event;

  return (
    <div className="flex h-full bg-gray-100">
      {/* Colonne de gauche - Détails de l'événement */}
      <div className="w-1/2 overflow-y-auto">
        <div className="p-6 bg-white h-full">
          <h1 className="text-3xl font-bold mb-6">{event.title}</h1>
          
          {/* Informations de base */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-700">
              <span className="w-4 h-4 mr-3">📅</span>
              <span><strong>Date:</strong> {event.start_date}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="w-4 h-4 mr-3">🕒</span>
              <span><strong>Heure:</strong> {event.start_time}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="w-4 h-4 mr-3">📍</span>
              <span>
                <strong>Lieu:</strong> {location?.address || 'Non spécifié'}
                {location?.city && `, ${location.city}`}
                {location?.country && `, ${location.country}`}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <span className="w-4 h-4 mr-3">💰</span>
              <span><strong>Prix:</strong> {event.price} €</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Images */}
          {images && images.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Photos</h2>
              <div className="grid grid-cols-2 gap-4">
                {images.map((image) => (
                  <img
                    key={image.ID}
                    src={image.url}
                    alt={`${event.title} ${image.ID}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sections détaillées */}
          {categories && categories.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">📂 Catégories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span key={category.ID} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {map_types && map_types.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">🗺️ Types de cartes</h2>
              <ul className="list-disc list-inside">
                {map_types.map((mapType) => (
                  <li key={mapType.ID} className="text-gray-700">{mapType.type}</li>
                ))}
              </ul>
            </div>
          )}

          {participants && participants.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">👥 Participants ({participants.length})</h2>
              <ul className="list-disc list-inside">
                {participants.map((participant) => (
                  <li key={participant.ID} className="text-gray-700">{participant.name}</li>
                ))}
              </ul>
            </div>
          )}

          {on_site_meals && on_site_meals.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">🍽️ Repas sur place</h2>
              <ul className="list-disc list-inside">
                {on_site_meals.map((meal) => (
                  <li key={meal.ID} className="text-gray-700">{meal.description}</li>
                ))}
              </ul>
            </div>
          )}

          {equipment_rentals && equipment_rentals.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">🎯 Locations d'équipement</h2>
              <ul className="list-disc list-inside">
                {equipment_rentals.map((rental) => (
                  <li key={rental.ID} className="text-gray-700">{rental.name}</li>
                ))}
              </ul>
            </div>
          )}

          {teams && teams.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">⚔️ Équipes</h2>
              <ul className="list-disc list-inside">
                {teams.map((team) => (
                  <li key={team.ID} className="text-gray-700">{team.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Colonne de droite - Carte plein écran */}
      <div className="w-1/2 relative">
        {location?.latitude !== undefined && location?.longitude !== undefined ? (
          <div className="absolute inset-0">
            <EventMap
              latitude={location.latitude}
              longitude={location.longitude}
              locationName={location.address}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-center p-8">
              <p className="text-gray-600 text-lg mb-2">
                🗺️ Carte non disponible
              </p>
              <p className="text-gray-500 text-sm">
                Les coordonnées GPS ne sont pas configurées pour cet événement
              </p>
              {location?.address && (
                <p className="text-gray-400 text-xs mt-2">
                  📍 {location.address}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
