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
    <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 ${gradient}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-xl shadow-lg ${color}`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{value}</p>
          <p className="text-xs text-green-600">+8% ce mois</p>
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }: { event: any }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            event.status === 'upcoming' ? 'bg-blue-500' :
            event.status === 'completed' ? 'bg-green-500' :
            'bg-gray-500'
          }`}>
            <span className="text-white text-lg">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{event.title}</h3>
            <p className="text-sm text-gray-600">Organisateur: {event.organizer}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
          event.status === 'upcoming' ? 'bg-blue-100 text-blue-800 border-blue-200' :
          event.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
          'bg-gray-100 text-gray-800 border-gray-200'
        }`}>
          {event.status === 'upcoming' ? 'À venir' : event.status === 'completed' ? 'Terminé' : 'Annulé'}
        </span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">Date: {event.date}</p>
        <p className="text-sm font-semibold text-gray-900">{event.price}€</p>
      </div>
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

  const ActivityItem = ({ activity }: { activity: any }) => (
    <div className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0">
        <span className="text-lg">
          {activity.type === 'event_registration' && '🎯'}
          {activity.type === 'event_completed' && '✅'}
          {activity.type === 'profile_update' && '👤'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.message}</p>
        <p className="text-xs text-gray-500">{activity.date}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout userRole="player">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Dashboard Joueur</h1>
          <p className="text-green-100 text-lg">Gérez vos événements et votre profil</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Événements totaux"
            value={stats.totalEvents}
            icon="🎯"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            gradient="from-blue-50 to-blue-100"
          />
          <StatCard
            title="Événements à venir"
            value={stats.upcomingEvents}
            icon="📅"
            color="bg-gradient-to-br from-green-500 to-green-600"
            gradient="from-green-50 to-green-100"
          />
          <StatCard
            title="Événements terminés"
            value={stats.completedEvents}
            icon="✅"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            gradient="from-purple-50 to-purple-100"
          />
          <StatCard
            title="Total dépensé (€)"
            value={stats.totalSpent.toLocaleString()}
            icon="💰"
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            gradient="from-emerald-50 to-emerald-100"
          />
          <StatCard
            title="Catégorie préférée"
            value={stats.favoriteCategory}
            icon="⭐"
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            gradient="from-yellow-50 to-yellow-100"
          />
        </div>

        {/* Events & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Events */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">🎯</span>
                Mes événements
              </h2>
              <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-md">
                Voir tous les événements
              </button>
            </div>
            <div className="space-y-6">
              {myEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">📊</span>
                Activité récente
              </h2>
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                {recentActivity.length} activités
              </span>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>


      </div>
    </DashboardLayout>
  );
};

export default PlayerDashboard; 