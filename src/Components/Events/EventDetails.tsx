// src/Components/Events/EventDetails.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getEventById, clearEventCache } from "../../Services/eventService";
import { bookEvent, cancelBooking, getBookingStatus } from "../../Services/bookingService";
import EventMap from "../Maps/EventMap";
import SEOHead from "../SEO/SEOHead";
import NavigationHelper from "./NavigationHelper";
import EventHeader from "./EventHeader";
import EventTabs from "./EventTabs";
import EventOverviewTab from "./EventOverviewTab";
import EventBookingWidget from "./EventBookingWidget";
import EventBookingModal from "./EventBookingModal";
import ShareEvent from "./ShareEvent";
import { DetailedEvent, BookingRequest } from "../../Interfaces/types";
import { useAuth } from "../../Contexts/AuthContext";
import { 
  extractEventIdFromUrl, 
  getCanonicalEventUrl, 
  generateEventSEOMetadata 
} from "../../utils/urlUtils";
import { extractTimeFromDate } from "../../utils/dateUtils";

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string; slug?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<DetailedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "scenario" | "participants" | "equipment">("overview");
  const [seoMetadata, setSeoMetadata] = useState<any>(null);
  
  // État pour le formulaire de réservation
  const [bookingForm, setBookingForm] = useState({
    firstname: "",
    lastname: "",
    pseudonyme: "",
    association: "",
    role: "",
    carpooling: false,
    team_preference: "",
    special_requirements: "",
    emergency_contact: {
      name: "",
      phone: "",
      relationship: ""
    }
  });

  useEffect(() => {
    const fetchEventAndBookingStatus = async () => {
      const eventId = id || extractEventIdFromUrl(location.pathname);
      
      if (!eventId) {
        setError("ID de l'événement manquant");
        setLoading(false);
        return;
      }

      try {
        // Vider le cache avant de récupérer l'événement
        clearEventCache();
        
        // Forcer le rafraîchissement pour éviter le cache
        const response = await getEventById(eventId, true);
        const eventData = response.event || response;
        
        // Log pour débugger l'ID de l'événement récupéré
        console.log("🔍 Event ID demandé:", eventId);
        console.log("🔍 Event ID reçu:", eventData.id);
        console.log("🔍 Adresse reçue:", eventData.location?.address);
 
        // Adaptation des données pour correspondre à la structure backend
        const adaptedEvent: DetailedEvent = {
          id: eventData.id || eventId,
          title: eventData.title || "Événement sans titre",
          description: eventData.description || "Aucune description disponible",
          scenario: eventData.scenario,
          start_date: eventData.start_date || eventData.date,
          end_date: eventData.end_date || eventData.date,
          start_time: extractTimeFromDate(eventData.start_date || "") || "Non défini",
          end_time: extractTimeFromDate(eventData.end_date || "") || "Non défini",
          location: eventData.location || { address: "Non défini", latitude: 0, longitude: 0 },
          price: typeof eventData.price === 'string' ? parseInt(eventData.price) || 0 : eventData.price || 0,
          max_participants: eventData.max_participants || 0,
          min_participants: eventData.min_participants,
          status: eventData.status || "published",
          difficulty_level: eventData.difficulty_level || "beginner",
          age_restriction: eventData.age_restriction,
          equipment_required: eventData.equipment_required || "Non spécifié",
          equipment_provided: eventData.equipment_provided || [],
          equipment_rentals: eventData.equipment_rentals || [],
          organizer_id: eventData.organizer_id || "",
          organizer_name: eventData.organizer_name,
          organizer_contact: eventData.organizer_contact,
          categories: eventData.categories || [],
          teams: eventData.teams || [],
          participants: eventData.participants || [],
          images: eventData.images?.map((img: any) => ({
            id: img.id || img.ID,
            uploadedUrl: img.uploadedUrl || img.url,
            altText: img.altText || img.alt_text,
            isPrimary: img.isPrimary || img.is_primary || false
          })) || [],
          stats: {
            confirmed_participants: eventData.participants?.length || 0,
            pending_participants: 0,
            available_spots: Math.max(0, (eventData.max_participants || 0) - (eventData.participants?.length || 0)),
            revenue: 0,
            average_rating: eventData.average_rating
          },
          booking_deadline: eventData.booking_deadline,
          cancellation_policy: eventData.cancellation_policy,
          safety_instructions: eventData.safety_instructions || [],
          meeting_point: eventData.meeting_point,
          parking_info: eventData.parking_info,
          amenities: eventData.amenities || [],
          weather_requirements: eventData.weather_requirements,
          created_at: eventData.created_at || "",
          updated_at: eventData.updated_at || ""
        };
        
        setEvent(adaptedEvent);
        
        // Générer les métadonnées SEO
        const metadata = generateEventSEOMetadata({
          title: adaptedEvent.title,
          description: adaptedEvent.description,
          location: adaptedEvent.location,
          start_date: adaptedEvent.start_date,
          price: adaptedEvent.price || 0,
          images: adaptedEvent.images
            .filter(img => !!img.uploadedUrl)
            .map(img => ({ url: img.uploadedUrl! }))
        });
        setSeoMetadata(metadata);
        
        // Vérifier si une redirection canonique est nécessaire
        const canonicalUrl = getCanonicalEventUrl(location.pathname, eventId, adaptedEvent.title);
        if (canonicalUrl) {
          window.history.replaceState(null, '', canonicalUrl);
        }

        // Vérification du statut de réservation si l'utilisateur est connecté
        if (user) {
          try {
            const status = await getBookingStatus(eventId);
            setBookingStatus(status.status);
          } catch (err) {
            setBookingStatus(null);
          }
        }
        
      } catch (err) {
        setError("Échec de la récupération des détails de l'événement");
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndBookingStatus();
  }, [id, user, location.pathname]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!event || !id) return;

    setIsBooking(true);
    try {
      const bookingData: BookingRequest = {
        event_id: id,
        user_id: user.pseudonyme,
        firstname: bookingForm.firstname,
        lastname: bookingForm.lastname,
        pseudonyme: bookingForm.pseudonyme,
        association: bookingForm.association || undefined,
        role: bookingForm.role || undefined,
        carpooling: bookingForm.carpooling,
        team_preference: bookingForm.team_preference || undefined,
        special_requirements: bookingForm.special_requirements || undefined,
        emergency_contact: bookingForm.emergency_contact.name ? bookingForm.emergency_contact : undefined
      };

      await bookEvent(bookingData);
      setBookingStatus("confirmed");
      setShowBookingForm(false);
      
      // Rafraîchir les données de l'événement
      const updatedResponse = await getEventById(id);
      const updatedEventData = updatedResponse.event || updatedResponse;
      setEvent(prev => prev ? {
        ...prev,
        participants: updatedEventData.participants || [],
        stats: {
          ...prev.stats,
          confirmed_participants: updatedEventData.participants?.length || 0,
          available_spots: Math.max(0, prev.max_participants - (updatedEventData.participants?.length || 0))
        }
      } : null);
      
    } catch (err) {
      alert("Erreur lors de la réservation. Veuillez réessayer.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!id) return;
    
    setIsBooking(true);
    try {
      await cancelBooking(id);
      setBookingStatus(null);
      
      // Rafraîchir les données
      const updatedResponse = await getEventById(id);
      const updatedEventData = updatedResponse.event || updatedResponse;
      setEvent(prev => prev ? {
        ...prev,
        participants: updatedEventData.participants || [],
        stats: {
          ...prev.stats,
          confirmed_participants: updatedEventData.participants?.length || 0,
          available_spots: Math.max(0, prev.max_participants - (updatedEventData.participants?.length || 0))
        }
      } : null);
      
    } catch (err) {
      alert("Erreur lors de l'annulation. Veuillez réessayer.");
    } finally {
      setIsBooking(false);
    }
  };

  const getDifficultyColor = (level: string | undefined) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-orange-100 text-orange-800";
      case "expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: number | string) => {
    const statusStr = typeof status === 'number' 
      ? ['pending', 'open', 'full', 'cancelled', 'ended'][status] || 'unknown'
      : status;
    
    switch (statusStr) {
      case "open":
      case "published": return "bg-green-100 text-green-800";
      case "pending":
      case "draft": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "ended":
      case "completed": return "bg-blue-100 text-blue-800";
      case "full": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">🔄 Chargement de l'événement...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/events")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Événement non trouvé</h3>
          <p className="text-gray-600 mb-6">L'événement avec l'ID {id} n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => navigate("/events")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux événements
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Métadonnées SEO */}
      {seoMetadata && (
        <SEOHead
          title={seoMetadata.title}
          description={seoMetadata.description}
          keywords={seoMetadata.keywords}
          canonical={seoMetadata.canonical}
          openGraph={seoMetadata.openGraph}
          structured={seoMetadata.structured}
        />
      )}
      
      <div className="bg-gray-50">
        {/* Header avec image de fond */}
        <EventHeader event={event} />

        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-8">
              {/* Navigation par onglets */}
              <div className="bg-white rounded-lg shadow-sm">
                <EventTabs 
                  activeTab={activeTab} 
                  onTabChange={(tab: string) => setActiveTab(tab as "overview" | "scenario" | "participants" | "equipment")} 
                />

                <div className="p-6">
                  {/* Contenu de l'onglet Vue d'ensemble */}
                  {activeTab === "overview" && (
                    <EventOverviewTab 
                      event={event} 
                      getDifficultyColor={getDifficultyColor}
                      getStatusColor={getStatusColor}
                    />
                  )}

                  {/* Contenu de l'onglet Scénario */}
                  {activeTab === "scenario" && (
                    <div id="section-scenario" className="space-y-6">
                      {event.scenario ? (
                        <>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.scenario.title}</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">{event.scenario.description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {event.scenario.objectives && event.scenario.objectives.length > 0 && (
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Objectifs</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                  {event.scenario.objectives.map((objective, index) => (
                                    <li key={index}>{objective}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {event.scenario.rules && event.scenario.rules.length > 0 && (
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">📜 Règles</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                  {event.scenario.rules.map((rule, index) => (
                                    <li key={index}>{rule}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span className="mr-2">⏱️</span>
                              Durée: {Math.floor(event.scenario.duration_minutes / 60)}h{event.scenario.duration_minutes % 60 > 0 ? ` ${event.scenario.duration_minutes % 60}min` : ''}
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2">📊</span>
                              Difficulté: {event.scenario.difficulty_level}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <div className="text-4xl mb-4">🎭</div>
                          <p>Aucun scénario détaillé n'est disponible pour cet événement.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contenu de l'onglet Participants */}
                  {activeTab === "participants" && (
                    <div id="section-participants" className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Participants ({event.stats.confirmed_participants}/{event.max_participants})
                        </h2>
                        <div className="text-sm text-gray-600">
                          {event.stats.available_spots} places restantes
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (event.stats.confirmed_participants / event.max_participants) * 100)}%`
                          }}
                        ></div>
                      </div>

                      {/* Liste des participants */}
                      {event.participants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {event.participants.map((participant) => (
                            <div key={participant.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                                {participant.avatar_url ? (
                                  <img
                                    src={participant.avatar_url}
                                    alt={participant.name || "Participant"}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  (participant.name || "?").charAt(0).toUpperCase()
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{participant.name || "Participant"}</div>
                                {participant.username && (
                                  <div className="text-sm text-gray-600">@{participant.username}</div>
                                )}
                                {participant.role && participant.role !== "participant" && (
                                  <div className="text-xs text-blue-600 font-medium">{participant.role}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <div className="text-4xl mb-4">👥</div>
                          <p>Aucun participant inscrit pour le moment.</p>
                          <p className="text-sm mt-2">Soyez le premier à vous inscrire !</p>
                        </div>
                      )}

                      {/* Équipes */}
                      {event.teams && event.teams.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚔️ Équipes</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {event.teams.map((team) => (
                              <div key={team.ID} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium text-gray-900">{team.name}</h4>
                                  {team.color && (
                                    <div
                                      className="w-4 h-4 rounded-full"
                                      style={{ backgroundColor: team.color }}
                                    ></div>
                                  )}
                                </div>
                                {team.max_players && (
                                  <div className="text-sm text-gray-600">
                                    {team.current_players || 0}/{team.max_players} joueurs
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contenu de l'onglet Équipement */}
                  {activeTab === "equipment" && (
                    <div id="section-equipment" className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900">🎯 Équipement</h2>

                      {/* Équipement fourni */}
                      {event.equipment_provided && event.equipment_provided.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Équipement fourni</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {event.equipment_provided.map((equipment) => (
                              <div key={equipment.ID} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="font-medium text-gray-900">{equipment.name}</h4>
                                {equipment.description && (
                                  <p className="text-sm text-gray-600 mt-1">{equipment.description}</p>
                                )}
                                <div className="text-xs text-green-600 mt-2 font-medium">
                                  Inclus dans le prix
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Équipement en location */}
                      {event.equipment_rentals && event.equipment_rentals.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Équipement en location</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {event.equipment_rentals.map((equipment) => (
                              <div key={equipment.ID} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{equipment.name}</h4>
                                    {equipment.description && (
                                      <p className="text-sm text-gray-600 mt-1">{equipment.description}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    {equipment.rental_price && (
                                      <div className="text-lg font-bold text-gray-900">{equipment.rental_price}€</div>
                                    )}
                                    {equipment.available_quantity && (
                                      <div className="text-xs text-gray-600">{equipment.available_quantity} disponibles</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Équipement personnel requis */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎒 Équipement personnel</h3>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-gray-700">{event.equipment_required}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Galerie d'images */}
              {event.images.length > 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">📸 Galerie</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.images.slice(1).map((image) => (
                      <div key={image.id} className="aspect-square overflow-hidden rounded-lg">
                        <img
                          src={image.uploadedUrl}
                          alt={image.altText || `${event.title} ${image.id}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              {/* Widget de réservation */}
              <EventBookingWidget
                event={event}
                bookingStatus={bookingStatus}
                isBooking={isBooking}
                onBookingClick={() => setShowBookingForm(true)}
                onCancelBooking={handleCancelBooking}
                getDifficultyColor={getDifficultyColor}
                ShareEventComponent={
                  <ShareEvent
                    eventTitle={event.title}
                    eventUrl={location.pathname}
                    eventDescription={event.description}
                  />
                }
              />

              {/* Carte */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">📍 Localisation</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.location.address}</p>
                  {event.location.city && (
                    <p className="text-sm text-gray-600">{event.location.city}, {event.location.country}</p>
                  )}
                </div>
                
                <div className="h-64">
                  {event.location.latitude !== undefined && event.location.longitude !== undefined && 
                   event.location.latitude !== 0 && event.location.longitude !== 0 ? (
                    <EventMap
                      latitude={event.location.latitude}
                      longitude={event.location.longitude}
                      locationName={event.location.address}
                      height="100%"
                      zoom={15}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-100 text-gray-500">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🗺️</div>
                        <p className="text-sm">Carte non disponible</p>
                        <p className="text-xs">Coordonnées GPS manquantes</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Organisateur */}
              {event.organizer_name && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">👨‍💼 Organisateur</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {event.organizer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{event.organizer_name}</div>
                      {event.organizer_contact && (
                        <div className="text-sm text-gray-600">{event.organizer_contact}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Politique d'annulation */}
              {event.cancellation_policy && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📜 Politique d'annulation</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{event.cancellation_policy}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de formulaire de réservation */}
        {showBookingForm && (
          <EventBookingModal
            event={event}
            showBookingForm={showBookingForm}
            bookingForm={{
              firstname: bookingForm.firstname,
              lastname: bookingForm.lastname,
              pseudonyme: bookingForm.pseudonyme,
              association: bookingForm.association,
              role: bookingForm.role,
              carpooling: bookingForm.carpooling,
              team_preference: bookingForm.team_preference,
              special_requirements: bookingForm.special_requirements,
              emergency_contact: bookingForm.emergency_contact
            }}
            isBooking={isBooking}
            onClose={() => setShowBookingForm(false)}
            onSubmit={(e) => {
              e.preventDefault();
              handleBooking();
            }}
            onFormChange={(updates) => setBookingForm(prev => ({ 
              ...prev, 
              firstname: updates.firstname || prev.firstname,
              lastname: updates.lastname || prev.lastname,
              pseudonyme: updates.pseudonyme || prev.pseudonyme,
              association: updates.association || prev.association,
              role: updates.role || prev.role,
              carpooling: updates.carpooling ?? prev.carpooling,
              team_preference: updates.team_preference || prev.team_preference,
              special_requirements: updates.special_requirements || prev.special_requirements,
              emergency_contact: updates.emergency_contact || prev.emergency_contact
            }))}
          />
        )}
       
        {/* Navigation et bouton retour en haut */}
        <NavigationHelper activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
};

export default EventDetails;
