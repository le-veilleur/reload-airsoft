import React, { useState } from 'react';
import ClearCacheWidget from '../Admin/ClearCacheWidget';

const Events: React.FC = () => {
  // État pour afficher/masquer le widget de cache (dev mode)
  const [showCacheWidget, setShowCacheWidget] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Widget de cache temporaire pour dev (peut être retiré en production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-40">
          <button
            onClick={() => setShowCacheWidget(!showCacheWidget)}
            className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full shadow-lg"
            title="Gestion du cache (dev)"
          >
            🗑️
          </button>
          
          {showCacheWidget && (
            <div className="absolute bottom-12 left-0">
              <ClearCacheWidget />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Events; 