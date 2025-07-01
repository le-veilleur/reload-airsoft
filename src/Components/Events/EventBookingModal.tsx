import React from 'react';
import { DetailedEvent } from '../../Interfaces/types';

interface EventBookingModalProps {
  event: DetailedEvent;
  showBookingForm: boolean;
  isBooking: boolean;
  bookingForm: {
    first_name: string;
    last_name: string;
    username: string;
    association: string;
    role: string;
    carpooling: boolean;
    team_preference: string;
    special_requirements: string;
    emergency_contact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (updates: any) => void;
}

const EventBookingModal: React.FC<EventBookingModalProps> = ({
  event,
  showBookingForm,
  isBooking,
  bookingForm,
  onClose,
  onSubmit,
  onFormChange
}) => {
  if (!showBookingForm) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {event.stats.available_spots > 0 ? "Réserver ma place" : "Liste d'attente"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bookingForm.first_name}
                  onChange={(e) => onFormChange({ first_name: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Votre prénom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bookingForm.last_name}
                  onChange={(e) => onFormChange({ last_name: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pseudo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bookingForm.username}
                onChange={(e) => onFormChange({ username: e.target.value })}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre pseudo"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Association
                </label>
                <input
                  type="text"
                  value={bookingForm.association}
                  onChange={(e) => onFormChange({ association: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom de votre association (optionnel)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <input
                  type="text"
                  value={bookingForm.role}
                  onChange={(e) => onFormChange({ role: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Votre rôle (optionnel)"
                />
              </div>
            </div>

            {/* Covoiturage */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="carpooling"
                checked={bookingForm.carpooling}
                onChange={(e) => onFormChange({ carpooling: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="carpooling" className="ml-2 block text-sm text-gray-700">
                🚗 J'aimerais organiser/participer à un covoiturage
              </label>
            </div>

            {/* Préférence d'équipe */}
            {event.teams && event.teams.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Préférence d'équipe
                </label>
                <select
                  value={bookingForm.team_preference}
                  onChange={(e) => onFormChange({ team_preference: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Aucune préférence</option>
                  {event.teams.map((team) => (
                    <option key={team.ID} value={team.name}>{team.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Exigences spéciales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exigences spéciales ou commentaires
              </label>
              <textarea
                value={bookingForm.special_requirements}
                onChange={(e) => onFormChange({ special_requirements: e.target.value })}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Allergies, besoins d'accessibilité, etc."
              />
            </div>

            {/* Contact d'urgence */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Contact d'urgence (optionnel)
              </label>
              
              <input
                type="text"
                placeholder="Nom et prénom"
                value={bookingForm.emergency_contact.name}
                onChange={(e) => onFormChange({
                  emergency_contact: { ...bookingForm.emergency_contact, name: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="tel"
                placeholder="Numéro de téléphone"
                value={bookingForm.emergency_contact.phone}
                onChange={(e) => onFormChange({
                  emergency_contact: { ...bookingForm.emergency_contact, phone: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <input
                type="text"
                placeholder="Relation (parent, conjoint, ami...)"
                value={bookingForm.emergency_contact.relationship}
                onChange={(e) => onFormChange({
                  emergency_contact: { ...bookingForm.emergency_contact, relationship: e.target.value }
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isBooking}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? "En cours..." : event.stats.available_spots > 0 ? "Confirmer" : "Rejoindre"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventBookingModal; 