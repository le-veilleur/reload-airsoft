// src/pages/EventsPage.tsx

import React, { useEffect, useState } from "react";
import { getAllEvents } from "../../Services/eventService";
import SearchBar from "../../common/SearchBar";
import EventMap from "../../Components/Maps/EventMap";
import EventCard from "../../Components/Events/EventCard";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchParams: {
    date?: string;
    time?: string;
    location?: string;
  }) => {
    try {
      const data = await getAllEvents();
      console.log("Events fetched successfully:", data);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Erreur lors de la récupération des événements.");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        console.log("Events fetched successfully:", data);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Erreur lors de la récupération des événements.");
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  return (
    <div className="flex max-h-[51.2rem] relative overflow-hidden border-none bg-gris-bleute">
      <div className="w-1/2 flex flex-col">
        <div className="sticky top-0 z-10 p-4 bg-gris-bleute">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 border-none bg-gris-bleute">
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event.ID}
                className="cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <EventCard
                  id={event.ID}
                  title={event.title}
                  date={event.start_date}
                  time={event.start_time}
                  location={event.location}
                  images={event.images.map((img: { url: any; }) => img.url)} // Assurez-vous que `event.images` est un tableau d'URLs
                  description={event.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-1/2 p-4 flex-shrink-0 z-10">
        {selectedEvent &&
        selectedEvent.latitude !== undefined &&
        selectedEvent.longitude !== undefined ? (
          <EventMap
            latitude={selectedEvent.latitude}
            longitude={selectedEvent.longitude}
            locationName={selectedEvent.location}
          />
        ) : (
          <p>
            Sélectionnez un événement pour voir son emplacement ou les
            coordonnées sont indisponibles.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
