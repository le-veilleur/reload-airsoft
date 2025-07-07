// src/user/Profile/ProfileOverview.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { UserProfile } from "../../Interfaces/types";
import UserService from "../../Services/userService";
import ProfileEdit from "./ProfileEdit";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";

const ProfileOverview: React.FC = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(authUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données complètes du profil
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) return;
      
      // Debug : afficher le contenu du token JWT pour voir les données disponibles
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('JWT-Reload-airsoft='))?.split('=')[1];
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          console.log("=== DONNÉES DISPONIBLES DANS LE TOKEN JWT ===");
          console.log(payload);
          console.log("===========================================");
          
          // Essayer de créer un profil immédiatement avec ces données
          if (payload.email || payload.sub) {
            const profileFromJWT = {
              firstname: payload.firstname || payload.given_name || payload.name?.split(' ')[0] || "Utilisateur",
              lastname: payload.lastname || payload.family_name || payload.name?.split(' ').slice(1).join(' ') || "",
              pseudonyme: payload.pseudonyme || payload.username || payload.preferred_username || (payload.email || payload.sub)?.split('@')[0] || "utilisateur",
              email: payload.email || payload.sub || "user@example.com",
              role: payload.role || payload.roles?.[0] || "player",
              profile_picture_url: payload.picture || null,
              phone_number: payload.phone_number || null,
              preferences: {
                notifications: true,
                language: "fr"
              }
            };
            console.log("Profil créé depuis JWT:", profileFromJWT);
            
            // Si on a des données valides, les utiliser directement
            if (profileFromJWT.email !== "user@example.com") {
              setUser(profileFromJWT);
              setProfileLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        console.log("Impossible de décoder le token JWT:", e);
      }
      
      try {
        setProfileLoading(true);
        setError(null);
        
        // Récupérer le profil avec fallbacks automatiques
        const fullProfile = await UserService.getCurrentUserProfile();
        setUser(fullProfile);
        
      } catch (error: any) {
        console.error("Erreur lors de la récupération du profil:", error);
        
        // Si l'utilisateur est connecté mais l'API échoue, utiliser les données du contexte
        if (authUser && authUser.email !== "user@example.com") {
          console.log("Utilisation des données du contexte d'authentification");
          setUser(authUser);
        } else {
          setError("Impossible de charger votre profil. Veuillez vous reconnecter.");
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, authUser]);

  // Rediriger si pas connecté
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Vous devez être connecté pour voir votre profil.
          </p>
        </div>
      </div>
    );
  }

  // Chargement du profil
  if (profileLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Chargement de votre profil...</span>
          </div>
        </div>
      </div>
    );
  }

  // Erreur ou données manquantes
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            {error || "Impossible de charger votre profil."}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Rafraîchir la page
          </button>
        </div>
      </div>
    );
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveSuccess = async () => {
    setIsEditing(false);
    
    // Rafraîchir les données du profil après modification
    try {
      const updatedProfile = await UserService.getCurrentUserProfile();
      setUser(updatedProfile);
      console.log("Profil rafraîchi après modification");
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du profil:", error);
    }
  };

  if (isEditing) {
    return (
      <ProfileEdit
        user={user}
        onCancel={handleEditToggle}
        onSaveSuccess={handleSaveSuccess}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Message d'information si profil incomplet */}
      {(user.firstname === "Utilisateur" && user.email === "user@example.com") && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-blue-800">
              <strong>Profil incomplet.</strong> Cliquez sur "Modifier le profil" pour ajouter vos informations personnelles.
            </p>
          </div>
        </div>
      )}

      {/* En-tête du profil */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
        <div className="relative px-6 pb-6">
          <ProfileAvatar
            src={user.profile_picture_url}
            alt={`${user.firstname} ${user.lastname}`}
            size="large"
            className="-mt-16 mb-4"
          />
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.pseudonyme}
              </h1>
              <p className="text-lg text-gray-600 mb-1">
                {user.firstname} {user.lastname}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'organizer' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'admin' ? 'Administrateur' :
                   user.role === 'organizer' ? 'Organisateur' : 'Joueur'}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleEditToggle}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Modifier le profil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileInfo
          title="Informations personnelles"
          items={[
            { label: "Email", value: user.email, icon: "email" },
            { label: "Téléphone", value: user.phone_number || "Non renseigné", icon: "phone" },
            { label: "Rôle", value: user.role, icon: "role" }
          ]}
        />
        
        <ProfileInfo
          title="Préférences"
          items={[
            { 
              label: "Notifications", 
              value: user.preferences?.notifications ? "Activées" : "Désactivées", 
              icon: "notifications" 
            },
            { 
              label: "Langue", 
              value: user.preferences?.language || "Français", 
              icon: "language" 
            }
          ]}
        />
      </div>

      {/* Statistiques (si disponibles) */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistiques</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">-</div>
            <div className="text-sm text-gray-600">Événements participés</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">-</div>
            <div className="text-sm text-gray-600">Événements organisés</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">-</div>
            <div className="text-sm text-gray-600">Points de réputation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
