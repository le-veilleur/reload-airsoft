import React from 'react';

interface AutoRefreshStatusProps {
  isActive: boolean;
  lastRefresh: Date | null;
  errorCount: number;
  onToggle: () => void;
  onRefresh: () => void;
  onForceRefresh?: () => void;
  onReset?: () => void;
}

export const AutoRefreshStatus: React.FC<AutoRefreshStatusProps> = ({
  isActive,
  lastRefresh,
  errorCount,
  onToggle,
  onRefresh,
  onForceRefresh,
  onReset
}) => {
  const formatLastRefresh = (date: Date | null) => {
    if (!date) return 'Jamais';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    
    if (diffSeconds < 60) {
      return `Il y a ${diffSeconds}s`;
    } else if (diffMinutes < 60) {
      return `Il y a ${diffMinutes}min`;
    } else {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const getStatusIcon = () => {
    if (errorCount >= 3) return '🚫';
    if (isActive) return '🔄';
    return '⏸️';
  };

  const getStatusText = () => {
    if (errorCount >= 3) return 'Suspendu (erreurs)';
    if (isActive) return 'Actif';
    return 'Inactif';
  };

  const getStatusColor = () => {
    if (errorCount >= 3) return 'text-red-600 bg-red-50';
    if (isActive) return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          <span>{getStatusIcon()}</span>
          <span>{getStatusText()}</span>
        </div>
        
        <div className="text-xs text-gray-500">
          <div>Dernier: {formatLastRefresh(lastRefresh)}</div>
          {errorCount > 0 && (
            <div className="text-red-500">
              {errorCount} erreur(s)
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {/* Bouton rafraîchir normal */}
        <button
          onClick={onRefresh}
          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Rafraîchir maintenant (normal)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Bouton rafraîchir forcé avec vidage du cache */}
        {onForceRefresh && (
          <button
            onClick={onForceRefresh}
            className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors"
            title="Rafraîchir avec vidage du cache"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        {/* Bouton toggle auto-refresh */}
        <button
          onClick={onToggle}
          className={`p-1.5 rounded transition-colors ${
            isActive 
              ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
              : 'text-green-600 hover:text-green-700 hover:bg-green-50'
          }`}
          title={isActive ? 'Désactiver rafraîchissement auto' : 'Activer rafraîchissement auto'}
        >
          {isActive ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              <rect x="3" y="4" width="18" height="16" rx="2" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16h1m4 0h1" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        {/* Bouton reset erreurs si nécessaire */}
        {errorCount >= 3 && onReset && (
          <button
            onClick={onReset}
            className="p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors"
            title="Réinitialiser les erreurs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}; 