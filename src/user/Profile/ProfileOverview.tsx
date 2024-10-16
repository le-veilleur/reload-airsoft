// src/user/Profile/ProfileOverview.tsx

import React, { useState } from "react";
import ProfileEdit from "./ProfileEdit";

interface UserProps {
  FirstName: string;
  LastName: string;
  email: string;
  avatarUrl: string | null;
  username: string;
  teams: string[];
}

const ProfileOverview: React.FC<UserProps> = ({
  FirstName,
  LastName,
  email,
  avatarUrl,
  username,
  teams
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
      {!isEditing ? (
        <>
          <div className="flex items-center space-x-6">
            <img
              src={avatarUrl || "https://cdn.discordapp.com/attachments/1156985446161711165/1296157593051594773/1_lgZkB5FIZEqR6v-h_ZpCNw.png?ex=67114453&is=670ff2d3&hm=c45ab66a8a6a146b8d398feb08cee329dba9ec207d6fd9813482dbe7c8a84f15&"}
              alt={`${FirstName} ${LastName}`}
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{username}</h2>
              <p className="text-lg text-gray-600">
                Prénom : <span className="font-medium">{FirstName}</span>
              </p>
              <p className="text-lg text-gray-600">
                Nom : <span className="font-medium">{LastName}</span>
              </p>
              <p className="text-lg text-gray-600">
                Email : <span className="font-medium">{email}</span>
              </p>
              <p className="text-lg text-gray-600">
                Équipes :{" "}
                <span className="font-medium">{teams.join(", ")}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleEditToggle}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200"
          >
            Modifier
          </button>
        </>
      ) : (
        <ProfileEdit
          avatarUrl={avatarUrl}
          username={username}
          FirstName={FirstName}
          LastName={LastName}
          teams={teams}
          email={email}
          onSave={handleEditToggle}
        />
      )}
    </div>
  );
};

export default ProfileOverview;
