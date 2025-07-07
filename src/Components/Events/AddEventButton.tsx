import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

interface AddEventButtonProps {
  onEventCreated?: () => void;
}

const AddEventButton: React.FC<AddEventButtonProps> = ({ onEventCreated }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (user) {
      navigate("/events/create");
    } else {
      // Rediriger vers la page de connexion avec un message
      navigate("/login", { 
        state: { 
          message: "Vous devez être connecté pour créer un événement",
          redirectTo: "/events/create"
        } 
      });
    }
  };

  // Ne pas afficher le bouton si l'utilisateur n'est pas connecté
  if (!user) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
      title="Créer un nouvel événement"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
};

export default AddEventButton; 