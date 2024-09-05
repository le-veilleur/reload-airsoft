import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../../Services/eventService";
import EventMap from "../../Components/Maps/EventMap";

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any | null>(null);
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
    title,
    start_date,
    start_time,
    location,
    price,
    description,
    images,
  } = event;

  return (
    <div className="p-4 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 mb-2">
        <strong>Date:</strong> {start_date}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Heure:</strong> {start_time}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Lieu:</strong> {location}
      </p>
      <p className="text-gray-600 mb-2">
        <strong>Prix:</strong> {price} €
      </p>
      <p className="mb-4">{description}</p>

      {Array.isArray(images) && images.length > 0 ? (
        <div className="image-gallery mt-2 bg-Light-Powder-Blue">
          {images.map((image: { url: string }, index: number) => (
            <img
              key={index}
              src={image.url}
              alt={`${title} image ${index + 1}`}
              className="w-full h-auto mt-2 rounded"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Aucune image disponible.</p>
      )}

      {latitude !== undefined && longitude !== undefined ? (
        <EventMap
          latitude={latitude}
          longitude={longitude}
          locationName={location}
        />
      ) : (
        <p className="text-red-500">Coordonnées de l'événement indisponibles.</p>
      )}
    </div>
  );
};

export default EventDetailPage;
