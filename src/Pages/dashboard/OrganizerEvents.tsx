import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

const OrganizerEvents: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simuler le chargement des données
    const mockEvents = [
      {
        id: '1',
        title: 'CQB Perfectionnement',
        status: 'active',
        date: '2025-07-15',
        participants: 25,
        maxParticipants: 30,
        location: 'Terrain de jeu - Paris',
        price: 45,
        type: 'training'
      },
      {
        id: '2',
        title: 'Tournoi Speedsoft',
        status: 'draft',
        date: '2025-08-20',
        participants: 0,
        maxParticipants: 50,
        location: 'Arena Tactical - Lyon',
        price: 60,
        type: 'tournament'
      },
      {
        id: '3',
        title: 'Entraînement Tactical',
        status: 'completed',
        date: '2025-06-25',
        participants: 15,
        maxParticipants: 20,
        location: 'Base Militaire - Marseille',
        price: 35,
        type: 'training'
      },
      {
        id: '4',
        title: 'Événement CQB Nocturne',
        status: 'cancelled',
        date: '2025-09-01',
        participants: 0,
        maxParticipants: 40,
        location: 'Terrain Nocturne - Toulouse',
        price: 50,
        type: 'event'
      }
    ];

    setEvents(mockEvents);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Actif', icon: '✅' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Brouillon', icon: '📝' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Terminé', icon: '🏁' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Annulé', icon: '❌' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} flex items-center`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      training: { color: 'bg-blue-100 text-blue-800', label: 'Entraînement', icon: '🎯' },
      tournament: { color: 'bg-purple-100 text-purple-800', label: 'Tournoi', icon: '🏆' },
      event: { color: 'bg-orange-100 text-orange-800', label: 'Événement', icon: '🎪' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.event;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} flex items-center`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="organizer">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des événements...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="organizer">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mes Événements</h1>
              <p className="text-green-100 text-lg">Gérez vos événements et tournois</p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm">{events.filter(e => e.status === 'active').length} événements actifs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">{events.filter(e => e.status === 'draft').length} brouillons</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/events/create')}
              className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center"
            >
              <span className="mr-2">➕</span>
              Créer un événement
            </button>
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
              <div className="p-3 bg-green-100 rounded-full">
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
                <p className="text-sm font-medium text-gray-600">Participants Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.reduce((sum, event) => sum + event.participants, 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Estimés</p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.reduce((sum, event) => sum + (event.participants * event.price), 0)}€
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Liste des Événements</h2>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les événements</option>
                <option value="active">Actifs</option>
                <option value="draft">Brouillons</option>
                <option value="completed">Terminés</option>
                <option value="cancelled">Annulés</option>
              </select>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{event.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusBadge(event.status)}
                      {getTypeBadge(event.type)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">📍 {event.location}</p>
                    <p className="text-sm text-gray-600 mb-2">📅 {event.date}</p>
                    <p className="text-sm text-gray-600 mb-2">💰 {event.price}€</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{event.participants}/{event.maxParticipants}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-md transition-colors text-sm font-medium">
                    👁️ Voir
                  </button>
                  <button 
                    onClick={() => navigate(`/events/edit/${event.id}`)}
                    className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                  >
                    ✏️ Modifier
                  </button>
                  <button className="text-orange-600 hover:text-orange-900 bg-orange-100 hover:bg-orange-200 px-3 py-2 rounded-md transition-colors text-sm font-medium">
                    📊 Statistiques
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                  >
                    🗑️ Supprimer
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

export default OrganizerEvents; 