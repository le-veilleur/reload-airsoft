import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    pendingModeration: 0,
    activeEvents: 0,
    reportedIssues: 0
  });

  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [reportedUsers, setReportedUsers] = useState<any[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    setStats({
      totalUsers: 1247,
      totalEvents: 89,
      pendingModeration: 5,
      activeEvents: 15,
      reportedIssues: 3
    });

    setPendingEvents([
      { id: 1, title: 'CQB Perfectionnement', organizer: 'John Doe', date: '2025-07-15', status: 'pending' },
      { id: 2, title: 'Tournoi Speedsoft', organizer: 'Jane Smith', date: '2025-07-20', status: 'pending' },
      { id: 3, title: 'Entraînement Tactical', organizer: 'Mike Johnson', date: '2025-07-25', status: 'pending' }
    ]);

    setReportedUsers([
      { id: 1, username: 'user123', reason: 'Comportement inapproprié', date: '2025-07-07', status: 'pending' },
      { id: 2, username: 'player456', reason: 'Spam', date: '2025-07-06', status: 'investigating' }
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
          <p className="text-xs text-green-600">+12% ce mois</p>
        </div>
      </div>
    </div>
  );

  const PendingEventCard = ({ event }: { event: any }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-500 rounded-lg">
            <span className="text-white text-lg">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{event.title}</h3>
            <p className="text-sm text-gray-600">Organisateur: {event.organizer}</p>
          </div>
        </div>
        <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
          En attente
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">Date: {event.date}</p>
      <div className="flex space-x-3">
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:shadow-md">
          Approuver
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-md">
          Rejeter
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-md">
          Voir détails
        </button>
      </div>
    </div>
  );

  const ReportedUserCard = ({ user }: { user: any }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500 rounded-lg">
            <span className="text-white text-lg">👤</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.username}</h3>
            <p className="text-sm text-gray-600">Raison: {user.reason}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-blue-100 text-blue-800 border-blue-200'
        }`}>
          {user.status === 'pending' ? 'En attente' : 'En cours'}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">Date: {user.date}</p>
      <div className="flex space-x-3">
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-md">
          Suspendre
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:shadow-md">
          Ignorer
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-md">
          Enquêter
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Dashboard Admin</h1>
          <p className="text-blue-100 text-lg">Gestion et modération de la plateforme</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Système opérationnel</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm">{stats.pendingModeration} en attente</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Utilisateurs totaux"
            value={stats.totalUsers.toLocaleString()}
            icon="👥"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            gradient="from-blue-50 to-blue-100"
          />
          <StatCard
            title="Événements totaux"
            value={stats.totalEvents}
            icon="🎯"
            color="bg-gradient-to-br from-green-500 to-green-600"
            gradient="from-green-50 to-green-100"
          />
          <StatCard
            title="En attente de modération"
            value={stats.pendingModeration}
            icon="⏳"
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            gradient="from-yellow-50 to-yellow-100"
          />
          <StatCard
            title="Événements actifs"
            value={stats.activeEvents}
            icon="🔥"
            color="bg-gradient-to-br from-red-500 to-red-600"
            gradient="from-red-50 to-red-100"
          />
          <StatCard
            title="Signalements"
            value={stats.reportedIssues}
            icon="🚨"
            color="bg-gradient-to-br from-orange-500 to-orange-600"
            gradient="from-orange-50 to-orange-100"
          />
        </div>

        {/* Moderation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Events */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">⏳</span>
                Événements en attente
              </h2>
              <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                {pendingEvents.length} en attente
              </span>
            </div>
            <div className="space-y-6">
              {pendingEvents.map((event) => (
                <PendingEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Reported Users */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">🚨</span>
                Utilisateurs signalés
              </h2>
              <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full border border-red-200">
                {reportedUsers.length} signalements
              </span>
            </div>
            <div className="space-y-6">
              {reportedUsers.map((user) => (
                <ReportedUserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">⚡</span>
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">🎯</span>
                <p className="text-sm font-semibold text-gray-900">Modérer événements</p>
                <p className="text-xs text-gray-600 mt-1">Validation & contrôle</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">👥</span>
                <p className="text-sm font-semibold text-gray-900">Gérer utilisateurs</p>
                <p className="text-xs text-gray-600 mt-1">Modération & permissions</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📊</span>
                <p className="text-sm font-semibold text-gray-900">Voir statistiques</p>
                <p className="text-xs text-gray-600 mt-1">Analyses détaillées</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">⚙️</span>
                <p className="text-sm font-semibold text-gray-900">Configuration</p>
                <p className="text-xs text-gray-600 mt-1">Paramètres système</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 