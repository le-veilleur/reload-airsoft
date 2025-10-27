import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext"; // Assure-toi que ce chemin est correct

const Home = () => {
  const { isAuthenticated } = useAuth(); // Utilisation du hook pour obtenir l'état d'authentification

  return (
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-100 min-h-screen">
      {/* Bannière d'Accueil */}
      <div
        className="relative bg-cover bg-center bg-no-repeat text-white overflow-hidden"
        style={{
          backgroundImage: `url('images/pxfuel.jpg')`
        }}
      >
        {/* Overlay gradient pour meilleure lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        
        <div className="relative z-10 text-center px-6 py-32 md:py-40 lg:py-48">
          <h1 className="text-gray-100 font-LeagueSpartan font-black text-4xl md:text-5xl lg:text-6xl leading-tight animate-fade-in">
            Prêt à vivre l'adrénaline ?
          </h1>
          <p className="mt-6 text-gray-200 font-Montserrat text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed animate-slide-up">
            Trouve ta prochaine partie d'airsoft et rejoins la bataille dès aujourd'hui !
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link
              to="/events"
              className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-2xl shadow-strong hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Voir les événements
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 text-lg font-bold text-primary-600 bg-white hover:bg-gray-50 rounded-2xl shadow-medium hover:shadow-strong transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                S'inscrire gratuitement
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Section Articles Récents */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-LeagueSpartan mb-4">
            Articles Récents
          </h2>
          <p className="text-gray-600 font-Montserrat text-lg max-w-2xl mx-auto">
            Découvrez les dernières actualités, guides et conseils sur l'airsoft
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Remplacez ces blocs par des données réelles */}
          <div className="group bg-white p-6 shadow-soft hover:shadow-strong rounded-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 font-Montserrat mb-3 group-hover:text-primary-600 transition-colors">
              Titre de l'Article
            </h3>
            <p className="text-gray-600 font-Montserrat leading-relaxed mb-4">
              Un aperçu de l'article avec quelques détails intéressants...
            </p>
            <a href="#" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Lire la suite
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          {/* Ajouter plus de blocs ici */}
        </div>
      </section>

      {/* Section Avis des Utilisateurs */}
      <section className="bg-gradient-to-br from-secondary-50 to-secondary-100 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-LeagueSpartan mb-4">
              Avis des Utilisateurs
            </h2>
            <p className="text-gray-600 font-Montserrat text-lg max-w-2xl mx-auto">
              Découvrez ce que notre communauté pense de nous
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Remplacez ces blocs par des données réelles */}
            <div className="bg-white p-8 shadow-soft hover:shadow-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 font-Montserrat leading-relaxed mb-4 italic">
                "Un excellent site pour les passionnés d'airsoft. Les événements
                sont bien organisés et la communauté est géniale!"
              </p>
              <div className="flex items-center pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div className="ml-3">
                  <p className="font-bold text-gray-900 font-Montserrat">Nom de l'Utilisateur</p>
                  <p className="text-sm text-gray-500">Joueur depuis 2 ans</p>
                </div>
              </div>
            </div>
            {/* Ajouter plus de blocs ici */}
          </div>
        </div>
      </section>

      {/* Section Parties Récentes ou Événements */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-LeagueSpartan mb-4">
            Événements Récents
          </h2>
          <p className="text-gray-600 font-Montserrat text-lg max-w-2xl mx-auto">
            Découvrez les prochaines parties organisées près de chez vous
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Remplacez ces blocs par des données réelles */}
          <div className="group bg-white shadow-soft hover:shadow-strong rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-accent-green/10 text-accent-green text-xs font-bold rounded-full">
                  DISPONIBLE
                </span>
                <span className="text-sm text-gray-500">Dans 3 jours</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-Montserrat mb-2 group-hover:text-primary-600 transition-colors">
                Nom de l'Événement
              </h3>
              <p className="text-gray-600 font-Montserrat mb-4">
                Détails de l'événement et date...
              </p>
              <Link to="/events" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Voir plus
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          {/* Ajouter plus de blocs ici */}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/events"
            className="inline-flex items-center px-8 py-4 text-base font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-2xl shadow-medium hover:shadow-strong transform hover:scale-105 transition-all duration-300"
          >
            Voir tous les événements
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Section Call-to-Action */}
      {!isAuthenticated && (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-20 lg:py-24">
          {/* Patterns de fond */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white font-LeagueSpartan mb-6">
              Rejoignez-nous maintenant !
            </h2>
            <p className="text-xl text-primary-100 font-Montserrat mb-10 max-w-2xl mx-auto leading-relaxed">
              Inscrivez-vous gratuitement pour ne rien manquer de nos événements et articles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <button className="px-10 py-4 bg-white text-primary-700 font-bold text-lg rounded-2xl shadow-strong hover:bg-gray-50 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Créer mon compte gratuit
                </button>
              </Link>
              <Link to="/events">
                <button className="px-10 py-4 bg-primary-800/50 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border-2 border-white/30 hover:bg-primary-800/70 hover:border-white/50 transform hover:scale-105 transition-all duration-300">
                  Explorer les événements
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
