import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';

// Tipos para las imágenes
interface Image {
  id: number;
  publication_id: number;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
  created_at: string;
}

// Tipos para las publicaciones
interface Publication {
  id: number;
  user_id: number;
  location_id: number;
  estado: 'disponible' | 'reservado' | 'ocupado';
  titulo: string;
  descripcion: string;
  price: number;
  direccion: string;
  capacidad: number;
  metros_cuadrados: number;
  amenidades: string[];
  created_at: string;
  updated_at: string;
  imagen?: string; // Campo legacy, ahora usamos la tabla images
  images?: Image[];
}

// Tipo para las ubicaciones del mapa con publicaciones completas
interface MapLocation {
  id: bigint;
  latitud: number;
  longitud: number;
  estado: string;
  direccion: string;
  publications_test: Publication[];
}

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
  // NUEVO: tipo de búsqueda actual
  currentSearchType: string | null;
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

  // NUEVO: estado para ubicaciones y tipo de búsqueda
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [errorLocations, setErrorLocations] = useState<string | null>(null);
  const [currentSearchType, setCurrentSearchType] = useState<string | null>(null);

  // NUEVO: función para determinar la distancia según el tipo de búsqueda
  const getSearchDistance = (searchType: string | null): { latOffset: number; lngOffset: number } => {
    switch (searchType) {
      case 'street_address':
        return { latOffset: 0.015, lngOffset: 0.015 }; // ~1km para direcciones específicas
      case 'route':
        return { latOffset: 0.025, lngOffset: 0.025 }; // ~2km para calles
      case 'sublocality':
      case 'sublocality_level_1':
        return { latOffset: 0.05, lngOffset: 0.05 }; // ~5km para barrios
      case 'locality':
        return { latOffset: 0.1, lngOffset: 0.1 }; // ~10km para ciudades
      case 'administrative_area_level_2':
        return { latOffset: 0.3, lngOffset: 0.3 }; // ~30km para partidos/departamentos
      case 'administrative_area_level_1':
        return { latOffset: 1.0, lngOffset: 1.0 }; // ~100km para provincias
      case 'country':
        return { latOffset: 5.0, lngOffset: 5.0 }; // ~500km para países
      default:
        return { latOffset: 0.09, lngOffset: 0.09 }; // ~10km por defecto
    }
  };

  // NUEVO: función setCenter mejorada que acepta tipo de búsqueda
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

  // Función para cargar ubicaciones desde Supabase
  const loadMapLocations = async () => {
    setLoadingLocations(true);
    setErrorLocations(null);
    try {
      const { latOffset, lngOffset } = getSearchDistance(currentSearchType);
      
      console.log('Consultando ubicaciones con parámetros:', {
        center: center,
        searchType: currentSearchType,
        latOffset,
        lngOffset,
        latRange: [center.lat - latOffset, center.lat + latOffset],
        lngRange: [center.lng - lngOffset, center.lng + lngOffset]
      });
      
      const { data, error } = await supabase
        .from('location')
        .select(`*, publications_test(*, images(*))`)
        .gte('latitud', center.lat - latOffset)
        .lte('latitud', center.lat + latOffset)
        .gte('longitud', center.lng - lngOffset)
        .lte('longitud', center.lng + lngOffset);
      
      console.log('Respuesta de Supabase (ubicaciones):', { data, error });
      
      if (error) {
        console.error('Error en consulta de ubicaciones:', error);
        throw error;
      }
      
      console.log('Ubicaciones cargadas:', data?.length || 0);
      console.log('Primera ubicación:', data?.[0]);
      setMapLocations(data || []);
    } catch (err) {
      console.error('Error completo:', err);
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
  }, [center]);

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
    refreshLocations: loadMapLocations,
    currentSearchType
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  );
}; 