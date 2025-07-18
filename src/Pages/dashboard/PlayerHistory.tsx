import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const PlayerHistory: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalSpent: 0,
    averageRating: 0,
    favoriteCategory: ''
  });

  useEffect(() => {
    // Simuler le chargement des données
    setHistory([
      {
        id: 1,
        eventTitle: 'Entraînement Tactical',
        date: '2025-06-30',
        organizer: 'Mike Johnson',
        price: 35,
        status: 'completed',
        rating: 5,
        review: 'Excellent entraînement, instructeurs très compétents. Je recommande !',
        category: 'Tactical',
        location: 'Base Tactical',
        participants: 18,
        maxParticipants: 20,
        performance: {
          kills: 12,
          deaths: 8,
          assists: 5,
          accuracy: '78%'
        }
      },
      {
        id: 2,
        eventTitle: 'Milsim Weekend',
        date: '2025-06-15',
        organizer: 'Tactical Team',
        price: 50,
        status: 'completed',
        rating: 4,
        review: 'Weekend intense et réaliste. Très bonne organisation.',
        category: 'Milsim',
        location: 'Forêt de Compiègne',
        participants: 45,
        maxParticipants: 50,
        performance: {
          kills: 8,
          deaths: 15,
          assists: 12,
          accuracy: '65%'
        }
      },
      {
        id: 3,
        eventTitle: 'CQB Masterclass',
        date: '2025-05-20',
        organizer: 'CQB Pro',
        price: 40,
        status: 'completed',
        rating: 5,
        review: 'Formation exceptionnelle aux techniques CQB avancées.',
        category: 'CQB',
        location: 'CQB Arena',
        participants: 15,
        maxParticipants: 15,
        performance: {
          kills: 20,
          deaths: 6,
          assists: 8,
          accuracy: '85%'
        }
      },
      {
        id: 4,
        eventTitle: 'Speedsoft Tournament',
        date: '2025-05-10',
        organizer: 'Speedsoft League',
        price: 30,
        status: 'completed',
        rating: 3,
        review: 'Tournoi correct mais trop de délais entre les matchs.',
        category: 'Speedsoft',
        location: 'Speed Arena',
        participants: 32,
        maxParticipants: 32,
        performance: {
          kills: 15,
          deaths: 10,
          assists: 3,
          accuracy: '72%'
        }
      },
      {
        id: 5,
        eventTitle: 'Woodland Battle',
        date: '2025-04-25',
        organizer: 'Woodland Warriors',
        price: 25,
        status: 'completed',
        rating: 4,
        review: 'Belle partie en forêt, bonne ambiance générale.',
        category: 'Woodland',
        location: 'Forêt de Fontainebleau',
        participants: 28,
        maxParticipants: 30,
        performance: {
          kills: 10,
          deaths: 12,
          assists: 7,
          accuracy: '68%'
        }
      }
    ]);

    setStats({
      totalEvents: 5,
      totalSpent: 180,
      averageRating: 4.2,
      favoriteCategory: 'CQB'
    });
  }, []);

  const HistoryCard = ({ item }: { item: any }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500 rounded-lg">
            <span className="text-white text-lg">✅</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{item.eventTitle}</h3>
            <p className="text-sm text-gray-600">Organisateur: {item.organizer}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">{item.price}€</p>
          <p className="text-xs text-gray-500">{item.date}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Catégorie</p>
          <p className="text-sm font-semibold text-gray-900">{item.category}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Lieu</p>
          <p className="text-sm font-semibold text-gray-900">{item.location}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Note</p>
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 text-sm font-semibold text-gray-900">{item.rating}/5</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600">Participants</p>
          <p className="text-sm font-semibold text-gray-900">{item.participants}/{item.maxParticipants}</p>
        </div>
      </div>
      
      {item.review && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 italic">"{item.review}"</p>
        </div>
      )}
      
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Performance</h4>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600">Kills</p>
            <p className="text-sm font-semibold text-blue-600">{item.performance.kills}</p>
          </div>
          <div className="text-center p-2 bg-red-50 rounded-lg">
            <p className="text-xs text-gray-600">Morts</p>
            <p className="text-sm font-semibold text-red-600">{item.performance.deaths}</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-600">Assists</p>
            <p className="text-sm font-semibold text-green-600">{item.performance.assists}</p>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <p className="text-xs text-gray-600">Précision</p>
            <p className="text-sm font-semibold text-purple-600">{item.performance.accuracy}</p>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:shadow-md">
          Voir détails
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:shadow-md">
          Modifier avis
        </button>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
    <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105`}>
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

  return (
    <DashboardLayout userRole="player">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Historique</h1>
          <p className="text-purple-100 text-lg">Retracez votre parcours et vos performances</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">{stats.totalEvents} événements participés</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm">Note moyenne: {stats.averageRating}/5</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Événements totaux"
            value={stats.totalEvents}
            icon="🎯"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total dépensé"
            value={`${stats.totalSpent}€`}
            icon="💰"
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Note moyenne"
            value={`${stats.averageRating}/5`}
            icon="⭐"
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          />
          <StatCard
            title="Catégorie préférée"
            value={stats.favoriteCategory}
            icon="🏆"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* History List */}
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-3">📅</span>
              Historique des événements
            </h2>
            <div className="space-y-6">
              {history.map((item) => (
                <HistoryCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlayerHistory; 