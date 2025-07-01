// src/App.tsx

import "./index.css";
import AppRoutes from "./Router/index"; // Importez le composant Routes
import { AuthProvider } from "./Contexts/AuthContext";
import React from "react";
import useCacheShortcut from './hooks/useCacheShortcut';

function App() {
  // Activer les raccourcis clavier de cache
  useCacheShortcut();

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
