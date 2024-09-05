// src/common/Footer.tsx

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Reload-Airsoft. Tous droits
          réservés.
        </p>
        <p className="text-sm mt-2">
          <a href="#" className="hover:underline">
            Adresse
          </a>{" "}
          |
          <a href="#" className="hover:underline mx-2">
            Contact
          </a>{" "}
          | 
          <a href="#" className="hover:underline">
            Mentions légales
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
