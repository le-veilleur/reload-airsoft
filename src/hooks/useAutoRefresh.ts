import { useEffect, useRef, useCallback, useState } from 'react';

interface UseAutoRefreshOptions {
  enabled?: boolean;
  interval?: number; // en millisecondes
  onRefresh: () => Promise<void> | void;
  onlyWhenVisible?: boolean;
  pauseOnError?: boolean;
}

export const useAutoRefresh = ({
  enabled = true,
  interval = 120000, // 2 minutes par défaut
  onRefresh,
  onlyWhenVisible = true,
  pauseOnError = true
}: UseAutoRefreshOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const errorCountRef = useRef(0);
  const maxErrors = 3;

  // Gérer la visibilité de la page
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!onlyWhenVisible) return;

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    const handleFocus = () => setIsVisible(true);
    const handleBlur = () => setIsVisible(false);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onlyWhenVisible]);

  const executeRefresh = useCallback(async () => {
    try {
      await onRefresh();
      errorCountRef.current = 0; // Reset compteur d'erreurs en cas de succès
    } catch (error) {
      console.error('🔄 Erreur lors du rafraîchissement automatique:', error);
      errorCountRef.current += 1;
      
      // Arrêter le rafraîchissement après trop d'erreurs
      if (pauseOnError && errorCountRef.current >= maxErrors) {
        console.warn(`🚫 Rafraîchissement automatique pausé après ${maxErrors} erreurs consécutives`);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }
  }, [onRefresh, pauseOnError]);

  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (onlyWhenVisible && !isVisible) {
        console.log('📱 Page non visible, rafraîchissement ignoré');
        return;
      }
      
      if (errorCountRef.current >= maxErrors && pauseOnError) {
        console.log('⚠️ Trop d\'erreurs, rafraîchissement suspendu');
        return;
      }
      
      console.log('🔄 Rafraîchissement automatique des données...');
      executeRefresh();
    }, interval);
  }, [interval, isVisible, onlyWhenVisible, executeRefresh, pauseOnError]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetErrors = useCallback(() => {
    errorCountRef.current = 0;
    if (enabled && !intervalRef.current) {
      startInterval();
    }
  }, [enabled, startInterval]);

  // Effet principal
  useEffect(() => {
    if (enabled && isVisible) {
      startInterval();
    } else {
      stopInterval();
    }

    return stopInterval;
  }, [enabled, isVisible, startInterval, stopInterval]);

  // Rafraîchissement immédiat quand la page redevient visible
  useEffect(() => {
    if (isVisible && enabled && onlyWhenVisible) {
      console.log('👀 Page redevenue visible, rafraîchissement immédiat');
      executeRefresh();
    }
  }, [isVisible, enabled, onlyWhenVisible, executeRefresh]);

  return {
    isActive: !!intervalRef.current,
    errorCount: errorCountRef.current,
    resetErrors,
    stop: stopInterval,
    start: startInterval
  };
}; 