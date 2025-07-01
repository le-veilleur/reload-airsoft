import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { getAllEvents } from "../../Services/eventService";
import { Event } from "../../Interfaces/types";
import { formatDateToFrench, extractTimeFromDate } from "../../utils/dateUtils";

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        
        // Les données viennent avec la structure {events: Array, total: number}
        if (data && data.events && Array.isArray(data.events)) {
          setEvents(data.events);
        } else if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {events.map((event: any) => (
                  <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            date={formatDateToFrench(event.start_date || event.date)}
            time={extractTimeFromDate(event.start_date || "") || "Heure non spécifiée"}
            endTime={extractTimeFromDate(event.end_date || "")}
            location={{
              address: event.location?.address || "Adresse non disponible",
              latitude: event.location?.latitude || 0,
              longitude: event.location?.longitude || 0,
              city: event.location?.city || "",
              country: event.location?.country || ""
            }}
            images={(event as any).image_urls || []} // Utilisation des vraies URLs d'images
            description={event.description}
            price={typeof event.price === 'string' ? parseInt(event.price) || 0 : event.price}
          />
      ))}
    </div>
  );
};

export default EventList;
