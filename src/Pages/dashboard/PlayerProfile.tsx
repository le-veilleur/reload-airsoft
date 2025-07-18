import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../../Contexts/AuthContext';
import UserService, { mapAvatarUrl } from '../../Services/userService';

const PlayerProfile: React.FC = () => {
  const { user, refreshUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // États pour les champs d'édition
  const [editData, setEditData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    pseudonyme: user?.pseudonyme || '',
    email: user?.email || '',
    phone_number: user?.phone_number || ''
  });

  // Statistiques simulées (à remplacer par de vraies données API)
  const [stats, setStats] = useState({
    memberSince: '2023-01-15',
    totalEvents: 15,
    totalSpent: 450,
    averageRating: 4.2,
    favoriteCategory: 'CQB'
  });

  // Mettre à jour les données d'édition quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setEditData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        pseudonyme: user.pseudonyme || '',
        email: user.email || '',
        phone_number: user.phone_number || ''
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Annuler : remettre les données originales
      setEditData({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        pseudonyme: user?.pseudonyme || '',
        email: user?.email || '',
        phone_number: user?.phone_number || ''
      });
      setAvatarFile(null);
      setAvatarPreview(null);
    }
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
          setError("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP, GIF).");
          return;
        }
        
        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError("L'image ne peut pas dépasser 10MB.");
          return;
        }
        
        setAvatarFile(file);
        
        // Créer un aperçu immédiat
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.onerror = () => {
          setError("Erreur lors de la lecture du fichier image.");
        };
        reader.readAsDataURL(file);
        setError(null);
        
        console.log("Fichier sélectionné:", {
          name: file.name,
          size: file.size,
          type: file.type
        });
      } catch (error) {
        console.error("Erreur lors de la sélection du fichier:", error);
        setError("Erreur lors de la sélection du fichier.");
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let avatarUrl: string | undefined = undefined;
      // Upload de l'avatar si un fichier a été sélectionné
      if (avatarFile) {
        try {
          console.log("Début de l'upload de l'avatar...");
          avatarUrl = await UserService.uploadProfilePicture(avatarFile);
          console.log("Avatar uploadé avec succès, URL:", avatarUrl);
        } catch (avatarError) {
          console.error("Erreur lors de l'upload de l'avatar:", avatarError);
          setError(`Erreur lors de l'upload de l'avatar: ${avatarError instanceof Error ? avatarError.message : 'Erreur inconnue'}. Les autres modifications seront sauvegardées.`);
        }
      }

      // Préparer les données modifiées seulement
      const updateData: any = {};
      if (editData.firstname !== user?.firstname && editData.firstname.trim()) {
        updateData.firstname = editData.firstname.trim();
      }
      if (editData.lastname !== user?.lastname && editData.lastname.trim()) {
        updateData.lastname = editData.lastname.trim();
      }
      if (editData.pseudonyme !== user?.pseudonyme && editData.pseudonyme.trim()) {
        updateData.pseudonyme = editData.pseudonyme.trim();
      }
      if (editData.phone_number !== user?.phone_number) {
        updateData.phone_number = editData.phone_number.trim() || null;
      }
      if (avatarUrl) {
        updateData.profile_picture_url = avatarUrl;
      }

      // Vérifier qu'il y a des modifications (ou qu'un avatar a été uploadé)
      if (Object.keys(updateData).length === 0 && !avatarFile) {
        setError("Aucune modification détectée.");
        setIsLoading(false);
        return;
      }

      // Validation basique
      if (updateData.pseudonyme && updateData.pseudonyme.length < 3) {
        setError("Le pseudonyme doit contenir au moins 3 caractères.");
        setIsLoading(false);
        return;
      }

      // Mettre à jour via l'API seulement si il y a des champs modifiés
      if (Object.keys(updateData).length > 0) {
        await UserService.updateUserProfile(updateData);
      }
      // Mettre à jour le contexte utilisateur
      await refreshUserProfile();
      setSuccess("Profil mis à jour avec succès !");
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      setError("Erreur lors de la mise à jour. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
    <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 ${color}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout userRole="player">
      <div className="space-y-6 pb-16">
        {/* Messages d'état */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mon Profil</h1>
              <p className="text-indigo-100 text-lg">Gérez vos informations personnelles et préférences</p>
            </div>
            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={handleEditToggle}
                  className="px-6 py-3 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 hover:shadow-md"
                >
                  ✏️ Modifier
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-3 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading && (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    <span>{isLoading ? 'Sauvegarde...' : '💾 Sauvegarder'}</span>
                  </button>
                  <button
                    onClick={handleEditToggle}
                    disabled={isLoading}
                    className="px-6 py-3 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:shadow-md disabled:opacity-50"
                  >
                    ❌ Annuler
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Membre depuis"
            value={new Date(stats.memberSince).getFullYear()}
            icon="👤"
            color="from-blue-50 to-blue-100"
          />
          <StatCard
            title="Événements"
            value={stats.totalEvents}
            icon="🎯"
            color="from-green-50 to-green-100"
          />
          <StatCard
            title="Total dépensé"
            value={`${stats.totalSpent}€`}
            icon="💰"
            color="from-yellow-50 to-yellow-100"
          />
          <StatCard
            title="Note moyenne"
            value={`${stats.averageRating}/5`}
            icon="⭐"
            color="from-purple-50 to-purple-100"
          />
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">👤</span>
              Informations personnelles
            </h2>
            
            {/* Avatar Section */}
            <div className="mb-6 flex items-center space-x-4">
              <div className="relative">
                <div className={`relative ${isEditing ? 'cursor-pointer group' : ''}`}>
                  <img
                    src={avatarPreview ? mapAvatarUrl(avatarPreview) ?? '../../../public/images/default-avatar.png' : (mapAvatarUrl(user?.avatar_url) ?? '../../../public/images/default-avatar.png')}
                    alt={`Avatar de ${user?.pseudonyme}`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                    onClick={isEditing ? () => document.getElementById('avatar-input')?.click() : undefined}
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user?.pseudonyme || user?.firstname || 'Utilisateur'}
                </h3>
                <p className="text-gray-600">
                  {user?.firstname} {user?.lastname}
                </p>
                {isEditing && (
                  <div className="space-y-1">
    
                    <button
                      type="button"
                      onClick={() => document.getElementById('avatar-input')?.click()}
                      className="text-xs text-blue-500 hover:text-blue-700 underline"
                    >
                      Ou cliquez ici pour sélectionner une image
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstname}
                      onChange={(e) => setEditData({...editData, firstname: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{user?.firstname || 'Non renseigné'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastname}
                      onChange={(e) => setEditData({...editData, lastname: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{user?.lastname || 'Non renseigné'}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pseudonyme</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.pseudonyme}
                    onChange={(e) => setEditData({...editData, pseudonyme: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre pseudonyme"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{user?.pseudonyme || 'Non renseigné'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm font-semibold text-gray-900 flex items-center">
                  {user?.email || 'Non renseigné'}
                  <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m9-5a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </p>
                <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone_number}
                    onChange={(e) => setEditData({...editData, phone_number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre numéro de téléphone"
                  />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{user?.phone_number || 'Non renseigné'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">⚙️</span>
              Préférences
            </h2>
            
            <div className="space-y-6">
              {/* Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Notifications par email</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user?.preferences?.notifications ?? true}
                        disabled={true}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Notifications push</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={false}
                        disabled={true}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Les préférences de notification seront configurables prochainement
                </p>
              </div>

              {/* Account Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations du compte</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Rôle</span>
                    <span className="text-sm font-semibold text-gray-900 capitalize">{user?.role || 'player'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Langue</span>
                    <span className="text-sm font-semibold text-gray-900">{user?.preferences?.language || 'Français'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700">Membre depuis</span>
                    <span className="text-sm font-semibold text-gray-900">{new Date(stats.memberSince).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlayerProfile; 