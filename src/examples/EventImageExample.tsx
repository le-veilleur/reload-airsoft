import React, { useState } from 'react';
import EventImageUpload from '../Components/Events/EventImageUpload';
import { EventImage } from '../Interfaces/eventImage';

// Exemple de données d'événement CQB Nocturne
const eventData = {
  "title": "Partie CQB Nocturne",
  "start_date": "15-01-2025 14:30",
  "end_date": "15-01-2025 18:00",
  "description": "Partie d'airsoft CQB en intérieur",
  "location": {
    "address": "56 Grande Rue",
    "city": "Strasbourg", 
    "country": "France",
    "postal_code": "67000",
    "latitude": 0,
    "longitude": 0
  },
  "max_participants": 24,
  "event_type": "tactical",
  "difficulty_level_enum": "intermediate",
  "age_restriction": 16,
  "equipment_required_list": [
    {
      "name": "Réplique",
      "description": "Réplique d'airsoft",
      "required": true,
      "provided": false
    }
  ],
  "pricing_options": [
    {
      "name": "Tarif standard",
      "price": 2500,
      "currency": "EUR"
    }
  ],
  "rules": ["Pas de tir en rafale", "Respect des distances"],
  "schedule": [
    {
      "phase": "Briefing",
      "start_time": "15-01-2025 14:00",
      "end_time": "15-01-2025 14:30"
    }
  ],
  "cancellation_policy": {
    "refund_percentage": 80,
    "deadline": "10-01-2025 23:59"
  },
  "insurance": {
    "included": true,
    "provider": "Assurance Airsoft"
  },
  "contacts": [
    {
      "name": "Organisateur",
      "email": "contact@event.com",
      "primary": true
    }
  ],
  "social_media": [
    {
      "platform": "facebook",
      "url": "https://facebook.com/event"
    }
  ],
  "metadata": {
    "tags": ["cqb", "nocturne"],
    "keywords": ["airsoft", "tactical"]
  }
};

const EventImageExample: React.FC = () => {
  const [images, setImages] = useState<EventImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImagesChange = (newImages: EventImage[]) => {
    setImages(newImages);
    console.log('Images mises à jour:', newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler l'envoi des données
      console.log('Données de l\'événement:', eventData);
      console.log('Images sélectionnées:', images);
      
      // Préparer les URLs d'images pour l'API
      const imageUrls = images.map(image => image.previewUrl);
      
      const eventDataWithImages = {
        ...eventData,
        image_urls: imageUrls
      };

      console.log('Données complètes à envoyer:', eventDataWithImages);
      
      // Ici, vous appelleriez votre API
      // await createEventWithJson(eventDataWithImages);
      
      alert('Événement créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création de l\'événement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exemple : Création d'événement CQB Nocturne</h1>
          <p className="mt-2 text-gray-600">
            Démonstration du composant d'upload d'images pour les événements
          </p>
        </div>

        {/* Informations de l'événement */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations de l'événement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Titre:</strong> {eventData.title}
            </div>
            <div>
              <strong>Date:</strong> {eventData.start_date} - {eventData.end_date}
            </div>
            <div>
              <strong>Lieu:</strong> {eventData.location.address}, {eventData.location.city}
            </div>
            <div>
              <strong>Type:</strong> {eventData.event_type} ({eventData.difficulty_level_enum})
            </div>
            <div>
              <strong>Participants max:</strong> {eventData.max_participants}
            </div>
            <div>
              <strong>Prix:</strong> {(eventData.pricing_options[0].price / 100).toFixed(2)}€
            </div>
          </div>
        </div>

        {/* Formulaire avec upload d'images */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Images de l'événement</h2>
            
            <EventImageUpload
              currentImages={images}
              onImagesChange={handleImagesChange}
              disabled={isSubmitting}
              maxImages={5}
            />

            {/* Bouton de soumission */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </>
                ) : (
                  "Créer l'événement"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Instructions d'utilisation</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Glissez-déposez vos images dans la zone ou cliquez pour sélectionner</li>
            <li>• Formats acceptés : JPG, PNG, WebP, GIF (max 10MB par image)</li>
            <li>• Maximum 5 images par événement</li>
            <li>• La première image sera utilisée comme image principale</li>
            <li>• Vous pouvez réorganiser les images en cliquant sur les boutons d'action</li>
            <li>• Ajoutez des descriptions pour chaque image (accessibilité)</li>
          </ul>
        </div>

        {/* Prévisualisation des données */}
        {images.length > 0 && (
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Prévisualisation des images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={image.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.previewUrl}
                      alt={image.altText}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Image {index + 1}
                      </span>
                      {image.isPrimary && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Principale
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{image.altText}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {image.file ? `${(image.file.size / 1024 / 1024).toFixed(2)} MB` : 'Image existante'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventImageExample; 