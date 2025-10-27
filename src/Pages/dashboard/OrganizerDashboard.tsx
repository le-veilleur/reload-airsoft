import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

const OrganizerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    upcomingEvents: 0
  });

  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [recentParticipants, setRecentParticipants] = useState<any[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    setStats({
      totalEvents: 12,
      activeEvents: 3,
      totalParticipants: 156,
      totalRevenue: 3200,
      upcomingEvents: 2
    });

    setMyEvents([
      { 
        id: 1, 
        title: 'CQB Perfectionnement', 
        date: '2025-07-15', 
        participants: 24, 
        maxParticipants: 30,
        status: 'active',
        revenue: 720
      },
      { 
        id: 2, 
        title: 'Tournoi Speedsoft', 
        date: '2025-07-20', 
        participants: 16, 
        maxParticipants: 16,
        status: 'full',
        revenue: 480
      },
      { 
        id: 3, 
        title: 'Entraînement Tactical', 
        date: '2025-07-25', 
        participants: 8, 
        maxParticipants: 20,
        status: 'upcoming',
        revenue: 240
      }
    ]);

    setRecentParticipants([
      { id: 1, name: 'John Doe', email: 'john@email.com', event: 'CQB Perfectionnement', date: '2025-07-07' },
      { id: 2, name: 'Jane Smith', email: 'jane@email.com', event: 'Tournoi Speedsoft', date: '2025-07-06' },
      { id: 3, name: 'Mike Johnson', email: 'mike@email.com', event: 'CQB Perfectionnement', date: '2025-07-05' }
    ]);
  }, []);

  const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
    <div className={`bg-white p-4 rounded-xl shadow-soft border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="ml-3">
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }: { event: any }) => (
    <div className="bg-white p-3 rounded-xl shadow-soft border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm text-gray-900">{event.title}</h3>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
          event.status === 'active' ? 'bg-green-100 text-green-800' :
          event.status === 'full' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {event.status === 'active' ? 'Actif' : event.status === 'full' ? 'Complet' : 'À venir'}
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-1.5">Date: {event.date}</p>
      <p className="text-xs text-gray-600 mb-1.5">
        Participants: {event.participants}/{event.maxParticipants}
      </p>
      <p className="text-xs text-gray-600 mb-2">Revenus: {event.revenue}€</p>
      <div className="flex space-x-2">
        <button className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200">
          Gérer
        </button>
        <button className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-lg hover:bg-green-200">
          Voir participants
        </button>
        <button 
          onClick={() => navigate(`/events/edit/${event.id}`)}
          className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
        >
          Modifier
        </button>
      </div>
    </div>
  );

  const ParticipantCard = ({ participant }: { participant: any }) => (
    <div className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">
            {participant.name.split(' ').map((n: string) => n[0]).join('')}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{participant.name}</p>
        <p className="text-xs text-gray-500">{participant.email}</p>
        <p className="text-xs text-gray-500">Événement: {participant.event}</p>
      </div>
      <div className="text-xs text-gray-500">{participant.date}</div>
    </div>
  );

  return (
    <DashboardLayout userRole="organizer">
      <div className="space-y-4 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 rounded-xl shadow-strong p-5 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Dashboard Organisateur</h1>
          <p className="text-orange-100 text-sm">Gérez vos événements et participants</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
              <span className="text-xs">{stats.activeEvents} événement(s) actif(s)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full"></div>
              <span className="text-xs">{stats.totalParticipants} participants au total</span>
            </div>
          </div>
        </div>

        {/* Organizer Stats - Focus on Events Management */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard
            title="Actifs"
            value={stats.activeEvents}
            icon="🔥"
            color="border-green-500"
          />
          <StatCard
            title="À venir"
            value={stats.upcomingEvents}
            icon="📅"
            color="border-blue-500"
          />
          <StatCard
            title="Participants"
            value={stats.totalParticipants}
            icon="👥"
            color="border-purple-500"
          />
          <StatCard
            title="Revenus"
            value={`${stats.totalRevenue}€`}
            icon="💰"
            color="border-emerald-500"
          />
          <StatCard
            title="Total événements"
            value={stats.totalEvents}
            icon="🎯"
            color="border-yellow-500"
          />
        </div>

        {/* Main Content - Event Management Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* My Events - Main Focus */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-soft p-5 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="mr-2">🎯</span>
                Mes événements en cours
              </h2>
              <button 
                onClick={() => navigate('/events/create')}
                className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
              >
                + Créer
              </button>
            </div>
            <div className="space-y-3">
              {myEvents.length > 0 ? (
                myEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Aucun événement</p>
                  <button 
                    onClick={() => navigate('/events/create')}
                    className="mt-3 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Créer mon premier événement
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Participants & Actions */}
          <div className="space-y-4">
            {/* Recent Participants */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center">
                  <span className="mr-2">👥</span>
                  Inscriptions récentes
                </h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {recentParticipants.length}
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentParticipants.map((participant) => (
                  <ParticipantCard key={participant.id} participant={participant} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-soft p-4 border border-orange-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Actions rapides</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/events/create')}
                  className="w-full px-3 py-2 text-xs font-medium bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center"
                >
                  <span className="mr-2">➕</span>
                  Créer un événement
                </button>
                <button className="w-full px-3 py-2 text-xs font-medium bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center">
                  <span className="mr-2">👥</span>
                  Gérer les participants
                </button>
                <button className="w-full px-3 py-2 text-xs font-medium bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center">
                  <span className="mr-2">💰</span>
                  Voir les finances
                </button>
                <button className="w-full px-3 py-2 text-xs font-medium bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center">
                  <span className="mr-2">📊</span>
                  Statistiques
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard; 