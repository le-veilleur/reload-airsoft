import Cookies from "js-cookie";
import { clearEventCache } from "./eventService";

/**
 * Service centralisé pour la gestion du cache de l'application
 */
class CacheService {
  /**
   * Vide le cache des événements
   */
  static clearEventsCache(): void {
    console.log("🗑️ Vidage du cache des événements...");
    clearEventCache();
  }

  /**
   * Vide tous les cookies de l'application
   */
  static clearCookies(): void {
    console.log("🗑️ Vidage des cookies...");
    
    // Supprimer le cookie JWT principal
    Cookies.remove("JWT-Reload-airsoft");
    
    // Supprimer tous les autres cookies (si il y en a)
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach(cookieName => {
      Cookies.remove(cookieName);
      // Essayer avec différents paramètres pour s'assurer de la suppression
      Cookies.remove(cookieName, { path: "/" });
      Cookies.remove(cookieName, { domain: window.location.hostname });
    });
    
    console.log("✅ Cookies supprimés");
  }

  /**
   * Vide le localStorage du navigateur
   */
  static clearLocalStorage(): void {
    console.log("🗑️ Vidage du localStorage...");
    try {
      localStorage.clear();
      console.log("✅ localStorage vidé");
    } catch (error) {
      console.warn("⚠️ Impossible de vider le localStorage:", error);
    }
  }

  /**
   * Vide le sessionStorage du navigateur
   */
  static clearSessionStorage(): void {
    console.log("🗑️ Vidage du sessionStorage...");
    try {
      sessionStorage.clear();
      console.log("✅ sessionStorage vidé");
    } catch (error) {
      console.warn("⚠️ Impossible de vider le sessionStorage:", error);
    }
  }

  /**
   * Vide le cache du navigateur (Service Worker, Cache API)
   */
  static async clearBrowserCache(): Promise<void> {
    console.log("🗑️ Vidage du cache du navigateur...");
    
    try {
      // Vider le cache des Service Workers si disponible
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      // Vider le Cache API si disponible
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      console.log("✅ Cache du navigateur vidé");
    } catch (error) {
      console.warn("⚠️ Impossible de vider complètement le cache du navigateur:", error);
    }
  }

  /**
   * Force le rechargement de la page sans cache
   */
  static hardReload(): void {
    console.log("🔄 Rechargement forcé de la page...");
    // Rechargement en ignorant le cache
    window.location.reload();
  }

  /**
   * FONCTION PRINCIPALE : Vide TOUS les types de cache
   */
  static async clearAllCache(): Promise<void> {
    console.log("🧹 === VIDAGE COMPLET DU CACHE ===");
    
    try {
      // 1. Vider le cache des événements
      this.clearEventsCache();
      
      // 2. Vider les cookies
      this.clearCookies();
      
      // 3. Vider le stockage local
      this.clearLocalStorage();
      this.clearSessionStorage();
      
      // 4. Vider le cache du navigateur
      await this.clearBrowserCache();
      
      console.log("✅ === CACHE COMPLÈTEMENT VIDÉ ===");
      
      // 5. Proposition de rechargement
      const shouldReload = window.confirm(
        "Cache vidé avec succès ! 🎉\n\nVoulez-vous recharger la page pour appliquer les changements ?"
      );
      
      if (shouldReload) {
        this.hardReload();
      }
      
    } catch (error) {
      console.error("❌ Erreur lors du vidage du cache:", error);
      throw error;
    }
  }

  /**
   * Vide seulement le cache applicatif (sans toucher au navigateur)
   */
  static clearAppCache(): void {
    console.log("🧹 Vidage du cache applicatif...");
    
    this.clearEventsCache();
    this.clearCookies();
    this.clearLocalStorage();
    this.clearSessionStorage();
    
    console.log("✅ Cache applicatif vidé");
  }

  /**
   * Obtient des informations sur l'état du cache
   */
  static getCacheInfo(): {
    cookies: number;
    localStorage: number;
    sessionStorage: number;
  } {
    const cookiesCount = Object.keys(Cookies.get()).length;
    
    let localStorageCount = 0;
    let sessionStorageCount = 0;
    
    try {
      localStorageCount = localStorage.length;
    } catch (error) {
      console.warn("Impossible d'accéder au localStorage");
    }
    
    try {
      sessionStorageCount = sessionStorage.length;
    } catch (error) {
      console.warn("Impossible d'accéder au sessionStorage");
    }
    
    return {
      cookies: cookiesCount,
      localStorage: localStorageCount,
      sessionStorage: sessionStorageCount
    };
  }
}

export default CacheService; 