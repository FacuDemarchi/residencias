import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { MapLocation } from '../types/app';
import { getLocations } from '../hooks/getLocations';

interface GoogleMapsContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  google: typeof window.google | undefined;
  retryLoad: () => void;
  center: { lat: number; lng: number };
  setCenter: (center: { lat: number; lng: number }, searchType?: string) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
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
  const [center, setCenterState] = useState<{ lat: number; lng: number }>({ lat: -31.4167, lng: -64.1833 }); // Córdoba, Argentina
  const [zoom, setZoomState] = useState<number>(12); // Zoom inicial
  const [viewport, setViewport] = useState<google.maps.LatLngBounds | null>(null);
  const [currentSearchType, setCurrentSearchType] = useState<string | null>(null);

  // Usar el hook getLocations para obtener las ubicaciones
  const { locations: mapLocations, loading: loadingLocations, error: errorLocations, refreshLocations } = getLocations({
    center,
    searchType: currentSearchType
  });



  // Función setCenter mejorada que acepta tipo de búsqueda
  const setCenter = (newCenter: { lat: number; lng: number }, searchType?: string) => {
    setCenterState(newCenter);
    if (searchType) {
      setCurrentSearchType(searchType);
    }
  };

  // Función para establecer el zoom
  const setZoom = (newZoom: number) => {
    setZoomState(newZoom);
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



  // Ajustar zoom según el tipo de búsqueda
  useEffect(() => {
    if (currentSearchType) {
      let newZoom = 15; // Zoom por defecto para barrios/direcciones
      if (currentSearchType.includes('locality')) {
        newZoom = 10; // Zoom para ciudades
      } else if (currentSearchType.includes('administrative_area_level_1')) {
        newZoom = 8; // Zoom para provincias
      }
      setZoom(newZoom);
    }
  }, [currentSearchType, setZoom]);

  const value: GoogleMapsContextType = {
    isLoaded,
    isLoading,
    error,
    google: typeof window !== 'undefined' ? window.google : undefined,
    retryLoad,
    center,
    setCenter,
    zoom,
    setZoom,
    viewport,
    setViewport,
    mapLocations,
    loadingLocations,
    errorLocations,
    refreshLocations
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
}; 