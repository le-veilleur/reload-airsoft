// src/Components/EventCard.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleViewMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la propagation vers le div parent
    navigate(`/event/evenements/${id}`);
  };

  return (
    <div className="p-3 bg-white shadow-md rounded-lg">
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

      {/* Description */}
      <div className="mb-4">
        <div className="relative">
          <p className="text-gray-700 font-Montserrat leading-relaxed text-sm">
            {description && description.length > 120 ? (
              <>
                <span>{description.substring(0, 120)}</span>
                <span className="text-gray-500">...</span>
                <br />
                <span className="text-blue-600 text-xs font-medium cursor-pointer hover:text-blue-800 transition-colors">
                  📖 Voir plus dans les détails
                </span>
              </>
            ) : (
              description || "Aucune description disponible"
            )}
          </p>
          {/* Indicateur visuel si description vide */}
          {!description && (
            <div className="flex items-center text-gray-400 text-xs mt-1">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Description à venir
            </div>
          )}
        </div>
      </div>

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
      <button 
        onClick={handleViewMoreClick}
        className="bg-blue-800 text-white py-2 px-4 rounded-full font-Montserrat hover:bg-blue-900 transition-colors"
      >
        Voir plus
      </button>
    </div>
  );
};

export default EventCard;
