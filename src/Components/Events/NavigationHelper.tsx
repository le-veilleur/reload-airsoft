import React, { useState, useEffect } from 'react';

interface NavigationHelperProps {
  activeTab: string;
  setActiveTab: (tab: "overview" | "scenario" | "participants" | "equipment") => void;
}

const NavigationHelper: React.FC<NavigationHelperProps> = ({ activeTab, setActiveTab }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const sections = [
    { key: "overview", label: "Vue d'ensemble", icon: "📋" },
    { key: "scenario", label: "Scénario", icon: "🎭" },
    { key: "participants", label: "Participants", icon: "👥" },
    { key: "equipment", label: "Équipement", icon: "🎯" }
  ];

  const scrollToSection = (sectionKey: string) => {
    setActiveTab(sectionKey as any);
    const element = document.getElementById(`section-${sectionKey}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Navigation par sections (desktop uniquement) */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <div className="text-xs text-gray-500 text-center mb-2 px-2">Navigation</div>
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => scrollToSection(section.key)}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors ${
                  activeTab === section.key
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                title={section.label}
              >
                <span className="text-sm">{section.icon}</span>
                <span className="hidden xl:block">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton retour en haut */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Retour en haut"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </>
  );
};

export default NavigationHelper; 