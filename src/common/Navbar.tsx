import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
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
            <li className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2"
              >
                <img
                  src={user?.avatarUrl || "https://cdn.discordapp.com/attachments/1156985446161711165/1296157593051594773/1_lgZkB5FIZEqR6v-h_ZpCNw.png?ex=67114453&is=670ff2d3&hm=c45ab66a8a6a146b8d398feb08cee329dba9ec207d6fd9813482dbe7c8a84f15&"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <svg
                  className="w-4 h-4 ml-2"
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
              {isDropdownOpen && (
                <ul className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg w-48 z-40">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 font-Montserrat hover:bg-gray-200"
                    >
                      Mon Profil
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left font-Montserrat px-4 py-2 hover:bg-gray-200"
                    >
                      Déconnexion
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 font-Montserrat rounded-md transition-colors"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 font-Montserrat rounded-md transition-colors"
                >
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
