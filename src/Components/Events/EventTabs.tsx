import React from 'react';

interface EventTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const EventTabs: React.FC<EventTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: "Vue d'ensemble", icon: '📋' },
    { id: 'scenario', label: 'Scénario', icon: '🎭' },
    { id: 'participants', label: 'Participants', icon: '👥' },
    { id: 'equipment', label: 'Équipement', icon: '🎯' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default EventTabs; 