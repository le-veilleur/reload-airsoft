import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const OrganizerFinances: React.FC = () => {
  const [finances, setFinances] = useState<any>({});
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simuler le chargement des données
    const mockFinances = {
      totalRevenue: 2840,
      totalExpenses: 1200,
      netProfit: 1640,
      pendingPayments: 450,
      thisMonth: 890,
      lastMonth: 1950
    };

    const mockTransactions = [
      {
        id: '1',
        eventTitle: 'CQB Perfectionnement',
        participant: 'Jean Dupont',
        type: 'income',
        amount: 45,
        date: '2025-07-07',
        status: 'completed',
        paymentMethod: 'card'
      },
      {
        id: '2',
        eventTitle: 'Tournoi Speedsoft',
        participant: 'Marie Martin',
        type: 'income',
        amount: 60,
        date: '2025-07-06',
        status: 'pending',
        paymentMethod: 'transfer'
      },
      {
        id: '3',
        eventTitle: 'Location terrain',
        participant: 'Terrain de jeu',
        type: 'expense',
        amount: 200,
        date: '2025-07-05',
        status: 'completed',
        paymentMethod: 'transfer'
      },
      {
        id: '4',
        eventTitle: 'Entraînement Tactical',
        participant: 'Pierre Durand',
        type: 'income',
        amount: 35,
        date: '2025-07-04',
        status: 'completed',
        paymentMethod: 'cash'
      },
      {
        id: '5',
        eventTitle: 'Matériel',
        participant: 'Fournisseur',
        type: 'expense',
        amount: 150,
        date: '2025-07-03',
        status: 'completed',
        paymentMethod: 'card'
      }
    ];

    setFinances(mockFinances);
    setTransactions(mockTransactions);
    setLoading(false);
  }, []);

  const getTransactionTypeBadge = (type: string) => {
    const typeConfig = {
      income: { color: 'bg-green-100 text-green-800', label: 'Revenu', icon: '💰' },
      expense: { color: 'bg-red-100 text-red-800', label: 'Dépense', icon: '💸' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.income;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} flex items-center`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', label: 'Terminé', icon: '✅' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: '⏳' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Annulé', icon: '❌' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} flex items-center`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout userRole="organizer">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des finances...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredTransactions = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

  return (
    <DashboardLayout userRole="organizer">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Gestion Financière</h1>
          <p className="text-green-100 text-lg">Suivez vos revenus et dépenses</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">Bénéfice net: {finances.netProfit}€</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm">{finances.pendingPayments}€ en attente</span>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
                <p className="text-3xl font-bold text-green-600">{finances.totalRevenue}€</p>
                <p className="text-sm text-gray-500">Ce mois: +{finances.thisMonth}€</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dépenses Totales</p>
                <p className="text-3xl font-bold text-red-600">{finances.totalExpenses}€</p>
                <p className="text-sm text-gray-500">Ce mois: -{finances.totalExpenses}€</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">💸</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bénéfice Net</p>
                <p className="text-3xl font-bold text-blue-600">{finances.netProfit}€</p>
                <p className="text-sm text-gray-500">Marge: {Math.round((finances.netProfit / finances.totalRevenue) * 100)}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paiements en Attente</p>
                <p className="text-3xl font-bold text-yellow-600">{finances.pendingPayments}€</p>
                <p className="text-sm text-gray-500">À recevoir</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Évolution des Revenus
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ce mois</p>
                  <p className="text-2xl font-bold text-gray-900">{finances.thisMonth}€</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">+{Math.round(((finances.thisMonth - finances.lastMonth) / finances.lastMonth) * 100)}%</p>
                  <p className="text-xs text-gray-500">vs mois dernier</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mois dernier</p>
                  <p className="text-2xl font-bold text-gray-900">{finances.lastMonth}€</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Référence</p>
                  <p className="text-xs text-gray-500">période précédente</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">💸</span>
              Répartition des Dépenses
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Location terrain</span>
                </div>
                <span className="text-sm font-medium text-gray-900">200€</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Matériel</span>
                </div>
                <span className="text-sm font-medium text-gray-900">150€</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Marketing</span>
                </div>
                <span className="text-sm font-medium text-gray-900">100€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Transactions Récentes</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Toutes les transactions</option>
              <option value="income">Revenus</option>
              <option value="expense">Dépenses</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getTransactionTypeBadge(transaction.type)}
                      {getStatusBadge(transaction.status)}
                    </div>
                    <h3 className="font-semibold text-gray-900">{transaction.eventTitle}</h3>
                    <p className="text-sm text-gray-600">{transaction.participant}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{transaction.amount}€
                    </div>
                    <p className="text-xs text-gray-500">{transaction.paymentMethod}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">⚡</span>
            Actions Rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="group p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📊</span>
                <p className="text-sm font-semibold text-gray-900">Générer Rapport</p>
                <p className="text-xs text-gray-600 mt-1">Exporter les données</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">💰</span>
                <p className="text-sm font-semibold text-gray-900">Nouvelle Dépense</p>
                <p className="text-xs text-gray-600 mt-1">Enregistrer une dépense</p>
              </div>
            </button>
            <button className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <div className="text-center">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📈</span>
                <p className="text-sm font-semibold text-gray-900">Analytics</p>
                <p className="text-xs text-gray-600 mt-1">Voir les tendances</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerFinances; 