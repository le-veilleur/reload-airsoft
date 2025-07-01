import { useEffect } from 'react';
import CacheService from '../Services/CacheService';

export const useCacheShortcut = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Raccourci: Ctrl + Shift + C (Clear Cache)
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        
        if (process.env.NODE_ENV === 'development') {
          const action = window.prompt(
            "🗑️ GESTION DU CACHE 🗑️\n\n" +
            "Choisissez une option:\n" +
            "1 - Vider cache événements uniquement\n" +
            "2 - Vider cache application (déconnexion)\n" +
            "3 - VIDER TOUT LE CACHE (déconnexion + rechargement)\n" +
            "i - Informations sur le cache\n\n" +
            "Tapez le numéro ou la lettre:",
            "1"
          );
          
          switch (action) {
            case '1':
              CacheService.clearEventsCache();
              alert('✅ Cache des événements vidé !');
              break;
              
            case '2':
              if (window.confirm('Vider le cache de l\'application ? Cela vous déconnectera.')) {
                CacheService.clearAppCache();
              }
              break;
              
            case '3':
              if (window.confirm('Vider TOUT le cache ? Cela vous déconnectera et rechargera la page.')) {
                CacheService.clearAllCache();
              }
              break;
              
            case 'i':
            case 'I':
              const info = CacheService.getCacheInfo();
              alert(
                `📊 INFORMATIONS DU CACHE 📊\n\n` +
                `🍪 Cookies: ${info.cookies}\n` +
                `💾 LocalStorage: ${info.localStorage} éléments\n` +
                `🔒 SessionStorage: ${info.sessionStorage} éléments\n\n` +
                `Raccourci: Ctrl + Shift + C`
              );
              break;
              
            default:
              if (action !== null) {
                alert('❌ Option non reconnue. Utilisez 1, 2, 3 ou i');
              }
          }
        } else {
          // En production, seulement le cache des événements
          if (window.confirm('Vider le cache des événements pour recharger les données ?')) {
            CacheService.clearEventsCache();
            alert('✅ Cache des événements vidé !');
          }
        }
      }
    };

    // Ajouter l'écouteur d'événements
    document.addEventListener('keydown', handleKeyDown);

    // Nettoyer l'écouteur lors du démontage
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

export default useCacheShortcut; 