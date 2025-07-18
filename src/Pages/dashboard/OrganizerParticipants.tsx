import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const OrganizerParticipants: React.FC = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simuler le chargement des données
    const mockEvents = [
      { id: '1', title: 'CQB Perfectionnement' },
      { id: '2', title: 'Tournoi Speedsoft' },
      { id: '3', title: 'Entraînement Tactical' }
    ];

    const mockParticipants = [
      {
        id: '1',
        eventId: '1',
        eventTitle: 'CQB Perfectionnement',
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        phone: '06 12 34 56 78',
        status: 'confirmed',
        registrationDate: '2025-06-15',
        paymentStatus: 'paid',
        amount: 45
      },
      {
        id: '2',
        eventId: '1',
        eventTitle: 'CQB Perfectionnement',
        name: 'Marie Martin',
        email: 'marie.martin@email.com',
        phone: '06 98 76 54 32',
        status: 'confirmed',
        registrationDate: '2025-06-16',
        paymentStatus: 'paid',
        amount: 45
      },
      {
        id: '3',
        eventId: '2',
        eventTitle: 'Tournoi Speedsoft',
        name: 'Pierre Durand',
        email: 'pierre.durand@email.com',
        phone: '06 11 22 33 44',
        status: 'pending',
        registrationDate: '2025-07-01',
        paymentStatus: 'pending',
        amount: 60
      },
      {
        id: '4',
        eventId: '3',
        eventTitle: 'Entraînement Tactical',
        name: 'Sophie Bernard',
        email: 'sophie.bernard@email.com',
        phone: '06 55 66 77 88',
        status: 'cancelled',
        registrationDate: '2025-06-20',
        paymentStatus: 'refunded',
        amount: 35
      }
    ];

    setEvents(mockEvents);
    setParticipants(mockParticipants);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmé', icon: '✅' },
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

  const getPaymentBadge = (status: string) => {
    const paymentConfig = {
      paid: { color: 'bg-green-100 text-green-800', label: 'Payé', icon: '💰' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: '⏳' },
      refunded: { color: 'bg-red-100 text-red-800', label: 'Remboursé', icon: '↩️' }
    };
    
    const config = paymentConfig[status as keyof typeof paymentConfig] || paymentConfig.pending;
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
            <p className="mt-4 text-gray-600">Chargement des participants...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredParticipants = participants.filter(p => {
    const eventMatch = selectedEvent === 'all' || p.eventId === selectedEvent;
    const statusMatch = filter === 'all' || p.status === filter;
    return eventMatch && statusMatch;
  });

  return (
    <DashboardLayout userRole="organizer">
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Gestion des Participants</h1>
          <p className="text-green-100 text-lg">Suivez les inscriptions et paiements</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm">{participants.filter(p => p.status === 'confirmed').length} confirmés</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm">{participants.filter(p => p.status === 'pending').length} en attente</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-3xl font-bold text-gray-900">{participants.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmés</p>
                <p className="text-3xl font-bold text-gray-900">
                  {participants.filter(p => p.status === 'confirmed').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-3xl font-bold text-gray-900">
                  {participants.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-3xl font-bold text-gray-900">
                  {participants.filter(p => p.paymentStatus === 'paid').reduce((sum, p) => sum + p.amount, 0)}€
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Événement</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les événements</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>{event.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="confirmed">Confirmés</option>
                <option value="pending">En attente</option>
                <option value="cancelled">Annulés</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                📊 Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Liste des Participants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Événement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredParticipants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                        <div className="text-sm text-gray-500">{participant.email}</div>
                        <div className="text-xs text-gray-400">{participant.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{participant.eventTitle}</div>
                      <div className="text-xs text-gray-500">{participant.registrationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(participant.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentBadge(participant.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{participant.amount}€</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors">
                          👁️ Voir
                        </button>
                        <button className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors">
                          ✅ Confirmer
                        </button>
                        <button className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors">
                          ❌ Annuler
                        </button>
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

export default OrganizerParticipants; 