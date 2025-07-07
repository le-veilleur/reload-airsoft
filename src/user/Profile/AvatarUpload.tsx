import React, { useState, useRef, useCallback } from 'react';
import ProfileAvatar from './ProfileAvatar';

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onImageChange: (file: File | null, previewUrl: string | null) => void;
  disabled?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onImageChange,
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format non supporté. Utilisez JPG, PNG ou GIF.');
      return false;
    }

    // Vérifier la taille (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Le fichier est trop volumineux. Maximum 5MB.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = useCallback((file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreviewUrl(url);
      onImageChange(file, url);
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    if (disabled) return;
    
    setPreviewUrl(null);
    onImageChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Zone de drag & drop */}
      <div
        className={`relative group cursor-pointer transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {/* Avatar actuel */}
        <ProfileAvatar
          src={previewUrl}
          alt="Avatar"
          size="large"
          className="transition-opacity duration-200"
        />
        
        {/* Overlay pour le hover et drag */}
        <div
          className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-200 ${
            isDragging 
              ? 'bg-blue-500 bg-opacity-90' 
              : 'bg-black bg-opacity-0 group-hover:bg-opacity-50'
          } ${disabled ? 'hidden' : ''}`}
        >
          <div className={`text-white text-center transition-opacity duration-200 ${
            isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-sm font-medium">
              {isDragging ? 'Déposer ici' : 'Changer'}
            </p>
          </div>
        </div>
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Boutons d'action */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Choisir une image
        </button>
        
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Supprimer
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600">
        <p>Glissez-déposez une image ou cliquez pour choisir</p>
        <p>JPG, PNG ou GIF • Maximum 5MB</p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="text-red-600 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default AvatarUpload; 