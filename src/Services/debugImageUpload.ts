// Fichier de debug pour tester le système d'upload d'images
// Ce fichier peut être importé temporairement pour diagnostiquer les problèmes

import { imageUploadService } from './imageUploadService';

// Fonction pour tester le système complet
export const debugImageUpload = () => {
  console.log('[DEBUG] Démarrage du test de debug du système d\'upload d\'images');
  
  // Créer un fichier de test
  const testFile = new File(['fake image data'], 'test-image.jpg', { 
    type: 'image/jpeg',
    lastModified: Date.now()
  });
  
  console.log('[DEBUG] Fichier de test créé:', {
    name: testFile.name,
    type: testFile.type,
    size: testFile.size
  });
  
  // Test de validation
  try {
    console.log('[DEBUG] Test de validation...');
    const validatedFile = imageUploadService['validateFile'](testFile, true);
    console.log('[DEBUG] Validation réussie:', {
      originalName: testFile.name,
      validatedName: validatedFile.name,
      originalType: testFile.type,
      validatedType: validatedFile.type
    });
  } catch (error: any) {
    console.error('[DEBUG] Erreur de validation:', error.message);
  }
  
  // Test de génération de prévisualisation
  imageUploadService.generatePreviewUrl(testFile)
    .then(url => {
      console.log('[DEBUG] Prévisualisation générée:', {
        urlLength: url.length,
        urlStart: url.substring(0, 50) + '...'
      });
    })
    .catch(error => {
      console.error('[DEBUG] Erreur prévisualisation:', error.message);
    });
  
  // Test d'optimisation
  imageUploadService.optimizeImage(testFile, 800, 600, 0.8)
    .then(optimizedFile => {
      console.log('[DEBUG] Optimisation réussie:', {
        originalSize: testFile.size,
        optimizedSize: optimizedFile.size,
        reduction: `${((1 - optimizedFile.size / testFile.size) * 100).toFixed(1)}%`
      });
    })
    .catch(error => {
      console.error('[DEBUG] Erreur optimisation:', error.message);
    });
};

// Fonction pour tester avec différents types de fichiers
export const debugDifferentFileTypes = () => {
  console.log('[DEBUG] Test avec différents types de fichiers');
  
  const testFiles = [
    new File(['fake data'], 'image.jpg', { type: 'image/jpeg' }),
    new File(['fake data'], 'photo.png', { type: 'image/png' }),
    new File(['fake data'], 'picture.webp', { type: 'image/webp' }),
    new File(['fake data'], 'animation.gif', { type: 'image/gif' }),
    new File(['fake data'], 'document.pdf', { type: 'application/pdf' }),
    new File(['fake data'], 'text.txt', { type: 'text/plain' }),
  ];
  
  testFiles.forEach((file, index) => {
    console.log(`[DEBUG] Test fichier ${index + 1}: ${file.name}`);
    
    try {
      const canProcess = imageUploadService['canProcessFile'](file);
      console.log(`[DEBUG] Peut être traité: ${canProcess}`);
      
      if (canProcess) {
        const validated = imageUploadService['validateFile'](file, true);
        console.log(`[DEBUG] Validation réussie pour ${file.name}`);
      } else {
        console.log(`[DEBUG] Fichier non supporté: ${file.name}`);
      }
    } catch (error: any) {
      console.error(`[DEBUG] Erreur pour ${file.name}:`, error.message);
    }
  });
};

// Fonction pour tester les erreurs réseau
export const debugNetworkErrors = () => {
  console.log('[DEBUG] Test des erreurs réseau');
  
  const testFile = new File(['fake image data'], 'test.jpg', { type: 'image/jpeg' });
  
  // Simuler une erreur réseau
  console.log('[DEBUG] Test d\'upload avec erreur réseau simulée...');
  
  // Note: Cette fonction ne peut pas vraiment simuler une erreur réseau
  // mais elle peut aider à identifier les problèmes de configuration
  console.log('[DEBUG] Configuration actuelle:', {
    baseURL: imageUploadService['baseUrl'],
    timeout: 'configuré dans api.config'
  });
};

// Fonction pour afficher les logs de debug
export const showDebugInfo = () => {
  console.log('[DEBUG] Informations de debug du système d\'upload');
  console.log('==================================================');
  console.log('[DEBUG] Service disponible:', !!imageUploadService);
  console.log('[DEBUG] Méthodes disponibles:', Object.getOwnPropertyNames(Object.getPrototypeOf(imageUploadService)));
  console.log('[DEBUG] Base URL:', imageUploadService['baseUrl']);
  console.log('==================================================');
};

// Exporter pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).debugImageUpload = {
    debugImageUpload,
    debugDifferentFileTypes,
    debugNetworkErrors,
    showDebugInfo
  };
  
  console.log('[DEBUG] Fonctions de debug disponibles dans window.debugImageUpload');
  console.log('[DEBUG] Utilisez debugImageUpload.debugImageUpload() pour tester');
} 