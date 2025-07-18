import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const ModeratorEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simuler le chargement des données
    const mockEvents = [
      {
        id: '1',
        title: 'CQB Perfectionnement',
        organizer: 'John Doe',
        status: 'active',
        date: '2025-07-15',
        participants: 25,
        maxParticipants: 30,
        reports: 0
      },
      {
        id: '2',
        title: 'Tournoi controversé',
        organizer: 'Jane Smith',
        status: 'flagged',
        date: '2025-07-20',
        participants: 48,
        maxParticipants: 50,
        reports: 3
      },
      {
        id: '3',
        title: 'Entraînement Tactical',
        organizer: 'Pierre Durand',
        status: 'active',
        date: '2025-07-25',
        participants: 15,
        maxParticipants: 20,
        reports: 0
      },
      {
        id: '4',
        title: 'Événement suspect',
        organizer: 'Sophie Bernard',
        status: 'under_review',
        date: '2025-08-01',
        participants: 0,
        maxParticipants: 100,
        reports: 2
      }
    ];

    setEvents(mockEvents);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Actif' },
      flagged: { color: 'bg-red-100 text-red-800', label: 'Signalé' },
      under_review: { color: 'bg-yellow-100 text-yellow-800', label: 'En révision' },
      suspended: { color: 'bg-gray-100 text-gray-800', label: 'Suspendu' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
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
            <p className="mt-4 text-gray-600">Chargement des événements...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="moderator">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Surveillance des Événements</h1>
          <p className="text-orange-100 text-lg">Modération et contrôle des événements</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">{events.filter(e => e.status === 'active').length} événements actifs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-sm">{events.filter(e => e.status === 'flagged').length} signalés</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Événements</p>
                <p className="text-3xl font-bold text-gray-900">{events.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Événements Actifs</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.filter(e => e.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Signalés</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.filter(e => e.status === 'flagged').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">🚨</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Révision</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.filter(e => e.status === 'under_review').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Liste des Événements</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tous les événements</option>
              <option value="active">Actifs</option>
              <option value="flagged">Signalés</option>
              <option value="under_review">En révision</option>
            </select>
          </div>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-600">Organisateur: {event.organizer}</p>
                    <p className="text-sm text-gray-600">Date: {event.date}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(event.status)}
                    {event.reports > 0 && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {event.reports} signalement(s)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Participants:</span>
                    <span className="ml-2 text-gray-600">{event.participants}/{event.maxParticipants}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Taux de remplissage:</span>
                    <span className="ml-2 text-gray-600">{Math.round((event.participants / event.maxParticipants) * 100)}%</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Statut:</span>
                    <span className="ml-2 text-gray-600">{event.status}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button className="text-orange-600 hover:text-orange-900 bg-orange-100 hover:bg-orange-200 px-4 py-2 rounded-md transition-colors text-sm font-medium">
                    🔍 Examiner
                  </button>
                  <button className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-md transition-colors text-sm font-medium">
                    📋 Détails
                  </button>
                  {event.status === 'flagged' && (
                    <button className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-md transition-colors text-sm font-medium">
                      🚫 Suspendre
                    </button>
                  )}
                  {event.status === 'under_review' && (
                    <button className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-md transition-colors text-sm font-medium">
                      ✅ Approuver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModeratorEvents; 