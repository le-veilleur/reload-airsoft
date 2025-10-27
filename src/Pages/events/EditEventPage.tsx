import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { getEventById, updateEventWithJson } from "../../Services/eventService";
import EventImageUpload from "../../Components/Events/EventImageUpload";
import { EventImage } from "../../Interfaces/eventImage";

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
  images: EventImage[];
  // Nouveaux champs
  eventType: string;
  difficultyLevel: string;
  ageRestriction: number;
  equipmentRequired: Array<{
    name: string;
    description: string;
    required: boolean;
    provided: boolean;
  }>;
  pricingOptions: Array<{
    name: string;
    price: number;
    currency: string;
  }>;
  rules: string[];
  schedule: Array<{
    phase: string;
    startTime: string;
    endTime: string;
  }>;
  cancellationPolicy: {
    refundPercentage: number;
    deadline: string;
  };
  insurance: {
    included: boolean;
    provider: string;
  };
  contacts: Array<{
    name: string;
    email: string;
    primary: boolean;
  }>;
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
  metadata: {
    tags: string[];
    keywords: string[];
  };
}

const EditEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    isPrivate: false,
    images: [],
    // Nouveaux champs avec valeurs par défaut
    eventType: "tactical",
    difficultyLevel: "intermediate",
    ageRestriction: 16,
    equipmentRequired: [
      {
        name: "Réplique",
        description: "Réplique d'airsoft",
        required: true,
        provided: false
      }
    ],
    pricingOptions: [
      {
        name: "Tarif standard",
        price: 2500,
        currency: "EUR"
      }
    ],
    rules: ["Pas de tir en rafale", "Respect des distances"],
    schedule: [
      {
        phase: "Briefing",
        startTime: "",
        endTime: ""
      }
    ],
    cancellationPolicy: {
      refundPercentage: 80,
      deadline: ""
    },
    insurance: {
      included: true,
      provider: "Assurance Airsoft"
    },
    contacts: [
      {
        name: "Organisateur",
        email: "",
        primary: true
      }
    ],
    socialMedia: [
      {
        platform: "facebook",
        url: ""
      }
    ],
    metadata: {
      tags: ["airsoft"],
      keywords: ["airsoft", "tactical"]
    }
  });

  // Charger les données de l'événement
  useEffect(() => {
    const loadEvent = async () => {
      if (!id) {
        setError("ID de l'événement manquant");
        setIsLoading(false);
        return;
      }

      try {
        const eventData = await getEventById(id);
        
        // Convertir les dates du format "DD-MM-YYYY HH:mm" vers les champs séparés
        const parseDateTime = (dateTimeStr: string) => {
          const [datePart, timePart] = dateTimeStr.split(' ');
          const [day, month, year] = datePart.split('-');
          const [hours, minutes] = timePart.split(':');
          return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`
          };
        };

        const startDateTime = parseDateTime(eventData.start_date);
        const endDateTime = parseDateTime(eventData.end_date);

        // Convertir les images existantes
        const existingImages: EventImage[] = eventData.images?.map((img: any, index: number) => ({
          id: img.ID?.toString() || `existing-${index}`,
          previewUrl: img.url,
          altText: img.alt_text || `Image ${index + 1}`,
          isPrimary: img.is_primary || index === 0,
          isExisting: true
        })) || [];

        setFormData({
          title: eventData.title || "",
          description: eventData.description || "",
          startDate: startDateTime.date,
          startTime: startDateTime.time,
          endDate: endDateTime.date,
          endTime: endDateTime.time,
          location: {
            address: eventData.location?.address || "",
            city: eventData.location?.city || "",
            country: eventData.location?.country || "",
            postalCode: eventData.location?.postal_code || ""
          },
          maxParticipants: eventData.max_participants || 10,
          price: eventData.price || 0,
          category: eventData.category_ids?.[0] || "",
          isPrivate: eventData.is_private || false,
          images: existingImages,
          eventType: eventData.event_type || "tactical",
          difficultyLevel: eventData.difficulty_level_enum || "intermediate",
          ageRestriction: eventData.age_restriction || 16,
          equipmentRequired: eventData.equipment_required_list || [
            {
              name: "Réplique",
              description: "Réplique d'airsoft",
              required: true,
              provided: false
            }
          ],
          pricingOptions: eventData.pricing_options || [
            {
              name: "Tarif standard",
              price: 2500,
              currency: "EUR"
            }
          ],
          rules: eventData.rules || ["Pas de tir en rafale", "Respect des distances"],
          schedule: eventData.schedule?.map((s: any) => ({
            phase: s.phase,
            startTime: s.start_time,
            endTime: s.end_time
          })) || [
            {
              phase: "Briefing",
              startTime: "",
              endTime: ""
            }
          ],
          cancellationPolicy: eventData.cancellation_policy || {
            refundPercentage: 80,
            deadline: ""
          },
          insurance: eventData.insurance || {
            included: true,
            provider: "Assurance Airsoft"
          },
          contacts: eventData.contacts || [
            {
              name: "Organisateur",
              email: "",
              primary: true
            }
          ],
          socialMedia: eventData.social_media || [
            {
              platform: "facebook",
              url: ""
            }
          ],
          metadata: eventData.metadata || {
            tags: ["airsoft"],
            keywords: ["airsoft", "tactical"]
          }
        });
      } catch (error) {
        console.error("Erreur lors du chargement de l'événement:", error);
        setError("Erreur lors du chargement de l'événement");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [id]);

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

  const handleImagesChange = (images: EventImage[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
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

      // Formater la date limite d'annulation (7 jours avant)
      const cancellationDate = new Date(startDateTime);
      cancellationDate.setDate(cancellationDate.getDate() - 7);
      const formattedCancellationDeadline = formatDateForAPI(
        cancellationDate.toISOString().split('T')[0],
        "23:59"
      );

      // Formater le planning avec les dates de l'événement
      const updatedSchedule = formData.schedule.map(item => ({
        ...item,
        start_time: item.startTime || formattedStartDate,
        end_time: item.endTime || formattedEndDate
      }));

      // Préparer les URLs d'images pour l'API
      const imageUrls = formData.images.map(image => image.previewUrl);

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
        organizer_id: user?.id || "", // ID de l'utilisateur connecté
        category_ids: formData.category ? [formData.category] : [],
        image_urls: imageUrls,
        event_type: formData.eventType,
        difficulty_level_enum: formData.difficultyLevel,
        age_restriction: formData.ageRestriction,
        equipment_required_list: formData.equipmentRequired,
        pricing_options: formData.pricingOptions,
        rules: formData.rules,
        schedule: updatedSchedule,
        cancellation_policy: {
          refund_percentage: formData.cancellationPolicy.refundPercentage,
          deadline: formattedCancellationDeadline
        },
        insurance: formData.insurance,
        contacts: formData.contacts,
        social_media: formData.socialMedia,
        metadata: formData.metadata
      };

      console.log("Données de mise à jour d'événement:", eventData);
      
      const response = await updateEventWithJson(id!, eventData);
      console.log("Événement mis à jour:", response);
      
      navigate(`/event/evenements/${id}`, { 
        state: { 
          message: "Événement mis à jour avec succès !"
        } 
      });
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'événement:", error);
      alert("Erreur lors de la mise à jour de l'événement");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rediriger si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      navigate("/login", { 
        state: { 
          message: "Vous devez être connecté pour modifier un événement",
          redirectTo: `/events/edit/${id}`
        } 
      });
    }
  }, [user, navigate, id]);

  // Permettre le scroll sur cette page
  useEffect(() => {
    document.body.classList.add('allow-scroll');
    
    // Nettoyer la classe au démontage du composant
    return () => {
      document.body.classList.remove('allow-scroll');
    };
  }, []);

  const handleCancel = () => {
    navigate(`/event/evenements/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/events")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Modifier l'événement</h1>
              <p className="mt-2 text-gray-600">Modifiez les informations de votre événement</p>
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
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="p-10 space-y-10">
            {/* Titre et description */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Informations de base</h3>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-8">
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Titre de l'événement *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Titre de votre événement"
                    />
                    <p className="text-xs text-gray-600 mt-2">Nom principal de votre événement</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
                      placeholder="Description détaillée de l'événement"
                    />
                    <p className="text-xs text-gray-600 mt-2">Présentez votre événement aux participants</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Images de l'événement */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Images de l'événement</h3>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-8">
                <EventImageUpload
                  currentImages={formData.images}
                  onImagesChange={handleImagesChange}
                  disabled={isSubmitting}
                  maxImages={5}
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Annuler
              </button>
              
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
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour l'événement"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage; 