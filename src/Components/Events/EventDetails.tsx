// src/Components/Events/EventDetails.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../Services/eventService";
import EventMap from "../Maps/EventMap";

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
  id: number;
  title: string;
  description: string;
  start_date: string;
  start_time: string;
  location: string;
  latitude?: number;
  longitude?: number;
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
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const {
    latitude,
    longitude,
    images,
    categories,
    map_types,
    participants,
    on_site_meals,
    equipment_rentals,
    teams
  } = event;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg ">
      <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
      <p className="text-gray-600 mb-2">
        <strong>Date:</strong> {event.start_date}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Heure:</strong> {event.start_time}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Lieu:</strong> {event.location}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Prix:</strong> {event.price} €
      </p>
      <p className="mb-4">{event.description}</p>

      {images.length > 0 && (
        <div className="image-gallery mt-2">
          {images.map((image) => (
            <img
              key={image.ID}
              src={image.url}
              alt={`Image ${image.ID}`}
              className="w-full h-auto mt-2 rounded"
            />
          ))}
        </div>
      )}

      {latitude !== undefined && longitude !== undefined ? (
        <EventMap
          latitude={latitude}
          longitude={longitude}
          locationName={event.location}
        />
      ) : (
        <p className="text-red-500">
          Coordonnées de l'événement indisponibles.
        </p>
      )}

      <div className="categories mt-4">
        <h3 className="text-xl font-semibold">Catégories</h3>
        <ul>
          {categories.map((category) => (
            <li key={category.ID}>{category.name}</li>
          ))}
        </ul>
      </div>

      <div className="map-types mt-4">
        <h3 className="text-xl font-semibold">Types de cartes</h3>
        <ul>
          {map_types.map((mapType) => (
            <li key={mapType.ID}>{mapType.type}</li>
          ))}
        </ul>
      </div>

      <div className="participants mt-4">
        <h3 className="text-xl font-semibold">Participants</h3>
        <ul>
          {participants.map((participant) => (
            <li key={participant.ID}>{participant.name}</li>
          ))}
        </ul>
      </div>

      <div className="on-site-meals mt-4">
        <h3 className="text-xl font-semibold">Repas sur place</h3>
        <ul>
          {on_site_meals.map((meal) => (
            <li key={meal.ID}>{meal.description}</li>
          ))}
        </ul>
      </div>

      <div className="equipment-rentals mt-4">
        <h3 className="text-xl font-semibold">Locations d'équipement</h3>
        <ul>
          {equipment_rentals.map((rental) => (
            <li key={rental.ID}>{rental.name}</li>
          ))}
        </ul>
      </div>

      <div className="teams mt-4">
        <h3 className="text-xl font-semibold">Équipes</h3>
        <ul>
          {teams.map((team) => (
            <li key={team.ID}>{team.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventDetails;
