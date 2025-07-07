import React, { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export interface RegisterFormProps {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  pseudonyme: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormProps>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    pseudonyme: ""
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
      await register(formData);
      setSuccess("Inscription réussie ! Vous pouvez vous connecter.");
      // Optional: redirect immediately or let the user click a link
      navigate("/login"); // Redirection vers la page de connexion
    } catch (err) {
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
