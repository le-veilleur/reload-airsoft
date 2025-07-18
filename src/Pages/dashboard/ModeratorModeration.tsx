import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';

const ModeratorModeration: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données
    const mockReports = [
      {
        id: '1',
        type: 'user',
        target: 'user123',
        reason: 'Comportement toxique',
        reporter: 'player456',
        date: '2025-07-07 14:30',
        status: 'pending',
        description: 'Utilisateur harcelant d\'autres joueurs'
      },
      {
        id: '2',
        type: 'event',
        target: 'Tournoi Speedsoft',
        reason: 'Règles non conformes',
        reporter: 'admin1',
        date: '2025-07-07 16:45',
        status: 'investigating',
        description: 'Événement avec règles de sécurité insuffisantes'
      }
    ];

    setReports(mockReports);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="moderator">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de la modération...</p>
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
          <h1 className="text-4xl font-bold mb-2">Modération</h1>
          <p className="text-orange-100 text-lg">Gestion des signalements</p>
        </div>

        {/* Reports */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Signalements</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Signalé: {report.target}</h3>
                  <span className="text-xs text-gray-500">{report.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Raison: {report.reason}</p>
                <p className="text-sm text-gray-700 mb-4">{report.description}</p>
                <div className="flex space-x-2">
                  <button className="text-orange-600 hover:text-orange-900 bg-orange-100 hover:bg-orange-200 px-3 py-1 rounded-md transition-colors text-sm">
                    Enquêter
                  </button>
                  <button className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors text-sm">
                    Résoudre
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors text-sm">
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModeratorModeration; 