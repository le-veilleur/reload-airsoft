import { useState, useCallback, useEffect } from 'react';
import { getAllEvents, clearEventCache } from '../Services/eventService';
import { useAutoRefresh } from './useAutoRefresh';
import { Event } from '../Interfaces/types';

interface UseEventsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  cooldownTime?: number; // Temps de cooldown pour éviter les rafraîchissements trop fréquents
}

export const useEvents = ({ 
  autoRefresh = true, 
  refreshInterval = 120000, // 2 minutes
  cooldownTime = 5000 // 5 secondes de cooldown par défaut
}: UseEventsOptions = {}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchEvents = useCallback(async (isRefresh = false, forceClearCache = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      
      // Ne vider le cache que si explicitement demandé
      if (forceClearCache) {
        clearEventCache();
        console.log('🗑️ Cache vidé avant récupération');
      }
      
      const data = await getAllEvents(isRefresh);
      const eventsArray = data.events || [];
      
      setEvents(eventsArray);
      setError(null);
      setLastRefresh(new Date());
      
      console.log(`📊 ${eventsArray.length} événements récupérés`, isRefresh ? '(rafraîchissement)' : '(chargement initial)');
      
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des événements:', err);
      setError('Erreur lors de la récupération des événements');
      
      // En cas d'erreur lors d'un rafraîchissement, on garde les données existantes
      if (!isRefresh) {
        setEvents([]);
      }
    } finally {
      if (!isRefresh) {
        setLoading(false);
      }
    }
  }, []);

  // Hook de rafraîchissement automatique avec cooldown
  const autoRefreshControl = useAutoRefresh({
    enabled: autoRefresh,
    interval: refreshInterval,
    onRefresh: () => fetchEvents(true), // Rafraîchissement normal sans vider le cache
    onlyWhenVisible: true,
    pauseOnError: true,
    cooldownTime: cooldownTime
  });

  // Chargement initial
  useEffect(() => {
    fetchEvents(false);
  }, [fetchEvents]);

  // Fonction pour rafraîchir manuellement (avec option de vidage de cache)
  const refreshEvents = useCallback((forceClearCache = false) => {
    return fetchEvents(true, forceClearCache);
  }, [fetchEvents]);

  // Fonction pour forcer un rafraîchissement complet avec vidage de cache
  const forceRefreshEvents = useCallback(() => {
    return fetchEvents(true, true);
  }, [fetchEvents]);

  // Fonction pour activer/désactiver le rafraîchissement auto
  const toggleAutoRefresh = useCallback(() => {
    if (autoRefreshControl.isActive) {
      autoRefreshControl.stop();
    } else {
      autoRefreshControl.start();
    }
  }, [autoRefreshControl]);

  return {
    // Données
    events,
    loading,
    error,
    lastRefresh,
    
    // Actions
    refreshEvents,
    forceRefreshEvents, // Nouvelle fonction pour forcer le rafraîchissement avec vidage de cache
    
    // Contrôles du rafraîchissement automatique
    autoRefresh: {
      isActive: autoRefreshControl.isActive,
      errorCount: autoRefreshControl.errorCount,
      toggle: toggleAutoRefresh,
      reset: autoRefreshControl.resetErrors,
      stop: autoRefreshControl.stop,
      start: autoRefreshControl.start
    }
  };
}; 