import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

const SuperAdminEvents: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    const mockEvents = [
      {
        id: '1',
        title: 'CQB Masterclass',
        organizer: 'John Doe',
        organizer_email: 'john.doe@email.com',
        category: 'CQB',
        status: 'active',
        date: '2025-02-15',
        location: 'Paris',
        max_participants: 30,
        current_participants: 25,
        price: 45,
        created_at: '2025-01-05',
        reported: false
      },
      {
        id: '2',
        title: 'Tournoi Speedsoft',
        organizer: 'Marie Martin',
        organizer_email: 'marie.martin@email.com',
        category: 'Speedsoft',
        status: 'pending',
        date: '2025-02-20',
        location: 'Lyon',
        max_participants: 20,
        current_participants: 0,
        price: 30,
        created_at: '2025-01-06',
        reported: true
      },
      {
        id: '3',
        title: 'Milsim Weekend',
        organizer: 'Pierre Durand',
        organizer_email: 'pierre.durand@email.com',
        category: 'Milsim',
        status: 'active',
        date: '2025-03-01',
        location: 'Bordeaux',
        max_participants: 50,
        current_participants: 48,
        price: 80,
        created_at: '2025-01-04',
        reported: false
      },
      {
        id: '4',
        title: 'Entraînement Tactical',
        organizer: 'Sophie Leroy',
        organizer_email: 'sophie.leroy@email.com',
        category: 'Tactical',
        status: 'suspended',
        date: '2025-02-10',
        location: 'Marseille',
        max_participants: 25,
        current_participants: 15,
        price: 60,
        created_at: '2025-01-03',
        reported: true
      },
      {
        id: '5',
        title: 'CQB Perfectionnement',
        organizer: 'Lucas Moreau',
        organizer_email: 'lucas.moreau@email.com',
        category: 'CQB',
        status: 'active',
        date: '2025-02-25',
        location: 'Toulouse',
        max_participants: 15,
        current_participants: 12,
        price: 40,
        created_at: '2025-01-07',
        reported: false
      }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, categoryFilter]);

  const handleEventAction = (action: string, eventId: string) => {
    console.log(`Action ${action} sur l'événement ${eventId}`);
    
    switch (action) {
      case 'view':
        // Rediriger vers la page de détail de l'événement
        navigate(`/events/${eventId}`);
        break;
      case 'edit':
        // Rediriger vers la page de modification de l'événement
        navigate(`/events/edit/${eventId}`);
        break;
      case 'approve':
        // Logique d'approbation
        console.log('Approuver événement:', eventId);
        break;
      case 'suspend':
        // Logique de suspension
        console.log('Suspendre événement:', eventId);
        break;
      case 'activate':
        // Logique d'activation
        console.log('Activer événement:', eventId);
        break;
      case 'delete':
        // Logique de suppression
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
          console.log('Supprimer événement:', eventId);
        }
        break;
      default:
        console.log('Action non reconnue:', action);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Action en masse ${action} sur les événements:`, selectedEvents);
    // Ici tu implémenteras les vraies actions en masse
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Actif' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      suspended: { color: 'bg-red-100 text-red-800', label: 'Suspendu' },
      cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Annulé' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      CQB: { color: 'bg-blue-100 text-blue-800' },
      Speedsoft: { color: 'bg-purple-100 text-purple-800' },
      Milsim: { color: 'bg-green-100 text-green-800' },
      Tactical: { color: 'bg-orange-100 text-orange-800' }
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || { color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {category}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout userRole="super_admin">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des événements...</p>
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
          <h1 className="text-4xl font-bold mb-2">Gestion des Événements</h1>
          <p className="text-red-100 text-lg">Modération et supervision de tous les événements</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">{events.length} événements total</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm">{events.filter(e => e.reported).length} signalés</span>
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
                placeholder="Titre, organisateur, lieu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
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
                <option value="pending">En attente</option>
                <option value="suspended">Suspendu</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                <option value="CQB">CQB</option>
                <option value="Speedsoft">Speedsoft</option>
                <option value="Milsim">Milsim</option>
                <option value="Tactical">Tactical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedEvents.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedEvents.length} événement(s) sélectionné(s)
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('approve')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Approuver
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Suspendre
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events Table */}
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
                          setSelectedEvents(filteredEvents.map(e => e.id));
                        } else {
                          setSelectedEvents([]);
                        }
                      }}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Événement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Signalé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents([...selectedEvents, event.id]);
                          } else {
                            setSelectedEvents(selectedEvents.filter(id => id !== event.id));
                          }
                        }}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.date} • {event.location}</div>
                        <div className="text-sm text-gray-400">{event.price}€</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{event.organizer}</div>
                        <div className="text-sm text-gray-500">{event.organizer_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryBadge(event.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {event.current_participants}/{event.max_participants}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(event.current_participants / event.max_participants) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.reported ? (
                        <span className="text-red-600">🚨</span>
                      ) : (
                        <span className="text-green-600">✅</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEventAction('view', event.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEventAction('edit', event.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          ✏️
                        </button>
                        {event.status === 'pending' ? (
                          <button
                            onClick={() => handleEventAction('approve', event.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            ✅
                          </button>
                        ) : event.status === 'active' ? (
                          <button
                            onClick={() => handleEventAction('suspend', event.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            ⏸️
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEventAction('activate', event.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            ▶️
                          </button>
                        )}
                        <button
                          onClick={() => handleEventAction('delete', event.id)}
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
              Affichage de 1 à {filteredEvents.length} sur {events.length} événements
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

export default SuperAdminEvents; 