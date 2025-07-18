import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const ModeratorStats: React.FC = () => {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockStats = {
      reports: {
        total: 45,
        pending: 12,
        resolved: 28,
        dismissed: 5
      },
      users: {
        total: 1247,
        warned: 8,
        suspended: 3,
        investigating: 2
      },
      events: {
        total: 89,
        flagged: 5,
        underReview: 3,
        active: 81
      },
      actions: {
        warnings: 15,
        suspensions: 3,
        investigations: 8,
        resolutions: 28
      }
    };

    setStats(mockStats);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="moderator">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
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
          <h1 className="text-4xl font-bold mb-2">Statistiques de Modération</h1>
          <p className="text-orange-100 text-lg">Analyses et métriques de modération</p>
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
                <p className="text-sm font-medium text-gray-600">Signalements Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.reports?.total}</p>
                <p className="text-sm text-orange-600">{stats.reports?.pending} en attente</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">🚨</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Surveillés</p>
                <p className="text-3xl font-bold text-gray-900">{stats.users?.total}</p>
                <p className="text-sm text-yellow-600">{stats.users?.warned} avertis</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Événements Surveillés</p>
                <p className="text-3xl font-bold text-gray-900">{stats.events?.total}</p>
                <p className="text-sm text-red-600">{stats.events?.flagged} signalés</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actions Effectuées</p>
                <p className="text-3xl font-bold text-gray-900">{stats.actions?.resolutions}</p>
                <p className="text-sm text-green-600">Résolutions</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reports Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Analyse des Signalements
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.reports?.pending}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-yellow-600">{Math.round((stats.reports?.pending / stats.reports?.total) * 100)}%</p>
                  <p className="text-xs text-gray-500">du total</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Résolus</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.reports?.resolved}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">{Math.round((stats.reports?.resolved / stats.reports?.total) * 100)}%</p>
                  <p className="text-xs text-gray-500">taux de résolution</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejetés</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.reports?.dismissed}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{Math.round((stats.reports?.dismissed / stats.reports?.total) * 100)}%</p>
                  <p className="text-xs text-gray-500">faux positifs</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Moderation */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">👥</span>
              Modération Utilisateurs
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avertis</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.users?.warned}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-yellow-600">Actions préventives</p>
                  <p className="text-xs text-gray-500">avertissements</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspendus</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.users?.suspended}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-600">Actions correctives</p>
                  <p className="text-xs text-gray-500">suspensions</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Enquêtes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.users?.investigating}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">En cours</p>
                  <p className="text-xs text-gray-500">investigations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">⚡</span>
            Résumé des Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.actions?.warnings}</div>
              <p className="text-sm font-medium text-gray-700">Avertissements</p>
              <p className="text-xs text-gray-500">Actions préventives</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.actions?.suspensions}</div>
              <p className="text-sm font-medium text-gray-700">Suspensions</p>
              <p className="text-xs text-gray-500">Actions correctives</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.actions?.investigations}</div>
              <p className="text-sm font-medium text-gray-700">Enquêtes</p>
              <p className="text-xs text-gray-500">Investigations</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.actions?.resolutions}</div>
              <p className="text-sm font-medium text-gray-700">Résolutions</p>
              <p className="text-xs text-gray-500">Cas traités</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">🎯</span>
            Actions rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">🚨</span>
                <p className="text-sm font-semibold text-gray-900">Signalements</p>
                <p className="text-xs text-gray-600 mt-1">Gérer les signalements</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">👥</span>
                <p className="text-sm font-semibold text-gray-900">Utilisateurs</p>
                <p className="text-xs text-gray-600 mt-1">Surveiller les utilisateurs</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">🎯</span>
                <p className="text-sm font-semibold text-gray-900">Événements</p>
                <p className="text-xs text-gray-600 mt-1">Surveiller les événements</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📊</span>
                <p className="text-sm font-semibold text-gray-900">Rapports</p>
                <p className="text-xs text-gray-600 mt-1">Générer des rapports</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModeratorStats; 