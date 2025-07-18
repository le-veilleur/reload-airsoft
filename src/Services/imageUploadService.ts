import axios from 'axios';
import Cookies from 'js-cookie';
import { API_CONFIG, DEBUG_CONFIG, JWT_CONFIG, getApiUrl } from '../config/api.config';

export interface UploadImageResponse {
  url: string;
  filename: string;
  size: number;
  mime_type: string;
  uploaded_at: string;
}

export interface UploadImageError {
  message: string;
  code: string;
  details?: any;
}

// Configuration de l'API avec les variables d'environnement
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: API_CONFIG.TIMEOUTS.DEFAULT,
  headers: {
    "Content-Type": "application/json"
  }
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(JWT_CONFIG.COOKIE_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class ImageUploadService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:8080';
  }

  /**
   * Upload une image vers le serveur
   * @param file - Le fichier image à uploader
   * @param eventId - ID de l'événement (optionnel, pour organiser les images)
   * @returns Promise<UploadImageResponse>
   */
  async uploadImage(file: File, eventId?: string): Promise<UploadImageResponse> {
    console.log('[ImageUploadService] uploadImage démarré:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      eventId: eventId || 'non défini'
    });

    try {
      // Validation du fichier
      console.log('[ImageUploadService] Validation du fichier...');
      const processedFile = this.validateFile(file);

      console.log('[ImageUploadService] Fichier validé:', {
        originalName: file.name,
        processedName: processedFile.name,
        originalType: file.type,
        processedType: processedFile.type,
        originalSize: file.size,
        processedSize: processedFile.size
      });

      // Optimiser automatiquement si le fichier est trop volumineux
      let finalFile = processedFile;
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (processedFile.size > maxSize) {
        console.log('[ImageUploadService] Fichier volumineux détecté, optimisation...');
        if (DEBUG_CONFIG.ENABLED) {
          console.log(`Optimisation automatique du fichier: ${processedFile.name}`);
        }
        finalFile = await this.optimizeImage(processedFile, 1920, 1080, 0.7);
        
        console.log('[ImageUploadService] Fichier optimisé:', {
          originalSize: processedFile.size,
          optimizedSize: finalFile.size,
          reduction: `${((1 - finalFile.size / processedFile.size) * 100).toFixed(1)}%`
        });
      }

      console.log('[ImageUploadService] Préparation de l\'upload...');
      const formData = new FormData();
      formData.append('image', finalFile);
      
      if (eventId) {
        formData.append('event_id', eventId);
        console.log('[ImageUploadService] Event ID ajouté:', eventId);
      }

      console.log('[ImageUploadService] Envoi de la requête vers:', `${this.baseUrl}/upload/image`);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: API_CONFIG.TIMEOUTS.UPLOAD,
        onUploadProgress: (progressEvent: any) => {
          if (DEBUG_CONFIG.ENABLED) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            console.log(`[ImageUploadService] Upload progress: ${percentCompleted}%`);
          }
        },
      });

      console.log('[ImageUploadService] Upload réussi:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });

      if (DEBUG_CONFIG.ENABLED) {
        console.log('Image uploadée avec succès:', response.data);
      }

      return response.data;
    } catch (error: any) {
      console.error('[ImageUploadService] Erreur upload:', {
        fileName: file.name,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          timeout: error.config?.timeout
        }
      });

      const uploadError: UploadImageError = {
        message: 'Erreur lors de l\'upload de l\'image',
        code: 'UPLOAD_FAILED',
        details: error.response?.data || error.message,
      };

      if (DEBUG_CONFIG.ENABLED) {
        console.error('Erreur upload image:', uploadError);
      }

      throw uploadError;
    }
  }

  /**
   * Upload plusieurs images en parallèle
   * @param files - Tableau de fichiers à uploader
   * @param eventId - ID de l'événement (optionnel)
   * @returns Promise<UploadImageResponse[]>
   */
  async uploadMultipleImages(files: File[], eventId?: string): Promise<UploadImageResponse[]> {
    try {
      // Validation de tous les fichiers
      const processedFiles = files.map(file => this.validateFile(file));

      // Upload en parallèle avec limitation de concurrence
      const uploadPromises = processedFiles.map(file => this.uploadImage(file, eventId));
      const results = await Promise.all(uploadPromises);

      if (DEBUG_CONFIG.ENABLED) {
        console.log(`${results.length} images uploadées avec succès`);
      }

      return results;
    } catch (error: any) {
      const uploadError: UploadImageError = {
        message: 'Erreur lors de l\'upload de plusieurs images',
        code: 'MULTIPLE_UPLOAD_FAILED',
        details: error,
      };

      if (DEBUG_CONFIG.ENABLED) {
        console.error('Erreur upload multiple images:', uploadError);
      }

      throw uploadError;
    }
  }

  /**
   * Supprimer une image du serveur
   * @param imageUrl - URL de l'image à supprimer
   * @returns Promise<void>
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      await api.delete('/upload/image', {
        data: { image_url: imageUrl },
        timeout: API_CONFIG.TIMEOUTS.DEFAULT,
      });

      if (DEBUG_CONFIG.ENABLED) {
        console.log('Image supprimée avec succès:', imageUrl);
      }
    } catch (error: any) {
      const deleteError: UploadImageError = {
        message: 'Erreur lors de la suppression de l\'image',
        code: 'DELETE_FAILED',
        details: error.response?.data || error.message,
      };

      if (DEBUG_CONFIG.ENABLED) {
        console.error('Erreur suppression image:', deleteError);
      }

      throw deleteError;
    }
  }

  /**
   * Valider un fichier avant upload
   * @param file - Le fichier à valider
   * @param autoFix - Si true, tente de corriger automatiquement les problèmes
   */
  private validateFile(file: File, autoFix: boolean = true): File {
    console.log('[ImageUploadService] validateFile démarré:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      autoFix
    });

    // Vérifier d'abord si le fichier peut être traité
    if (!this.canProcessFile(file)) {
      console.error('[ImageUploadService] Fichier non traitable:', {
        fileName: file.name,
        fileType: file.type
      });
      throw {
        message: `Format de fichier non supporté: ${file.name}. Utilisez JPG, PNG, WebP, GIF, BMP, TIFF ou SVG.`,
        code: 'INVALID_FILE_TYPE',
      };
    }

    let processedFile = file;
    let hasIssues = false;
    let issues: string[] = [];

    // Détecter et corriger le type MIME en premier
    if (autoFix) {
      console.log('[ImageUploadService] Détection et correction du type MIME...');
      const mimeFixedFile = this.detectAndFixMimeType(file);
      if (mimeFixedFile !== file) {
        processedFile = mimeFixedFile;
        hasIssues = true;
        issues.push(`Type MIME corrigé automatiquement`);
        console.log('[ImageUploadService] Type MIME corrigé:', {
          original: file.type,
          corrected: mimeFixedFile.type
        });
      }
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(processedFile.type)) {
      hasIssues = true;
      issues.push(`Format non supporté: ${processedFile.type}`);
      console.log('[ImageUploadService] Format non supporté:', processedFile.type);
      
      if (autoFix) {
        // Tenter de détecter le type réel du fichier
        const fileName = processedFile.name.toLowerCase();
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
          processedFile = new File([processedFile], processedFile.name, { type: 'image/jpeg' });
          issues.push('Format corrigé automatiquement vers JPEG');
          console.log('[ImageUploadService] Format corrigé vers JPEG');
        } else if (fileName.endsWith('.png')) {
          processedFile = new File([processedFile], processedFile.name, { type: 'image/png' });
          issues.push('Format corrigé automatiquement vers PNG');
          console.log('[ImageUploadService] Format corrigé vers PNG');
        } else if (fileName.endsWith('.webp')) {
          processedFile = new File([processedFile], processedFile.name, { type: 'image/webp' });
          issues.push('Format corrigé automatiquement vers WebP');
          console.log('[ImageUploadService] Format corrigé vers WebP');
        } else if (fileName.endsWith('.gif')) {
          processedFile = new File([processedFile], processedFile.name, { type: 'image/gif' });
          issues.push('Format corrigé automatiquement vers GIF');
          console.log('[ImageUploadService] Format corrigé vers GIF');
        }
      }
    }

    // Vérifier la taille du fichier
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (processedFile.size > maxSize) {
      hasIssues = true;
      issues.push(`Fichier trop volumineux: ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
      console.log('[ImageUploadService] Fichier volumineux:', {
        size: processedFile.size,
        sizeMB: (processedFile.size / 1024 / 1024).toFixed(2),
        maxSizeMB: (maxSize / 1024 / 1024).toFixed(2)
      });
      
      if (autoFix) {
        // Retourner le fichier original mais avec un avertissement
        // L'optimisation sera faite plus tard dans le processus
        issues.push('Le fichier sera automatiquement optimisé');
        console.log('[ImageUploadService] Fichier marqué pour optimisation automatique');
      }
    }

    // Vérifier que le fichier n'est pas vide
    if (processedFile.size === 0) {
      console.error('[ImageUploadService] Fichier vide détecté');
      throw {
        message: 'Le fichier est vide.',
        code: 'EMPTY_FILE',
      };
    }

    // Si des problèmes ont été détectés et corrigés, log les informations
    if (hasIssues && DEBUG_CONFIG.ENABLED) {
      console.warn('Problèmes détectés et corrigés pour le fichier:', file.name);
      issues.forEach(issue => console.warn('-', issue));
    }

    console.log('[ImageUploadService] Validation terminée:', {
      fileName: file.name,
      hasIssues,
      issuesCount: issues.length,
      finalType: processedFile.type,
      finalSize: processedFile.size
    });

    return processedFile;
  }

  /**
   * Détecter et corriger le type MIME basé sur l'extension du fichier
   * @param file - Le fichier à analyser
   * @returns File avec le type MIME corrigé
   */
  private detectAndFixMimeType(file: File): File {
    console.log('[ImageUploadService] detectAndFixMimeType:', {
      fileName: file.name,
      currentType: file.type
    });

    const fileName = file.name.toLowerCase();
    const extension = fileName.split('.').pop();
    
    console.log('[ImageUploadService] Extension détectée:', extension);
    
    const mimeTypeMap: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'tiff': 'image/tiff',
      'svg': 'image/svg+xml'
    };
    
    const detectedType = mimeTypeMap[extension || ''];
    
    console.log('[ImageUploadService] Type MIME détecté:', {
      extension,
      detectedType,
      currentType: file.type,
      needsCorrection: detectedType && detectedType !== file.type
    });
    
    if (detectedType && detectedType !== file.type) {
      if (DEBUG_CONFIG.ENABLED) {
        console.log(`Type MIME corrigé pour ${file.name}: ${file.type} -> ${detectedType}`);
      }
      const correctedFile = new File([file], file.name, { type: detectedType });
      console.log('[ImageUploadService] Type MIME corrigé:', {
        original: file.type,
        corrected: detectedType
      });
      return correctedFile;
    }
    
    console.log('[ImageUploadService] Aucune correction MIME nécessaire');
    return file;
  }

  /**
   * Vérifier si un fichier peut être traité ou doit être rejeté
   * @param file - Le fichier à vérifier
   * @returns true si le fichier peut être traité, false sinon
   */
  private canProcessFile(file: File): boolean {
    console.log('[ImageUploadService] canProcessFile:', {
      fileName: file.name,
      fileType: file.type
    });

    // Vérifier l'extension du fichier
    const fileName = file.name.toLowerCase();
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.svg'];
    const hasSupportedExtension = supportedExtensions.some(ext => fileName.endsWith(ext));
    
    console.log('[ImageUploadService] Vérification extension:', {
      fileName,
      hasSupportedExtension,
      supportedExtensions
    });
    
    // Vérifier le type MIME
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml'];
    const hasSupportedMimeType = allowedTypes.includes(file.type);
    
    console.log('[ImageUploadService] Vérification type MIME:', {
      fileType: file.type,
      hasSupportedMimeType,
      allowedTypes
    });
    
    // Le fichier peut être traité s'il a une extension supportée OU un type MIME supporté
    const canProcess = hasSupportedExtension || hasSupportedMimeType;
    
    console.log('[ImageUploadService] Résultat canProcessFile:', {
      fileName: file.name,
      hasSupportedExtension,
      hasSupportedMimeType,
      canProcess
    });
    
    return canProcess;
  }

  /**
   * Optimiser une image avant upload (redimensionnement, compression)
   * @param file - Le fichier image à optimiser
   * @param maxWidth - Largeur maximale (défaut: 1920)
   * @param maxHeight - Hauteur maximale (défaut: 1080)
   * @param quality - Qualité de compression (0.1 à 1.0, défaut: 0.8)
   * @returns Promise<File> - Fichier optimisé
   */
  async optimizeImage(
    file: File, 
    maxWidth: number = 1920, 
    maxHeight: number = 1080, 
    quality: number = 0.8
  ): Promise<File> {
    console.log('[ImageUploadService] optimizeImage démarré:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      maxWidth,
      maxHeight,
      quality
    });

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        console.log('[ImageUploadService] Image chargée pour optimisation:', {
          originalWidth: img.width,
          originalHeight: img.height,
          aspectRatio: (img.width / img.height).toFixed(2)
        });

        // Calculer les nouvelles dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
          console.log('[ImageUploadService] Redimensionnement largeur:', {
            originalWidth: img.width,
            newWidth: width,
            newHeight: height
          });
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
          console.log('[ImageUploadService] Redimensionnement hauteur:', {
            originalHeight: img.height,
            newWidth: width,
            newHeight: height
          });
        }

        // Redimensionner l'image
        canvas.width = width;
        canvas.height = height;
        
        console.log('[ImageUploadService] Configuration canvas:', {
          canvasWidth: canvas.width,
          canvasHeight: canvas.height
        });
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          console.log('[ImageUploadService] Conversion en blob avec compression...');
          
          // Convertir en blob avec compression
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const optimizedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                
                console.log('[ImageUploadService] Optimisation terminée:', {
                  originalSize: file.size,
                  optimizedSize: optimizedFile.size,
                  reduction: `${((1 - optimizedFile.size / file.size) * 100).toFixed(1)}%`,
                  originalDimensions: `${img.width}x${img.height}`,
                  optimizedDimensions: `${width}x${height}`
                });
                
                resolve(optimizedFile);
              } else {
                console.error('[ImageUploadService] Erreur lors de la conversion en blob');
                reject(new Error('Erreur lors de l\'optimisation de l\'image'));
              }
            },
            file.type,
            quality
          );
        } else {
          console.error('[ImageUploadService] Impossible d\'obtenir le contexte canvas');
          reject(new Error('Impossible d\'obtenir le contexte canvas'));
        }
      };

      img.onerror = () => {
        console.error('[ImageUploadService] Erreur lors du chargement de l\'image:', {
          fileName: file.name,
          fileType: file.type
        });
        reject(new Error('Erreur lors du chargement de l\'image'));
      };

      console.log('[ImageUploadService] Lecture du fichier pour optimisation...');
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Générer une URL de prévisualisation temporaire
   * @param file - Le fichier pour lequel générer la prévisualisation
   * @returns Promise<string> - URL de prévisualisation
   */
  generatePreviewUrl(file: File): Promise<string> {
    console.log('[ImageUploadService] generatePreviewUrl démarré:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const url = e.target?.result as string;
        console.log('[ImageUploadService] Prévisualisation générée:', {
          fileName: file.name,
          urlLength: url.length,
          urlStart: url.substring(0, 50) + '...'
        });
        resolve(url);
      };
      
      reader.onerror = () => {
        console.error('[ImageUploadService] Erreur lors de la génération de la prévisualisation:', {
          fileName: file.name,
          error: reader.error
        });
        reject(new Error('Erreur lors de la génération de la prévisualisation'));
      };
      
      console.log('[ImageUploadService] Lecture du fichier pour prévisualisation...');
      reader.readAsDataURL(file);
    });
  }
}

// Instance singleton du service
export const imageUploadService = new ImageUploadService();
export default imageUploadService; 