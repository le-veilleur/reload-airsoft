import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { createEventWithJson } from "../../Services/eventService";
import UserService from "../../Services/userService";
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

      // Préparer les URLs d'images pour l'API (utiliser les URLs uploadées si disponibles)
      const imageUrls = formData.images
        .map(img => img.uploadedUrl)
        .filter((url): url is string => !!url);

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

      console.log("Données de création d'événement:", eventData);
      
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

            {/* Dates et heures */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Planning de l'événement</h3>
              </div>
              
              {dateError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-red-700">{dateError}</span>
                  </div>
                </div>
              )}
              
                              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-8">
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-8 rounded-2xl border border-yellow-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Date et heure de début *</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date de début
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
                          className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Heure de début
                        </label>
                        <input
                          type="time"
                          required
                          value={formData.startTime}
                          onChange={(e) => handleInputChange("startTime", e.target.value)}
                          className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                                      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-8 rounded-2xl border border-yellow-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Date et heure de fin *</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.endDate}
                          onChange={(e) => handleInputChange("endDate", e.target.value)}
                          className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Heure de fin
                        </label>
                        <input
                          type="time"
                          required
                          value={formData.endTime}
                          onChange={(e) => handleInputChange("endTime", e.target.value)}
                          className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Localisation</h3>
              </div>
              
                              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-8">
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-8 rounded-2xl border border-teal-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Adresse complète *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location.address}
                      onChange={(e) => handleInputChange("location.address", e.target.value)}
                      className="w-full px-4 py-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                      placeholder="Adresse complète"
                    />
                    <p className="text-xs text-gray-600 mt-2">Adresse détaillée du lieu de l'événement</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-8 rounded-2xl border border-teal-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Ville *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location.city}
                        onChange={(e) => handleInputChange("location.city", e.target.value)}
                        className="w-full px-4 py-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                        placeholder="Ville"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-8 rounded-2xl border border-teal-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Code postal
                      </label>
                      <input
                        type="text"
                        value={formData.location.postalCode}
                        onChange={(e) => handleInputChange("location.postalCode", e.target.value)}
                        className="w-full px-4 py-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                        placeholder="Code postal"
                      />
                    </div>
                    
                    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-8 rounded-2xl border border-teal-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Pays *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location.country}
                        onChange={(e) => handleInputChange("location.country", e.target.value)}
                        className="w-full px-4 py-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                        placeholder="Pays"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails de l'événement */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Détails de l'événement</h3>
              </div>
              
                              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-8">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-8 rounded-2xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Nombre maximum de participants
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxParticipants}
                        onChange={(e) => handleInputChange("maxParticipants", parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                        placeholder="50"
                      />
                      <p className="text-xs text-gray-600 mt-2">Nombre maximum de participants autorisés</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-8 rounded-2xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Type d'événement
                      </label>
                      <select
                        value={formData.eventType}
                        onChange={(e) => handleInputChange("eventType", e.target.value)}
                        className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                      >
                        <option value="tactical">Tactical</option>
                        <option value="scenario">Scénario</option>
                        <option value="competition">Compétition</option>
                        <option value="training">Entraînement</option>
                        <option value="social">Social</option>
                      </select>
                      <p className="text-xs text-gray-600 mt-2">Type principal de l'événement</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-8 rounded-2xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Niveau de difficulté
                      </label>
                      <select
                        value={formData.difficultyLevel}
                        onChange={(e) => handleInputChange("difficultyLevel", e.target.value)}
                        className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                      >
                        <option value="beginner">Débutant</option>
                        <option value="intermediate">Intermédiaire</option>
                        <option value="advanced">Avancé</option>
                        <option value="expert">Expert</option>
                      </select>
                      <p className="text-xs text-gray-600 mt-2">Niveau requis pour participer</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-8 rounded-2xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Âge minimum requis
                      </label>
                      <input
                        type="number"
                        min="12"
                        max="100"
                        value={formData.ageRestriction}
                        onChange={(e) => handleInputChange("ageRestriction", parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                        placeholder="16"
                      />
                      <p className="text-xs text-gray-600 mt-2">Âge minimum pour participer</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Catégorie
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-4 py-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
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
                    <p className="text-xs text-gray-600 mt-2">Catégorie spécifique de l'événement</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-8 rounded-2xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="isPrivate"
                        checked={formData.isPrivate}
                        onChange={(e) => handleInputChange("isPrivate", e.target.checked)}
                        className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPrivate" className="text-sm font-semibold text-gray-900">
                        Événement privé
                      </label>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">L'événement sera visible uniquement par invitation ou réservé aux membres de la même association</p>
                    <p className="text-xs text-emerald-700 mt-1 font-medium">💡 Événements privés : par invitation ou membres de l'association</p>
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

            {/* Prix et options tarifaires */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Prix et options tarifaires</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8 rounded-2xl border border-green-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Prix de base
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">€</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={(formData.price / 100).toFixed(2)}
                      onChange={(e) => {
                        const euros = parseFloat(e.target.value) || 0;
                        handleInputChange("price", Math.round(euros * 100));
                      }}
                      className="w-full pl-8 pr-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      placeholder="25.00"
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Prix principal de l'événement</p>
                </div>
              </div>

              {/* Options tarifaires dynamiques */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <label className="text-xl font-bold text-gray-800">
                    Options tarifaires
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = [...formData.pricingOptions, {
                        name: "Nouvelle option",
                        price: 0,
                        currency: "EUR"
                      }];
                      handleInputChange("pricingOptions", newOptions);
                    }}
                    className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Ajouter une option</span>
                  </button>
                </div>
                
                {formData.pricingOptions.map((option, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-blue-200/50 rounded-2xl p-8 mb-6 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nom de l'option
                        </label>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) => {
                            const newOptions = [...formData.pricingOptions];
                            newOptions[index].name = e.target.value;
                            handleInputChange("pricingOptions", newOptions);
                          }}
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          placeholder="Tarif standard"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Prix
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">€</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={(option.price / 100).toFixed(2)}
                            onChange={(e) => {
                              const euros = parseFloat(e.target.value) || 0;
                              const newOptions = [...formData.pricingOptions];
                              newOptions[index].price = Math.round(euros * 100);
                              handleInputChange("pricingOptions", newOptions);
                            }}
                            className="w-full pl-8 pr-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            placeholder="25.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Devise
                        </label>
                        <select
                          value={option.currency}
                          onChange={(e) => {
                            const newOptions = [...formData.pricingOptions];
                            newOptions[index].currency = e.target.value;
                            handleInputChange("pricingOptions", newOptions);
                          }}
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="EUR">EUR (€)</option>
                          <option value="USD">USD ($)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = formData.pricingOptions.filter((_, i) => i !== index);
                          handleInputChange("pricingOptions", newOptions);
                        }}
                        className="flex items-center space-x-3 px-6 py-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Équipement requis et fourni */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Équipement</h3>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-gray-800">
                    Équipement requis
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newEquipment = [...formData.equipmentRequired, {
                        name: "Nouvel équipement",
                        description: "",
                        required: true,
                        provided: false
                      }];
                      handleInputChange("equipmentRequired", newEquipment);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Ajouter un équipement</span>
                  </button>
                </div>
                
                {formData.equipmentRequired.map((equipment, index) => (
                  <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de l'équipement
                        </label>
                        <input
                          type="text"
                          value={equipment.name}
                          onChange={(e) => {
                            const newEquipment = [...formData.equipmentRequired];
                            newEquipment[index].name = e.target.value;
                            handleInputChange("equipmentRequired", newEquipment);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Réplique d'airsoft"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={equipment.description}
                          onChange={(e) => {
                            const newEquipment = [...formData.equipmentRequired];
                            newEquipment[index].description = e.target.value;
                            handleInputChange("equipmentRequired", newEquipment);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Description de l'équipement"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={equipment.required}
                          onChange={(e) => {
                            const newEquipment = [...formData.equipmentRequired];
                            newEquipment[index].required = e.target.checked;
                            handleInputChange("equipmentRequired", newEquipment);
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Obligatoire</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={equipment.provided}
                          onChange={(e) => {
                            const newEquipment = [...formData.equipmentRequired];
                            newEquipment[index].provided = e.target.checked;
                            handleInputChange("equipmentRequired", newEquipment);
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Fourni par l'organisateur</span>
                      </label>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const newEquipment = formData.equipmentRequired.filter((_, i) => i !== index);
                          handleInputChange("equipmentRequired", newEquipment);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Règles et planning */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Règles et planning</h3>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-gray-800">
                    Règles de l'événement
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newRules = [...formData.rules, ""];
                      handleInputChange("rules", newRules);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Ajouter une règle</span>
                  </button>
                </div>
                
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => {
                          const newRules = [...formData.rules];
                          newRules[index] = e.target.value;
                          handleInputChange("rules", newRules);
                        }}
                        className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        placeholder="Ex: Pas de tir en rafale"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newRules = formData.rules.filter((_, i) => i !== index);
                        handleInputChange("rules", newRules);
                      }}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-gray-800">
                    Planning de l'événement
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newSchedule = [...formData.schedule, {
                        phase: "Nouvelle phase",
                        startTime: "",
                        endTime: ""
                      }];
                      handleInputChange("schedule", newSchedule);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Ajouter une phase</span>
                  </button>
                </div>
                
                {formData.schedule.map((phase, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phase
                        </label>
                        <input
                          type="text"
                          value={phase.phase}
                          onChange={(e) => {
                            const newSchedule = [...formData.schedule];
                            newSchedule[index].phase = e.target.value;
                            handleInputChange("schedule", newSchedule);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Briefing"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Heure de début
                        </label>
                        <input
                          type="time"
                          value={phase.startTime}
                          onChange={(e) => {
                            const newSchedule = [...formData.schedule];
                            newSchedule[index].startTime = e.target.value;
                            handleInputChange("schedule", newSchedule);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Heure de fin
                        </label>
                        <input
                          type="time"
                          value={phase.endTime}
                          onChange={(e) => {
                            const newSchedule = [...formData.schedule];
                            newSchedule[index].endTime = e.target.value;
                            handleInputChange("schedule", newSchedule);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const newSchedule = formData.schedule.filter((_, i) => i !== index);
                          handleInputChange("schedule", newSchedule);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Politique d'annulation et assurance */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Politique d'annulation et assurance</h3>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Pourcentage de remboursement
                    </label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.cancellationPolicy.refundPercentage}
                        onChange={(e) => handleInputChange("cancellationPolicy", {
                          ...formData.cancellationPolicy,
                          refundPercentage: parseInt(e.target.value)
                        })}
                        className="w-full pr-8 px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                        placeholder="80"
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Pourcentage remboursé en cas d'annulation</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Date limite d'annulation
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.cancellationPolicy.deadline}
                      onChange={(e) => handleInputChange("cancellationPolicy", {
                        ...formData.cancellationPolicy,
                        deadline: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                    />
                    <p className="text-xs text-gray-600 mt-2">Date limite pour annuler et être remboursé</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <input
                        type="checkbox"
                        id="insuranceIncluded"
                        checked={formData.insurance.included}
                        onChange={(e) => handleInputChange("insurance", {
                          ...formData.insurance,
                          included: e.target.checked
                        })}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="insuranceIncluded" className="text-sm font-semibold text-gray-900">
                        Assurance incluse
                      </label>
                    </div>
                    <p className="text-xs text-gray-600">L'assurance est-elle incluse dans le prix ?</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Fournisseur d'assurance
                    </label>
                    <input
                      type="text"
                      value={formData.insurance.provider}
                      onChange={(e) => handleInputChange("insurance", {
                        ...formData.insurance,
                        provider: e.target.value
                      })}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Nom du fournisseur"
                    />
                    <p className="text-xs text-gray-600 mt-2">Nom de la compagnie d'assurance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts et réseaux sociaux */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Contacts et réseaux sociaux</h3>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-gray-800">
                    Contacts
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newContacts = [...formData.contacts, {
                        name: "Nouveau contact",
                        email: "",
                        primary: false
                      }];
                      handleInputChange("contacts", newContacts);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Ajouter un contact</span>
                  </button>
                </div>
                
                {formData.contacts.map((contact, index) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={contact.name}
                          onChange={(e) => {
                            const newContacts = [...formData.contacts];
                            newContacts[index].name = e.target.value;
                            handleInputChange("contacts", newContacts);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom du contact"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => {
                            const newContacts = [...formData.contacts];
                            newContacts[index].email = e.target.value;
                            handleInputChange("contacts", newContacts);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={contact.primary}
                          onChange={(e) => {
                            const newContacts = [...formData.contacts];
                            newContacts[index].primary = e.target.checked;
                            handleInputChange("contacts", newContacts);
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Contact principal</span>
                      </label>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const newContacts = formData.contacts.filter((_, i) => i !== index);
                          handleInputChange("contacts", newContacts);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-gray-800">
                    Réseaux sociaux
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newSocial = [...formData.socialMedia, {
                        platform: "Facebook",
                        url: ""
                      }];
                      handleInputChange("socialMedia", newSocial);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Ajouter un réseau</span>
                  </button>
                </div>
                
                {formData.socialMedia.map((social, index) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plateforme
                        </label>
                        <select
                          value={social.platform}
                          onChange={(e) => {
                            const newSocial = [...formData.socialMedia];
                            newSocial[index].platform = e.target.value;
                            handleInputChange("socialMedia", newSocial);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter</option>
                          <option value="youtube">YouTube</option>
                          <option value="discord">Discord</option>
                          <option value="telegram">Telegram</option>
                          <option value="website">Site web</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          value={social.url}
                          onChange={(e) => {
                            const newSocial = [...formData.socialMedia];
                            newSocial[index].url = e.target.value;
                            handleInputChange("socialMedia", newSocial);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const newSocial = formData.socialMedia.filter((_, i) => i !== index);
                          handleInputChange("socialMedia", newSocial);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Métadonnées */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Métadonnées</h3>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-gray-800">
                    Tags
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = [...formData.metadata.tags, ""];
                      handleInputChange("metadata", {
                        ...formData.metadata,
                        tags: newTags
                      });
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Ajouter un tag</span>
                  </button>
                </div>
                
                {formData.metadata.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => {
                          const newTags = [...formData.metadata.tags];
                          newTags[index] = e.target.value;
                          handleInputChange("metadata", {
                            ...formData.metadata,
                            tags: newTags
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                        placeholder="Ex: airsoft, cqb, outdoor"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = formData.metadata.tags.filter((_, i) => i !== index);
                        handleInputChange("metadata", {
                          ...formData.metadata,
                          tags: newTags
                        });
                      }}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-gray-800">
                    Mots-clés
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newKeywords = [...formData.metadata.keywords, ""];
                      handleInputChange("metadata", {
                        ...formData.metadata,
                        keywords: newKeywords
                      });
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Ajouter un mot-clé</span>
                  </button>
                </div>
                
                {formData.metadata.keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => {
                          const newKeywords = [...formData.metadata.keywords];
                          newKeywords[index] = e.target.value;
                          handleInputChange("metadata", {
                            ...formData.metadata,
                            keywords: newKeywords
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                        placeholder="Ex: tactical, military, simulation"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newKeywords = formData.metadata.keywords.filter((_, i) => i !== index);
                        handleInputChange("metadata", {
                          ...formData.metadata,
                          keywords: newKeywords
                        });
                      }}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-end space-x-6 pt-10 border-t border-gray-200 bg-gradient-to-br from-gray-50 via-blue-50/50 to-purple-50/50 p-8 rounded-2xl shadow-lg">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center space-x-3 px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:ring-offset-2 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="font-semibold">Annuler</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-3 px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-semibold">Création en cours...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-semibold">Créer l'événement</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage; 