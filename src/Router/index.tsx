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
import Profile from "../user/Profile/ProfileOverview";
import PrivateRoute from "../Router/PrivateRoute";
import EventsPage from "../Pages/events/Events";

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
                      path="/profile"
                      element={
                        <Profile
                    FirstName={user?.firstname || ""}
                    LastName={user?.lastname || ""}
                          email={user?.email || ""}
                    avatarUrl={user?.profile_picture_url || null}
                    username={user?.pseudonyme || ""}
                                          teams={user?.role ? [user.role] : []}
                        />
                      }
                    />
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
