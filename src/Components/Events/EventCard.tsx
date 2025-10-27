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

  const handleCardClick = () => {
    navigate(`/event/evenements/${id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white shadow-soft hover:shadow-strong rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
    >
      {/* Images */}
      <div className="relative h-48 overflow-hidden">
        {images && Array.isArray(images) && images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              console.error("Failed to load image:", images[0]);
              e.currentTarget.src = "/images/shutterstock_761941054.jpg";
            }}
          />
        ) : (
          <img
            src="/images/shutterstock_761941054.jpg"
            alt="Placeholder"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge de prix si disponible */}
        {price !== undefined && price > 0 && (
          <div className="absolute top-4 right-4 bg-accent-green text-white px-3 py-1.5 rounded-full font-bold text-sm shadow-medium">
            {formatPriceFromCents(price)}
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Title */}
        <h3 className="font-bold font-Montserrat text-xl mb-3 text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Date et Time */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              {time}
              {endTime && endTime !== "Non défini" && ` - ${endTime}`}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start text-gray-600 mb-4 text-sm">
          <svg className="w-5 h-5 mr-2 mt-0.5 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-2">
            {location?.address ? 
              location.address : 
              `${location?.city || 'Ville non spécifiée'}${location?.country ? `, ${location.country}` : ''}`
            }
          </span>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-600 font-Montserrat leading-relaxed text-sm line-clamp-3">
            {description || "Aucune description disponible"}
          </p>
          {!description && (
            <div className="flex items-center text-gray-400 text-xs mt-2">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Description à venir
            </div>
          )}
        </div>

        {/* Footer avec bouton */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button 
            onClick={handleViewMoreClick}
            className="inline-flex items-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-soft hover:shadow-medium transform hover:scale-105 transition-all duration-300"
          >
            Voir plus
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Indicateur de participants ou autre info */}
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
