import React from 'react';
import { DetailedEvent } from '../../Interfaces/types';
import { formatPriceFromCents } from '../../utils/priceUtils';
import { formatDateToFrench, extractTimeFromDate } from '../../utils/dateUtils';

interface EventOverviewTabProps {
  event: DetailedEvent;
  getDifficultyColor: (level: string | undefined) => string;
  getStatusColor: (status: number | string) => string;
}

const EventOverviewTab: React.FC<EventOverviewTabProps> = ({ 
  event, 
  getDifficultyColor, 
  getStatusColor 
}) => {
  return (
    <div id="section-overview" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>
      </div>

      {/* Informations pratiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">📍 Informations pratiques</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{formatDateToFrench(event.start_date)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Heure de début:</span>
              <span className="font-medium">{extractTimeFromDate(event.start_date) || "Non défini"}</span>
            </div>
            
            {event.end_time && event.end_time !== "Non défini" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Heure de fin:</span>
                <span className="font-medium">{event.end_time}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Prix:</span>
              <span className="font-medium text-green-600 text-lg">
                {formatPriceFromCents(event.price || 0)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Lieu:</span>
              <span className="font-medium">{event.location.address}</span>
            </div>
            
            {event.meeting_point && (
              <div className="flex justify-between">
                <span className="text-gray-600">Point de rendez-vous:</span>
                <span className="font-medium">{event.meeting_point}</span>
              </div>
            )}
            
            {event.parking_info && (
              <div className="flex justify-between">
                <span className="text-gray-600">Parking:</span>
                <span className="font-medium">{event.parking_info}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Niveau:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(event.difficulty_level)}`}>
                {event.difficulty_level}
              </span>
            </div>
            
            {event.age_restriction && (
              <div className="flex justify-between">
                <span className="text-gray-600">Âge minimum:</span>
                <span className="font-medium">{event.age_restriction} ans</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">⚡ Détails supplémentaires</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Statut:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            
            {event.booking_deadline && (
              <div className="flex justify-between">
                <span className="text-gray-600">Date limite:</span>
                <span className="font-medium">{event.booking_deadline}</span>
              </div>
            )}

            {event.weather_requirements && (
              <div className="flex justify-between">
                <span className="text-gray-600">Météo:</span>
                <span className="font-medium">{event.weather_requirements}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Équipement requis */}
      {event.equipment_required && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Équipement requis</h3>
          <p className="text-gray-700">{event.equipment_required}</p>
        </div>
      )}

      {/* Consignes de sécurité */}
      {event.safety_instructions && event.safety_instructions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">⚠️ Consignes de sécurité</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {event.safety_instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Commodités */}
      {event.amenities && event.amenities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🏪 Commodités disponibles</h3>
          <div className="flex flex-wrap gap-2">
            {event.amenities.map((amenity, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventOverviewTab; 