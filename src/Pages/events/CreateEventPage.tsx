import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { createEventWithJson } from "../../Services/eventService";
import UserService from "../../Services/userService";

interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  maxParticipants: number;
  price: number;
  category: string;
  isPrivate: boolean;
}

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: {
      address: "",
      city: "",
      country: "",
      postalCode: ""
    },
    maxParticipants: 10,
    price: 0,
    category: "",
    isPrivate: false
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof EventFormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Validation des dates en temps réel
    if (field === 'startDate' || field === 'startTime' || field === 'endDate' || field === 'endTime') {
      validateDates();
    }
  };

  const validateDates = () => {
    // Si les champs ne sont pas tous remplis, pas d'erreur
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      setDateError(null);
      return;
    }

    try {
      // Créer les dates complètes
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      const now = new Date();

      console.log("Validation des dates:", {
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        now: now.toISOString(),
        startTimestamp: startDateTime.getTime(),
        nowTimestamp: now.getTime(),
        isInPast: startDateTime.getTime() <= now.getTime()
      });

      // Permettre les événements sur 24h complètes
      // Accepter n'importe quelle heure du jour actuel
      const startDateOnly = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate());
      const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Si c'est une date future, accepter
      if (startDateOnly > nowDateOnly) {
        console.log("    Événement futur accepté");
      } else if (startDateOnly.getTime() === nowDateOnly.getTime()) {
        // Même jour, accepter n'importe quelle heure (00:00 à 23:59)
        console.log("Événement du même jour accepté - 24h disponibles");
      } else {
        // Date passée, rejeter
        setDateError("La date de début ne peut pas être dans le passé");
        return;
      }

      // Vérifier que la date de fin est après la date de début
      if (endDateTime.getTime() <= startDateTime.getTime()) {
        setDateError("La date et heure de fin doivent être postérieures au début");
        return;
      }

      // Vérifier la durée minimale (30 minutes)
      const durationMs = endDateTime.getTime() - startDateTime.getTime();
      const durationMinutes = durationMs / (1000 * 60);
      if (durationMinutes < 30) {
        setDateError("L'événement doit durer au moins 30 minutes");
        return;
      }

      setDateError(null);
    } catch (error) {
      console.error("Erreur lors de la validation des dates:", error);
      setDateError("Format de date invalide");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation des données
      if (!formData.category) {
        alert("Veuillez sélectionner une catégorie");
        return;
      }

      if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
        alert("Veuillez remplir toutes les dates et heures");
        return;
      }

      // Validation finale des dates
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      const now = new Date();

      // Permettre les événements sur 24h complètes
      // Accepter n'importe quelle heure du jour actuel
      const startDateOnly = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate());
      const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (startDateOnly < nowDateOnly) {
        alert("La date de début ne peut pas être dans le passé");
        return;
      }
      
      // Si c'est le même jour, accepter n'importe quelle heure
      if (startDateOnly.getTime() === nowDateOnly.getTime()) {
        console.log("Événement du même jour accepté - 24h disponibles");
      }

      if (endDateTime.getTime() <= startDateTime.getTime()) {
        alert("La date et heure de fin doivent être postérieures au début");
        return;
      }

      const durationMs = endDateTime.getTime() - startDateTime.getTime();
      const durationMinutes = durationMs / (1000 * 60);
      if (durationMinutes < 30) {
        alert("L'événement doit durer au moins 30 minutes");
        return;
      }

      // Formater les dates pour l'API: "DD-MM-YYYY HH:mm"
      const formatDateForAPI = (dateStr: string, timeStr: string) => {
        const date = new Date(`${dateStr}T${timeStr}`);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
      };

      const formattedStartDate = formatDateForAPI(formData.startDate, formData.startTime);
      const formattedEndDate = formatDateForAPI(formData.endDate, formData.endTime);

      const organizerId = UserService.getUserIDFromToken();
      if (!organizerId) {
        alert("Erreur: Impossible de récupérer l'ID de l'organisateur");
        return;
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        location: {
          address: formData.location.address,
          city: formData.location.city,
          country: formData.location.country,
          postal_code: formData.location.postalCode,
          latitude: 0,
          longitude: 0
        },
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        max_participants: formData.maxParticipants,
        price: formData.price * 100, // Convertir en centimes
        category_ids: formData.category ? [formData.category] : [],
        is_private: formData.isPrivate,
        organizer_id: organizerId,
        image_urls: []
      };

      console.log("Données de création d'événement:", {
        ...eventData,
        organizer_id: organizerId ? "Présent" : "Manquant",
        category_ids: eventData.category_ids
      });
      
      const response = await createEventWithJson(eventData);
      console.log("Événement créé:", response);
      
      navigate("/events", { 
        state: { 
          message: "Événement créé avec succès !",
          eventId: response?.event?.id || "unknown" 
        } 
      });
      
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      alert("Erreur lors de la création de l'événement");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rediriger si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      navigate("/login", { 
        state: { 
          message: "Vous devez être connecté pour créer un événement",
          redirectTo: "/events/create"
        } 
      });
    }
  }, [user, navigate]);

  // Permettre le scroll sur cette page
  useEffect(() => {
    document.body.classList.add('allow-scroll');
    
    // Nettoyer la classe au démontage du composant
    return () => {
      document.body.classList.remove('allow-scroll');
    };
  }, []);

  const handleCancel = () => {
    navigate("/events");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Créer un nouvel événement</h1>
              <p className="mt-2 text-gray-600">Remplissez les informations pour créer votre événement</p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Titre et description */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'événement *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Titre de votre événement"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description détaillée de l'événement"
                />
              </div>
            </div>

            {/* Dates et heures */}
            <div className="space-y-4">
              {dateError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-red-700">{dateError}</span>
                  </div>
                </div>
              )}
              
              <h3 className="text-lg font-medium text-gray-900">Date et heure de début *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900">Date et heure de fin *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Localisation</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location.address}
                  onChange={(e) => handleInputChange("location.address", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adresse complète"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location.city}
                    onChange={(e) => handleInputChange("location.city", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ville"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={formData.location.postalCode}
                    onChange={(e) => handleInputChange("location.postalCode", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Code postal"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location.country}
                    onChange={(e) => handleInputChange("location.country", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Pays"
                  />
                </div>
              </div>
            </div>

            {/* Détails de l'événement */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Détails de l'événement</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre maximum de participants
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange("maxParticipants", parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (en euros)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="tactical">Tactical</option>
                  <option value="cqb">CQB (Combat rapproché)</option>
                  <option value="scenario">Scénario</option>
                  <option value="training">Entraînement</option>
                  <option value="competition">Compétition</option>
                  <option value="recreational">Récréatif</option>
                  <option value="milsim">MilSim</option>
                  <option value="speedsoft">Speedsoft</option>
                  <option value="woodland">Woodland</option>
                  <option value="urban">Urbain</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onChange={(e) => handleInputChange("isPrivate", e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
                  Événement privé
                </label>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Création en cours..." : "Créer l'événement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage; 