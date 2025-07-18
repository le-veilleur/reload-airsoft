import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const SuperAdminOrganizers: React.FC = () => {
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockOrganizers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@email.com',
        events_count: 15,
        total_participants: 450,
        rating: 4.8,
        status: 'active',
        verified: true,
        joined_date: '2024-01-15'
      },
      {
        id: '2',
        name: 'Marie Martin',
        email: 'marie.martin@email.com',
        events_count: 8,
        total_participants: 200,
        rating: 4.5,
        status: 'active',
        verified: true,
        joined_date: '2024-02-20'
      },
      {
        id: '3',
        name: 'Pierre Durand',
        email: 'pierre.durand@email.com',
        events_count: 25,
        total_participants: 800,
        rating: 4.9,
        status: 'suspended',
        verified: true,
        joined_date: '2024-03-10'
      }
    ];

    setOrganizers(mockOrganizers);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="super_admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des organisateurs...</p>
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
          <h1 className="text-4xl font-bold mb-2">Gestion des Organisateurs</h1>
          <p className="text-red-100 text-lg">Supervision des organisateurs d'événements</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">{organizers.length} organisateurs</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm">{organizers.filter(o => o.verified).length} vérifiés</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Organisateurs</p>
                <p className="text-3xl font-bold text-gray-900">{organizers.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">🏢</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Événements Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {organizers.reduce((sum, org) => sum + org.events_count, 0)}
                </p>
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
                <p className="text-3xl font-bold text-gray-900">
                  {organizers.reduce((sum, org) => sum + org.total_participants, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Organizers Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Événements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
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
                {organizers.map((organizer) => (
                  <tr key={organizer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {organizer.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{organizer.name}</div>
                          <div className="text-sm text-gray-500">{organizer.email}</div>
                          <div className="text-xs text-gray-400">Depuis {organizer.joined_date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{organizer.events_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{organizer.total_participants.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">{organizer.rating}</span>
                        <span className="text-yellow-400 ml-1">⭐</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        organizer.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {organizer.status === 'active' ? 'Actif' : 'Suspendu'}
                      </span>
                      {organizer.verified && (
                        <span className="ml-2 text-blue-600">✓</span>
                      )}
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

export default SuperAdminOrganizers; 