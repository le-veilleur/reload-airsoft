/**
 * Convertit un prix en centimes vers un affichage en euros
 * @param priceInCents Prix en centimes (ex: 2500 pour 25€)
 * @returns Prix formaté en euros (ex: "25,00€")
 */
export const formatPriceFromCents = (priceInCents: number): string => {
  // Log pour déboguer
  console.log('💰 formatPriceFromCents reçu:', priceInCents, typeof priceInCents);
  
  if (!priceInCents || priceInCents <= 0) {
    return "Gratuit";
  }
  
  const euros = priceInCents / 100;
  
  // Toujours afficher avec 2 décimales et virgule française
  return `${euros.toFixed(2).replace('.', ',')}€`;
};

/**
 * Convertit un prix en euros vers des centimes
 * @param priceInEuros Prix en euros (ex: 25.50)
 * @returns Prix en centimes (ex: 2550)
 */
export const convertEurosToCents = (priceInEuros: number): number => {
  return Math.round(priceInEuros * 100);
}; 