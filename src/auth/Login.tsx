import React, { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LoginData } from "../Interfaces/types";

const Login: React.FC = () => {
  // État pour stocker les données du formulaire et les messages d'erreur/success
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer le message et la redirection depuis l'état de navigation
  const state = location.state as { message?: string; redirectTo?: string } | null;
  const redirectTo = state?.redirectTo || "/";
  const message = state?.message;

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // console.log("Form Data Change:", name, value);
  };

  // Validation de l'email
  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Validation du mot de passe
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  // Gestion de l'envoi du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Form Data on Submit:", formData);

    // Vérification des validations
    if (!validateEmail(formData.email)) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await login(formData);
      setSuccess("Connexion réussie !");
      console.log("Login Successful");
      navigate(redirectTo);
    } catch (err: any) {
      console.error("Login Error:", err);
      
      // Afficher un message d'erreur plus spécifique selon le type d'erreur
      let errorMessage = "Échec de la connexion. Veuillez vérifier vos informations.";
      
      if (err?.message) {
        // Si c'est notre erreur custom du AuthContext
        if (err.message.includes("Token d'accès manquant")) {
          errorMessage = "Erreur serveur : token d'accès manquant. Contactez l'administrateur.";
        } else if (err.message.includes("Données utilisateur incomplètes")) {
          errorMessage = "Erreur serveur : données utilisateur incomplètes. Contactez l'administrateur.";
        } else if (err.message.includes("401") || err.message.includes("Unauthorized")) {
          errorMessage = "Email ou mot de passe incorrect.";
        } else if (err.message.includes("429")) {
          errorMessage = "Trop de tentatives de connexion. Veuillez patienter.";
        } else if (err.message.includes("500")) {
          errorMessage = "Erreur serveur temporaire. Veuillez réessayer dans quelques instants.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-strong p-8 md:p-10 animate-scale-in">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-gray-900 font-LeagueSpartan mb-2">
              Connexion
            </h2>
            <p className="text-gray-600 font-Montserrat">
              Bienvenue ! Connectez-vous à votre compte
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-200 text-primary-800 rounded-xl text-sm font-Montserrat">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red/30 text-accent-red rounded-xl text-sm font-Montserrat flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-accent-green/10 border border-accent-green/30 text-accent-green rounded-xl text-sm font-Montserrat flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-2 font-Montserrat"
              >
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl font-Montserrat text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-2 font-Montserrat"
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl font-Montserrat text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-medium hover:shadow-strong focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-300 font-Montserrat"
            >
              Se connecter
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm font-Montserrat transition-colors duration-200"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-Montserrat">Nouveau sur Reload-Airsoft ?</span>
              </div>
            </div>

            <Link
              to="/register"
              className="block w-full py-3 px-4 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-300 text-center font-Montserrat"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
