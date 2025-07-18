import React, { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Inscription</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pseudonyme"
              className="block text-sm font-medium text-gray-700"
            >
              Pseudo:
            </label>
            <input
              type="text"
              name="pseudonyme"
              id="pseudonyme"
              value={formData.pseudonyme}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700"
            >
              Prénom:
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700"
            >
              Nom de famille:
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
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
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
              Avatar (optionnel):
            </label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading} // Disable the button while loading
            className={`w-full py-2 px-4 ${
              loading ? "bg-gray-400" : "bg-blue-600"
            } text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
