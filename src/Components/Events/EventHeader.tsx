import React from 'react';
import { DetailedEvent } from '../../Interfaces/types';
import { formatPriceFromCents } from '../../utils/priceUtils';
import { formatDateToFrench, extractTimeFromDate } from '../../utils/dateUtils';

interface EventHeaderProps {
  event: DetailedEvent;
}

const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Image principale */}
      <div className="relative h-96">
        {event.images.length > 0 ? (
          <img
            src={event.images[0].url}
            alt={event.images[0].alt_text || event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-xl">Événement Airsoft</p>
            </div>
          </div>
        )}
        
        {/* Overlay avec informations rapides */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="w-full p-6 text-white">
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            
            <div className="flex flex-wrap gap-4 text-lg">
              <div className="flex items-center">
                <span className="mr-2">📅</span>
                {formatDateToFrench(event.start_date)}
              </div>
              <div className="flex items-center">
                <span className="mr-2">🕒</span>
                {extractTimeFromDate(event.start_date) || "Non défini"}
                {event.end_time && event.end_time !== "Non défini" && ` - ${event.end_time}`}
              </div>
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                {event.location.city || event.location.address}
              </div>
              <div className="flex items-center">
                <span className="mr-2">💰</span>
                {formatPriceFromCents(event.price || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default EventHeader; 