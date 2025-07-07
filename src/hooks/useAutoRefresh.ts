import { useEffect, useRef, useCallback, useState } from 'react';

interface UseAutoRefreshOptions {
  enabled?: boolean;
  interval?: number; // en millisecondes
  onRefresh: () => Promise<void> | void;
  onlyWhenVisible?: boolean;
  pauseOnError?: boolean;
  cooldownTime?: number; // Temps minimum entre deux rafraîchissements (en ms)
}

export const useAutoRefresh = ({
  enabled = true,
  interval = 120000, // 2 minutes par défaut
  onRefresh,
  onlyWhenVisible = true,
  pauseOnError = true,
  cooldownTime = 5000 // 5 secondes de cooldown par défaut
}: UseAutoRefreshOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const errorCountRef = useRef(0);
  const lastRefreshRef = useRef<number>(0);
  const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxErrors = 3;

  // Gérer la visibilité de la page
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    if (!onlyWhenVisible) return;

    const handleVisibilityChange = () => {
      const newVisibility = !document.hidden;
      
      // Debouncing pour éviter les changements trop rapides
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
      
      visibilityTimeoutRef.current = setTimeout(() => {
        setIsVisible(newVisibility);
      }, 100); // Attendre 100ms avant de changer l'état
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
    };
  }, [onlyWhenVisible]);

  const executeRefresh = useCallback(async () => {
    const now = Date.now();
    
    // Vérifier le cooldown pour éviter les rafraîchissements trop fréquents
    if (now - lastRefreshRef.current < cooldownTime) {
      console.log(`⏳ Rafraîchissement ignoré (cooldown: ${Math.ceil((cooldownTime - (now - lastRefreshRef.current)) / 1000)}s restantes)`);
      return;
    }

    try {
      lastRefreshRef.current = now;
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
  }, [onRefresh, pauseOnError, cooldownTime]);

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
    lastRefreshRef.current = 0; // Reset aussi le cooldown
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

  // Rafraîchissement avec cooldown quand la page redevient visible
  useEffect(() => {
    if (isVisible && enabled && onlyWhenVisible) {
      const timeSinceLastRefresh = Date.now() - lastRefreshRef.current;
      
      if (timeSinceLastRefresh >= cooldownTime) {
        console.log('👀 Page redevenue visible, rafraîchissement avec cooldown');
        executeRefresh();
      } else {
        console.log(`👀 Page redevenue visible, mais cooldown actif (${Math.ceil((cooldownTime - timeSinceLastRefresh) / 1000)}s restantes)`);
      }
    }
  }, [isVisible, enabled, onlyWhenVisible, executeRefresh, cooldownTime]);

  return {
    isActive: !!intervalRef.current,
    errorCount: errorCountRef.current,
    resetErrors,
    stop: stopInterval,
    start: startInterval
  };
}; 