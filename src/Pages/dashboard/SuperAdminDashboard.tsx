import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalOrganizers: 0,
    totalCompanies: 0,
    activeUsers: 0,
    pendingEvents: 0,
    systemHealth: 'healthy'
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    setStats({
      totalUsers: 1247,
      totalEvents: 89,
      totalOrganizers: 23,
      totalCompanies: 12,
      activeUsers: 892,
      pendingEvents: 5,
      systemHealth: 'healthy'
    });

    setRecentActivity([
      { id: 1, type: 'user_registration', message: 'Nouvel utilisateur inscrit: john.doe@email.com', date: '2025-01-07 14:30', severity: 'info' },
      { id: 2, type: 'event_created', message: 'Nouvel événement créé: "CQB Masterclass"', date: '2025-01-07 13:45', severity: 'info' },
      { id: 3, type: 'system_alert', message: 'Taux d\'erreur API élevé: 2.3%', date: '2025-01-07 12:15', severity: 'warning' },
      { id: 4, type: 'user_suspension', message: 'Utilisateur suspendu: spam@example.com', date: '2025-01-07 11:20', severity: 'warning' },
      { id: 5, type: 'backup_completed', message: 'Sauvegarde automatique terminée', date: '2025-01-07 10:00', severity: 'success' }
    ]);

    setSystemAlerts([
      { id: 1, type: 'performance', message: 'Temps de réponse API > 500ms', severity: 'warning', active: true },
      { id: 2, type: 'security', message: 'Tentative de connexion suspecte détectée', severity: 'error', active: true },
      { id: 3, type: 'storage', message: 'Espace disque à 85%', severity: 'warning', active: false }
    ]);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <DashboardLayout userRole="super_admin">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Dashboard Super Admin</h1>
          <p className="text-red-100 text-lg">Contrôle total du système et supervision globale</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Système opérationnel</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm">{systemAlerts.filter(a => a.active).length} alertes actives</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
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
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
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
                <p className="text-sm font-medium text-gray-600">Organisateurs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrganizers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">🏢</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+3%</span>
              <span className="text-gray-500 ml-2">ce mois</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entreprises</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCompanies}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">💼</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+5%</span>
              <span className="text-gray-500 ml-2">ce mois</span>
            </div>
          </div>
        </div>

        {/* System Health & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">État du Système</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-800">API Gateway</span>
                </div>
                <span className="text-sm text-green-600">Opérationnel</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-800">Base de données</span>
                </div>
                <span className="text-sm text-green-600">Opérationnel</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-yellow-800">Cache Redis</span>
                </div>
                <span className="text-sm text-yellow-600">Lent</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-800">Services Micro</span>
                </div>
                <span className="text-sm text-green-600">Opérationnel</span>
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes Actives</h3>
            <div className="space-y-3">
              {systemAlerts.filter(alert => alert.active).map(alert => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getSeverityIcon(alert.severity)}</span>
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm opacity-75 mt-1">Type: {alert.type}</p>
                    </div>
                  </div>
                </div>
              ))}
              {systemAlerts.filter(alert => alert.active).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl">✅</span>
                  <p className="mt-2">Aucune alerte active</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                <span className="text-lg">{getSeverityIcon(activity.severity)}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(activity.severity)}`}>
                  {activity.type}
                </span>
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
                <span className="text-2xl">👥</span>
                <p className="text-sm font-medium text-blue-800 mt-2">Gérer Utilisateurs</p>
              </div>
            </button>
            
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
              <div className="text-center">
                <span className="text-2xl">🎯</span>
                <p className="text-sm font-medium text-green-800 mt-2">Modérer Événements</p>
              </div>
            </button>
            
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <div className="text-center">
                <span className="text-2xl">📊</span>
                <p className="text-sm font-medium text-purple-800 mt-2">Voir Statistiques</p>
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

export default SuperAdminDashboard; 