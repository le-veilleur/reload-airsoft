import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const CompanyDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalAds: 0,
    activeAds: 0,
    totalViews: 0,
    totalClicks: 0,
    totalSpent: 0,
    conversionRate: 0
  });

  const [myAds, setMyAds] = useState<any[]>([]);
  const [recentBilling, setRecentBilling] = useState<any[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    setStats({
      totalAds: 8,
      activeAds: 3,
      totalViews: 15420,
      totalClicks: 1234,
      totalSpent: 850,
      conversionRate: 8.0
    });

    setMyAds([
      { 
        id: 1, 
        title: 'Équipement Tactical Pro', 
        status: 'active', 
        views: 5420, 
        clicks: 432,
        spent: 320,
        startDate: '2025-06-01',
        endDate: '2025-07-31'
      },
      { 
        id: 2, 
        title: 'Répliques Airsoft Elite', 
        status: 'active', 
        views: 3200, 
        clicks: 256,
        spent: 180,
        startDate: '2025-06-15',
        endDate: '2025-07-15'
      },
      { 
        id: 3, 
        title: 'Protection Militaire', 
        status: 'paused', 
        views: 6800, 
        clicks: 546,
        spent: 350,
        startDate: '2025-05-01',
        endDate: '2025-06-30'
      }
    ]);

    setRecentBilling([
      { id: 1, amount: 320, description: 'Équipement Tactical Pro - Juin 2025', date: '2025-06-30', status: 'paid' },
      { id: 2, amount: 180, description: 'Répliques Airsoft Elite - Juin 2025', date: '2025-06-30', status: 'paid' },
      { id: 3, amount: 350, description: 'Protection Militaire - Mai 2025', date: '2025-05-31', status: 'paid' }
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

  const AdCard = ({ ad }: { ad: any }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{ad.title}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          ad.status === 'active' ? 'bg-green-100 text-green-800' :
          ad.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {ad.status === 'active' ? 'Actif' : ad.status === 'paused' ? 'En pause' : 'Terminé'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-500">Vues</p>
          <p className="text-sm font-medium text-gray-900">{ad.views.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Clics</p>
          <p className="text-sm font-medium text-gray-900">{ad.clicks.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Dépensé</p>
          <p className="text-sm font-medium text-gray-900">{ad.spent}€</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">CTR</p>
          <p className="text-sm font-medium text-gray-900">{((ad.clicks / ad.views) * 100).toFixed(1)}%</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        {ad.startDate} - {ad.endDate}
      </p>
      <div className="flex space-x-2">
        <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
          Modifier
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded hover:bg-green-200">
          {ad.status === 'active' ? 'Pause' : 'Activer'}
        </button>
        <button className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded hover:bg-purple-200">
          Statistiques
        </button>
      </div>
    </div>
  );

  const BillingCard = ({ bill }: { bill: any }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{bill.description}</p>
        <p className="text-xs text-gray-500">{bill.date}</p>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-900">{bill.amount}€</span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {bill.status === 'paid' ? 'Payé' : 'En attente'}
        </span>
      </div>
    </div>
  );

  return (
    <DashboardLayout userRole="company">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Entreprise</h1>
          <p className="mt-2 text-gray-600">Gérez vos publicités et facturation</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Publicités totales"
            value={stats.totalAds}
            icon="📢"
            color="border-blue-500"
          />
          <StatCard
            title="Publicités actives"
            value={stats.activeAds}
            icon="🔥"
            color="border-green-500"
          />
          <StatCard
            title="Vues totales"
            value={stats.totalViews.toLocaleString()}
            icon="👁️"
            color="border-purple-500"
          />
          <StatCard
            title="Clics totaux"
            value={stats.totalClicks.toLocaleString()}
            icon="🖱️"
            color="border-yellow-500"
          />
          <StatCard
            title="Dépensé total (€)"
            value={stats.totalSpent.toLocaleString()}
            icon="💰"
            color="border-emerald-500"
          />
          <StatCard
            title="Taux de conversion"
            value={`${stats.conversionRate}%`}
            icon="📈"
            color="border-red-500"
          />
        </div>

        {/* Ads & Billing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Ads */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Mes publicités</h2>
              <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Créer une publicité
              </button>
            </div>
            <div className="space-y-4">
              {myAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>

          {/* Recent Billing */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Facturation récente</h2>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                À jour
              </span>
            </div>
            <div className="space-y-2">
              {recentBilling.map((bill) => (
                <BillingCard key={bill.id} bill={bill} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <span className="text-2xl">📢</span>
                <p className="mt-2 text-sm font-medium text-gray-900">Créer publicité</p>
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
                <span className="text-2xl">💰</span>
                <p className="mt-2 text-sm font-medium text-gray-900">Gérer facturation</p>
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

export default CompanyDashboard; 