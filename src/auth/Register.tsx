import React, { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // Importer useNavigate

export interface RegisterFormProps {
  FirstName: string;
  LastName: string;
  email: string;
  password: string;
  username: string; // Nouveau champ pour le pseudo
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormProps>({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    username: "" // Initialisation du nouveau champ
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // État pour le message de succès
  const { register } = useAuth();
  const navigate = useNavigate(); // Initialiser useNavigate

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 7; // Mot de passe d'au moins 7 caractères
  };

  const validateName = (name: string) => {
    return name.trim().length > 0; // Nom non vide
  };

  const validateUsername = (username: string) => {
    return username.trim().length > 0; // Pseudo non vide
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(formData.FirstName)) {
      setError("Le prénom ne peut pas être vide.");
      return;
    }

    if (!validateName(formData.LastName)) {
      setError("Le nom de famille ne peut pas être vide.");
      return;
    }

    if (!validateUsername(formData.username)) {
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
      setSuccess(null); // Réinitialiser le message de succès
      await register(formData);
      setSuccess("Inscription réussie ! Vous pouvez vous connecter."); // Message de succès
      setTimeout(() => {
        navigate("/login"); // Redirection vers la page de connexion après 3 secondes
      }, 3000);
    } catch (err) {
      setError("Échec de l'inscription. Veuillez vérifier vos informations.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Inscription</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}{" "}
        {/* Affiche le message de succès */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pseudo:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prénom:
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.FirstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom de famille:
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.LastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe:
            </label>
            <input
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
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
