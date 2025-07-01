# Hooks de Rafraîchissement Automatique

## 🔄 useAutoRefresh

Hook générique pour gérer le rafraîchissement automatique de données avec des fonctionnalités avancées.

### Fonctionnalités

- ✅ **Rafraîchissement périodique** (configurable)
- ✅ **Pause quand la page n'est pas visible** (économise les ressources)
- ✅ **Gestion d'erreurs avec pause automatique** (évite les boucles d'erreurs)
- ✅ **Contrôles manuels** (start/stop/reset)
- ✅ **Rafraîchissement immédiat** quand la page redevient visible

### Utilisation

```typescript
import { useAutoRefresh } from './useAutoRefresh';

const MyComponent = () => {
  const autoRefreshControl = useAutoRefresh({
    enabled: true,                    // Activer le rafraîchissement
    interval: 120000,                 // 2 minutes
    onRefresh: fetchData,             // Fonction à exécuter
    onlyWhenVisible: true,            // Pause si page invisible
    pauseOnError: true                // Pause après 3 erreurs consécutives
  });

  return (
    <div>
      <p>Status: {autoRefreshControl.isActive ? 'Actif' : 'Inactif'}</p>
      <p>Erreurs: {autoRefreshControl.errorCount}</p>
      <button onClick={autoRefreshControl.start}>Démarrer</button>
      <button onClick={autoRefreshControl.stop}>Arrêter</button>
      <button onClick={autoRefreshControl.resetErrors}>Reset erreurs</button>
    </div>
  );
};
```

## 📊 useEvents

Hook spécialisé pour la gestion des événements avec rafraîchissement automatique intégré.

### Fonctionnalités

- ✅ **Gestion complète des événements** (récupération, cache, erreurs)
- ✅ **Rafraîchissement automatique** (basé sur useAutoRefresh)
- ✅ **Cache intelligent** avec invalidation
- ✅ **Gestion d'état optimisée** (loading, error, data)
- ✅ **Rafraîchissement manuel** 

### Utilisation

```typescript
import { useEvents } from './useEvents';

const EventsPage = () => {
  const { 
    events,           // Liste des événements
    loading,          // État de chargement
    error,            // Erreur éventuelle
    lastRefresh,      // Timestamp du dernier rafraîchissement
    refreshEvents,    // Fonction de rafraîchissement manuel
    autoRefresh       // Contrôles du rafraîchissement auto
  } = useEvents({ 
    autoRefresh: true,      // Activer le rafraîchissement auto
    refreshInterval: 120000 // 2 minutes
  });

  return (
    <div>
      <h2>Événements ({events.length})</h2>
      
      {/* Statut du rafraîchissement */}
      <AutoRefreshStatus
        isActive={autoRefresh.isActive}
        lastRefresh={lastRefresh}
        errorCount={autoRefresh.errorCount}
        onToggle={autoRefresh.toggle}
        onRefresh={refreshEvents}
        onReset={autoRefresh.reset}
      />
      
      {/* Liste des événements */}
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error}</p>}
      {events.map(event => <EventCard key={event.id} event={event} />)}
    </div>
  );
};
```

## 🎛️ AutoRefreshStatus

Composant pour afficher et contrôler le statut du rafraîchissement automatique.

### Props

```typescript
interface AutoRefreshStatusProps {
  isActive: boolean;       // État actuel (actif/inactif)
  lastRefresh: Date | null; // Timestamp du dernier rafraîchissement
  errorCount: number;      // Nombre d'erreurs consécutives
  onToggle: () => void;    // Fonction pour activer/désactiver
  onRefresh: () => void;   // Fonction de rafraîchissement manuel
  onReset?: () => void;    // Fonction pour reset les erreurs (optionnel)
}
```

### Fonctionnalités visuelles

- 🟢 **Indicateur de statut** (actif/inactif/suspendu)
- ⏰ **Temps depuis dernier rafraîchissement** (formaté intelligemment)
- 🔴 **Compteur d'erreurs** (affiché si > 0)
- 🔄 **Bouton rafraîchissement manuel**
- ⏸️ **Bouton toggle** (pause/play)
- 🔧 **Bouton reset erreurs** (si erreurs >= 3)

## 🎯 Bonnes Pratiques

### Performance

1. **Pause automatique** : Le rafraîchissement s'arrête quand l'onglet n'est pas visible
2. **Gestion d'erreurs** : Pause automatique après 3 erreurs consécutives pour éviter les boucles
3. **Cache intelligent** : Utilise le cache du navigateur et peut forcer le rafraîchissement si nécessaire
4. **Debounce** : Évite les appels simultanés

### UX/UI

1. **Feedback visuel** : L'utilisateur voit toujours l'état du rafraîchissement
2. **Contrôle utilisateur** : Possibilité d'activer/désactiver et de rafraîchir manuellement
3. **Informations contextuelles** : Affiche le temps depuis le dernier rafraîchissement
4. **Gestion d'erreurs** : Affiche les erreurs et permet de les réinitialiser

### Accessibilité

1. **Tooltips** : Tous les boutons ont des titres explicites
2. **Indicateurs visuels** : Couleurs et icônes pour les différents états
3. **Feedback** : Messages clairs sur l'état du système

## 🔧 Configuration

### Intervalles recommandés

- **Événements** : 2 minutes (120000ms) - Équilibre entre fraîcheur et performance
- **Notifications** : 30 secondes (30000ms) - Pour les données critiques
- **Statistiques** : 5 minutes (300000ms) - Pour les données moins critiques

### Customisation

Tous les hooks acceptent des options pour personnaliser le comportement selon vos besoins spécifiques. 