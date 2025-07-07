# 🔧 Configuration des Variables d'Environnement - Reload Airsoft Frontend

## 📝 Vue d'ensemble

Ce document explique comment utiliser les variables d'environnement pour configurer dynamiquement les communications API avec tous les microservices de l'architecture Reload Airsoft.

## 📁 Fichiers de Configuration

### 1. `env` - Variables d'environnement
Contient toutes les variables de configuration pour les différents environnements (développement, production).

### 2. `src/config/api.config.ts` - Configuration centralisée
Module TypeScript qui centralise l'accès aux variables d'environnement et fournit des fonctions utilitaires.

## 🚀 Architecture des Microservices

### Services Backend

| Service | Port HTTP | Port gRPC | Description |
|---------|-----------|-----------|-------------|
| **API Gateway** | 8080 | 50053 | Point d'entrée principal |
| **User Service** | 8181 | 50051 | Authentification et gestion utilisateurs |
| **Event Service** | - | 50052 | Gestion des événements |
| **Payment Service** | - | 50054 | Traitement des paiements |
| **Analytics Service** | - | 50055 | Analytiques et statistiques |

### Bases de données et outils

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **PostgreSQL** | 5432 | - | Base de données principale |
| **PgAdmin** | 5050 | http://localhost:5050 | Interface d'administration PostgreSQL |
| **Redis (User)** | 6379 | - | Cache utilisateur |
| **Redis (Gateway)** | 6381 | - | Cache API Gateway |
| **RedisInsight** | 5540 | http://localhost:5540 | Interface Redis |

## ⚙️ Configuration des Variables

### Variables principales

```bash
# Environnement
NODE_ENV=development
REACT_APP_ENV=development

# API Gateway
REACT_APP_API_GATEWAY_URL=http://localhost:8080
REACT_APP_API_GATEWAY_VERSION=/api/v1

# User Service (Auth)
REACT_APP_USER_SERVICE_URL=http://localhost:8181
REACT_APP_AUTH_API_URL=http://localhost:8181/user
```

### Timeouts et configuration réseau

```bash
# Timeouts (en millisecondes)
REACT_APP_API_TIMEOUT=30000        # 30 secondes
REACT_APP_AUTH_TIMEOUT=10000       # 10 secondes
REACT_APP_UPLOAD_TIMEOUT=120000    # 2 minutes

# Retry
REACT_APP_MAX_RETRIES=3
REACT_APP_RETRY_DELAY=1000
```

### Configuration du cache

```bash
# Cache des événements
REACT_APP_EVENTS_CACHE_TTL=300000           # 5 minutes
REACT_APP_AUTO_REFRESH_INTERVAL=60000       # 1 minute
REACT_APP_FORCE_REFRESH_INTERVAL=1800000    # 30 minutes
```

## 📋 Utilisation dans le Code

### Import de la configuration

```typescript
import { 
  getApiUrl, 
  getAuthUrl,
  API_CONFIG, 
  JWT_CONFIG, 
  ENDPOINTS,
  FEATURES 
} from "../config/api.config";
```

### Exemples d'utilisation

#### 1. Configuration d'un client Axios

```typescript
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  headers: {
    "Content-Type": "application/json"
  }
});
```

#### 2. Gestion de l'authentification

```typescript
// Récupération du token
const token = Cookies.get(JWT_CONFIG.COOKIE_NAME);

// Configuration des cookies
Cookies.set(JWT_CONFIG.COOKIE_NAME, token, {
  expires: JWT_CONFIG.EXPIRY_DAYS,
  secure: JWT_CONFIG.SECURE_COOKIES,
  sameSite: JWT_CONFIG.SAME_SITE
});
```

#### 3. Utilisation des endpoints

```typescript
// Événements
const response = await api.get(ENDPOINTS.EVENTS.LIST);
const event = await api.get(ENDPOINTS.EVENTS.BY_ID(eventId));

// Réservations
await api.post(ENDPOINTS.BOOKINGS.BOOK(eventId), bookingData);
await api.delete(ENDPOINTS.BOOKINGS.CANCEL(eventId));

// Authentification
await axios.post(getAuthUrl(ENDPOINTS.AUTH.LOGIN), credentials);
```

#### 4. Feature flags

