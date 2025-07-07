import React, { useState } from "react";

// Composants natifs pour remplacer les dépendances externes
const Switch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}> = ({ checked, onChange, className = "", children }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`${checked ? "bg-blue-600" : "bg-gray-200"} relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${className}`}
  >
    <span className="sr-only">{children}</span>
    <span
      className={`${checked ? "translate-x-4" : "translate-x-0.5"} inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
    />
  </button>
);

// Icônes simples en SVG
const FunnelIcon = () => (
  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarDaysIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CurrencyEuroIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface EventFiltersProps {
  onFiltersChange: (filters: EventFilters) => void;
  onClearFilters: () => void;
}

export interface EventFilters {
  // Filtres de base
  searchTerm?: string;
  categoryIds?: string[];
  statuses?: string[];
  
  // Filtres de date
  startDate?: string;
  endDate?: string;
  
  // Filtres géographiques
  locationText?: string;
  city?: string;
  country?: string;
  
  // Filtres de prix
  minPrice?: number;
  maxPrice?: number;
  freeOnly?: boolean;
  paidOnly?: boolean;
  
  // Filtres de participants
  excludeFull?: boolean;
  
  // Filtres de visibilité
  isPrivate?: boolean;
  isPublic?: boolean;
}

const badgeClass =
  "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1";

const sectionTitleClass =
  "flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5 mt-3";

const EventFilters: React.FC<EventFiltersProps> = ({ onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState<EventFilters>({});

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    let newFilters = { ...filters };
    
    // Si la valeur est vide, null, undefined ou un tableau vide, on supprime le filtre
    if (value === "" || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onClearFilters();
  };

  // Fonction pour nettoyer les filtres vides
  const cleanFilters = (filters: EventFilters): EventFilters => {
    const cleaned: EventFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null && 
          !(Array.isArray(value) && value.length === 0) &&
          value !== false) {
        cleaned[key as keyof EventFilters] = value;
      }
    });
    return cleaned;
  };

  const activeFilters = Object.entries(filters).filter(
    ([, v]) => v !== undefined && v !== "" && v !== null && 
    !(Array.isArray(v) && v.length === 0) && v !== false
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2">
      {/* Header des filtres - plus compact */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <FunnelIcon />
          <span className="text-xs font-semibold text-gray-800">Filtres</span>
          {activeFilters.length > 0 && (
            <span className="ml-1 px-1 py-0.5 bg-blue-600 text-white rounded-full text-xs font-bold">
              {activeFilters.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {activeFilters.length > 0 && (
            <button
              onClick={handleClearFilters}
              className="p-1 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Effacer tous les filtres"
            >
              <XCircleIcon />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-xs text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            title={isExpanded ? "Masquer les filtres" : "Afficher les filtres"}
          >
            {isExpanded ? "−" : "+"}
          </button>
        </div>
      </div>

      {/* Badges des filtres actifs - plus compacts */}
      {activeFilters.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {activeFilters.slice(0, 3).map(([k, v]) => {
            let displayValue = "";
            let displayKey = k;
            
            // Améliorer l'affichage des clés et valeurs
            switch(k) {
              case "searchTerm":
                displayKey = "Recherche";
                displayValue = v.toString().slice(0, 8) + (v.toString().length > 8 ? "..." : "");
                break;
              case "city":
                displayKey = "Ville";
                displayValue = v.toString();
                break;
              case "country":
                displayKey = "Pays";
                displayValue = v.toString();
                break;
              case "startDate":
                displayKey = "Début";
                displayValue = new Date(v.toString()).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
                break;
              case "endDate":
                displayKey = "Fin";
                displayValue = new Date(v.toString()).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
                break;
              case "minPrice":
                displayKey = "Prix min";
                displayValue = `${v}€`;
                break;
              case "maxPrice":
                displayKey = "Prix max";
                displayValue = `${v}€`;
                break;
              case "freeOnly":
                displayKey = "Gratuits";
                displayValue = "✓";
                break;
              case "paidOnly":
                displayKey = "Payants";
                displayValue = "✓";
                break;
              case "isPublic":
                displayKey = "Publics";
                displayValue = "✓";
                break;
              case "isPrivate":
                displayKey = "Privés";
                displayValue = "✓";
                break;
              case "excludeFull":
                displayKey = "Exclure complets";
                displayValue = "✓";
                break;
              case "statuses":
                displayKey = "Statut";
                displayValue = Array.isArray(v) ? v[0] : v.toString();
                break;
              default:
                displayValue = Array.isArray(v) ? v.join(",") : v.toString().slice(0, 8);
            }
            
            return (
              <span 
                key={k} 
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors"
                onClick={() => handleFilterChange(k as keyof EventFilters, undefined)}
                title={`Cliquer pour supprimer le filtre ${displayKey}`}
              >
                {displayKey}: {displayValue}
              </span>
            );
          })}
          {activeFilters.length > 3 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              +{activeFilters.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Contenu des filtres - optimisé pour menu latéral */}
      {isExpanded && (
        <div className="space-y-2 mt-2">
          {/* Recherche textuelle - plus compacte */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <MapPinIcon />
              <span className="text-xs font-medium text-gray-700">Recherche</span>
            </div>
            <input
              type="text"
              placeholder="Titre, description..."
              value={filters.searchTerm || ""}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
            />
          </div>

          {/* Filtres géographiques - en colonnes */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <MapPinIcon />
              <span className="text-xs font-medium text-gray-700">Lieu</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <input
                type="text"
                placeholder="Ville"
                value={filters.city || ""}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
              />
              <input
                type="text"
                placeholder="Pays"
                value={filters.country || ""}
                onChange={(e) => handleFilterChange("country", e.target.value)}
                className="px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
              />
            </div>
          </div>

          {/* Filtres de date - plus compacts */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <CalendarDaysIcon />
              <span className="text-xs font-medium text-gray-700">Dates</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
              />
              <input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
              />
            </div>
          </div>

          {/* Filtres de prix - optimisés */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <CurrencyEuroIcon />
              <span className="text-xs font-medium text-gray-700">Prix</span>
            </div>
            <div className="grid grid-cols-2 gap-1 mb-2">
              <input
                type="number"
                placeholder="Min €"
                value={filters.minPrice || ""}
                onChange={(e) => handleFilterChange("minPrice", e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
              />
              <input
                type="number"
                placeholder="Max €"
                value={filters.maxPrice || ""}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value ? parseInt(e.target.value) : undefined)}
                className="px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Switch
                  checked={filters.freeOnly || false}
                  onChange={(v: boolean) => handleFilterChange("freeOnly", v ? true : undefined)}
                />
                <span className="text-xs text-gray-600">Gratuits</span>
              </div>
              <div className="flex items-center gap-1">
                <Switch
                  checked={filters.paidOnly || false}
                  onChange={(v: boolean) => handleFilterChange("paidOnly", v ? true : undefined)}
                />
                <span className="text-xs text-gray-600">Payants</span>
              </div>
            </div>
          </div>

          {/* Filtres de statut - plus compact */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <EyeIcon />
              <span className="text-xs font-medium text-gray-700">Statut</span>
            </div>
            <select
              value={filters.statuses?.[0] || ""}
              onChange={(e) => handleFilterChange("statuses", e.target.value ? [e.target.value] : undefined)}
              className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="active">Actif</option>
              <option value="full">Complet</option>
              <option value="cancelled">Annulé</option>
              <option value="ended">Terminé</option>
            </select>
          </div>

          {/* Filtres de visibilité - en ligne */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Switch
                  checked={filters.isPublic || false}
                  onChange={(v: boolean) => handleFilterChange("isPublic", v ? true : undefined)}
                />
                <EyeIcon />
                <span className="text-xs text-gray-600">Publics</span>
              </div>
              <div className="flex items-center gap-1">
                <Switch
                  checked={filters.isPrivate || false}
                  onChange={(v: boolean) => handleFilterChange("isPrivate", v ? true : undefined)}
                />
                <EyeSlashIcon />
                <span className="text-xs text-gray-600">Privés</span>
              </div>
            </div>
          </div>

          {/* Filtre d'exclusion - compact */}
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            <Switch
              checked={filters.excludeFull || false}
              onChange={(v: boolean) => handleFilterChange("excludeFull", v ? true : undefined)}
            />
            <span className="text-xs text-gray-600">Exclure les complets</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters; 