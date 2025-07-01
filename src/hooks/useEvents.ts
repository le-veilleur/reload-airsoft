import { useState, useCallback, useEffect } from 'react';
import { getAllEvents, clearEventCache } from '../Services/eventService';
import { useAutoRefresh } from './useAutoRefresh';
import { Event } from '../Interfaces/types';

interface UseEventsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useEvents = ({ 
  autoRefresh = true, 
  refreshInterval = 120000 // 2 minutes
}: UseEventsOptions = {}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchEvents = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      
      // Vider le cache pour forcer la récupération
      if (isRefresh) {
        clearEventCache();
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

  // Hook de rafraîchissement automatique
  const autoRefreshControl = useAutoRefresh({
    enabled: autoRefresh,
    interval: refreshInterval,
    onRefresh: () => fetchEvents(true),
    onlyWhenVisible: true,
    pauseOnError: true
  });

  // Chargement initial
  useEffect(() => {
    fetchEvents(false);
  }, [fetchEvents]);

  // Fonction pour rafraîchir manuellement
  const refreshEvents = useCallback(() => {
    return fetchEvents(true);
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