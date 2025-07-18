import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const ModeratorDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    activeUsers: 0,
    flaggedEvents: 0,
    moderationActions: 0
  });

  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [flaggedUsers, setFlaggedUsers] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    setStats({
      totalReports: 47,
      pendingReports: 12,
      resolvedReports: 35,
      activeUsers: 1247,
      flaggedEvents: 8,
      moderationActions: 23
    });

    setRecentReports([
      { 
        id: 1, 
        type: 'user_report', 
        reporter: 'user123', 
        reported: 'player456',
        reason: 'Comportement inapproprié',
        description: 'Utilisateur a envoyé des messages offensants',
        status: 'pending',
        date: '2025-07-07 14:30',
        priority: 'high'
      },
      { 
        id: 2, 
        type: 'event_report', 
        reporter: 'organizer1', 
        reported: 'event789',
        reason: 'Contenu inapproprié',
        description: 'Description d\'événement contient du contenu inapproprié',
        status: 'investigating',
        date: '2025-07-07 13:15',
        priority: 'medium'
      },
      { 
        id: 3, 
        type: 'user_report', 
        reporter: 'admin1', 
        reported: 'user789',
        reason: 'Spam',
        description: 'Utilisateur envoie trop de messages publicitaires',
        status: 'resolved',
        date: '2025-07-07 12:00',
        priority: 'low'
      }
    ]);

    setFlaggedUsers([
      { 
        id: 1, 
        username: 'player456', 
        reason: 'Comportement toxique',
        reports: 3,
        status: 'warned',
        lastAction: '2025-07-07 10:00'
      },
      { 
        id: 2, 
        username: 'user789', 
        reason: 'Spam répété',
        reports: 5,
        status: 'suspended',
        lastAction: '2025-07-06 16:30'
      },
      { 
        id: 3, 
        username: 'troublemaker', 
        reason: 'Harcèlement',
        reports: 2,
        status: 'investigating',
        lastAction: '2025-07-07 09:15'
      }
    ]);

    setPendingEvents([
      { 
        id: 1, 
        title: 'Événement suspect', 
        organizer: 'organizer123',
        reason: 'Contenu inapproprié',
        date: '2025-07-08',
        status: 'pending'
      },
      { 
        id: 2, 
        title: 'Tournoi controversé', 
        organizer: 'organizer456',
        reason: 'Règles non conformes',
        date: '2025-07-10',
        status: 'reviewing'
      }
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
        </div>
      </div>
    </div>
  );

  const ReportCard = ({ report }: { report: any }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            report.priority === 'high' ? 'bg-red-500' :
            report.priority === 'medium' ? 'bg-yellow-500' :
            'bg-green-500'
          }`}>
            <span className="text-white text-lg">
              {report.type === 'user_report' ? '👤' : '🎯'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{report.reason}</h3>
            <p className="text-sm text-gray-600">Signalé par: {report.reporter}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
          report.status === 'investigating' ? 'bg-blue-100 text-blue-800 border-blue-200' :
          'bg-green-100 text-green-800 border-green-200'
        }`}>
          {report.status === 'pending' ? 'En attente' : 
           report.status === 'investigating' ? 'En cours' : 'Résolu'}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{report.description}</p>
      <p className="text-xs text-gray-500 mb-4">Date: {report.date}</p>
      
      <div className="flex space-x-3">
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-md">
          Examiner
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:shadow-md">
          Résoudre
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-md">
          Ignorer
        </button>
      </div>
    </div>
  );

  const FlaggedUserCard = ({ user }: { user: any }) => (
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
          user.status === 'warned' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
          user.status === 'suspended' ? 'bg-red-100 text-red-800 border-red-200' :
          'bg-blue-100 text-blue-800 border-blue-200'
        }`}>
          {user.status === 'warned' ? 'Averti' : 
           user.status === 'suspended' ? 'Suspendu' : 'En cours'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Signalements</p>
          <p className="text-sm font-semibold text-gray-900">{user.reports}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Dernière action</p>
          <p className="text-sm font-semibold text-gray-900">{user.lastAction}</p>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 hover:shadow-md">
          Avertir
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-md">
          Suspendre
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-md">
          Voir détails
        </button>
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
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
          event.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-blue-100 text-blue-800 border-blue-200'
        }`}>
          {event.status === 'pending' ? 'En attente' : 'En cours'}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">Raison: {event.reason}</p>
      <p className="text-sm text-gray-600 mb-4">Date: {event.date}</p>
      
      <div className="flex space-x-3">
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:shadow-md">
          Approuver
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:shadow-md">
          Rejeter
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-md">
          Demander modification
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout userRole="moderator">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Dashboard Modérateur</h1>
          <p className="text-orange-100 text-lg">Surveillance et modération de la plateforme</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm">{stats.pendingReports} signalements en attente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm">{stats.flaggedEvents} événements signalés</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Signalements totaux"
            value={stats.totalReports}
            icon="🚨"
            color="bg-gradient-to-br from-red-500 to-red-600"
            gradient="from-red-50 to-red-100"
          />
          <StatCard
            title="En attente"
            value={stats.pendingReports}
            icon="⏳"
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            gradient="from-yellow-50 to-yellow-100"
          />
          <StatCard
            title="Résolus"
            value={stats.resolvedReports}
            icon="✅"
            color="bg-gradient-to-br from-green-500 to-green-600"
            gradient="from-green-50 to-green-100"
          />
          <StatCard
            title="Utilisateurs actifs"
            value={stats.activeUsers.toLocaleString()}
            icon="👥"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            gradient="from-blue-50 to-blue-100"
          />
          <StatCard
            title="Événements signalés"
            value={stats.flaggedEvents}
            icon="🎯"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            gradient="from-purple-50 to-purple-100"
          />
          <StatCard
            title="Actions de modération"
            value={stats.moderationActions}
            icon="🛡️"
            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
            gradient="from-indigo-50 to-indigo-100"
          />
        </div>

        {/* Moderation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">🚨</span>
                Signalements récents
              </h2>
              <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full border border-red-200">
                {recentReports.length} signalements
              </span>
            </div>
            <div className="space-y-6">
              {recentReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>

          {/* Flagged Users */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">👤</span>
                Utilisateurs signalés
              </h2>
              <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full border border-orange-200">
                {flaggedUsers.length} utilisateurs
              </span>
            </div>
            <div className="space-y-6">
              {flaggedUsers.map((user) => (
                <FlaggedUserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        </div>

        {/* Pending Events */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">🎯</span>
              Événements en attente de modération
            </h2>
            <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
              {pendingEvents.length} événements
            </span>
          </div>
          <div className="space-y-6">
            {pendingEvents.map((event) => (
              <PendingEventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModeratorDashboard; 