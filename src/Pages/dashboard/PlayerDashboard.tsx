import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardProfileSummary from '../../Components/Dashboard/DashboardProfileSummary';
import userStatsService from '../../services/userStatsService';

const PlayerDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalSpent: 0,
    favoriteCategory: ''
  });

  const [userStats, setUserStats] = useState({
    eventsPlayed: 0,
    winRate: 0,
    level: "Débutant",
    totalPoints: 0,
    upcomingEvents: 0,
    completedEvents: 0
  });

  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    setStats({
      totalEvents: 15,
      upcomingEvents: 3,
      completedEvents: 12,
      totalSpent: 450,
      favoriteCategory: 'CQB'
    });

    // Utiliser les données du service
    const mockStats = userStatsService.getMockUserStats();
    setUserStats({
      eventsPlayed: mockStats.eventsPlayed,
      winRate: mockStats.winRate,
      level: mockStats.level,
      totalPoints: mockStats.totalPoints,
      upcomingEvents: mockStats.upcomingEvents,
      completedEvents: mockStats.completedEvents
    });

    setMyEvents([
      { 
        id: 1, 
        title: 'CQB Perfectionnement', 
        date: '2025-07-15', 
        status: 'upcoming',
        price: 30,
        organizer: 'John Doe'
      },
      { 
        id: 2, 
        title: 'Tournoi Speedsoft', 
        date: '2025-07-20', 
        status: 'upcoming',
        price: 25,
        organizer: 'Jane Smith'
      },
      { 
        id: 3, 
        title: 'Entraînement Tactical', 
        date: '2025-06-30', 
        status: 'completed',
        price: 35,
        organizer: 'Mike Johnson'
      }
    ]);

    setRecentActivity([
      { id: 1, type: 'event_registration', message: 'Inscrit à "CQB Perfectionnement"', date: '2025-07-07' },
      { id: 2, type: 'event_completed', message: 'A participé à "Entraînement Tactical"', date: '2025-06-30' },
      { id: 3, type: 'profile_update', message: 'Mis à jour le profil', date: '2025-06-25' },
      { id: 4, type: 'event_registration', message: 'Inscrit à "Tournoi Speedsoft"', date: '2025-06-20' }
    ]);
  }, []);

  const StatCard = ({ title, value, icon, color, gradient }: { title: string; value: string | number; icon: string; color: string; gradient: string }) => (
    <div className={`bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-soft border border-white/20 hover:shadow-medium transition-all duration-300 hover:transform hover:scale-105 ${gradient}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-2 rounded-lg shadow-soft ${color}`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
        <div className="ml-3">
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{value}</p>
          <p className="text-xs text-green-600">+8% ce mois</p>
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }: { event: any }) => (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-soft border border-white/20 hover:shadow-medium transition-all duration-200 hover:transform hover:scale-105">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${
            event.status === 'upcoming' ? 'bg-blue-500' :
            event.status === 'completed' ? 'bg-green-500' :
            'bg-gray-500'
          }`}>
            <span className="text-white text-lg">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">{event.title}</h3>
            <p className="text-xs text-gray-600">Organisateur: {event.organizer}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
          event.status === 'upcoming' ? 'bg-blue-100 text-blue-800 border-blue-200' :
          event.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
          'bg-gray-100 text-gray-800 border-gray-200'
        }`}>
          {event.status === 'upcoming' ? 'À venir' : event.status === 'completed' ? 'Terminé' : 'Annulé'}
        </span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-600">Date: {event.date}</p>
        <p className="text-sm font-semibold text-gray-900">{event.price}€</p>
      </div>
      <div className="flex space-x-2">
        <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
          Voir détails
        </button>
        {event.status === 'upcoming' && (
          <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200">
            Se désinscrire
          </button>
        )}
        {event.status === 'completed' && (
          <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200">
            Laisser un avis
          </button>
        )}
      </div>
    </div>
  );

  const ActivityItem = ({ activity }: { activity: any }) => (
    <div className="flex items-center space-x-2 py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0">
        <span className="text-base">
          {activity.type === 'event_registration' && '🎯'}
          {activity.type === 'event_completed' && '✅'}
          {activity.type === 'profile_update' && '👤'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-900">{activity.message}</p>
        <p className="text-xs text-gray-500">{activity.date}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout userRole="player">
      <div className="space-y-4 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-xl shadow-strong p-5 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Dashboard Joueur</h1>
          <p className="text-green-100 text-sm">Gérez vos événements et votre profil</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Profil actif</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm">{stats.upcomingEvents} événements à venir</span>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <DashboardProfileSummary stats={userStats} className="mb-6" />

        {/* Quick Stats - Player Focus */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            title="Prochaines parties"
            value={stats.upcomingEvents}
            icon="📅"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            gradient="from-blue-50 to-blue-100"
          />
          <StatCard
            title="Parties jouées"
            value={stats.completedEvents}
            icon="✅"
            color="bg-gradient-to-br from-green-500 to-green-600"
            gradient="from-green-50 to-green-100"
          />
          <StatCard
            title="Budget dépensé"
            value={`${stats.totalSpent}€`}
            icon="💰"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            gradient="from-purple-50 to-purple-100"
          />
          <StatCard
            title="Style favori"
            value={stats.favoriteCategory}
            icon="⭐"
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            gradient="from-yellow-50 to-yellow-100"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* My Upcoming Events - Main Focus */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-soft p-5 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="mr-2">🎯</span>
                Mes prochaines parties
              </h2>
              <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                Découvrir plus
              </button>
            </div>
            <div className="space-y-3">
              {myEvents.filter(e => e.status === 'upcoming').length > 0 ? (
                myEvents.filter(e => e.status === 'upcoming').map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Aucune partie prévue</p>
                  <button className="mt-3 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Explorer les événements
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Activity & Quick Actions */}
          <div className="space-y-4">
            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft p-4 border border-white/20">
              <h3 className="text-sm font-bold text-gray-900 flex items-center mb-3">
                <span className="mr-2">📊</span>
                Activité récente
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentActivity.slice(0, 5).map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-soft p-4 border border-primary-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Actions rapides</h3>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 text-xs font-medium bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center">
                  <span className="mr-2">🔍</span>
                  Rechercher des événements
                </button>
                <button className="w-full px-3 py-2 text-xs font-medium bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center">
                  <span className="mr-2">👤</span>
                  Modifier mon profil
                </button>
                <button className="w-full px-3 py-2 text-xs font-medium bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center">
                  <span className="mr-2">📜</span>
                  Historique des parties
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </DashboardLayout>
  );
};

export default PlayerDashboard; 