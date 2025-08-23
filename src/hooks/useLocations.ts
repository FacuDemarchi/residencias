import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import type { MapLocation } from '../types/app';

interface UseLocationsProps {
  center: { lat: number; lng: number };
  searchType: string | null;
}

export const useLocations = ({ center, searchType }: UseLocationsProps) => {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para determinar la distancia según el tipo de búsqueda
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

  // Función para cargar ubicaciones desde Supabase
  const loadLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const { latOffset, lngOffset } = getSearchDistance(searchType);
      
      console.log('🗺️ Consultando ubicaciones con parámetros:', {
        center: center,
        searchType: searchType,
        latOffset,
        lngOffset,
        latRange: [center.lat - latOffset, center.lat + latOffset],
        lngRange: [center.lng - lngOffset, center.lng + lngOffset]
      });
      
      // Obtener todas las ubicaciones en el área
      const { data: locationsData, error: locationsError } = await supabase
        .from('location')
        .select('*')
        .gte('latitud', center.lat - latOffset)
        .lte('latitud', center.lat + latOffset)
        .gte('longitud', center.lng - lngOffset)
        .lte('longitud', center.lng + lngOffset);
      
      if (locationsError) {
        console.error('❌ Error en consulta de ubicaciones:', locationsError);
        throw locationsError;
      }
      
      console.log('📍 Ubicaciones encontradas:', locationsData?.length || 0);
      
      const processedData = locationsData || [];
      
      console.log('✅ Ubicaciones procesadas:', processedData.length);
      
      setLocations(processedData);
    } catch (err) {
      console.error('❌ Error completo:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar ubicaciones cuando cambie el centro
  useEffect(() => {
    loadLocations();
  }, [center.lat, center.lng, searchType]);

  return {
    locations,
    loading,
    error,
    refreshLocations: loadLocations
  };
};
