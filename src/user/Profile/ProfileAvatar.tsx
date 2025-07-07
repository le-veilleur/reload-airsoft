import React from 'react';

interface ProfileAvatarProps {
  src?: string | null;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  src,
  alt,
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-32 h-32'
  };

  const defaultAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(alt) + "&background=6366f1&color=fff&size=128";

  return (
    <div className={`relative ${className}`}>
      <img
        src={src || defaultAvatar}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-4 border-white shadow-lg`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = defaultAvatar;
        }}
      />
      {/* Indicateur de statut en ligne (optionnel pour plus tard) */}
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
    </div>
  );
};

export default ProfileAvatar; 