```typescript
// Vérifier si une fonctionnalité est activée
if (FEATURES.PAYMENTS) {
  // Afficher les options de paiement
}

if (FEATURES.REAL_TIME_UPDATES) {
  // Activer les mises à jour en temps réel
}
```

#### 5. Configuration debug

```typescript
if (DEBUG_CONFIG.ENABLED) {
  console.log("🚀 API Request:", config.url);
}
```

## 🔄 Gestion d'environnements

### Développement

```bash
NODE_ENV=development
REACT_APP_API_GATEWAY_URL=http://localhost:8080
REACT_APP_USER_SERVICE_URL=http://localhost:8181
REACT_APP_DEBUG_MODE=true
```

### Production

```bash
NODE_ENV=production
REACT_APP_API_GATEWAY_URL=https://api.reload-airsoft.com
REACT_APP_USER_SERVICE_URL=https://auth.reload-airsoft.com
REACT_APP_DEBUG_MODE=false
REACT_APP_SECURE_COOKIES=true
```

## 🚨 Gestion d'erreurs

Le système inclut une gestion d'erreurs avancée :

### Retry automatique

```typescript
// Retry avec backoff exponentiel pour les erreurs 5xx
export const getAllEventsWithRetry = (forceRefresh?: boolean) => 
  retryRequest(() => getAllEvents(forceRefresh));
```

### Gestion des codes d'erreur

- **401** : Token expiré → Suppression automatique du cookie
- **403** : Accès interdit
- **404** : Ressource non trouvée
- **429** : Limite de taux atteinte
- **5xx** : Erreur serveur → Retry automatique

## 🔐 Sécurité

### JWT Token

- Stockage sécurisé en cookie
- Expiration configurée
- Suppression automatique en cas d'erreur 401
- Envoi automatique dans l'en-tête Authorization

### CORS et Proxy

```typescript
// Proxy pour le développement (setupProxy.js)
app.use('/api/v1', createProxyMiddleware({
  target: process.env.REACT_APP_API_GATEWAY_URL,
  changeOrigin: true
}));
```

## 📊 Monitoring et Debug

### Logs détaillés

Quand `REACT_APP_DEBUG_MODE=true` :

- 🚀 Requêtes API sortantes
- ✅ Réponses API
- ❌ Erreurs avec détails complets
- 🔄 Tentatives de retry
- 🔐 Gestion des tokens

### Health checks

```typescript
// Vérification de la santé des services
const healthUrl = API_ENDPOINTS.API_GATEWAY.HEALTH;
const response = await fetch(healthUrl);
```

## 🔧 Migration depuis l'ancienne configuration

### Avant

```typescript
const API_BASE_URL = "http://localhost:8080/api/v1";
const token = Cookies.get("JWT-Reload-airsoft");
```

### Après

```typescript
import { getApiUrl, JWT_CONFIG } from "../config/api.config";

const apiUrl = getApiUrl();
const token = Cookies.get(JWT_CONFIG.COOKIE_NAME);
```

## 🔄 Démarrage rapide

1. **Copier le fichier `env`** à la racine du projet frontend
2. **Ajuster les URLs** selon votre environnement
3. **Importer la configuration** dans vos services :
   ```typescript
   import config from "../config/api.config";
   ```
4. **Utiliser les fonctions utilitaires** au lieu des URLs codées en dur
5. **Activer le debug** en développement avec `REACT_APP_DEBUG_MODE=true`

## 📝 Bonnes pratiques

- ✅ Toujours utiliser `getApiUrl()` et `getAuthUrl()` 
- ✅ Respecter les timeouts configurés
- ✅ Utiliser les feature flags pour les nouvelles fonctionnalités
- ✅ Activer le debug en développement
- ✅ Désactiver le debug en production
- ❌ Ne jamais coder les URLs en dur
- ❌ Ne pas ignorer les erreurs de configuration

---

## 🆘 Support

En cas de problème avec la configuration :

1. Vérifier que le fichier `env` est présent
2. Vérifier que les services backend sont démarrés
3. Consulter les logs du navigateur si `DEBUG_MODE=true`
4. Tester les endpoints avec les commandes du Makefile :
   ```bash
   make up      # Démarre tous les services
   make status  # Vérifie le statut
   make health  # Test de santé
   ``` 