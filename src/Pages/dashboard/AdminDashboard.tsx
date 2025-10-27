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
          <p className="text-xs text-green-600">+12% ce mois</p>
        </div>
      </div>
    </div>
  );

  const PendingEventCard = ({ event }: { event: any }) => (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-soft border border-white/20 hover:shadow-medium transition-all duration-200 hover:transform hover:scale-105">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-yellow-500 rounded-lg">
            <span className="text-white text-base">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">{event.title}</h3>
            <p className="text-xs text-gray-600">Organisateur: {event.organizer}</p>
          </div>
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
          En attente
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-3">Date: {event.date}</p>
      <div className="flex space-x-2">
        <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200">
          Approuver
        </button>
        <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200">
          Rejeter
        </button>
        <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
          Détails
        </button>
      </div>
    </div>
  );

  const ReportedUserCard = ({ user }: { user: any }) => (
    <div className="bg-white/80 backdrop-blur-sm p-2.5 rounded-lg shadow-soft border border-white/20 hover:shadow-medium transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <div className="p-1 bg-red-500 rounded flex-shrink-0">
            <span className="text-white text-xs">👤</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-xs text-gray-900 truncate">{user.username}</h3>
            <p className="text-xs text-gray-600 truncate">{user.reason}</p>
          </div>
        </div>
        <span className={`px-1.5 py-0.5 text-xs font-medium rounded flex-shrink-0 ml-2 ${
          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {user.status === 'pending' ? 'Nouveau' : 'En cours'}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-2">{user.date}</p>
      <div className="flex gap-1">
        <button className="flex-1 px-2 py-1 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600 transition-all">
          Bannir
        </button>
        <button className="flex-1 px-2 py-1 text-xs font-medium bg-gray-400 text-white rounded hover:bg-gray-500 transition-all">
          Ignorer
        </button>
        <button className="flex-1 px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition-all">
          Voir
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-strong p-5 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Dashboard Administration</h1>
          <p className="text-blue-100 text-sm">Modération et gestion de la plateforme</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs">Système opérationnel</span>
            </div>
            {stats.pendingModeration > 0 && (
              <div className="flex items-center space-x-2 px-2 py-1 bg-yellow-500/20 rounded-lg">
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                <span className="text-xs font-medium">{stats.pendingModeration} à modérer</span>
              </div>
            )}
            {stats.reportedIssues > 0 && (
              <div className="flex items-center space-x-2 px-2 py-1 bg-red-500/20 rounded-lg">
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                <span className="text-xs font-medium">{stats.reportedIssues} signalements</span>
              </div>
            )}
          </div>
        </div>

        {/* Admin Stats - Focus on Moderation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard
            title="Utilisateurs"
            value={stats.totalUsers.toLocaleString()}
            icon="👥"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            gradient="from-blue-50 to-blue-100"
          />
          <StatCard
            title="À modérer"
            value={stats.pendingModeration}
            icon="⏳"
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            gradient="from-yellow-50 to-yellow-100"
          />
          <StatCard
            title="Signalements"
            value={stats.reportedIssues}
            icon="🚨"
            color="bg-gradient-to-br from-red-500 to-red-600"
            gradient="from-red-50 to-red-100"
          />
          <StatCard
            title="Événements actifs"
            value={stats.activeEvents}
            icon="🔥"
            color="bg-gradient-to-br from-green-500 to-green-600"
            gradient="from-green-50 to-green-100"
          />
          <StatCard
            title="Total événements"
            value={stats.totalEvents}
            icon="🎯"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            gradient="from-purple-50 to-purple-100"
          />
        </div>

        {/* Priority Moderation Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pending Events - Priority */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-soft p-5 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="mr-2">⏳</span>
                Événements à valider
              </h2>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                {pendingEvents.length} en attente
              </span>
            </div>
            <div className="space-y-3">
              {pendingEvents.length > 0 ? (
                pendingEvents.map((event) => (
                  <PendingEventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">✅ Aucun événement en attente</p>
                </div>
              )}
            </div>
          </div>

          {/* Reported Users - Urgent */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft p-5 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center">
                <span className="mr-2">🚨</span>
                Signalements urgents
              </h2>
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full border border-red-200">
                {reportedUsers.length}
              </span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {reportedUsers.length > 0 ? (
                reportedUsers.map((user) => (
                  <ReportedUserCard key={user.id} user={user} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-xs">✅ Aucun signalement</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Management Tools */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft p-5 border border-white/20">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Outils de gestion
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="group p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 hover:shadow-soft">
              <div className="text-center">
                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🎯</span>
                <p className="text-xs font-semibold text-gray-900">Événements</p>
              </div>
            </button>
            <button className="group p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200 hover:shadow-soft">
              <div className="text-center">
                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">👥</span>
                <p className="text-xs font-semibold text-gray-900">Utilisateurs</p>
              </div>
            </button>
            <button className="group p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-200 hover:shadow-soft">
              <div className="text-center">
                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📊</span>
                <p className="text-xs font-semibold text-gray-900">Statistiques</p>
              </div>
            </button>
            <button className="group p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200 hover:shadow-soft">
              <div className="text-center">
                <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">⚙️</span>
                <p className="text-xs font-semibold text-gray-900">Paramètres</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard; 