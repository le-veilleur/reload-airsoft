import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fermer le dropdown avec la touche Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      logout();
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="relative bg-transparent border-none">
      <div className="container mx-auto flex justify-between items-center p-3">
        {/* Partie gauche avec le titre et Événements */}
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold">
            <Link to="/" className="hover:underline text-black">
              Reload-Airsoft
            </Link>
          </h1>
          {/* Ajout de marge à gauche du lien Événements */}
          <Link to="/events" className="px-3 py-2 text-sm font-medium ml-4 font-Montserrat">
            Événements
          </Link>
        </div>

        {/* Partie droite avec Connexion et Inscription */}
        <ul className="flex items-center space-x-6">
          {isAuthenticated ? (
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 min-w-0"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <img
                  src={user?.profile_picture_url || "https://cdn.discordapp.com/attachments/1156985446161711165/1296157593051594773/1_lgZkB5FIZEqR6v-h_ZpCNw.png?ex=67114453&is=670ff2d3&hm=c45ab66a8a6a146b8d398feb08cee329dba9ec207d6fd9813482dbe7c8a84f15&"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="hidden sm:block text-left min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstname || user?.pseudonyme || 'Utilisateur'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {/* Menu déroulant amélioré */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] transform opacity-100 scale-100 transition-all duration-200">
                  {/* Header du menu */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <img
                        src={user?.profile_picture_url || "https://cdn.discordapp.com/attachments/1156985446161711165/1296157593051594773/1_lgZkB5FIZEqR6v-h_ZpCNw.png?ex=67114453&is=670ff2d3&hm=c45ab66a8a6a146b8d398feb08cee329dba9ec207d6fd9813482dbe7c8a84f15&"}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="ml-3 min-w-0 flex-1">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {user?.firstname} {user?.lastname}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                          {user?.role || 'Joueur'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Options du menu */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mon Profil
                    </Link>
                    
                    <Link
                      to="/events"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Mes Événements
                    </Link>
                    
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Inscription
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
