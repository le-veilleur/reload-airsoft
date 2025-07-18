// Tests pour le service d'upload d'images
// Ce fichier contient des tests simples pour vérifier le comportement du service

import { imageUploadService } from './imageUploadService';

// Test de la détection du type MIME
export const testMimeTypeDetection = () => {
  console.log('=== Test de détection du type MIME ===');
  
  // Créer des fichiers de test
  const testFiles = [
    new File(['test'], 'image.jpg', { type: 'application/octet-stream' }),
    new File(['test'], 'photo.png', { type: 'text/plain' }),
    new File(['test'], 'picture.webp', { type: 'unknown/type' }),
    new File(['test'], 'animation.gif', { type: 'image/gif' }),
  ];
  
  testFiles.forEach(file => {
    try {
      const processed = imageUploadService['validateFile'](file, true);
      console.log(`${file.name} (${file.type}) -> ${processed.type} - ${processed.size / 1024 / 1024}MB`);
    } catch (error:  any) {
      console.log(`${file.name}: ${error.message}`);
    }
  });
};

// Test de la gestion des fichiers volumineux
export const testLargeFileHandling = () => {
  console.log('\n=== Test de gestion des fichiers volumineux ===');
  
  // Créer un fichier "volumineux" (simulé)
  const largeFile = new File(['x'.repeat(15 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
  
  try {
    const processed = imageUploadService['validateFile'](largeFile, true);
    console.log(`Fichier volumineux traité: ${(processed.size / 1024 / 1024).toFixed(2)}MB`);
  } catch (error: any) {
    console.log(`Erreur: ${error.message}`);
  }
};

// Test de la validation des formats supportés
export const testSupportedFormats = () => {
  console.log('\n=== Test des formats supportés ===');
  
  const supportedFormats = [
    { name: 'test.jpg', type: 'image/jpeg' },
    { name: 'test.jpeg', type: 'image/jpeg' },
    { name: 'test.png', type: 'image/png' },
    { name: 'test.webp', type: 'image/webp' },
    { name: 'test.gif', type: 'image/gif' },
    { name: 'test.bmp', type: 'image/bmp' },
    { name: 'test.tiff', type: 'image/tiff' },
    { name: 'test.svg', type: 'image/svg+xml' },
  ];
  
  supportedFormats.forEach(format => {
    const file = new File(['test'], format.name, { type: format.type });
    const canProcess = imageUploadService['canProcessFile'](file);
    console.log(`${canProcess ? '' : ''} ${format.name} (${format.type})`);
  });
};

// Test des formats non supportés
export const testUnsupportedFormats = () => {
  console.log('\n=== Test des formats non supportés ===');
  
  const unsupportedFormats = [
    { name: 'test.pdf', type: 'application/pdf' },
    { name: 'test.txt', type: 'text/plain' },
    { name: 'test.doc', type: 'application/msword' },
    { name: 'test.mp4', type: 'video/mp4' },
  ];
  
  unsupportedFormats.forEach(format => {
    const file = new File(['test'], format.name, { type: format.type });
    try {
      imageUploadService['validateFile'](file, true);
      console.log(`${format.name} aurait dû être rejeté`);
    } catch (error: any) {
      console.log(`${format.name} correctement rejeté: ${error.message}`);
    }
  });
};

// Fonction pour exécuter tous les tests
export const runAllTests = () => {
  console.log('🧪 Démarrage des tests du service d\'upload d\'images...\n');
  
  testMimeTypeDetection();
  testLargeFileHandling();
  testSupportedFormats();
  testUnsupportedFormats();
  
  console.log('\nTous les tests terminés !');
};

// Exporter pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).testImageUploadService = {
    runAllTests,
    testMimeTypeDetection,
    testLargeFileHandling,
    testSupportedFormats,
    testUnsupportedFormats
  };
} 