import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Définir la valeur initiale
    setMatches(media.matches);

    // Créer un gestionnaire pour les changements
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Ajouter le listener
    media.addEventListener('change', listener);

    // Nettoyer
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}