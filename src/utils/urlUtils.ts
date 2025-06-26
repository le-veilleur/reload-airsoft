/**
 * Génère un slug SEO-friendly à partir d'un titre
 * @param title - Le titre à convertir en slug
 * @returns Le slug généré
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    // Remplacer les accents français
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Remplacer les caractères spéciaux courants
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ýÿ]/g, "y")
    .replace(/[ñ]/g, "n")
    .replace(/[ç]/g, "c")
    // Remplacer les espaces et caractères spéciaux par des tirets
    .replace(/[^a-z0-9]+/g, "-")
    // Supprimer les tirets en début et fin
    .replace(/^-+|-+$/g, "")
    // Limiter la longueur pour éviter les URLs trop longues
    .substring(0, 50);
};

/**
 * Génère l'URL complète pour un événement
 * @param eventId - L'ID de l'événement
 * @param eventTitle - Le titre de l'événement
 * @param format - Le format d'URL à utiliser
 * @returns L'URL générée
 */
export const generateEventUrl = (
  eventId: string, 
  eventTitle: string, 
  format: "recommended" | "legacy" | "short" = "recommended"
): string => {
  const slug = generateSlug(eventTitle);
  
  switch (format) {
    case "recommended":
      return `/events/${eventId}/${slug}`;
    case "legacy":
      return `/event/evenements/${eventId}`;
    case "short":
      return `/events/${eventId}`;
    default:
      return `/events/${eventId}/${slug}`;
  }
};

/**
 * Extrait l'ID d'événement d'une URL
 * @param pathname - Le pathname de l'URL
 * @returns L'ID de l'événement ou null si non trouvé
 */
export const extractEventIdFromUrl = (pathname: string): string | null => {
  // Pattern pour /events/:id/:slug
  const recommendedMatch = pathname.match(/^\/events\/([^/]+)\/[^/]+$/);
  if (recommendedMatch) {
    return recommendedMatch[1];
  }
  
  // Pattern pour /event/evenements/:id
  const legacyMatch = pathname.match(/^\/event\/evenements\/([^/]+)$/);
  if (legacyMatch) {
    return legacyMatch[1];
  }
  
  // Pattern pour /events/:id
  const shortMatch = pathname.match(/^\/events\/([^/]+)$/);
  if (shortMatch) {
    return shortMatch[1];
  }
  
  return null;
};

/**
 * Valide si un slug correspond au titre de l'événement
 * @param slug - Le slug de l'URL
 * @param eventTitle - Le titre de l'événement
 * @returns true si le slug est valide
 */
export const isValidSlug = (slug: string, eventTitle: string): boolean => {
  const expectedSlug = generateSlug(eventTitle);
  return slug === expectedSlug;
};

/**
 * Génère une URL de redirection canonique si nécessaire
 * @param currentPath - Le chemin actuel
 * @param eventId - L'ID de l'événement
 * @param eventTitle - Le titre de l'événement
 * @returns L'URL canonique ou null si déjà correcte
 */
export const getCanonicalEventUrl = (
  currentPath: string, 
  eventId: string, 
  eventTitle: string
): string | null => {
  const canonicalUrl = generateEventUrl(eventId, eventTitle, "recommended");
  
  // Si l'URL actuelle n'est pas le format recommandé, retourner l'URL canonique
  if (currentPath !== canonicalUrl) {
    return canonicalUrl;
  }
  
  return null;
};

/**
 * Génère les métadonnées SEO pour un événement
 * @param event - Les données de l'événement
 * @returns Les métadonnées SEO
 */
export const generateEventSEOMetadata = (event: {
  title: string;
  description: string;
  location: { city?: string; country?: string };
  start_date: string;
  price: number;
  images?: { url: string }[];
}) => {
  const baseUrl = window.location.origin;
  // Corriger: on a besoin de l'ID pour générer l'URL
  const eventUrl = window.location.pathname; // Utiliser l'URL actuelle
  const fullUrl = `${baseUrl}${eventUrl}`;
  
  // Générer une description SEO optimisée
  const seoDescription = `${event.description.substring(0, 140)}... | Événement airsoft le ${event.start_date} à ${event.location.city || event.location.country || "TBD"} - ${event.price}€`;
  
  // Mots-clés basés sur le contenu
  const keywords = [
    "airsoft",
    "événement",
    "simulation militaire",
    event.location.city,
    event.location.country,
    "réservation",
    "jeu d'équipe"
  ].filter(Boolean).join(", ");
  
  return {
    title: `${event.title} - Événement Airsoft | Reload Airsoft`,
    description: seoDescription,
    keywords,
    canonical: fullUrl,
    openGraph: {
      title: event.title,
      description: seoDescription,
      url: fullUrl,
      type: "event",
      image: event.images?.[0]?.url || "/images/default-event.jpg",
      site_name: "Reload Airsoft"
    },
    structured: {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.title,
      "description": event.description,
      "startDate": event.start_date,
      "location": {
        "@type": "Place",
        "name": event.location.city || "Location TBD",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": event.location.city,
          "addressCountry": event.location.country
        }
      },
      "offers": {
        "@type": "Offer",
        "price": event.price,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      },
      "image": event.images?.[0]?.url,
      "url": fullUrl
    }
  };
}; 