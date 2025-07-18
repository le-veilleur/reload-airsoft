// src/Pages/dashboard/DashboardLayout.tsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import Navbar from '../../common/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const getMenuItems = () => {
    switch (userRole) {
      case 'super_admin':
        return [
          { name: 'Vue d\'ensemble', path: '/dashboard/super-admin', icon: '📊' },
          { name: 'Utilisateurs', path: '/dashboard/super-admin/users', icon: '👥' },
          { name: 'Événements', path: '/dashboard/super-admin/events', icon: '🎯' },
          { name: 'Organisateurs', path: '/dashboard/super-admin/organizers', icon: '🎪' },
          { name: 'Entreprises', path: '/dashboard/super-admin/companies', icon: '🏢' },
          { name: 'Statistiques', path: '/dashboard/super-admin/stats', icon: '📈' },
          { name: 'Configuration', path: '/dashboard/super-admin/settings', icon: '⚙️' },
          { name: 'Logs système', path: '/dashboard/super-admin/logs', icon: '📋' }
        ];
      case 'admin':
        return [
          { name: 'Vue d\'ensemble', path: '/dashboard/admin', icon: '📊' },
          { name: 'Événements', path: '/dashboard/admin/events', icon: '🎯' },
          { name: 'Utilisateurs', path: '/dashboard/admin/users', icon: '👥' },
          { name: 'Modération', path: '/dashboard/admin/moderation', icon: '🛡️' },
          { name: 'Statistiques', path: '/dashboard/admin/stats', icon: '📈' },
          { name: 'Configuration', path: '/dashboard/admin/settings', icon: '⚙️' }
        ];
      case 'moderator':
        return [
          { name: 'Vue d\'ensemble', path: '/dashboard/moderator', icon: '📊' },
          { name: 'Modération', path: '/dashboard/moderator/moderation', icon: '🛡️' },
          { name: 'Signalements', path: '/dashboard/moderator/reports', icon: '🚨' },
          { name: 'Utilisateurs', path: '/dashboard/moderator/users', icon: '👥' },
          { name: 'Événements', path: '/dashboard/moderator/events', icon: '🎯' },
          { name: 'Statistiques', path: '/dashboard/moderator/stats', icon: '📈' },
          { name: 'Paramètres', path: '/dashboard/moderator/settings', icon: '⚙️' }
        ];
      case 'organizer':
        return [
          { name: 'Vue d\'ensemble', path: '/dashboard/organizer', icon: '📊' },
          { name: 'Mes événements', path: '/dashboard/organizer/events', icon: '🎯' },
          { name: 'Participants', path: '/dashboard/organizer/participants', icon: '👥' },
          { name: 'Statistiques', path: '/dashboard/organizer/stats', icon: '📈' },
          { name: 'Paramètres', path: '/dashboard/organizer/settings', icon: '⚙️' }
        ];
      case 'company':
        return [
          { name: 'Vue d\'ensemble', path: '/dashboard/company', icon: '📊' },
          { name: 'Mes publicités', path: '/dashboard/company/ads', icon: '📢' },
          { name: 'Statistiques', path: '/dashboard/company/stats', icon: '📈' },
          { name: 'Facturation', path: '/dashboard/company/billing', icon: '💰' },
          { name: 'Paramètres', path: '/dashboard/company/settings', icon: '⚙️' }
        ];
      case 'player':
        return [
          { name: 'Vue d\'ensemble', path: '/dashboard/player', icon: '📊' },
          { name: 'Mes événements', path: '/dashboard/player/events', icon: '🎯' },
          { name: 'Historique', path: '/dashboard/player/history', icon: '📅' },
          { name: 'Profil', path: '/dashboard/player/profile', icon: '👤' },
          { name: 'Paramètres', path: '/dashboard/player/settings', icon: '⚙️' }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'super_admin':
        return {
          name: 'Super Administrateur',
          description: 'Accès complet au système',
          color: 'from-red-500 to-pink-600',
          icon: '👑',
          badge: 'SUPER'
        };
      case 'admin':
        return {
          name: 'Administrateur',
          description: 'Gestion des événements et utilisateurs',
          color: 'from-purple-500 to-indigo-600',
          icon: '🛡️',
          badge: 'ADMIN'
        };
      case 'moderator':
        return {
          name: 'Modérateur',
          description: 'Modération et surveillance',
          color: 'from-orange-500 to-red-600',
          icon: '🛡️',
          badge: 'MOD'
        };
      case 'organizer':
        return {
          name: 'Organisateur',
          description: 'Gestion de vos événements',
          color: 'from-blue-500 to-cyan-600',
          icon: '🎯',
          badge: 'ORG'
        };
      case 'company':
        return {
          name: 'Entreprise',
          description: 'Gestion des publicités',
          color: 'from-green-500 to-emerald-600',
          icon: '💼',
          badge: 'ENT'
        };
      case 'player':
        return {
          name: 'Joueur',
          description: 'Accès aux événements',
          color: 'from-orange-500 to-yellow-600',
          icon: '🎮',
          badge: 'PLAY'
        };
      default:
        return {
          name: 'Utilisateur',
          description: 'Accès standard',
          color: 'from-gray-500 to-gray-600',
          icon: '👤',
          badge: 'USER'
        };
    }
  };

  const roleInfo = getRoleInfo(userRole);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fixe global */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <Navbar />
      </header>

      {/* Container principal */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/95 backdrop-blur-sm shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200/50 flex flex-col`} style={{ top: '64px' }}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/50 bg-white/80">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 bg-gradient-to-r ${roleInfo.color} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                {roleInfo.icon}
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <span className="text-xs text-gray-500">{roleInfo.name}</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-white/80 hover:text-gray-900 hover:shadow-md hover:transform hover:scale-105'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200/50 bg-white/80 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <span className="mr-3">🚪</span>
              Déconnexion
            </button>
          </div>
        </div>

        {/* Bouton mobile pour ouvrir la sidebar */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-16 left-4 z-30 p-2 bg-white rounded-md shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Contenu principal */}
        <div className="flex-1 lg:ml-64 pt-16">
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout; 