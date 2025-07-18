import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const SuperAdminCompanies: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockCompanies = [
      {
        id: '1',
        name: 'Airsoft Pro',
        contact: 'contact@airsoftpro.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de la Paix, Paris',
        type: 'Équipement',
        status: 'active',
        verified: true,
        ads_count: 5,
        revenue: 15000,
        joined_date: '2024-01-15'
      },
      {
        id: '2',
        name: 'Tactical Gear',
        contact: 'info@tacticalgear.fr',
        phone: '+33 4 56 78 90 12',
        address: '456 Avenue des Champs, Lyon',
        type: 'Vêtements',
        status: 'active',
        verified: true,
        ads_count: 3,
        revenue: 8000,
        joined_date: '2024-02-20'
      },
      {
        id: '3',
        name: 'Speedsoft Arena',
        contact: 'hello@speedsoftarena.com',
        phone: '+33 5 67 89 01 23',
        address: '789 Boulevard Central, Bordeaux',
        type: 'Terrain',
        status: 'pending',
        verified: false,
        ads_count: 1,
        revenue: 2000,
        joined_date: '2024-03-10'
      }
    ];

    setCompanies(mockCompanies);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="super_admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des entreprises...</p>
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
          <h1 className="text-4xl font-bold mb-2">Gestion des Entreprises</h1>
          <p className="text-red-100 text-lg">Supervision des entreprises partenaires</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">{companies.length} entreprises</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm">{companies.filter(c => c.verified).length} vérifiées</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Entreprises</p>
                <p className="text-3xl font-bold text-gray-900">{companies.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">💼</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Publicités Actives</p>
                <p className="text-3xl font-bold text-gray-900">
                  {companies.reduce((sum, comp) => sum + comp.ads_count, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">📢</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {companies.reduce((sum, comp) => sum + comp.revenue, 0).toLocaleString()}€
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-3xl font-bold text-gray-900">
                  {companies.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publicités
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.contact}</div>
                        <div className="text-xs text-gray-400">{company.phone}</div>
                        <div className="text-xs text-gray-400">{company.address}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {company.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.ads_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.revenue.toLocaleString()}€</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          company.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {company.status === 'active' ? 'Actif' : 'En attente'}
                        </span>
                        {company.verified && (
                          <span className="text-blue-600">✓</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">👁️</button>
                        <button className="text-green-600 hover:text-green-900">✏️</button>
                        <button className="text-yellow-600 hover:text-yellow-900">⏸️</button>
                        <button className="text-red-600 hover:text-red-900">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminCompanies; 