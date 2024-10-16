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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/event/evenements/:id" element={<EventDetailPage />} />
            <Route element={<PrivateRoute />}>
              <Route
                path="/profile"
                element={
                  <Profile
                    FirstName={user?.FirstName || ""}
                    LastName={user?.LastName || ""}
                    email={user?.email || ""}
                    avatarUrl={user?.avatarUrl || null}
                    username={user?.username || ""}
                    teams={user?.teams || []}
                  />
                }
              />
              {/* Ajoutez d'autres routes protégées ici */}
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default AppRoutes;
