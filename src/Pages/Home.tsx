import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext"; // Assure-toi que ce chemin est correct

const Home = () => {
  const { isAuthenticated } = useAuth(); // Utilisation du hook pour obtenir l'état d'authentification

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Bannière d'Accueil */}
      <div className="bg-blue-500 text-white text-center p-12">
        <h1 className="text-4xl font-bold">Bienvenue sur Reload-Airsoft</h1>
        <p className="mt-4 text-xl">
          Découvrez les derniers événements, articles, et plus encore!
        </p>
        <button className="mt-6 bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200">
          Découvrez Maintenant
        </button>
      </div>

      {/* Section Articles Récents */}
      <section className="p-8">
        <h2 className="text-2xl font-bold mb-4">Articles Récents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Remplacez ces blocs par des données réelles */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Titre de l'Article</h3>
            <p className="mt-2">
              Un aperçu de l'article avec quelques détails intéressants...
            </p>
            <a href="#" className="text-blue-500 mt-4 inline-block">
              Lire la suite
            </a>
          </div>
          {/* Ajouter plus de blocs ici */}
        </div>
      </section>

      {/* Section Avis des Utilisateurs */}
      <section className="bg-gray-200 p-8">
        <h2 className="text-2xl font-bold mb-4">Avis des Utilisateurs</h2>
        <div className="flex flex-wrap gap-4">
          {/* Remplacez ces blocs par des données réelles */}
          <div className="bg-white p-6 shadow-lg rounded-lg w-full md:w-1/3">
            <p>
              "Un excellent site pour les passionnés d'airsoft. Les événements
              sont bien organisés et la communauté est géniale!"
            </p>
            <p className="mt-2 font-semibold">- Nom de l'Utilisateur</p>
          </div>
          {/* Ajouter plus de blocs ici */}
        </div>
      </section>

      {/* Section Parties Récentes ou Événements */}
      <section className="p-8">
        <h2 className="text-2xl font-bold mb-4">Événements Récentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Remplacez ces blocs par des données réelles */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Nom de l'Événement</h3>
            <p className="mt-2">Détails de l'événement et date...</p>
            <a href="#" className="text-blue-500 mt-4 inline-block">
              Voir plus
            </a>
          </div>
          {/* Ajouter plus de blocs ici */}
        </div>
      </section>

      {/* Section Call-to-Action */}
      {!isAuthenticated && (
        <div className="bg-blue-500 text-white text-center p-12 mt-8">
          <h2 className="text-2xl font-bold">Rejoignez-nous maintenant!</h2>
          <p className="mt-4">
            Inscrivez-vous pour ne rien manquer de nos événements et articles.
          </p>
          <Link to="/register">
            <button className="mt-6 bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200">
              Inscription
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
