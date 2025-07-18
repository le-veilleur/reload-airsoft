// src/Router/index.tsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import Home from "../Pages/Home";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";
import EventDetailPage from "../Pages/events/EventDetailPage";
import CreateEventPage from "../Pages/events/CreateEventPage";
import PrivateRoute from "../Router/PrivateRoute";
import EventsPage from "../Pages/events/Events";

// Import des dashboards
import {
  SuperAdminDashboard,
  SuperAdminUsers,
  SuperAdminEvents,
  SuperAdminOrganizers,
  SuperAdminCompanies,
  SuperAdminStats,
  SuperAdminSettings,
  SuperAdminLogs,
  AdminDashboard,
  AdminUsers,
  AdminEvents,
  AdminModeration,
  AdminStats,
  AdminSettings,
  ModeratorDashboard,
  ModeratorModeration,
  ModeratorReports,
  ModeratorUsers,
  ModeratorEvents,
  ModeratorStats,
  ModeratorSettings,
  OrganizerDashboard,
  OrganizerEvents,
  OrganizerParticipants,
  OrganizerFinances,
  OrganizerStats,
  OrganizerSettings,
  CompanyDashboard,
  PlayerDashboard,
  PlayerEvents,
  PlayerHistory,
  PlayerProfile,
  PlayerSettings
} from "../Pages/dashboard";

import { useAuth } from "../Contexts/AuthContext";

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Contenu principal qui prend tout l'espace disponible */}
        <main className="flex-1 flex flex-col overflow-hidden">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/events" element={<EventsPage />} />
            
            {/* Routes événements avec footer */}
            <Route path="/events/:id/:slug" element={<EventDetailPage />} />
            <Route path="/event/evenements/:id" element={<EventDetailPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
                  
                  <Route element={<PrivateRoute />}>
                    <Route
                      path="/events/create"
                      element={<CreateEventPage />}
                    />
                    
                    {/* Routes des dashboards Super Admin */}
                    <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
                    <Route path="/dashboard/super-admin/users" element={<SuperAdminUsers />} />
                    <Route path="/dashboard/super-admin/events" element={<SuperAdminEvents />} />
                    <Route path="/dashboard/super-admin/organizers" element={<SuperAdminOrganizers />} />
                    <Route path="/dashboard/super-admin/companies" element={<SuperAdminCompanies />} />
                    <Route path="/dashboard/super-admin/stats" element={<SuperAdminStats />} />
                    <Route path="/dashboard/super-admin/settings" element={<SuperAdminSettings />} />
                    <Route path="/dashboard/super-admin/logs" element={<SuperAdminLogs />} />
                    
                    {/* Routes des dashboards Admin */}
                    <Route path="/dashboard/admin" element={<AdminDashboard />} />
                    <Route path="/dashboard/admin/users" element={<AdminUsers />} />
                    <Route path="/dashboard/admin/events" element={<AdminEvents />} />
                    <Route path="/dashboard/admin/moderation" element={<AdminModeration />} />
                    <Route path="/dashboard/admin/stats" element={<AdminStats />} />
                    <Route path="/dashboard/admin/settings" element={<AdminSettings />} />
                    
                    {/* Routes des dashboards autres rôles */}
                    <Route path="/dashboard/moderator" element={<ModeratorDashboard />} />
                    <Route path="/dashboard/moderator/moderation" element={<ModeratorModeration />} />
                    <Route path="/dashboard/moderator/reports" element={<ModeratorReports />} />
                    <Route path="/dashboard/moderator/users" element={<ModeratorUsers />} />
                    <Route path="/dashboard/moderator/events" element={<ModeratorEvents />} />
                    <Route path="/dashboard/moderator/stats" element={<ModeratorStats />} />
                    <Route path="/dashboard/moderator/settings" element={<ModeratorSettings />} />
                    <Route path="/dashboard/organizer" element={<OrganizerDashboard />} />
                    <Route path="/dashboard/organizer/events" element={<OrganizerEvents />} />
                    <Route path="/dashboard/organizer/participants" element={<OrganizerParticipants />} />
                    <Route path="/dashboard/organizer/finances" element={<OrganizerFinances />} />
                    <Route path="/dashboard/organizer/stats" element={<OrganizerStats />} />
                    <Route path="/dashboard/organizer/settings" element={<OrganizerSettings />} />
                    <Route path="/dashboard/company" element={<CompanyDashboard />} />
                    <Route path="/dashboard/player" element={<PlayerDashboard />} />
                    
                    {/* Routes du dashboard joueur */}
                    <Route path="/dashboard/player/events" element={<PlayerEvents />} />
                    <Route path="/dashboard/player/history" element={<PlayerHistory />} />
                    <Route path="/dashboard/player/profile" element={<PlayerProfile />} />
                    <Route path="/dashboard/player/settings" element={<PlayerSettings />} />
                    
                    {/* Ajoutez d'autres routes protégées ici */}
                  </Route>
                </Routes>
              </main>
        
        {/* Footer fixe en bas */}
              <Footer />
      </div>
    </Router>
  );
};

export default AppRoutes;
