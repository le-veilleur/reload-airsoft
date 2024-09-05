import React from "react";
import { Link } from "react-router-dom"; // Assurez-vous d'avoir installé react-router-dom

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  location: string;
  images: string[];
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  location,
  images
}) => {
  console.log("Rendering EventCard:", { title, date, location, images });

  return (
    <div className="event-card border p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">{date}</p>
      <p className="text-gray-600">{location}</p>
      <div className="image-gallery mt-2">
        {images.length > 0 ? (
          images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${title} image ${index + 1}`}
              className="w-full h-auto mt-2 rounded"
            />
          ))
        ) : (
          <p className="text-gray-500">No images available</p>
        )}
      </div>
      <div className="mt-4">
        <Link
          to={`/events/${id}`} // Utilise l'ID pour la route
          className="text-blue-500 hover:underline"
        >
          Voir plus
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
