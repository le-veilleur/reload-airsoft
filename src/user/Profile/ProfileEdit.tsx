import React, { useState } from "react";

interface ProfileEditProps {
  avatarUrl: string | null;
  username: string;
  FirstName: string;
  LastName: string;
  teams: string[];
  email: string;
  onSave: () => void; // Fonction pour gérer la sauvegarde
}

const ProfileEdit: React.FC<ProfileEditProps> = ({
  avatarUrl,
  username,
  FirstName,
  LastName,
  teams,
  email,
  onSave
}) => {
  const [formData, setFormData] = useState({
    avatarUrl,
    username,
    FirstName,
    LastName,
    teams: teams.join(", "), // Convertir le tableau en chaîne
    email
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pouvez envoyer les données mises à jour au serveur
    console.log("Données mises à jour : ", formData);
    onSave(); // Appeler la fonction onSave après la sauvegarde
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Modifier le profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Pseudo
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            Prénom
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.FirstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Nom de famille
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.LastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="teams"
            className="block text-sm font-medium text-gray-700"
          >
            Équipes (séparées par des virgules)
          </label>
          <input
            id="teams"
            type="text"
            name="teams"
            value={formData.teams}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
