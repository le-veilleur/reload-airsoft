import AuthService from "./AuthService";
import { geocodeLocation } from "./geocodingService";
import { CompleteRegisterData, AuthResponse } from "../Interfaces/types";
import { DEBUG_CONFIG, API_CONFIG } from "../config/api.config";

/**
 * Service spécialisé pour les inscriptions complètes
 * Inclut validation, géocodage automatique et gestion d'erreurs avancée
 */
class RegistrationService {
  
  /**
   * Inscription complète avec validation et géocodage automatique
   */
  static async registerWithCompleteProfile(data: CompleteRegisterData): Promise<AuthResponse> {
    try {
      // 1. Validation des données
      const validation = AuthService.validateCompleteRegisterData(data);
      if (!validation.isValid) {
        throw new Error(`Données invalides: ${validation.errors.join(', ')}`);
      }

      if (DEBUG_CONFIG.ENABLED) {
        console.log("Début de l'inscription complète pour:", data.email);
      }

      // 2. Formatage des données
      const formattedData = AuthService.formatCompleteRegisterData(data);

      // 3. Tentative de géocodage de la localisation
      let locationWithCoordinates = formattedData.location;
      try {
        const geocodingResult = await geocodeLocation(formattedData.location);
        if (geocodingResult) {
          locationWithCoordinates = geocodingResult.displayName;
          
          if (DEBUG_CONFIG.ENABLED) {
            console.log("Localisation géocodée:", {
              original: formattedData.location,
              geocoded: locationWithCoordinates,
              coordinates: `${geocodingResult.latitude}, ${geocodingResult.longitude}`
            });
          }
        }
      } catch (geocodingError) {
        // Le géocodage échoue, on continue avec la localisation originale
        if (DEBUG_CONFIG.ENABLED) {
          console.log("Géocodage échoué, utilisation de la localisation originale:", geocodingError);
        }
      }

      // 4. Préparation des données finales avec localisation géocodée
      const finalData: CompleteRegisterData = {
        ...formattedData,
        location: locationWithCoordinates
      };

      // 5. Inscription via AuthService
      const response = await AuthService.registerComplete(finalData);

      if (DEBUG_CONFIG.ENABLED) {
        console.log("Inscription complète réussie");
      }

      return response;

    } catch (error) {
      if (DEBUG_CONFIG.ENABLED) {
        console.error("Erreur lors de l'inscription complète:", error);
      }
      throw error;
    }
  }

  /**
   * Vérification de la disponibilité d'un pseudonyme
   */
  static async checkPseudonameAvailability(pseudonyme: string): Promise<boolean> {
    try {
      // Cette méthode devrait appeler l'API pour vérifier la disponibilité
      // Pour l'instant, on simule avec une validation locale
      
      if (!pseudonyme || pseudonyme.trim().length < 3) {
        return false;
      }

      // TODO: Implémenter l'appel API réel
      // const response = await api.get(`/users/check-pseudonyme/${pseudonyme}`);
      // return response.data.available;

      if (DEBUG_CONFIG.ENABLED) {
        console.log("Vérification de disponibilité du pseudonyme:", pseudonyme);
      }

      // Simulation: pseudonymes réservés
      const reservedPseudonymes = ['admin', 'root', 'moderator', 'system'];
      return !reservedPseudonymes.includes(pseudonyme.toLowerCase());

    } catch (error) {
      if (DEBUG_CONFIG.ENABLED) {
        console.error("Erreur lors de la vérification du pseudonyme:", error);
      }
      return false;
    }
  }

