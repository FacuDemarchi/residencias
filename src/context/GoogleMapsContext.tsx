import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';

interface MapLocation {
  id: bigint; // Cambiar de number a bigint
  latitud: number;
  longitud: number;
  estado: string;
}

interface GoogleMapsContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  google: typeof window.google | undefined;
  retryLoad: () => void;
  center: { lat: number; lng: number };
  setCenter: (center: { lat: number; lng: number }) => void;
  viewport: google.maps.LatLngBounds | null;
  setViewport: (viewport: google.maps.LatLngBounds | null) => void;
  // NUEVO: ubicaciones para marcadores
  mapLocations: MapLocation[];
  loadingLocations: boolean;
  errorLocations: string | null;
  refreshLocations: () => void;
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
    script.setAttribute('loading', 'async');
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
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: -31.4167, lng: -64.1833 }); // Córdoba, Argentina
  const [viewport, setViewport] = useState<google.maps.LatLngBounds | null>(null);

  // NUEVO: estado para ubicaciones
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [errorLocations, setErrorLocations] = useState<string | null>(null);

  // Función para cargar ubicaciones desde Supabase
  const loadMapLocations = async () => {
    setLoadingLocations(true);
    setErrorLocations(null);
    try {
      const { data, error: supabaseError } = await supabase.rpc('get_locations_for_map', {
        center_lat: center.lat,
        center_lng: center.lng,
        radius_km: 15
      });
      if (supabaseError) throw supabaseError;
      setMapLocations(data || []);
    } catch (err) {
      setErrorLocations(err instanceof Error ? err.message : 'Error desconocido');
      setMapLocations([]);
    } finally {
      setLoadingLocations(false);
    }
  };

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

  // Cargar ubicaciones cuando cambie el centro
  useEffect(() => {
    loadMapLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);

  const value: GoogleMapsContextType = {
    isLoaded,
    isLoading,
    error,
    google: typeof window !== 'undefined' ? window.google : undefined,
    retryLoad,
    center,
    setCenter,
    viewport,
    setViewport,
    mapLocations,
    loadingLocations,
    errorLocations,
    refreshLocations: loadMapLocations
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
}; 