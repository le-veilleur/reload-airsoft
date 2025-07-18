# Structure de Profil Utilisateur - Reload Airsoft

## Vue d'ensemble

Cette implémentation propose une structure complète pour la gestion du profil utilisateur avec trois niveaux d'accès :

1. **Dashboard** - Résumé rapide avec statistiques et actions
2. **Navbar** - Menu dropdown avec accès global
3. **Page dédiée** - Profil complet avec toutes les fonctionnalités

## Architecture

### 1. Composants créés

#### `DashboardProfileSummary.tsx`
- **Localisation** : `src/Components/Dashboard/DashboardProfileSummary.tsx`
- **Fonction** : Résumé du profil dans le dashboard
- **Fonctionnalités** :
  - Avatar avec indicateur de statut
  - Statistiques rapides (événements, win rate, points, etc.)
  - Actions rapides (voir événements, créer événement, etc.)
  - Indicateur d'événements à venir

#### `UserProfileDropdown.tsx`
- **Localisation** : `src/Components/Navigation/UserProfileDropdown.tsx`
- **Fonction** : Menu dropdown dans la navbar
- **Fonctionnalités** :
  - En-tête avec informations utilisateur
  - Navigation vers profil, dashboard, événements
  - Accès aux paramètres et aide
  - Déconnexion

#### `ProfilePage.tsx`
- **Localisation** : `src/Pages/Profile/ProfilePage.tsx`
- **Fonction** : Page de profil complète
- **Fonctionnalités** :
  - Onglets : Vue d'ensemble, Événements, Succès, Paramètres
  - Informations personnelles détaillées
  - Statistiques complètes
  - Gestion des préférences
  - Historique des événements

### 2. Service de données

#### `userStatsService.ts`
- **Localisation** : `src/services/userStatsService.ts`
- **Fonction** : Gestion des données utilisateur
- **Méthodes** :
  - `getUserProfile()` - Profil complet
  - `getUserStats()` - Statistiques
  - `getUserEvents()` - Événements utilisateur
  - `updateUserProfile()` - Mise à jour profil
  - `updateUserPreferences()` - Préférences
  - Méthodes mock pour développement

### 3. Intégration

#### Dashboard Joueur
- **Fichier** : `src/Pages/dashboard/PlayerDashboard.tsx`
- **Intégration** : Composant `DashboardProfileSummary` ajouté
- **Données** : Utilise `userStatsService` pour les statistiques

#### Routes
- **Fichier** : `src/Router/index.tsx`
- **Routes ajoutées** :
  - `/profile` → `ProfilePage` (nouvelle page complète)
  - `/profile/overview` → `Profile` (ancienne page)

## Fonctionnalités par niveau

### Dashboard (Niveau 1 - Accès rapide)
- ✅ Vue d'ensemble du profil
- ✅ Statistiques clés
- ✅ Actions rapides
- ✅ Indicateur d'événements à venir
- ✅ Navigation vers profil complet

### Navbar (Niveau 2 - Accès global)
- ✅ Menu dropdown élégant
- ✅ Informations utilisateur
- ✅ Navigation principale
- ✅ Accès aux paramètres
- ✅ Déconnexion

### Page dédiée (Niveau 3 - Fonctionnalités complètes)
- ✅ Informations personnelles détaillées
- ✅ Statistiques complètes
- ✅ Historique des événements
- ✅ Succès et achievements
- ✅ Paramètres et préférences
- ✅ Gestion des notifications
- ✅ Paramètres de confidentialité

## Avantages de cette structure

### 1. Accessibilité
- **Dashboard** : Accès immédiat aux informations essentielles
- **Navbar** : Accès global depuis n'importe quelle page
- **Page dédiée** : Fonctionnalités complètes quand nécessaire

### 2. Expérience utilisateur
- **Progression logique** : Du résumé aux détails
- **Actions rapides** : Boutons d'accès direct
- **Navigation intuitive** : Menu contextuel

### 3. Scalabilité
- **Composants modulaires** : Réutilisables
- **Service centralisé** : Gestion des données
- **Structure extensible** : Facile d'ajouter des fonctionnalités

### 4. Performance
- **Chargement progressif** : Données essentielles d'abord
- **Lazy loading** : Page complète à la demande
- **Cache intelligent** : Données réutilisées

## Utilisation

### Pour les développeurs

1. **Ajouter des statistiques** :
   ```typescript
   // Dans userStatsService.ts
   interface UserStats {
     // Ajouter nouvelle propriété
     newStat: number;
   }
   ```

2. **Modifier le dashboard** :
   ```typescript
   // Dans DashboardProfileSummary.tsx
   // Ajouter nouvelle statistique dans le rendu
   ```

3. **Ajouter des onglets** :
   ```typescript
   // Dans ProfilePage.tsx
   // Ajouter nouveau rendu d'onglet
   ```

### Pour les utilisateurs

1. **Accès rapide** : Dashboard → Résumé profil
2. **Navigation globale** : Navbar → Menu utilisateur
3. **Fonctionnalités complètes** : Page profil dédiée

## Évolutions futures

### Fonctionnalités à ajouter
- [ ] Édition en ligne du profil
- [ ] Upload d'images multiples
- [ ] Système de badges/achievements
- [ ] Historique détaillé des parties
- [ ] Statistiques avancées
- [ ] Export des données

### Améliorations techniques
- [ ] Cache Redis pour les statistiques
- [ ] WebSockets pour les mises à jour temps réel
- [ ] Optimisation des images
- [ ] Mode hors ligne
- [ ] Notifications push

## Notes techniques

### Dépendances
- React Router pour la navigation
- Axios pour les appels API
- Tailwind CSS pour le styling
- Context API pour l'état global

### Structure des données
```typescript
interface UserStats {
  eventsPlayed: number;
  winRate: number;
  level: string;
  totalPoints: number;
  upcomingEvents: number;
  completedEvents: number;
  favoriteWeapon?: string;
  teamRole?: string;
  achievements?: string[];
}
```

### Points d'API
- `GET /api/users/profile` - Profil complet
- `GET /api/users/stats` - Statistiques
- `GET /api/users/events` - Événements utilisateur
- `PUT /api/users/profile` - Mise à jour profil
- `PUT /api/users/preferences` - Préférences

Cette structure offre une expérience utilisateur complète et évolutive pour la gestion des profils dans l'application Reload Airsoft. 