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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
        {message && <p className="text-blue-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe:
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Se connecter
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
