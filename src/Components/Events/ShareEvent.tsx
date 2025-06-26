import React, { useState } from "react";

interface ShareEventProps {
  eventTitle: string;
  eventUrl: string;
  eventDescription: string;
}

const ShareEvent: React.FC<ShareEventProps> = ({ eventTitle, eventUrl, eventDescription }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const shareUrl = `${window.location.origin}${eventUrl}`;
  const encodedTitle = encodeURIComponent(eventTitle);
  const encodedDescription = encodeURIComponent(eventDescription.substring(0, 200));
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0D%0A%0D%0APlus d'informations : ${encodedUrl}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
      >
        <span>📤</span>
        Partager
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Partager cet événement</h4>
            
            <div className="space-y-2">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm">
                  📘
                </div>
                <span className="text-sm text-gray-700">Facebook</span>
              </a>

              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center text-white text-sm">
                  🐦
                </div>
                <span className="text-sm text-gray-700">Twitter</span>
              </a>

              <button
                onClick={copyToClipboard}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
              >
                <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center text-white text-sm">
                  📋
                </div>
                <span className="text-sm text-gray-700">
                  {copySuccess ? "Lien copié !" : "Copier le lien"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default ShareEvent; 