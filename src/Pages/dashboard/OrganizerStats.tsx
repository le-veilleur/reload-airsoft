import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const OrganizerStats: React.FC = () => {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockStats = {
      events: {
        total: 12,
        active: 3,
        completed: 8,
        cancelled: 1
      },
      participants: {
        total: 284,
        thisMonth: 45,
        averagePerEvent: 24,
        retention: 78
      },
      revenue: {
        total: 12840,
        thisMonth: 2840,
        averagePerEvent: 1070,
        growth: 15
      },
      performance: {
        rating: 4.6,
        reviews: 156,
        satisfaction: 92,
        recommendations: 89
      }
    };

    setStats(mockStats);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="organizer">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
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
          <h1 className="text-4xl font-bold mb-2">Statistiques & Analytics</h1>
          <p className="text-green-100 text-lg">Analysez vos performances d'organisateur</p>
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
                <p className="text-sm font-medium text-gray-600">Événements Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.events?.total}</p>
                <p className="text-sm text-green-600">{stats.events?.active} actifs</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participants Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.participants?.total}</p>
                <p className="text-sm text-blue-600">+{stats.participants?.thisMonth} ce mois</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
                <p className="text-3xl font-bold text-gray-900">{stats.revenue?.total}€</p>
                <p className="text-sm text-green-600">+{stats.revenue?.growth}% croissance</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Note Moyenne</p>
                <p className="text-3xl font-bold text-gray-900">{stats.performance?.rating}/5</p>
                <p className="text-sm text-purple-600">{stats.performance?.reviews} avis</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Events Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Performance des Événements
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Événements Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.events?.active}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">{Math.round((stats.events?.active / stats.events?.total) * 100)}%</p>
                  <p className="text-xs text-gray-500">du total</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Événements Terminés</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.events?.completed}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">{Math.round((stats.events?.completed / stats.events?.total) * 100)}%</p>
                  <p className="text-xs text-gray-500">taux de réussite</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux d'Annulation</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.events?.cancelled}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-600">{Math.round((stats.events?.cancelled / stats.events?.total) * 100)}%</p>
                  <p className="text-xs text-gray-500">annulations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Participant Analytics */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">👥</span>
              Analyse des Participants
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Moyenne par événement</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.participants?.averagePerEvent}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">Participants</p>
                  <p className="text-xs text-gray-500">par événement</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de Rétention</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.participants?.retention}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">Fidélisation</p>
                  <p className="text-xs text-gray-500">participants récurrents</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nouveaux ce mois</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.participants?.thisMonth}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600">Croissance</p>
                  <p className="text-xs text-gray-500">nouveaux participants</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">💰</span>
              Analyse des Revenus
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus ce mois</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.revenue?.thisMonth}€</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">+{stats.revenue?.growth}%</p>
                  <p className="text-xs text-gray-500">vs mois dernier</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Moyenne par événement</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.revenue?.averagePerEvent}€</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">Performance</p>
                  <p className="text-xs text-gray-500">revenu moyen</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Croissance annuelle</p>
                  <p className="text-2xl font-bold text-gray-900">+{stats.revenue?.growth * 12}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600">Projection</p>
                  <p className="text-xs text-gray-500">sur 12 mois</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">⭐</span>
              Satisfaction Client
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.performance?.rating}/5</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-yellow-600">Excellent</p>
                  <p className="text-xs text-gray-500">sur {stats.performance?.reviews} avis</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.performance?.satisfaction}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">Très satisfaits</p>
                  <p className="text-xs text-gray-500">clients satisfaits</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recommandations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.performance?.recommendations}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">NPS</p>
                  <p className="text-xs text-gray-500">net promoter score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">🎯</span>
            Actions Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="group p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📊</span>
                <p className="text-sm font-semibold text-gray-900">Rapport Complet</p>
                <p className="text-xs text-gray-600 mt-1">Générer un rapport</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📈</span>
                <p className="text-sm font-semibold text-gray-900">Analytics Avancés</p>
                <p className="text-xs text-gray-600 mt-1">Analyses détaillées</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">🎯</span>
                <p className="text-sm font-semibold text-gray-900">Objectifs</p>
                <p className="text-xs text-gray-600 mt-1">Définir des objectifs</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📧</span>
                <p className="text-sm font-semibold text-gray-900">Exporter</p>
                <p className="text-xs text-gray-600 mt-1">Exporter les données</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerStats; 