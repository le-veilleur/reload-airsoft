import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const OrganizerSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockSettings = {
      profile: {
        name: 'John Organizer',
        email: 'john.organizer@email.com',
        phone: '06 12 34 56 78',
        company: 'Airsoft Events Pro',
        website: 'www.airsofteventspro.com'
      },
      notifications: {
        newRegistrations: true,
        paymentReceived: true,
        eventReminders: true,
        marketingEmails: false
      },
      events: {
        autoApprove: false,
        requirePayment: true,
        maxParticipants: 50,
        cancellationPolicy: '24h'
      },
      payments: {
        stripeEnabled: true,
        paypalEnabled: true,
        bankTransfer: true,
        autoRefund: false
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
      <DashboardLayout userRole="organizer">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des paramètres...</p>
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
          <h1 className="text-4xl font-bold mb-2">Paramètres</h1>
          <p className="text-green-100 text-lg">Configurez votre espace organisateur</p>
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
          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">👤</span>
              Profil Organisateur
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={settings.profile?.name}
                  onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={settings.profile?.email}
                  onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={settings.profile?.phone}
                  onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Entreprise</label>
                <input
                  type="text"
                  value={settings.profile?.company}
                  onChange={(e) => handleSettingChange('profile', 'company', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                <input
                  type="url"
                  value={settings.profile?.website}
                  onChange={(e) => handleSettingChange('profile', 'website', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🔔</span>
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nouvelles inscriptions</label>
                  <p className="text-xs text-gray-500">Recevoir des notifications pour chaque inscription</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', 'newRegistrations', !settings.notifications?.newRegistrations)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications?.newRegistrations ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications?.newRegistrations ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Paiements reçus</label>
                  <p className="text-xs text-gray-500">Notifications pour les paiements confirmés</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', 'paymentReceived', !settings.notifications?.paymentReceived)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications?.paymentReceived ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications?.paymentReceived ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Rappels événements</label>
                  <p className="text-xs text-gray-500">Rappels avant vos événements</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', 'eventReminders', !settings.notifications?.eventReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications?.eventReminders ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications?.eventReminders ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Emails marketing</label>
                  <p className="text-xs text-gray-500">Recevoir des offres et nouveautés</p>
                </div>
                <button
                  onClick={() => handleSettingChange('notifications', 'marketingEmails', !settings.notifications?.marketingEmails)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications?.marketingEmails ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications?.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Event & Payment Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">🎯</span>
              Paramètres Événements
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Approbation automatique</label>
                  <p className="text-xs text-gray-500">Approuver automatiquement les inscriptions</p>
                </div>
                <button
                  onClick={() => handleSettingChange('events', 'autoApprove', !settings.events?.autoApprove)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.events?.autoApprove ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.events?.autoApprove ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Paiement obligatoire</label>
                  <p className="text-xs text-gray-500">Exiger un paiement pour confirmer l'inscription</p>
                </div>
                <button
                  onClick={() => handleSettingChange('events', 'requirePayment', !settings.events?.requirePayment)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.events?.requirePayment ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.events?.requirePayment ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Participants maximum par défaut</label>
                <input
                  type="number"
                  value={settings.events?.maxParticipants}
                  onChange={(e) => handleSettingChange('events', 'maxParticipants', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Politique d'annulation</label>
                <select
                  value={settings.events?.cancellationPolicy}
                  onChange={(e) => handleSettingChange('events', 'cancellationPolicy', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="24h">24h avant l'événement</option>
                  <option value="48h">48h avant l'événement</option>
                  <option value="72h">72h avant l'événement</option>
                  <option value="1week">1 semaine avant l'événement</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">💰</span>
              Méthodes de Paiement
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Stripe</label>
                  <p className="text-xs text-gray-500">Paiements par carte bancaire</p>
                </div>
                <button
                  onClick={() => handleSettingChange('payments', 'stripeEnabled', !settings.payments?.stripeEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.payments?.stripeEnabled ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.payments?.stripeEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">PayPal</label>
                  <p className="text-xs text-gray-500">Paiements via PayPal</p>
                </div>
                <button
                  onClick={() => handleSettingChange('payments', 'paypalEnabled', !settings.payments?.paypalEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.payments?.paypalEnabled ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.payments?.paypalEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Virement bancaire</label>
                  <p className="text-xs text-gray-500">Paiements par virement</p>
                </div>
                <button
                  onClick={() => handleSettingChange('payments', 'bankTransfer', !settings.payments?.bankTransfer)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.payments?.bankTransfer ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.payments?.bankTransfer ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Remboursement automatique</label>
                  <p className="text-xs text-gray-500">Rembourser automatiquement les annulations</p>
                </div>
                <button
                  onClick={() => handleSettingChange('payments', 'autoRefund', !settings.payments?.autoRefund)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.payments?.autoRefund ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.payments?.autoRefund ? 'translate-x-6' : 'translate-x-1'
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
              <button className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-colors">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerSettings; 