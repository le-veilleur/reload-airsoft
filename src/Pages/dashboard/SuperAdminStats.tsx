import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const SuperAdminStats: React.FC = () => {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockStats = {
      overview: {
        totalUsers: 1247,
        totalEvents: 89,
        totalRevenue: 45600,
        activeUsers: 892
      },
      userGrowth: [
        { month: 'Jan', users: 1200, events: 85 },
        { month: 'Fév', users: 1250, events: 92 },
        { month: 'Mar', users: 1300, events: 88 },
        { month: 'Avr', users: 1350, events: 95 },
        { month: 'Mai', users: 1400, events: 102 },
        { month: 'Juin', users: 1450, events: 98 }
      ],
      topCategories: [
        { name: 'CQB', events: 25, participants: 450 },
        { name: 'Milsim', events: 18, participants: 380 },
        { name: 'Speedsoft', events: 15, participants: 280 },
        { name: 'Tactical', events: 12, participants: 220 }
      ],
      topOrganizers: [
        { name: 'John Doe', events: 15, rating: 4.8 },
        { name: 'Marie Martin', events: 12, rating: 4.6 },
        { name: 'Pierre Durand', events: 10, rating: 4.9 }
      ]
    };

    setStats(mockStats);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="super_admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="super_admin">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Statistiques</h1>
          <p className="text-red-100 text-lg">Analyses et métriques du système</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.overview?.totalUsers?.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-2">ce mois</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Événements</p>
                <p className="text-3xl font-bold text-gray-900">{stats.overview?.totalEvents}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-gray-500 ml-2">ce mois</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-3xl font-bold text-gray-900">{stats.overview?.totalRevenue?.toLocaleString()}€</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+15%</span>
              <span className="text-gray-500 ml-2">ce mois</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.overview?.activeUsers?.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+5%</span>
              <span className="text-gray-500 ml-2">ce mois</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Croissance des Utilisateurs</h3>
            <div className="space-y-3">
              {stats.userGrowth?.map((data: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-600">👥</span>
                      <span className="text-sm font-medium">{data.users}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600">🎯</span>
                      <span className="text-sm font-medium">{data.events}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Catégories</h3>
            <div className="space-y-4">
              {stats.topCategories?.map((category: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {category.name === 'CQB' && '🏠'}
                      {category.name === 'Milsim' && '🎖️'}
                      {category.name === 'Speedsoft' && '⚡'}
                      {category.name === 'Tactical' && '🎯'}
                    </span>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{category.events} événements</div>
                    <div className="text-xs text-gray-500">{category.participants} participants</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Organizers */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Organisateurs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.topOrganizers?.map((organizer: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {organizer.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{organizer.name}</div>
                    <div className="text-sm text-gray-500">{organizer.events} événements</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-400">⭐</span>
                  <span className="ml-1 text-sm font-medium">{organizer.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
              <div className="text-center">
                <span className="text-2xl">📊</span>
                <p className="text-sm font-medium text-blue-800 mt-2">Exporter Rapport</p>
              </div>
            </button>
            
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
              <div className="text-center">
                <span className="text-2xl">📈</span>
                <p className="text-sm font-medium text-green-800 mt-2">Analytics Avancées</p>
              </div>
            </button>
            
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <div className="text-center">
                <span className="text-2xl">📋</span>
                <p className="text-sm font-medium text-purple-800 mt-2">Générer Rapport</p>
              </div>
            </button>
            
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
              <div className="text-center">
                <span className="text-2xl">⚙️</span>
                <p className="text-sm font-medium text-orange-800 mt-2">Configuration</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminStats; 