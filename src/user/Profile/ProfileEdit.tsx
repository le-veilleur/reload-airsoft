import React, { useState } from "react";
import { UserProfile, UpdateUserData } from "../../Interfaces/types";
import { useAuth } from "../../Contexts/AuthContext";
import AvatarUpload from "./AvatarUpload";
import UserService from "../../Services/userService";

interface ProfileEditProps {
  user: UserProfile;
  onCancel: () => void;
  onSaveSuccess: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Type spécifique pour les champs du formulaire de profil
type ProfileFormData = {
  firstname: string;
  lastname: string;
  pseudonyme: string;
  email: string;
  phone_number: string;
  profile_picture_url: string;
};

const ProfileEdit: React.FC<ProfileEditProps> = ({
  user,
  onCancel,
  onSaveSuccess,
  loading,
  setLoading
}) => {
  const { user: contextUser } = useAuth();
  
  // Valeurs initiales pour la comparaison
  const initialValues: ProfileFormData = {
    firstname: user.firstname,
    lastname: user.lastname,
    pseudonyme: user.pseudonyme,
    email: user.email,
    phone_number: user.phone_number || "",
    profile_picture_url: user.profile_picture_url || ""
  };

  const [formData, setFormData] = useState<ProfileFormData>(initialValues);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Nettoyer l'erreur du champ quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Fonction pour détecter les champs modifiés
  const getModifiedFields = (): Partial<UpdateUserData> => {
    const modifiedFields: Partial<UpdateUserData> = {};
    
    // Vérifier chaque champ pour voir s'il a été modifié
    (Object.keys(formData) as Array<keyof ProfileFormData>).forEach(key => {
      if (formData[key] !== initialValues[key]) {
        modifiedFields[key] = formData[key];
      }
    });

    return modifiedFields;
  };

  // Fonction pour vérifier si au moins un champ a été modifié
  const hasModifications = (): boolean => {
    const modifiedFields = getModifiedFields();
    return Object.keys(modifiedFields).length > 0 || avatarFile !== null;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const modifiedFields = getModifiedFields();

    // Valider uniquement les champs qui ont été modifiés
    if ('firstname' in modifiedFields && !modifiedFields.firstname?.trim()) {
      newErrors.firstname = "Le prénom ne peut pas être vide";
    }

    if ('lastname' in modifiedFields && !modifiedFields.lastname?.trim()) {
      newErrors.lastname = "Le nom ne peut pas être vide";
    }

    if ('pseudonyme' in modifiedFields && !modifiedFields.pseudonyme?.trim()) {
      newErrors.pseudonyme = "Le pseudo ne peut pas être vide";
    }

    if ('email' in modifiedFields) {
      if (!modifiedFields.email?.trim()) {
        newErrors.email = "L'email ne peut pas être vide";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modifiedFields.email)) {
        newErrors.email = "Format d'email invalide";
      }
    }

    if ('phone_number' in modifiedFields && modifiedFields.phone_number && 
        !/^[\d\s\-\+\(\)]+$/.test(modifiedFields.phone_number)) {
      newErrors.phone_number = "Format de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier s'il y a des modifications
    if (!hasModifications()) {
      setErrors({ general: "Aucune modification détectée." });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess(null);

    try {
      let updateData: Partial<UpdateUserData> = getModifiedFields();

      // Upload de l'avatar si un fichier a été sélectionné
      if (avatarFile) {
        const avatarUrl = await UserService.uploadProfilePicture(avatarFile);
        updateData.profile_picture_url = avatarUrl;
      }
      
      // Appel réel au service API avec seulement les champs modifiés
      const updatedProfile = await UserService.updateUserProfile(updateData);
      
      setSuccess("Profil mis à jour avec succès !");
      
      // Attendre un peu pour montrer le message de succès
      setTimeout(() => {
        onSaveSuccess();
      }, 1500);
      
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      
      let errorMessage = "Erreur lors de la mise à jour. Veuillez réessayer.";
      
      // Gestion des erreurs spécifiques
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || "Données invalides. Vérifiez les champs.";
      } else if (error.response?.status === 409) {
        errorMessage = "Email ou pseudo déjà utilisé par un autre utilisateur.";
      } else if (error.response?.status === 422) {
        // Erreurs de validation détaillées
        const validationErrors = error.response.data?.errors || {};
        setErrors(validationErrors);
        return; // Ne pas définir le message général si on a des erreurs de champ
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour indiquer visuellement les champs modifiés
  const isFieldModified = (fieldName: keyof ProfileFormData): boolean => {
    return formData[fieldName] !== initialValues[fieldName];
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Modifier le profil</h1>
              <p className="text-sm text-gray-600 mt-1">
                Modifiez seulement les champs que vous souhaitez changer
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Messages d'erreur/succès globaux */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{errors.general}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Avatar */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Photo de profil</h3>
            <AvatarUpload
              currentAvatar={formData.profile_picture_url}
              onImageChange={(file, previewUrl) => {
                setAvatarFile(file);
                if (previewUrl) {
                  setFormData(prev => ({ ...prev, profile_picture_url: previewUrl }));
                }
              }}
              disabled={loading}
            />
          </div>

          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom {isFieldModified('firstname') && <span className="text-blue-600">(modifié)</span>}
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname || ""}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.firstname ? 'border-red-300' : 
                  isFieldModified('firstname') ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                }`}
              />
              {errors.firstname && (
                <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                Nom {isFieldModified('lastname') && <span className="text-blue-600">(modifié)</span>}
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname || ""}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastname ? 'border-red-300' : 
                  isFieldModified('lastname') ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                }`}
              />
              {errors.lastname && (
                <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
              )}
            </div>

            <div>
              <label htmlFor="pseudonyme" className="block text-sm font-medium text-gray-700 mb-1">
                Pseudo {isFieldModified('pseudonyme') && <span className="text-blue-600">(modifié)</span>}
              </label>
              <input
                type="text"
                id="pseudonyme"
                name="pseudonyme"
                value={formData.pseudonyme || ""}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.pseudonyme ? 'border-red-300' : 
                  isFieldModified('pseudonyme') ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                }`}
              />
              {errors.pseudonyme && (
                <p className="mt-1 text-sm text-red-600">{errors.pseudonyme}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email {isFieldModified('email') && <span className="text-blue-600">(modifié)</span>}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 
                  isFieldModified('email') ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone {isFieldModified('phone_number') && <span className="text-blue-600">(modifié)</span>}
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number || ""}
                onChange={handleChange}
                placeholder="+33 1 23 45 67 89"
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone_number ? 'border-red-300' : 
                  isFieldModified('phone_number') ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                }`}
              />
              {errors.phone_number && (
                <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
              )}
            </div>
          </div>

          {/* Indicateur de modifications */}
          {hasModifications() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-blue-700 text-sm">
                  Des modifications ont été détectées. Cliquez sur "Sauvegarder" pour les enregistrer.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !hasModifications()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sauvegarde...</span>
                </>
              ) : (
                <span>Sauvegarder</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
