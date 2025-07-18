import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const SuperAdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    const mockUsers = [
      {
        id: '1',
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean.dupont@email.com',
        pseudonyme: 'jean_du',
        role: 'player',
        status: 'active',
        email_verified: true,
        created_at: '2024-01-15',
        last_login: '2025-01-07 14:30'
      },
      {
        id: '2',
        firstname: 'Marie',
        lastname: 'Martin',
        email: 'marie.martin@email.com',
        pseudonyme: 'marie_m',
        role: 'organizer',
        status: 'active',
        email_verified: true,
        created_at: '2024-02-20',
        last_login: '2025-01-07 13:45'
      },
      {
        id: '3',
        firstname: 'Pierre',
        lastname: 'Durand',
        email: 'pierre.durand@email.com',
        pseudonyme: 'pierre_d',
        role: 'admin',
        status: 'active',
        email_verified: true,
        created_at: '2024-03-10',
        last_login: '2025-01-07 12:15'
      },
      {
        id: '4',
        firstname: 'Sophie',
        lastname: 'Leroy',
        email: 'sophie.leroy@email.com',
        pseudonyme: 'sophie_l',
        role: 'player',
        status: 'suspended',
        email_verified: false,
        created_at: '2024-04-05',
        last_login: '2025-01-06 18:20'
      },
      {
        id: '5',
        firstname: 'Lucas',
        lastname: 'Moreau',
        email: 'lucas.moreau@email.com',
        pseudonyme: 'lucas_m',
        role: 'moderator',
        status: 'active',
        email_verified: true,
        created_at: '2024-05-12',
        last_login: '2025-01-07 11:30'
      }
    ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.pseudonyme.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par rôle
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleUserAction = (action: string, userId: string) => {
    console.log(`Action ${action} sur l'utilisateur ${userId}`);
    // Ici tu implémenteras les vraies actions
  };

  const handleBulkAction = (action: string) => {
    console.log(`Action en masse ${action} sur les utilisateurs:`, selectedUsers);
    // Ici tu implémenteras les vraies actions en masse
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      super_admin: { color: 'bg-red-100 text-red-800', label: 'Super Admin' },
      admin: { color: 'bg-purple-100 text-purple-800', label: 'Admin' },
      moderator: { color: 'bg-orange-100 text-orange-800', label: 'Modérateur' },
      organizer: { color: 'bg-blue-100 text-blue-800', label: 'Organisateur' },
      player: { color: 'bg-green-100 text-green-800', label: 'Joueur' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.player;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Actif' },
      suspended: { color: 'bg-yellow-100 text-yellow-800', label: 'Suspendu' },
      banned: { color: 'bg-red-100 text-red-800', label: 'Banni' },
      pending: { color: 'bg-gray-100 text-gray-800', label: 'En attente' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout userRole="super_admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
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
          <h1 className="text-4xl font-bold mb-2">Gestion des Utilisateurs</h1>
          <p className="text-red-100 text-lg">Supervision et modération de tous les utilisateurs</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">{users.length} utilisateurs total</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-sm">{filteredUsers.length} filtrés</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <input
                type="text"
                placeholder="Nom, email, pseudonyme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Tous les rôles</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="moderator">Modérateur</option>
                <option value="organizer">Organisateur</option>
                <option value="player">Joueur</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
                <option value="banned">Banni</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedUsers.length} utilisateur(s) sélectionné(s)
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Suspendre
                </button>
                <button
                  onClick={() => handleBulkAction('ban')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Bannir
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vérifié
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.firstname.charAt(0)}{user.lastname.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstname} {user.lastname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            @{user.pseudonyme}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email_verified ? (
                        <span className="text-green-600">✅</span>
                      ) : (
                        <span className="text-red-600">❌</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUserAction('view', user.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleUserAction('edit', user.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          ✏️
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction('suspend', user.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            ⏸️
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction('activate', user.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            ▶️
                          </button>
                        )}
                        <button
                          onClick={() => handleUserAction('delete', user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de 1 à {filteredUsers.length} sur {users.length} utilisateurs
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Précédent
              </button>
              <button className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminUsers; 