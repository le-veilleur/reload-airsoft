import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import { mapAvatarUrl } from '../../Services/userService';

interface UserStats {
  eventsPlayed: number;
  winRate: number;
  level: string;
  totalPoints: number;
  upcomingEvents: number;
  completedEvents: number;
}

interface DashboardProfileSummaryProps {
  stats?: UserStats;
  className?: string;
}

const DashboardProfileSummary: React.FC<DashboardProfileSummaryProps> = ({ 
  stats, 
  className = "" 
}) => {
  const navigate = useNavigate();
  const { user, refreshUserProfile } = useAuth();


  // Statistiques par défaut si non fournies
  const defaultStats: UserStats = {
    eventsPlayed: 0,
    winRate: 0,
    level: "Débutant",
    totalPoints: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    ...stats
  };

  const getDashboardPath = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return '/dashboard/super-admin';
      case 'admin':
        return '/dashboard/admin';
      case 'moderator':
        return '/dashboard/moderator';
      case 'organizer':
        return '/dashboard/organizer';
      case 'company':
        return '/dashboard/company';
      case 'player':
      default:
        return '/dashboard/player';
    }
  };



  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return 'text-red-600 bg-red-100';
      case 'avancé':
        return 'text-orange-600 bg-orange-100';
      case 'intermédiaire':
        return 'text-blue-600 bg-blue-100';
      case 'débutant':
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
            {/* En-tête avec avatar et actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={mapAvatarUrl(user?.avatar_url) || '../../../public/images/default-avatar.png'}
              alt={`Avatar de ${user?.pseudonyme}`}
              className="w-16 h-16 rounded-full object-cover border-4 border-blue-100"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user?.pseudonyme || user?.firstname || 'Utilisateur'}
            </h2>
            <p className="text-gray-600">
              {user?.firstname} {user?.lastname}
            </p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getLevelColor(defaultStats.level)}`}>
              {defaultStats.level}
            </span>
          </div>
        </div>


      </div>

      

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {defaultStats.eventsPlayed}
          </div>
          <div className="text-sm text-gray-600">Événements</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {defaultStats.winRate}%
          </div>
          <div className="text-sm text-gray-600">Win Rate</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {defaultStats.totalPoints}
          </div>
          <div className="text-sm text-gray-600">Points</div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {defaultStats.upcomingEvents}
          </div>
          <div className="text-sm text-gray-600">À venir</div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Actions rapides</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/events')}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            📅 Voir événements
          </button>
          
          <button
            onClick={() => navigate('/events/create')}
            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
          >
            ➕ Créer événement
          </button>
          
          <button
            onClick={() => navigate(getDashboardPath(user?.role))}
            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
          >
            🎯 Tableau de bord
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
          >
            ⚙️ Paramètres
          </button>
        </div>
      </div>

      {/* Prochain événement */}
      {defaultStats.upcomingEvents > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Prochain événement</h4>
              <p className="text-sm text-gray-600">Vous avez {defaultStats.upcomingEvents} événement(s) à venir</p>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Voir détails
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProfileSummary; 