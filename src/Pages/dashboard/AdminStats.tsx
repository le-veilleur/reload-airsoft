import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockStats = {
      users: {
        total: 1247,
        active: 1189,
        newThisMonth: 45,
        growth: 12.5
      },
      events: {
        total: 89,
        active: 15,
        completed: 74,
        pending: 5
      },
      revenue: {
        total: 45600,
        thisMonth: 8900,
        growth: 8.3
      },
      engagement: {
        avgParticipants: 28,
        avgRating: 4.6,
        totalReviews: 342
      }
    };

    setStats(mockStats);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
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
          <h1 className="text-4xl font-bold mb-2">Statistiques</h1>
          <p className="text-purple-100 text-lg">Analyses et métriques de la plateforme</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Données en temps réel</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm">Mise à jour: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.users?.total?.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{stats.users?.growth}% ce mois</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Événements Actifs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.events?.active}</p>
                <p className="text-sm text-blue-600">{stats.events?.pending} en attente</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Total (€)</p>
                <p className="text-3xl font-bold text-gray-900">{stats.revenue?.total?.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{stats.revenue?.growth}% ce mois</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
                <p className="text-3xl font-bold text-gray-900">{stats.engagement?.avgRating}</p>
                <p className="text-sm text-yellow-600">{stats.engagement?.totalReviews} avis</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">📈</span>
              Croissance Utilisateurs
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nouveaux ce mois</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.users?.newThisMonth}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">+{stats.users?.growth}%</p>
                  <p className="text-xs text-gray-500">vs mois dernier</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.users?.active}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">{Math.round((stats.users?.active / stats.users?.total) * 100)}%</p>
                  <p className="text-xs text-gray-500">du total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🎯</span>
              Performance Événements
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Événements terminés</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.events?.completed}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">{Math.round((stats.events?.completed / stats.events?.total) * 100)}%</p>
                  <p className="text-xs text-gray-500">taux de réussite</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Participants moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.engagement?.avgParticipants}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600">par événement</p>
                  <p className="text-xs text-gray-500">moyenne</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">💰</span>
            Analyse des Revenus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.revenue?.total?.toLocaleString()}€</div>
              <p className="text-sm font-medium text-gray-700">Revenus totaux</p>
              <p className="text-xs text-gray-500">Tous les temps</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.revenue?.thisMonth?.toLocaleString()}€</div>
              <p className="text-sm font-medium text-gray-700">Ce mois</p>
              <p className="text-xs text-gray-500">+{stats.revenue?.growth}% vs dernier mois</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">{Math.round(stats.revenue?.total / stats.events?.total)}€</div>
              <p className="text-sm font-medium text-gray-700">Revenu moyen</p>
              <p className="text-xs text-gray-500">Par événement</p>
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
            <button className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📊</span>
                <p className="text-sm font-semibold text-gray-900">Rapport détaillé</p>
                <p className="text-xs text-gray-600 mt-1">Exporter les données</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📈</span>
                <p className="text-sm font-semibold text-gray-900">Graphiques</p>
                <p className="text-xs text-gray-600 mt-1">Visualiser les tendances</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">🎯</span>
                <p className="text-sm font-semibold text-gray-900">Événements</p>
                <p className="text-xs text-gray-600 mt-1">Gérer les événements</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">👥</span>
                <p className="text-sm font-semibold text-gray-900">Utilisateurs</p>
                <p className="text-xs text-gray-600 mt-1">Gérer les utilisateurs</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminStats; 