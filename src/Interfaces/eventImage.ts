export interface EventImage {
  id: string; // Identifiant unique (généré côté front ou backend)
  file?: File; // Fichier image sélectionné (avant upload)
  previewUrl?: string; // URL temporaire pour prévisualisation (avant upload)
  altText?: string; // Texte alternatif pour l'accessibilité
  isPrimary?: boolean; // Indique si c'est l'image principale
  uploadedUrl?: string; // URL permanente après upload (backend)
  isUploading?: boolean; // Statut d'upload en cours
  uploadProgress?: number; // Progression de l'upload (0-100)
  error?: string; // Message d'erreur éventuel lors de l'upload
} 