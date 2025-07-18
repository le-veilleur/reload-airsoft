import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const ModeratorSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockSettings = {
      notifications: {
        emailAlerts: true,
        pushNotifications: true,
        reportAlerts: true,
        userAlerts: false
      },
      moderation: {
        autoFlag: true,
        requireEvidence: true,
        maxWarnings: 3,
        suspensionDuration: 7
      },
      interface: {
        darkMode: false,
        compactView: true,
        showAdvanced: false
      },
      privacy: {
        showName: true,
        logActions: true,
        shareStats: false
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
      <DashboardLayout userRole="moderator">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des paramètres...</p>
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
          <h1 className="text-4xl font-bold mb-2">Paramètres</h1>
          <p className="text-orange-100 text-lg">Configuration de votre espace modérateur</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Paramètres sauvegardés</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm">Dernière modification: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🔔</span>
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Alertes email</label>
                  <p className="text-xs text-gray-500">Recevoir des emails pour les signalements</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', 'emailAlerts', !settings.notifications?.emailAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications?.emailAlerts ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications?.emailAlerts ? 'translate-x-6' : 'translate-x-1'
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
                  <label className="text-sm font-medium text-gray-700">Alertes signalements</label>
                  <p className="text-xs text-gray-500">Notifications pour nouveaux signalements</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', 'reportAlerts', !settings.notifications?.reportAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications?.reportAlerts ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications?.reportAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Alertes utilisateurs</label>
                  <p className="text-xs text-gray-500">Notifications pour actions utilisateurs</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', 'userAlerts', !settings.notifications?.userAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications?.userAlerts ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications?.userAlerts ? 'translate-x-6' : 'translate-x-1'
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
                  <label className="text-sm font-medium text-gray-700">Marquage automatique</label>
                  <p className="text-xs text-gray-500">Marquer automatiquement le contenu suspect</p>
                </div>
                <button
                  onClick={() => handleSettingChange('moderation', 'autoFlag', !settings.moderation?.autoFlag)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.moderation?.autoFlag ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.moderation?.autoFlag ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Preuves requises</label>
                  <p className="text-xs text-gray-500">Exiger des preuves pour les actions</p>
                </div>
                <button
                  onClick={() => handleSettingChange('moderation', 'requireEvidence', !settings.moderation?.requireEvidence)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.moderation?.requireEvidence ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.moderation?.requireEvidence ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avertissements maximum</label>
                <input
                  type="number"
                  value={settings.moderation?.maxWarnings}
                  onChange={(e) => handleSettingChange('moderation', 'maxWarnings', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée suspension (jours)</label>
                <input
                  type="number"
                  value={settings.moderation?.suspensionDuration}
                  onChange={(e) => handleSettingChange('moderation', 'suspensionDuration', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interface & Privacy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interface Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🎨</span>
              Interface
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Mode sombre</label>
                  <p className="text-xs text-gray-500">Interface en mode sombre</p>
                </div>
                <button
                  onClick={() => handleSettingChange('interface', 'darkMode', !settings.interface?.darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.interface?.darkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.interface?.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Vue compacte</label>
                  <p className="text-xs text-gray-500">Affichage compact des listes</p>
                </div>
                <button
                  onClick={() => handleSettingChange('interface', 'compactView', !settings.interface?.compactView)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.interface?.compactView ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.interface?.compactView ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Options avancées</label>
                  <p className="text-xs text-gray-500">Afficher les options avancées</p>
                </div>
                <button
                  onClick={() => handleSettingChange('interface', 'showAdvanced', !settings.interface?.showAdvanced)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.interface?.showAdvanced ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.interface?.showAdvanced ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🔒</span>
              Confidentialité
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Afficher nom</label>
                  <p className="text-xs text-gray-500">Afficher votre nom aux utilisateurs</p>
                </div>
                <button
                  onClick={() => handleSettingChange('privacy', 'showName', !settings.privacy?.showName)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.privacy?.showName ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.privacy?.showName ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Journaliser actions</label>
                  <p className="text-xs text-gray-500">Enregistrer vos actions de modération</p>
                </div>
                <button
                  onClick={() => handleSettingChange('privacy', 'logActions', !settings.privacy?.logActions)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.privacy?.logActions ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.privacy?.logActions ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Partager statistiques</label>
                  <p className="text-xs text-gray-500">Partager vos stats avec l'équipe</p>
                </div>
                <button
                  onClick={() => handleSettingChange('privacy', 'shareStats', !settings.privacy?.shareStats)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.privacy?.shareStats ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.privacy?.shareStats ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sauvegarder les modifications</h2>
              <p className="text-sm text-gray-600">Vos paramètres seront appliqués immédiatement</p>
            </div>
            <div className="flex space-x-4">
              <button className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Annuler
              </button>
              <button className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg transition-colors">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModeratorSettings; 