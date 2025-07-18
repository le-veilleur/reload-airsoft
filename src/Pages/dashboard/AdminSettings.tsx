import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockSettings = {
      general: {
        siteName: 'Reload-Airsoft',
        siteDescription: 'Plateforme d\'événements airsoft',
        maintenanceMode: false,
        registrationEnabled: true
      },
      moderation: {
        autoModeration: true,
        requireApproval: true,
        maxParticipants: 100,
        minAge: 16
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        adminAlerts: true
      },
      security: {
        twoFactorAuth: true,
        sessionTimeout: 24,
        maxLoginAttempts: 5
      }
    };

    setSettings(mockSettings);
    setLoading(false);
  }, []);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des paramètres...</p>
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
          <h1 className="text-4xl font-bold mb-2">Configuration</h1>
          <p className="text-purple-100 text-lg">Paramètres de la plateforme</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Système opérationnel</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm">Dernière sauvegarde: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">⚙️</span>
              Paramètres Généraux
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du site</label>
                <input
                  type="text"
                  value={settings.general?.siteName}
                  onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={settings.general?.siteDescription}
                  onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Mode maintenance</label>
                  <p className="text-xs text-gray-500">Désactiver l'accès public</p>
                </div>
                <button
                  onClick={() => handleSettingChange('general', 'maintenanceMode', !settings.general?.maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.general?.maintenanceMode ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.general?.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Inscriptions ouvertes</label>
                  <p className="text-xs text-gray-500">Permettre les nouvelles inscriptions</p>
                </div>
                <button
                  onClick={() => handleSettingChange('general', 'registrationEnabled', !settings.general?.registrationEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.general?.registrationEnabled ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.general?.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Moderation Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🛡️</span>
              Paramètres de Modération
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Modération automatique</label>
                  <p className="text-xs text-gray-500">Filtrage automatique du contenu</p>
                </div>
                <button
                  onClick={() => handleSettingChange('moderation', 'autoModeration', !settings.moderation?.autoModeration)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.moderation?.autoModeration ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.moderation?.autoModeration ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Approbation requise</label>
                  <p className="text-xs text-gray-500">Valider les événements manuellement</p>
                </div>
                <button
                  onClick={() => handleSettingChange('moderation', 'requireApproval', !settings.moderation?.requireApproval)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.moderation?.requireApproval ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.moderation?.requireApproval ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Participants maximum</label>
                <input
                  type="number"
                  value={settings.moderation?.maxParticipants}
                  onChange={(e) => handleSettingChange('moderation', 'maxParticipants', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Âge minimum</label>
                <input
                  type="number"
                  value={settings.moderation?.minAge}
                  onChange={(e) => handleSettingChange('moderation', 'minAge', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Security */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🔔</span>
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Notifications email</label>
                  <p className="text-xs text-gray-500">Envoyer des emails aux utilisateurs</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', 'emailNotifications', !settings.notifications?.emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications?.emailNotifications ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications?.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Notifications push</label>
                  <p className="text-xs text-gray-500">Notifications en temps réel</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', 'pushNotifications', !settings.notifications?.pushNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications?.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications?.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Alertes admin</label>
                  <p className="text-xs text-gray-500">Notifications pour les administrateurs</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', 'adminAlerts', !settings.notifications?.adminAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications?.adminAlerts ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications?.adminAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🔒</span>
              Sécurité
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Authentification 2FA</label>
                  <p className="text-xs text-gray-500">Double authentification</p>
                </div>
                <button
                  onClick={() => handleSettingChange('security', 'twoFactorAuth', !settings.security?.twoFactorAuth)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.security?.twoFactorAuth ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security?.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeout session (heures)</label>
                <input
                  type="number"
                  value={settings.security?.sessionTimeout}
                  onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tentatives de connexion max</label>
                <input
                  type="number"
                  value={settings.security?.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sauvegarder les modifications</h2>
              <p className="text-sm text-gray-600">Les changements seront appliqués immédiatement</p>
            </div>
            <div className="flex space-x-4">
              <button className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Annuler
              </button>
              <button className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-colors">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings; 