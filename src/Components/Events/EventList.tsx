import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { getAllEvents } from "../../Services/eventService";
import { Event } from "../../Interfaces/types";

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching all events...");
        const data = await getAllEvents();
        console.log("Events fetched successfully:", data);
        
        // S'assurer que nous avons la structure attendue
        if (data && data.events) {
          setEvents(data.events);
        } else if (Array.isArray(data)) {
        setEvents(data);
        } else {
          console.warn("Format de données inattendu:", data);
          setEvents([]);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    console.log("Loading events...");
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error in EventList:", error);
    return <div>{error}</div>;
  }

  return (
    <div>
      {events.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          date={event.date}
          time={event.created_at ? new Date(event.created_at).toLocaleTimeString() : "Non spécifié"}
          location={event.location}
          images={event.image_urls || []}
          description={event.description}
        />
      ))}
    </div>
  );
};

export default EventList;
