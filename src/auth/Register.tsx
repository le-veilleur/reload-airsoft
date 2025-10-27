import React, { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export interface RegisterFormProps {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  pseudonyme: string;
  avatar_data?: string;
  avatar_filename?: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormProps>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    pseudonyme: "",
    avatar_data: undefined,
    avatar_filename: undefined
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Ajout gestion avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          avatar_data: reader.result?.toString().split(",")[1], // base64 sans le préfixe data:image/...
          avatar_filename: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 7;
  };

  const validateName = (name: string) => {
    return name.trim().length > 0;
  };

  const validateUsername = (username: string) => {
    return username.trim().length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(formData.firstname)) {
      setError("Le prénom ne peut pas être vide.");
      return;
    }

    if (!validateName(formData.lastname)) {
      setError("Le nom de famille ne peut pas être vide.");
      return;
    }

    if (!validateUsername(formData.pseudonyme)) {
      setError("Le pseudo ne peut pas être vide.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Le mot de passe doit contenir au moins 7 caractères.");
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      setLoading(true); // Set loading state

      // LOG AVATAR DEBUG
      if (formData.avatar_data) {
        console.log("[DEBUG] Avatar présent dans formData :");
        console.log("Type avatar_data:", typeof formData.avatar_data);
        console.log("Taille avatar_data:", formData.avatar_data.length);
        console.log("Début base64:", formData.avatar_data.substring(0, 40));
        if (formData.avatar_filename) {
          console.log("Nom du fichier avatar:", formData.avatar_filename);
        }
      } else {
        console.log("[DEBUG] Aucun avatar dans formData");
      }

      await register(formData); // formData contient maintenant avatar_data et avatar_filename
      setSuccess("Inscription réussie ! Vous pouvez vous connecter.");
      // Optional: redirect immediately or let the user click a link
      navigate("/login"); // Redirection vers la page de connexion
    } catch (err: any) {
      console.error("[DEBUG] Erreur lors de l'inscription:", err);
      if (err?.response) {
        console.error("[DEBUG] Réponse serveur:", err.response);
        if (err.response.data) {
          console.error("[DEBUG] Détail erreur serveur:", err.response.data);
        }
      }
      setError("Échec de l'inscription. Veuillez vérifier vos informations.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-8 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-strong p-6 md:p-8 animate-scale-in">
          {/* Logo / Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-3">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 font-LeagueSpartan mb-1">
              Inscription
            </h2>
            <p className="text-sm text-gray-600 font-Montserrat">
              Rejoignez la communauté Reload-Airsoft
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-accent-red/10 border border-accent-red/30 text-accent-red rounded-xl text-xs font-Montserrat flex items-start">
              <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-accent-green/10 border border-accent-green/30 text-accent-green rounded-xl text-xs font-Montserrat flex items-start">
              <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="pseudonyme" className="block text-xs font-bold text-gray-700 mb-1.5 font-Montserrat">
                Pseudo
              </label>
              <input
                type="text"
                name="pseudonyme"
                id="pseudonyme"
                value={formData.pseudonyme}
                onChange={handleChange}
                required
                placeholder="Votre pseudo"
                className="block w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl font-Montserrat text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstname" className="block text-xs font-bold text-gray-700 mb-1.5 font-Montserrat">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                  placeholder="Jean"
                  className="block w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl font-Montserrat text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-xs font-bold text-gray-700 mb-1.5 font-Montserrat">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                  placeholder="Dupont"
                  className="block w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl font-Montserrat text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-1.5 font-Montserrat">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl font-Montserrat text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-700 mb-1.5 font-Montserrat">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl font-Montserrat text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <p className="mt-0.5 text-xs text-gray-500 font-Montserrat">Au moins 7 caractères</p>
            </div>

            <div>
              <label htmlFor="avatar" className="block text-xs font-bold text-gray-700 mb-1.5 font-Montserrat">
                Avatar (optionnel)
              </label>
              <input
                type="file"
                name="avatar"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-xl font-Montserrat text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 mt-1 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transform hover:scale-[1.02]"
              } text-white font-bold text-sm rounded-xl shadow-medium hover:shadow-strong focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-300 font-Montserrat flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 font-Montserrat">Déjà inscrit ?</span>
              </div>
            </div>

            <Link
              to="/login"
              className="mt-3 block w-full py-2.5 px-4 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-bold text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-300 text-center font-Montserrat"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
