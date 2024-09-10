import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { getAllEvents } from "../../Services/eventService";

interface Event {
  ID: number;
  title: string;
  start_date: string;
  location: string;
  images: string[];
}

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
        setEvents(data);
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
          key={event.ID}
          id={event.ID}
          title={event.title}
          date={event.start_date}
          location={event.location}
          images={event.images} time={""} description={""}        />
      ))}
    </div>
  );
};

export default EventList;
