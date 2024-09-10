// src/user/Profile/ProfileOverview.tsx
import React from "react";

interface ProfileOverviewProps {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  firstName,
  lastName,
  email
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 font-Montserrat">Profil</h2>
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-md shadow-sm">
          <p className="text-lg font-medium text-gray-700 font-Montserrat">Prénom:</p>
          <p className="text-gray-600">{firstName}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-md shadow-sm">
          <p className="text-lg font-medium text-gray-700 font-Montserrat">Nom de famille:</p>
          <p className="text-gray-600">{lastName}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-md shadow-sm">
          <p className="text-lg font-medium text-gray-700 font-Montserrat">Email:</p>
          <p className="text-gray-600">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
