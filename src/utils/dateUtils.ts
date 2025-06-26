/**
 * Convertit une date de plusieurs formats vers un affichage français simple
 * @param dateStr Date au format DD-MM-YYYY HH:MM, DD-MM-YYYY, YYYY-MM-DD, etc.
 * @returns Date formatée en français (ex: "15 février 2024")
 */
export const formatDateToFrench = (dateStr: string): string => {
  if (!dateStr) return "";

  try {
    // Supprimer l'heure si présente
    const [datePart] = dateStr.split(' ');
    
    let day: number, month: number, year: number;
    
    // Détecter le format de date
    if (datePart.includes('/')) {
      // Format MM/DD/YYYY ou DD/MM/YYYY
      const parts = datePart.split('/').map(Number);
      [month, day, year] = parts;
    } else if (datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Format YYYY-MM-DD (ISO)
      const parts = datePart.split('-').map(Number);
      [year, month, day] = parts;
    } else if (datePart.match(/^\d{2}-\d{2}-\d{4}$/)) {
      // Format DD-MM-YYYY
      const parts = datePart.split('-').map(Number);
      [day, month, year] = parts;
    } else {
      console.warn('Format de date non reconnu:', dateStr);
      return dateStr;
    }
    
    // Mois en français
    const monthNames = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    
    const monthName = monthNames[month - 1];
    
    return `${day} ${monthName} ${year}`;
  } catch (error) {
    console.warn('Erreur formatage date:', error, 'pour:', dateStr);
    return dateStr; // Fallback vers la date originale
  }
};

/**
 * Extrait l'heure d'une date contenant un timestamp
 * @param dateStr Date contenant potentiellement une heure
 * @returns Heure formatée (ex: "10:00" ou "14:30") ou chaîne vide si pas d'heure
 */
export const extractTimeFromDate = (dateStr: string): string => {
  if (!dateStr) return "";
  
  try {
    // Chercher un pattern d'heure dans la chaîne (HH:MM)
    const timeMatch = dateStr.match(/\b(\d{1,2}):(\d{2})\b/);
    if (timeMatch) {
      const [, hours, minutes] = timeMatch;
      // Formater avec des zéros si nécessaire
      return `${hours.padStart(2, '0')}:${minutes}`;
    }
    
    // Si pas de pattern d'heure trouvé, retourner vide
    return "";
  } catch (error) {
    console.warn('Erreur extraction heure:', error, 'pour:', dateStr);
    return "";
  }
};

/**
 * Formate une date courte en français
 * @param dateStr Date au format DD-MM-YYYY HH:MM ou DD-MM-YYYY  
 * @returns Date courte (ex: "Ven. 15 fév.")
 */
export const formatDateShort = (dateStr: string): string => {
  if (!dateStr) return "";

  try {
    const [datePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    const shortDayNames = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
    const shortMonthNames = [
      'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
      'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
    ];
    
    return `${shortDayNames[date.getDay()]} ${day} ${shortMonthNames[date.getMonth()]}`;
  } catch (error) {
    console.warn('Erreur formatage date courte:', error, 'pour:', dateStr);
    return dateStr;
  }
}; 