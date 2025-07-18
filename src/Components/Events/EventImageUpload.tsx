import React, { useState, useRef, useCallback } from 'react';
import { imageUploadService, UploadImageResponse } from '../../Services/imageUploadService';
import { EventImage } from '../../Interfaces/eventImage';

interface EventImageUploadProps {
  currentImages?: EventImage[];
  onImagesChange: (images: EventImage[]) => void;
  disabled?: boolean;
  maxImages?: number;
  eventId?: string; // Pour organiser les images par événement
  autoUpload?: boolean; // Upload automatique ou manuel
}

const EventImageUpload: React.FC<EventImageUploadProps> = ({
  currentImages = [],
  onImagesChange,
  disabled = false,
  maxImages = 5,
  eventId,
  autoUpload = false // Désactivé par défaut en attendant l'endpoint backend
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessages, setInfoMessages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { isValid: boolean; message?: string; processedFile?: File } => {
    console.log('[EventImageUpload] Validation du fichier:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    try {
      // Utiliser le service de validation avec autoFix activé
      const processedFile = imageUploadService['validateFile'](file, true);
      
      console.log('[EventImageUpload] Fichier validé avec succès:', {
        originalName: file.name,
        originalType: file.type,
        processedType: processedFile.type,
        processedSize: processedFile.size,
        wasModified: processedFile !== file
      });
      
      // Si le fichier a été modifié, c'est qu'il y avait des problèmes
      if (processedFile !== file) {
        return {
          isValid: true,
          message: `Fichier "${file.name}" traité automatiquement`,
          processedFile
        };
      }
      
      return { isValid: true };
    } catch (error: any) {
      console.error('[EventImageUpload] Erreur de validation:', {
        fileName: file.name,
        error: error.message,
        code: error.code
      });
      
      // Seuls les fichiers vides sont vraiment rejetés
      return {
        isValid: false,
        message: error.message
      };
    }
  };

  const handleFileChange = useCallback(async (files: FileList) => {
    console.log('[EventImageUpload] handleFileChange appelé avec:', {
      fileCount: files.length,
      currentImagesCount: currentImages.length,
      maxImages,
      autoUpload
    });

    const newImages: EventImage[] = [];
    const infoMessages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`[EventImageUpload] Traitement du fichier ${i + 1}/${files.length}:`, {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const validation = validateFile(file);
      
      console.log(`[EventImageUpload] Résultat validation pour ${file.name}:`, {
        isValid: validation.isValid,
        message: validation.message,
        hasProcessedFile: !!validation.processedFile
      });
      
      if (!validation.isValid) {
        console.error(`[EventImageUpload] Fichier rejeté: ${file.name}`, validation.message);
        setError(validation.message || `Erreur de validation pour ${file.name}`);
        continue;
      }
      
      // Utiliser le fichier traité s'il existe
      const fileToUse = validation.processedFile || file;
      
      if (validation.message) {
        infoMessages.push(validation.message);
        console.log(`[EventImageUpload] Message info ajouté: ${validation.message}`);
      }
      
      if (currentImages.length + newImages.length >= maxImages) {
        console.warn(`[EventImageUpload] Limite d'images atteinte: ${maxImages}`);
        setError(`Maximum ${maxImages} images autorisées.`);
        return;
      }

      try {
        console.log(`[EventImageUpload] Génération prévisualisation pour: ${fileToUse.name}`);
      // Générer une prévisualisation temporaire
        const previewUrl = await imageUploadService.generatePreviewUrl(fileToUse);
        
        console.log(`[EventImageUpload] Prévisualisation générée:`, {
          fileName: fileToUse.name,
          previewUrlLength: previewUrl.length,
          previewUrlStart: previewUrl.substring(0, 50) + '...'
        });
      
      const newImage: EventImage = {
        id: `temp-${Date.now()}-${Math.random()}`,
          file: fileToUse,
        previewUrl,
          altText: fileToUse.name.replace(/\.[^/.]+$/, ""), // Nom du fichier sans extension
        isPrimary: currentImages.length === 0 && newImages.length === 0, // Première image = primaire
        isUploading: autoUpload,
        uploadProgress: 0
      };
        
        console.log(`[EventImageUpload] Nouvelle image créée:`, {
          id: newImage.id,
          name: fileToUse.name,
          isPrimary: newImage.isPrimary,
          isUploading: newImage.isUploading
        });
      
      newImages.push(newImage);
      
      // Upload automatique si activé
      if (autoUpload) {
          console.log(`[EventImageUpload] Démarrage upload automatique pour: ${fileToUse.name}`);
        uploadImage(newImage);
      }
      } catch (error: any) {
        console.error(`[EventImageUpload] Erreur lors du traitement de ${fileToUse.name}:`, error);
        setError(`Erreur lors du traitement de ${fileToUse.name}: ${error.message}`);
      }
    }
    
    console.log(`[EventImageUpload] Résumé du traitement:`, {
      filesTraites: files.length,
      nouvellesImages: newImages.length,
      messagesInfo: infoMessages.length,
      imagesActuelles: currentImages.length
    });
    
    // Afficher les messages informatifs
    if (infoMessages.length > 0) {
      setError(null); // Effacer les erreurs précédentes
      setInfoMessages(infoMessages);
      console.log(`[EventImageUpload] Messages informatifs affichés:`, infoMessages);
      // Effacer les messages après 8 secondes pour laisser le temps de lire
      setTimeout(() => {
        console.log('[EventImageUpload] Suppression automatique des messages informatifs');
        setInfoMessages([]);
      }, 8000);
    }
    
    // Mettre à jour les images immédiatement pour la prévisualisation
    const updatedImages = [...currentImages, ...newImages];
    console.log(`[EventImageUpload] Mise à jour des images:`, {
      ancienCount: currentImages.length,
      nouveauCount: updatedImages.length,
      ajoutCount: newImages.length
    });
    
    onImagesChange(updatedImages);
  }, [currentImages, maxImages, onImagesChange, autoUpload, eventId]);

  const uploadImage = async (image: EventImage) => {
    console.log('[EventImageUpload] uploadImage démarré pour:', {
      imageId: image.id,
      fileName: image.file?.name,
      isUploading: image.isUploading
    });

    if (!image.file) {
      console.error('[EventImageUpload] uploadImage: Pas de fichier pour l\'image', image.id);
      return;
    }
    
    try {
      // Marquer comme en cours d'upload
      console.log('[EventImageUpload] Mise à jour statut upload pour:', image.id);
      const updatedImages = currentImages.map(img => 
        img.id === image.id 
          ? { ...img, isUploading: true, uploadProgress: 0 }
          : img
      );
      onImagesChange(updatedImages);
      
      console.log('[EventImageUpload] Optimisation de l\'image:', image.file.name);
      // Optimiser l'image avant upload
      const optimizedFile = await imageUploadService.optimizeImage(image.file);
      
      console.log('[EventImageUpload] Image optimisée:', {
        originalSize: image.file.size,
        optimizedSize: optimizedFile.size,
        reduction: `${((1 - optimizedFile.size / image.file.size) * 100).toFixed(1)}%`
      });
      
      console.log('[EventImageUpload] Démarrage upload vers serveur:', {
        fileName: optimizedFile.name,
        fileSize: optimizedFile.size,
        eventId
      });
      
      // Upload vers le serveur
      const uploadResponse: UploadImageResponse = await imageUploadService.uploadImage(optimizedFile, eventId);
      
      console.log('[EventImageUpload] Upload réussi:', {
        imageId: image.id,
        uploadedUrl: uploadResponse.url,
        filename: uploadResponse.filename,
        size: uploadResponse.size
      });
      
      // Mettre à jour avec l'URL permanente
      const finalImages = currentImages.map(img => 
        img.id === image.id 
          ? { 
              ...img, 
              uploadedUrl: uploadResponse.url,
              isUploading: false,
              uploadProgress: 100,
              file: undefined // Supprimer le fichier temporaire
            }
          : img
      );
      
      console.log('[EventImageUpload] Mise à jour finale des images pour:', image.id);
      onImagesChange(finalImages);
      
    } catch (error: any) {
      console.error('[EventImageUpload] Erreur upload image:', {
        imageId: image.id,
        fileName: image.file?.name,
        error: error.message,
        code: error.code,
        details: error.details
      });
      
      setError(`Erreur lors de l'upload de ${image.altText}: ${error.message}`);
      
      // Marquer comme erreur
      const errorImages = currentImages.map(img => 
        img.id === image.id 
          ? { ...img, isUploading: false, uploadProgress: 0 }
          : img
      );
      
      console.log('[EventImageUpload] Marquage image en erreur:', image.id);
      onImagesChange(errorImages);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[EventImageUpload] handleInputChange appelé:', {
      filesCount: e.target.files?.length || 0,
      accept: e.target.accept,
      multiple: e.target.multiple
    });

    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('[EventImageUpload] Fichiers sélectionnés via input:', {
        count: files.length,
        names: Array.from(files).map(f => f.name)
      });
      handleFileChange(files);
    } else {
      console.log('[EventImageUpload] Aucun fichier sélectionné via input');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      console.log('[EventImageUpload] Drag over détecté');
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('[EventImageUpload] Drag leave détecté');
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('[EventImageUpload] Drop détecté:', {
      disabled,
      filesCount: e.dataTransfer.files.length
    });
    
    setIsDragging(false);
    
    if (disabled) {
      console.log('[EventImageUpload] Drop ignoré - composant désactivé');
      return;
    }

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      console.log('[EventImageUpload] Fichiers déposés:', {
        count: files.length,
        names: Array.from(files).map(f => f.name)
      });
      handleFileChange(files);
    } else {
      console.log('[EventImageUpload] Drop sans fichiers');
    }
  };

  const handleClick = () => {
    console.log('[EventImageUpload] Click sur zone de drop:', {
      disabled,
      hasFileInput: !!fileInputRef.current
    });

    if (!disabled && fileInputRef.current) {
      console.log('[EventImageUpload] Ouverture du sélecteur de fichiers');
      fileInputRef.current.click();
    } else {
      console.log('[EventImageUpload] Click ignoré - désactivé ou pas de file input');
    }
  };

  const handleRemove = async (imageId: string) => {
    if (disabled) return;
    
    const removedImage = currentImages.find(img => img.id === imageId);
    
    // Supprimer du serveur si l'image a été uploadée
    if (removedImage?.uploadedUrl) {
      try {
        await imageUploadService.deleteImage(removedImage.uploadedUrl);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
        // Continuer même si la suppression échoue côté serveur
      }
    }
    
    const updatedImages = currentImages.filter(img => img.id !== imageId);
    
    // Si on supprime l'image primaire et qu'il y a d'autres images, rendre la première primaire
    if (removedImage?.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    
    onImagesChange(updatedImages);
  };

  const handleSetPrimary = (imageId: string) => {
    if (disabled) return;
    
    const updatedImages = currentImages.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    
    onImagesChange(updatedImages);
  };

  const handleAltTextChange = (imageId: string, altText: string) => {
    const updatedImages = currentImages.map(img => 
      img.id === imageId ? { ...img, altText } : img
    );
    
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-6">
      {/* Zone de drag & drop */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="space-y-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          
          <div className="text-gray-600">
            <p className="text-lg font-medium">
              {isDragging ? 'Déposer les images ici' : 'Glissez-déposez vos images'}
            </p>
            <p className="text-sm">ou cliquez pour sélectionner</p>
          </div>
          
          <p className="text-xs text-gray-500">
            JPG, PNG, WebP ou GIF • Maximum 10MB par image • {maxImages} images max
            <br />
            <span className="text-blue-600">Les images non conformes seront automatiquement traitées</span>
            <br />
            <span className="text-orange-600">Upload automatique désactivé - Endpoint backend en cours d'implémentation</span>
          </p>
        </div>
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Messages informatifs */}
      {infoMessages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <p className="font-medium mb-1">Images traitées automatiquement :</p>
              <ul className="list-disc list-inside space-y-1">
                {infoMessages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Bouton d'ajout */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || currentImages.length >= maxImages}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter des images
        </button>
      </div>

      {/* Aperçu des images */}
      {currentImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Images de l'événement</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentImages.map((image) => (
              <div key={image.id} className="relative group bg-white rounded-lg shadow-md overflow-hidden">
                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.previewUrl}
                    alt={image.altText}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay avec actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    {!image.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(image.id)}
                        disabled={disabled}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        title="Définir comme image principale"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => handleRemove(image.id)}
                      disabled={disabled}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      title="Supprimer l'image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                                 {/* Badge image principale */}
                 {image.isPrimary && (
                   <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                     Principale
                   </div>
                 )}
                 
                 {/* Indicateur d'upload */}
                 {image.isUploading && (
                   <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                     Upload...
                   </div>
                 )}
                 
                 {/* Barre de progression */}
                 {image.isUploading && (
                   <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                     <div className="w-full bg-gray-200 rounded-full h-2">
                       <div 
                         className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                         style={{ width: `${image.uploadProgress || 0}%` }}
                       ></div>
                     </div>
                     <p className="text-white text-xs mt-1 text-center">
                       {image.uploadProgress || 0}%
                     </p>
                   </div>
                 )}
                
                {/* Nom de l'image */}
                <div className="p-3">
                  <input
                    type="text"
                    value={image.altText}
                    onChange={(e) => handleAltTextChange(image.id, e.target.value)}
                    disabled={disabled}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description de l'image"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Instructions */}
          <div className="text-sm text-gray-600 text-center">
            <p>La première image sera utilisée comme image principale de l'événement</p>
            <p>Vous pouvez réorganiser les images en cliquant sur les boutons d'action</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventImageUpload; 