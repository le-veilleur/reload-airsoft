// src/Components/EventCard.tsx

import React from "react";
import { Link } from "react-router-dom";
import { Location } from "../../Interfaces/types";
import { formatPriceFromCents } from "../../utils/priceUtils";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime?: string;
  location: Location;
  images: string[];
  description: string;
  price?: number;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  time,
  endTime,
  location,
  images,
  description,
  price
}) => {
  return (
    <div className="p-3 bg-white shadow-md rounded-lg cursor-pointer">
      {/* Images  Affichage de la première image si disponible*/}
      {images && Array.isArray(images) && images.length > 0 ? (
        <img
          src={images[0]}
          alt={title}
          className="w-full h-55  bg-no-repeat mb-4 rounded"
          onError={(e) => {
            console.error("Failed to load image:", images[0]);
            e.currentTarget.src = "/images/shutterstock_761941054.jpg";
          }}
        />
      ) : (
        <img
          src="/images/shutterstock_761941054.jpg"
          alt="Placeholder"
          className="w-full h-48 object-cover mb-4 rounded"
        />
      )}

      {/* Title */}
      <h3 className="font-bold font-Montserrat text-xl">{title}</h3>

      {/* Date */}
      <div className="text-gray-600 mb-2 flex items-center">
        <img
          src="/images/icons/calendar.svg"
          alt="Date icon"
          className="w-4 h-4 mr-2"
        />
        <span>{date}</span>
      </div>

      {/* Time */}
      <div className="text-gray-600 mb-2 flex items-center">
        <img
          src="/images/icons/clock.svg"
          alt="Time icon"
          className="w-4 h-4 mr-2"
        />
        <span>
          {time}
          {endTime && endTime !== "Non défini" && ` - ${endTime}`}
        </span>
      </div>

      {/* Location */}
      <div className="text-gray-600 mb-4 flex items-center">
        <img
          src="/images/icons/map-pin.svg"
          alt="Location icon"
          className="w-4 h-4 mr-2"
        />
        <span>
          {location?.address ? 
            location.address : 
            `${location?.city || 'Ville non spécifiée'}${location?.country ? `, ${location.country}` : ''}`
          }
        </span>
      </div>

      {/* Price */}
      {price && price > 0 && (
        <div className="text-gray-600 mb-4 flex items-center">
          <img
            src="/images/icons/euro.svg"
            alt="Price icon"
            className="w-4 h-4 mr-2"
          />
          <span>{formatPriceFromCents(price)}</span>
        </div>
      )}

      {/* Description */}
      <p className="mb-4 font-Montserrat">{description}</p>

      {/* Price */}
      {price !== undefined && price > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            💰 {formatPriceFromCents(price)}
          </span>
          <span className="text-sm text-gray-500">par personne</span>
        </div>
      )}

      {/* View More Button */}
      <Link to={`/event/evenements/${id}`}>
        <button className="bg-blue-800 text-white py-2 px-4 rounded-full font-Montserrat">
          Voir plus
        </button>
      </Link>
    </div>
  );
};

export default EventCard;
