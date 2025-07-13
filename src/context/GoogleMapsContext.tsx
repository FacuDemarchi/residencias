import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface GoogleMapsContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  google: typeof window.google | undefined;
  retryLoad: () => void;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

// Singleton para evitar múltiples cargas del script
let googleMapsScriptLoadingPromise: Promise<void> | null = null;

function loadGoogleMapsScript(libraries: string[] = ['places']): Promise<void> {
  if (typeof window !== 'undefined' && window.google && window.google.maps) return Promise.resolve();
  if (googleMapsScriptLoadingPromise) return googleMapsScriptLoadingPromise;

  googleMapsScriptLoadingPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Si ya existe el script, esperar a que Google Maps esté disponible
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps) {
          resolve();
        } else {
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=${libraries.join(',')}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });

  return googleMapsScriptLoadingPromise;
}

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps debe usarse dentro de GoogleMapsProvider');
  }
  return context;
};

export const GoogleMapsProvider = ({ children }: { children: ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para reintentar la carga si falla
  const retryLoad = () => {
    setError(null);
    setIsLoaded(false);
    setIsLoading(false);
    googleMapsScriptLoadingPromise = null;
    loadScript();
  };

  // Función que maneja la carga del script
  const loadScript = () => {
    setIsLoading(true);
    loadGoogleMapsScript()
      .then(() => {
        setIsLoaded(true);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e?.message || 'Error al cargar Google Maps');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadScript();
    // Solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: GoogleMapsContextType = {
    isLoaded,
    isLoading,
    error,
    google: typeof window !== 'undefined' ? window.google : undefined,
    retryLoad,
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
}; 