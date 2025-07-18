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
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const EventCard = ({ event }: { event: any }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{event.title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          event.status === 'active' ? 'bg-green-100 text-green-800' :
          event.status === 'full' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {event.status === 'active' ? 'Actif' : event.status === 'full' ? 'Complet' : 'À venir'}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">Date: {event.date}</p>
      <p className="text-sm text-gray-600 mb-2">
        Participants: {event.participants}/{event.maxParticipants}
      </p>
      <p className="text-sm text-gray-600 mb-3">Revenus: {event.revenue}€</p>
      <div className="flex space-x-2">
        <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
          Gérer
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded hover:bg-green-200">
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
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Organisateur</h1>
          <p className="mt-2 text-gray-600">Gérez vos événements et participants</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Événements totaux"
            value={stats.totalEvents}
            icon="🎯"
            color="border-blue-500"
          />
          <StatCard
            title="Événements actifs"
            value={stats.activeEvents}
            icon="🔥"
            color="border-green-500"
          />
          <StatCard
            title="Participants totaux"
            value={stats.totalParticipants}
            icon="👥"
            color="border-purple-500"
          />
          <StatCard
            title="Revenus totaux (€)"
            value={stats.totalRevenue.toLocaleString()}
            icon="💰"
            color="border-emerald-500"
          />
          <StatCard
            title="Événements à venir"
            value={stats.upcomingEvents}
            icon="📅"
            color="border-yellow-500"
          />
        </div>

        {/* Events & Participants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Events */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Mes événements</h2>
              <button 
                onClick={() => navigate('/events/create')}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer un événement
              </button>
            </div>
            <div className="space-y-4">
              {myEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Recent Participants */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Participants récents</h2>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {recentParticipants.length} nouveaux
              </span>
            </div>
            <div className="space-y-2">
              {recentParticipants.map((participant) => (
                <ParticipantCard key={participant.id} participant={participant} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/events/create')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-center">
                <span className="text-2xl">🎯</span>
                <p className="mt-2 text-sm font-medium text-gray-900">Créer événement</p>
              </div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl">👥</span>
                <p className="mt-2 text-sm font-medium text-gray-900">Gérer participants</p>
              </div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl">📊</span>
                <p className="mt-2 text-sm font-medium text-gray-900">Voir statistiques</p>
              </div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl">⚙️</span>
                <p className="mt-2 text-sm font-medium text-gray-900">Paramètres</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard; 