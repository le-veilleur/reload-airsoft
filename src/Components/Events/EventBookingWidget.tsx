import React from 'react';
import { DetailedEvent } from '../../Interfaces/types';
import { formatPriceFromCents } from '../../utils/priceUtils';
import { formatDateToFrench } from '../../utils/dateUtils';

interface EventBookingWidgetProps {
  event: DetailedEvent;
  bookingStatus: string | null;
  isBooking: boolean;
  onBookingClick: () => void;
  onCancelBooking: () => void;
  getDifficultyColor: (level: string | undefined) => string;
  ShareEventComponent: React.ReactNode;
}

const EventBookingWidget: React.FC<EventBookingWidgetProps> = ({
  event,
  bookingStatus,
  isBooking,
  onBookingClick,
  onCancelBooking,
  getDifficultyColor,
  ShareEventComponent
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {formatPriceFromCents(event.price || 0)}
        </div>
        <div className="text-sm text-gray-600">par personne</div>
      </div>

      {/* Statut de réservation */}
      {bookingStatus === "confirmed" ? (
        <div className="mb-6">
          <div className="flex items-center justify-center p-3 bg-green-100 text-green-800 rounded-lg mb-4">
            <span className="mr-2">✅</span>
            Vous êtes inscrit(e) à cet événement
          </div>
          <button
            onClick={onCancelBooking}
            disabled={isBooking}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBooking ? "Annulation..." : "Annuler ma réservation"}
          </button>
        </div>
      ) : event.stats.available_spots > 0 ? (
        <div className="mb-6">
          <button
            onClick={onBookingClick}
            disabled={isBooking}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isBooking ? "Réservation..." : "Réserver ma place"}
          </button>
          <div className="text-sm text-gray-600 text-center">
            {event.stats.available_spots} place{event.stats.available_spots > 1 ? 's' : ''} restante{event.stats.available_spots > 1 ? 's' : ''}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center justify-center p-3 bg-red-100 text-red-800 rounded-lg mb-4">
            <span className="mr-2">❌</span>
            Événement complet
          </div>
          <button
            onClick={onBookingClick}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Rejoindre la liste d'attente
          </button>
        </div>
      )}

      {/* Bouton de partage */}
      <div className="mb-4 flex justify-center">
        {ShareEventComponent}
      </div>

      {/* Informations rapides */}
      <div className="space-y-3 text-sm border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <span className="text-gray-600">📅 Date:</span>
          <span className="font-medium">{formatDateToFrench(event.start_date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">🕒 Horaires:</span>
          <span className="font-medium">
            {event.start_time || "Non défini"}
            {event.end_time && event.end_time !== "Non défini" && ` - ${event.end_time}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">👥 Participants:</span>
          <span className="font-medium">{event.stats.confirmed_participants}/{event.max_participants}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">📊 Niveau:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(event.difficulty_level)}`}>
            {event.difficulty_level}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventBookingWidget; 