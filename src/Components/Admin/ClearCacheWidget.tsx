import React, { useState, useEffect } from 'react';
import CacheService from '../../Services/CacheService';

interface CacheInfo {
  cookies: number;
  localStorage: number;
  sessionStorage: number;
}

const ClearCacheWidget: React.FC = () => {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({ cookies: 0, localStorage: 0, sessionStorage: 0 });
  const [isClearing, setIsClearing] = useState(false);
  const [lastCleared, setLastCleared] = useState<Date | null>(null);

  // Rafraîchir les informations du cache
  const refreshCacheInfo = () => {
    setCacheInfo(CacheService.getCacheInfo());
  };

  useEffect(() => {
    refreshCacheInfo();
    // Rafraîchir toutes les 30 secondes au lieu de 5 (plus raisonnable)
    const interval = setInterval(refreshCacheInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClearAllCache = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir vider TOUT le cache ? Cela vous déconnectera.')) {
      return;
    }

    setIsClearing(true);
    try {
      await CacheService.clearAllCache();
      setLastCleared(new Date());
      refreshCacheInfo();
    } catch (error) {
      console.error('Erreur lors du vidage du cache:', error);
      alert('Erreur lors du vidage du cache. Consultez la console pour plus de détails.');
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearAppCache = () => {
    if (!window.confirm('Vider le cache de l\'application ? Cela vous déconnectera.')) {
      return;
    }

    setIsClearing(true);
    try {
      CacheService.clearAppCache();
      setLastCleared(new Date());
      refreshCacheInfo();
      
      // Rechargement optionnel
      const shouldReload = window.confirm('Cache applicatif vidé ! Recharger la page ?');
      if (shouldReload) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors du vidage du cache:', error);
      alert('Erreur lors du vidage du cache. Consultez la console pour plus de détails.');
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearEventsOnly = () => {
    CacheService.clearEventsCache();
    setLastCleared(new Date());
    refreshCacheInfo();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-gray-900">🗑️ Gestion du Cache</h3>
        <button 
          onClick={refreshCacheInfo}
          className="text-blue-500 hover:text-blue-700 text-sm"
          title="Actualiser les informations"
        >
          🔄
        </button>
      </div>
      
      {/* Informations sur le cache */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>🍪 Cookies:</span>
          <span className="font-medium">{cacheInfo.cookies}</span>
        </div>
        <div className="flex justify-between">
          <span>💾 LocalStorage:</span>
          <span className="font-medium">{cacheInfo.localStorage} éléments</span>
        </div>
        <div className="flex justify-between">
          <span>🔒 SessionStorage:</span>
          <span className="font-medium">{cacheInfo.sessionStorage} éléments</span>
        </div>
        
        {lastCleared && (
          <div className="pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500">
              Dernière suppression: {lastCleared.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="space-y-3">
        <button
          onClick={handleClearEventsOnly}
          disabled={isClearing}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          🎯 Vider cache événements uniquement
        </button>
        
        <button
          onClick={handleClearAppCache}
          disabled={isClearing}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          🧹 Vider cache application
        </button>
        
        <button
          onClick={handleClearAllCache}
          disabled={isClearing}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          {isClearing ? '⏳ Vidage en cours...' : '💥 VIDER TOUT LE CACHE'}
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• <strong>Événements</strong>: Force le rechargement des données</p>
        <p>• <strong>Application</strong>: Vide cookies + stockage local</p>
        <p>• <strong>Tout</strong>: Vide tout + cache navigateur</p>
      </div>
    </div>
  );
};

export default ClearCacheWidget; 