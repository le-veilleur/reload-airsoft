# Upload d'Images pour les Événements

Ce document explique comment utiliser le composant `EventImageUpload` pour ajouter des images aux événements dans l'application Reload Airsoft.

## Composants créés

### 1. EventImageUpload.tsx
Composant principal pour l'upload d'images d'événements avec les fonctionnalités suivantes :

- **Drag & Drop** : Glissez-déposez vos images directement
- **Sélection multiple** : Choisissez plusieurs images à la fois
- **Prévisualisation** : Aperçu immédiat des images sélectionnées
- **Gestion des images principales** : Définissez quelle image sera l'image principale
- **Validation** : Vérification des formats et tailles de fichiers
- **Interface intuitive** : Boutons d'action pour réorganiser et supprimer

### 2. Intégration dans CreateEventPage.tsx
Le formulaire de création d'événements a été mis à jour pour inclure :
- Section dédiée aux images
- Gestion des images dans l'état du formulaire
- Envoi des URLs d'images à l'API

### 3. EditEventPage.tsx
Nouvelle page d'édition d'événements qui permet de :
- Charger les images existantes
- Ajouter de nouvelles images
- Modifier les images existantes
- Supprimer des images

## Utilisation

### Import du composant
```typescript
import EventImageUpload from '../../Components/Events/EventImageUpload';
```

### Interface EventImage
```typescript
interface EventImage {
  id: string;
  file: File;
  previewUrl: string;
  altText: string;
  isPrimary: boolean;
}
```

### Utilisation basique
```typescript
const [images, setImages] = useState<EventImage[]>([]);

const handleImagesChange = (newImages: EventImage[]) => {
  setImages(newImages);
};

<EventImageUpload
  currentImages={images}
  onImagesChange={handleImagesChange}
  disabled={false}
  maxImages={5}
/>
```

## Fonctionnalités

### Validation des fichiers
- **Formats acceptés** : JPG, PNG, WebP, GIF
- **Taille maximale** : 10MB par image
- **Nombre maximum** : 5 images par événement (configurable)

### Gestion des images
- **Image principale** : La première image devient automatiquement l'image principale
- **Réorganisation** : Changez l'ordre des images en définissant une nouvelle image principale
- **Suppression** : Supprimez des images individuellement
- **Descriptions** : Ajoutez des descriptions pour l'accessibilité

### Interface utilisateur
- **Zone de drag & drop** : Interface intuitive pour déposer les images
- **Aperçu en grille** : Visualisation des images sélectionnées
- **Boutons d'action** : Actions rapides au survol des images
- **Indicateurs visuels** : Badges pour l'image principale et les erreurs

## Intégration avec l'API

### Préparation des données
```typescript
// Convertir les images en URLs pour l'API
const imageUrls = formData.images.map(image => image.previewUrl);

const eventData = {
  // ... autres données de l'événement
  image_urls: imageUrls
};
```

### Envoi à l'API
```typescript
// Création d'événement
const response = await createEventWithJson(eventData);

// Mise à jour d'événement
const response = await updateEventWithJson(eventId, eventData);
```

## Exemple complet

Voir le fichier `src/examples/EventImageExample.tsx` pour un exemple complet d'utilisation avec les données d'événement CQB Nocturne.

## Données d'exemple

L'exemple utilise les données suivantes pour l'événement "Partie CQB Nocturne" :

```json
{
  "title": "Partie CQB Nocturne",
  "start_date": "15-01-2025 14:30",
  "end_date": "15-01-2025 18:00",
  "description": "Partie d'airsoft CQB en intérieur",
  "location": {
    "address": "56 Grande Rue",
    "city": "Strasbourg",
    "country": "France",
    "postal_code": "67000"
  },
  "max_participants": 24,
  "event_type": "tactical",
  "difficulty_level_enum": "intermediate",
  "age_restriction": 16,
  "pricing_options": [
    {
      "name": "Tarif standard",
      "price": 2500,
      "currency": "EUR"
    }
  ]
}
```

## Configuration

### Variables d'environnement
```env
REACT_APP_MAX_FILE_SIZE=10485760  # 10MB en octets
REACT_APP_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif
```

### Personnalisation
Vous pouvez personnaliser le composant en modifiant :
- Le nombre maximum d'images (`maxImages`)
- Les formats acceptés dans `validateFile()`
- La taille maximale des fichiers
- Les styles CSS avec Tailwind

## Gestion des erreurs

Le composant gère automatiquement :
- **Formats non supportés** : Affichage d'un message d'erreur
- **Fichiers trop volumineux** : Validation de la taille
- **Nombre d'images dépassé** : Limitation automatique
- **Erreurs de lecture** : Gestion des erreurs de FileReader

## Accessibilité

Le composant inclut :
- **Textes alternatifs** : Chaque image peut avoir une description
- **Navigation clavier** : Tous les boutons sont accessibles au clavier
- **Messages d'erreur** : Descriptions claires des erreurs
- **Indicateurs visuels** : Badges et icônes pour guider l'utilisateur

## Prochaines étapes

Pour améliorer le système d'images :

1. **Upload vers serveur** : Implémenter l'upload réel vers un service de stockage
2. **Redimensionnement** : Ajouter le redimensionnement automatique des images
3. **Compression** : Optimiser la taille des images avant l'upload
4. **Galerie** : Créer une galerie interactive pour visualiser les images
5. **Filtres** : Ajouter des filtres et effets sur les images
6. **Cropping** : Permettre le recadrage des images 