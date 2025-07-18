import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const ModeratorReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
        priority: 'high',
        description: 'Utilisateur harcelant d\'autres joueurs dans les commentaires'
      },
      {
        id: '2',
        type: 'event',
        target: 'Tournoi Speedsoft',
        reason: 'Règles non conformes',
        reporter: 'admin1',
        date: '2025-07-07 16:45',
        status: 'investigating',
        priority: 'medium',
        description: 'Événement avec règles de sécurité insuffisantes'
      },
      {
        id: '3',
        type: 'comment',
        target: 'Commentaire #1234',
        reason: 'Spam',
        reporter: 'moderator2',
        date: '2025-07-06 09:15',
        status: 'resolved',
        priority: 'low',
        description: 'Commentaire publicitaire répété'
      },
      {
        id: '4',
        type: 'user',
        target: 'spammer789',
        reason: 'Compte fake',
        reporter: 'player101',
        date: '2025-07-05 18:20',
        status: 'pending',
        priority: 'high',
        description: 'Compte créé avec de fausses informations'
      }
    ];

    setReports(mockReports);
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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      high: { color: 'bg-red-100 text-red-800', label: 'Haute' },
      medium: { color: 'bg-orange-100 text-orange-800', label: 'Moyenne' },
      low: { color: 'bg-green-100 text-green-800', label: 'Basse' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout userRole="moderator">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des signalements...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.status === filter);

  return (
    <DashboardLayout userRole="moderator">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Signalements</h1>
          <p className="text-orange-100 text-lg">Gestion des signalements utilisateurs</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-sm">{reports.filter(r => r.status === 'pending').length} en attente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm">{reports.filter(r => r.status === 'investigating').length} en cours</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Signalements</p>
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

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filtrer les signalements</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tous les signalements</option>
              <option value="pending">En attente</option>
              <option value="investigating">En cours</option>
              <option value="resolved">Résolus</option>
              <option value="dismissed">Rejetés</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Liste des Signalements</h2>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getReportTypeBadge(report.type)}
                    {getStatusBadge(report.status)}
                    {getPriorityBadge(report.priority)}
                  </div>
                  <span className="text-xs text-gray-500">{report.date}</span>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">Signalé: {report.target}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Raison:</span>
                      <span className="ml-2 text-gray-600">{report.reason}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Signalé par:</span>
                      <span className="ml-2 text-gray-600">{report.reporter}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-4 bg-white p-3 rounded border">
                  {report.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <button className="text-orange-600 hover:text-orange-900 bg-orange-100 hover:bg-orange-200 px-4 py-2 rounded-md transition-colors text-sm font-medium">
                    🔍 Enquêter
                  </button>
                  <button className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-md transition-colors text-sm font-medium">
                    ✅ Résoudre
                  </button>
                  <button className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-md transition-colors text-sm font-medium">
                    🚫 Suspendre
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors text-sm font-medium">
                    ❌ Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModeratorReports; 