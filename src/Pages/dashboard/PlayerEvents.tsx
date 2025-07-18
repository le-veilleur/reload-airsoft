import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const PlayerEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled

  useEffect(() => {
    // Simuler le chargement des données
    setEvents([
      { 
        id: 1, 
        title: 'CQB Perfectionnement', 
        date: '2025-07-15', 
        time: '14:00',
        status: 'upcoming',
        price: 30,
        organizer: 'John Doe',
        location: 'Terrain CQB Pro',
        description: 'Session d\'entraînement intensif en CQB avec instructeurs expérimentés.',
        participants: 24,
        maxParticipants: 30
      },
      { 
        id: 2, 
        title: 'Tournoi Speedsoft', 
        date: '2025-07-20', 
        time: '09:00',
        status: 'upcoming',
        price: 25,
        organizer: 'Jane Smith',
        location: 'Speedsoft Arena',
        description: 'Tournoi compétitif de speedsoft avec classement et récompenses.',
        participants: 16,
        maxParticipants: 20
      },
      { 
        id: 3, 
        title: 'Entraînement Tactical', 
        date: '2025-06-30', 
        time: '10:00',
        status: 'completed',
        price: 35,
        organizer: 'Mike Johnson',
        location: 'Base Tactical',
        description: 'Formation aux techniques tactiques avancées en équipe.',
        participants: 18,
        maxParticipants: 20
      },
      { 
        id: 4, 
        title: 'Milsim Weekend', 
        date: '2025-06-15', 
        time: '08:00',
        status: 'completed',
        price: 50,
        organizer: 'Tactical Team',
        location: 'Forêt de Compiègne',
        description: 'Weekend complet de simulation militaire avec scénarios réalistes.',
        participants: 45,
        maxParticipants: 50
      }
    ]);
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const EventCard = ({ event }: { event: any }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getStatusColor(event.status)}`}>
            <span className="text-white text-lg">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
            <p className="text-sm text-gray-600">Organisateur: {event.organizer}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
          event.status === 'upcoming' ? 'bg-blue-100 text-blue-800 border-blue-200' :
          event.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
          'bg-red-100 text-red-800 border-red-200'
        }`}>
          {getStatusText(event.status)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Date & Heure</p>
          <p className="text-sm font-semibold text-gray-900">{event.date} à {event.time}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Lieu</p>
          <p className="text-sm font-semibold text-gray-900">{event.location}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Prix</p>
          <p className="text-sm font-semibold text-gray-900">{event.price}€</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Participants</p>
          <p className="text-sm font-semibold text-gray-900">{event.participants}/{event.maxParticipants}</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{event.description}</p>
      
      <div className="flex space-x-3">
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-md">
          Voir détails
        </button>
        {event.status === 'upcoming' && (
          <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-md">
            Se désinscrire
          </button>
        )}
        {event.status === 'completed' && (
          <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:shadow-md">
            Laisser un avis
          </button>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout userRole="player">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Mes Événements</h1>
          <p className="text-blue-100 text-lg">Gérez vos inscriptions et suivez vos événements</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">{events.filter(e => e.status === 'upcoming').length} événements à venir</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm">{events.filter(e => e.status === 'completed').length} événements terminés</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({events.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filter === 'upcoming'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              À venir ({events.filter(e => e.status === 'upcoming').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Terminés ({events.filter(e => e.status === 'completed').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filter === 'cancelled'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Annulés ({events.filter(e => e.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun événement trouvé</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Vous n\'êtes inscrit à aucun événement pour le moment.'
                  : `Vous n'avez aucun événement ${filter === 'upcoming' ? 'à venir' : filter === 'completed' ? 'terminé' : 'annulé'}.`
                }
              </p>
              <button className="px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-md">
                Découvrir des événements
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlayerEvents; 