import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllEvents } from "../../Services/eventService";
import SearchBar from "../../common/SearchBar";
import EventMap from "../../Components/Maps/EventMap";

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
            {events.map((event) => {
              return (
                <div
                  key={event.ID}
                  className="p-4 bg-white shadow-md rounded-lg cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  {event.images && event.images.length > 0 ? (
                    <img
                      src={event.images[0].url}
                      alt={event.title}
                      className="w-full h-48 object-cover mb-4 rounded"
                      onError={(e) => {
                        console.error(
                          "Failed to load image:",
                          event.images[0].url
                        );
                        e.currentTarget.src =
                          "/images/shutterstock_761941054.jpg";
                      }}
                    />
                  ) : (
                    <img
                      src="/images/shutterstock_761941054.jpg"
                      alt="Placeholder"
                      className="w-full h-48 object-cover mb-4 rounded"
                    />
                  )}
                  <h3 className="text-xl font-bold">{event.title}</h3>

                  <div className="text-gray-600 mb-2 flex items-center">
                    <img
                      src="/images/icons/calendar.svg"
                      alt="Date icon"
                      className="w-4 h-4 mr-2"
                    />
                    <span>{event.start_date}</span>
                  </div>

                  <div className="text-gray-600 mb-2 flex items-center">
                    <img
                      src="/images/icons/clock.svg"
                      alt="Time icon"
                      className="w-4 h-4 mr-2"
                    />
                    <span>{event.start_time}</span>
                  </div>

                  <div className="text-gray-600 mb-4 flex items-center">
                    <img
                      src="/images/icons/map-pin.svg"
                      alt="Location icon"
                      className="w-4 h-4 mr-2"
                    />
                    <span>{event.location}</span>
                  </div>
                  <p className="mb-4">{event.description}</p>
                  <Link to={`/event/evenements/${event.ID}`}>
                    <button className="bg-blue-800 text-white py-2 px-4 rounded-full">
                      Voir plus
                    </button>
                  </Link>
                </div>
              );
            })}
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