  /**
   * Vérification de la disponibilité d'un email
   */
  static async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return false;
      }

      // TODO: Implémenter l'appel API réel
      // const response = await api.get(`/users/check-email/${email}`);
      // return response.data.available;

      if (DEBUG_CONFIG.ENABLED) {
        console.log("Vérification de disponibilité de l'email:", email);
      }

      // Simulation: toujours disponible pour le moment
      return true;

    } catch (error) {
      if (DEBUG_CONFIG.ENABLED) {
        console.error("Erreur lors de la vérification de l'email:", error);
      }
      return false;
    }
  }

  /**
   * Validation du mot de passe avec critères de sécurité
   */
  static validatePasswordStrength(password: string): { isStrong: boolean; score: number; feedback: string[] } {
    const feedback: string[] = [];
    let score = 0;

    // Longueur minimale
    if (password.length >= 8) {
      score += 20;
    } else {
      feedback.push("Le mot de passe doit contenir au moins 8 caractères");
    }

    // Longueur recommandée
    if (password.length >= 12) {
      score += 10;
    } else {
      feedback.push("Recommandé: au moins 12 caractères pour plus de sécurité");
    }

    // Caractères minuscules
    if (/[a-z]/.test(password)) {
      score += 15;
    } else {
      feedback.push("Ajoutez des lettres minuscules");
    }

    // Caractères majuscules
    if (/[A-Z]/.test(password)) {
      score += 15;
    } else {
      feedback.push("Ajoutez des lettres majuscules");
    }

    // Chiffres
    if (/\d/.test(password)) {
      score += 15;
    } else {
      feedback.push("Ajoutez des chiffres");
    }

    // Caractères spéciaux
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 15;
    } else {
      feedback.push("Ajoutez des caractères spéciaux (!@#$%...)");
    }

    // Absence de répétitions
    if (!/(.)\1{2,}/.test(password)) {
      score += 10;
    } else {
      feedback.push("Évitez les répétitions de caractères");
    }

    const isStrong = score >= 70;

    if (DEBUG_CONFIG.ENABLED) {
      console.log("Analyse de la force du mot de passe:", { score, isStrong, feedback });
    }

    return { isStrong, score, feedback };
  }

  /**
   * Inscription avec retry en cas d'échec
   */
  static async registerWithRetry(data: CompleteRegisterData, maxRetries: number = API_CONFIG.RETRY.MAX_RETRIES): Promise<AuthResponse> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (DEBUG_CONFIG.ENABLED) {
          console.log(`Tentative d'inscription ${attempt}/${maxRetries}`);
        }

        const response = await this.registerWithCompleteProfile(data);
        
        if (DEBUG_CONFIG.ENABLED) {
          console.log(`Inscription réussie à la tentative ${attempt}`);
        }

        return response;

      } catch (error) {
        lastError = error;

        if (DEBUG_CONFIG.ENABLED) {
          console.log(`Tentative ${attempt} échouée:`, error);
        }

        // Si c'est la dernière tentative, on lance l'erreur
        if (attempt === maxRetries) {
          break;
        }

        // Attendre avant la prochaine tentative
        const delay = API_CONFIG.RETRY.DELAY * attempt;
        if (DEBUG_CONFIG.ENABLED) {
          console.log(`Attente de ${delay}ms avant la prochaine tentative`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Prévisualisation des données formatées avant inscription
   */
  static previewFormattedData(data: CompleteRegisterData): CompleteRegisterData {
    return AuthService.formatCompleteRegisterData(data);
  }

  /**
   * Génération d'un rapport de validation complet
   */
  static generateValidationReport(data: CompleteRegisterData): {
    overall: { isValid: boolean; score: number };
    fields: { [key: string]: { isValid: boolean; message: string } };
    password: { isStrong: boolean; score: number; feedback: string[] };
    suggestions: string[];
  } {
    const validation = AuthService.validateCompleteRegisterData(data);
    const passwordStrength = this.validatePasswordStrength(data.password);
    
    const fieldsValidation = {
      firstname: {
        isValid: data.firstname && data.firstname.trim().length >= 2,
        message: data.firstname?.trim().length >= 2 ? "Valide" : "Minimum 2 caractères requis"
      },
      lastname: {
        isValid: data.lastname && data.lastname.trim().length >= 2,
        message: data.lastname?.trim().length >= 2 ? "Valide" : "Minimum 2 caractères requis"
      },
      pseudonyme: {
        isValid: data.pseudonyme && data.pseudonyme.trim().length >= 3,
        message: data.pseudonyme?.trim().length >= 3 ? "Valide" : "Minimum 3 caractères requis"
      },
      email: {
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || ''),
        message: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '') ? "Valide" : "Format email invalide"
      },
      phone_number: {
        isValid: /^(\+33|0)[1-9](\d{8})$/.test((data.phone_number || '').replace(/\s/g, '')),
        message: /^(\+33|0)[1-9](\d{8})$/.test((data.phone_number || '').replace(/\s/g, '')) ? "Valide" : "Format téléphone français requis"
      },
      bio: {
        isValid: data.bio && data.bio.trim().length >= 10 && data.bio.length <= 500,
        message: data.bio?.trim().length >= 10 && data.bio.length <= 500 ? "Valide" : "Entre 10 et 500 caractères requis"
      },
      location: {
        isValid: data.location && data.location.trim().length >= 3,
        message: data.location?.trim().length >= 3 ? "Valide" : "Minimum 3 caractères requis"
      }
    };

    const validFields = Object.values(fieldsValidation).filter(field => field.isValid).length;
    const totalFields = Object.keys(fieldsValidation).length;
    const score = Math.round((validFields / totalFields) * 100);

    const suggestions: string[] = [];
    if (passwordStrength.score < 70) {
      suggestions.push("Renforcez votre mot de passe");
    }
    if (!fieldsValidation.bio.isValid) {
      suggestions.push("Ajoutez une biographie plus détaillée");
    }
    if (!fieldsValidation.phone_number.isValid) {
      suggestions.push("Vérifiez le format de votre numéro de téléphone");
    }

    return {
      overall: {
        isValid: validation.isValid && passwordStrength.isStrong,
        score
      },
      fields: fieldsValidation as { [key: string]: { isValid: boolean; message: string } },
      password: passwordStrength,
      suggestions
    };
  }
}

export default RegistrationService; 