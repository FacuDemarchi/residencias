import { supabase } from './supabaseClient';
import type { Tables } from '../types/database';
import { useGoogleMaps } from '../context/GoogleMapsContext';

type Location = Tables<'locations'>;

// Función para determinar la distancia según el tipo de búsqueda
const getSearchDistance = (searchType: string | null) => {
  switch (searchType) {
    case 'street_address': return { latOffset: 0.015, lngOffset: 0.015 };
    case 'route': return { latOffset: 0.025, lngOffset: 0.025 };
    case 'sublocality': return { latOffset: 0.05, lngOffset: 0.05 };
    case 'locality': return { latOffset: 0.1, lngOffset: 0.1 };
    case 'administrative_area_level_2': return { latOffset: 0.3, lngOffset: 0.3 };
    case 'administrative_area_level_1': return { latOffset: 1.0, lngOffset: 1.0 };
    case 'country': return { latOffset: 5.0, lngOffset: 5.0 };
    default: return { latOffset: 0.09, lngOffset: 0.09 };
  }
};

// Cache simple para evitar consultas repetidas
const cache = new Map<string, { data: Location[]; timestamp: number }>();

export async function getLocations(): Promise<Location[]> {
  const { center, currentSearchType } = useGoogleMaps();
  return await getLocationsByCoordinates(center, currentSearchType);
}

export async function getLocationsByCoordinates(
  center: { lat: number; lng: number },
  searchType: string | null = null
): Promise<Location[]> {
  const { latOffset, lngOffset } = getSearchDistance(searchType);
  
  // Crear clave única para el cache
  const cacheKey = `${center.lat}-${center.lng}-${searchType}`;
  
  // Verificar cache (válido por 5 minutos)
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    console.log('Locations obtenidas del cache');
    return cached.data;
  }

  try {
    const { data: locationsData, error: locationsError } = await supabase
      .from('locations')
      .select('*')
      .gte('latitud', center.lat - latOffset)
      .lte('latitud', center.lat + latOffset)
      .gte('longitud', center.lng - lngOffset)
      .lte('longitud', center.lng + lngOffset);

    if (locationsError) throw locationsError;

    const processedData = locationsData || [];
    
    // Guardar en cache
    cache.set(cacheKey, {
      data: processedData,
      timestamp: Date.now()
    });

    console.log('Locations obtenidas de la base de datos:', processedData);
    return processedData;
  } catch (err) {
    console.error('Error al cargar locations:', err);
    return [];
  }
}

export function clearLocationsCache(): void {
  cache.clear();
}
