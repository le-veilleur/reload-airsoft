import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const AdminModeration: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockReports = [
      {
        id: '1',
        type: 'user',
        target: 'user123',
        reason: 'Comportement toxique',
        reporter: 'player456',
        date: '2025-07-07 14:30',
        status: 'pending',
        description: 'Utilisateur harcelant d\'autres joueurs'
      },
      {
        id: '2',
        type: 'event',
        target: 'Tournoi Speedsoft',
        reason: 'Règles non conformes',
        reporter: 'moderator1',
        date: '2025-07-07 16:45',
        status: 'investigating',
        description: 'Événement avec règles de sécurité insuffisantes'
      },
      {
        id: '3',
        type: 'user',
        target: 'spammer789',
        reason: 'Spam répété',
        reporter: 'admin2',
        date: '2025-07-06 09:15',
        status: 'resolved',
        description: 'Utilisateur envoyant des messages publicitaires'
      }
    ];

    const mockPendingEvents = [
      {
        id: '1',
        title: 'CQB Perfectionnement',
        organizer: 'John Doe',
        reason: 'Contenu inapproprié',
        date: '2025-07-15',
        status: 'pending'
      },
      {
        id: '2',
        title: 'Tournoi controversé',
        organizer: 'Jane Smith',
        reason: 'Règles non conformes',
        date: '2025-07-20',
        status: 'reviewing'
      }
    ];

    setReports(mockReports);
    setPendingEvents(mockPendingEvents);
    setLoading(false);
  }, []);

  const getReportTypeBadge = (type: string) => {
    const typeConfig = {
      user: { color: 'bg-red-100 text-red-800', label: 'Utilisateur', icon: '👤' },
      event: { color: 'bg-blue-100 text-blue-800', label: 'Événement', icon: '🎯' },
      comment: { color: 'bg-yellow-100 text-yellow-800', label: 'Commentaire', icon: '💬' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.user;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} flex items-center`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      investigating: { color: 'bg-blue-100 text-blue-800', label: 'En cours' },
      resolved: { color: 'bg-green-100 text-green-800', label: 'Résolu' },
      dismissed: { color: 'bg-gray-100 text-gray-800', label: 'Rejeté' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de la modération...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Modération</h1>
          <p className="text-purple-100 text-lg">Gestion des signalements et modération</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm">{reports.filter(r => r.status === 'pending').length} signalements en attente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm">{pendingEvents.length} événements à modérer</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Signalements Total</p>
                <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">🚨</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-3xl font-bold text-gray-900">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Cours</p>
                <p className="text-3xl font-bold text-gray-900">
                  {reports.filter(r => r.status === 'investigating').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Résolus</p>
                <p className="text-3xl font-bold text-gray-900">
                  {reports.filter(r => r.status === 'resolved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Moderation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reports */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">🚨</span>
                Signalements
              </h2>
              <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full border border-red-200">
                {reports.filter(r => r.status === 'pending').length} en attente
              </span>
            </div>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getReportTypeBadge(report.type)}
                      {getStatusBadge(report.status)}
                    </div>
                    <span className="text-xs text-gray-500">{report.date}</span>
                  </div>
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900">Signalé: {report.target}</h3>
                    <p className="text-sm text-gray-600">Raison: {report.reason}</p>
                    <p className="text-sm text-gray-500 mt-1">Par: {report.reporter}</p>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{report.description}</p>
                  <div className="flex space-x-2">
                    <button className="text-purple-600 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded-md transition-colors text-sm">
                      Enquêter
                    </button>
                    <button className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors text-sm">
                      Résoudre
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors text-sm">
                      Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Events */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">🎯</span>
                Événements en attente
              </h2>
              <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                {pendingEvents.length} à modérer
              </span>
            </div>
            <div className="space-y-4">
              {pendingEvents.map((event) => (
                <div key={event.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <span className="text-xs text-gray-500">{event.date}</span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">Organisateur: {event.organizer}</p>
                    <p className="text-sm text-gray-600">Raison: {event.reason}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors text-sm">
                      Approuver
                    </button>
                    <button className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors text-sm">
                      Rejeter
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors text-sm">
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">⚡</span>
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="group p-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">🚨</span>
                <p className="text-sm font-semibold text-gray-900">Signalements</p>
                <p className="text-xs text-gray-600 mt-1">Gérer les signalements</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">🎯</span>
                <p className="text-sm font-semibold text-gray-900">Événements</p>
                <p className="text-xs text-gray-600 mt-1">Modérer événements</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">👥</span>
                <p className="text-sm font-semibold text-gray-900">Utilisateurs</p>
                <p className="text-xs text-gray-600 mt-1">Gérer utilisateurs</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📊</span>
                <p className="text-sm font-semibold text-gray-900">Statistiques</p>
                <p className="text-xs text-gray-600 mt-1">Voir analyses</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminModeration; 