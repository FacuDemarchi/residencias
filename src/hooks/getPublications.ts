import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Publication } from '../types/app';

interface GetPublicationsProps {
  locationIds: bigint[];
  sortBy?: 'created_at' | 'price' | 'capacidad';
  sortOrder?: 'asc' | 'desc';
  pageSize?: number;
}

interface GetPublicationsReturn {
  publications: Publication[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  totalLoaded: number;
}

export const getPublications = ({ 
  locationIds, 
  sortBy = 'created_at', 
  sortOrder = 'desc',
  pageSize = 20 
}: GetPublicationsProps): GetPublicationsReturn => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener publicaciones de Supabase usando la función SQL
  const fetchPublications = useCallback(async (offset: number) => {
    try {
      console.log(' Consultando publicaciones con función SQL:', {
        locationIds: locationIds.length,
        sortBy,
        sortOrder,
        limit: pageSize,
        offset
      });

      const { data, error: fetchError } = await supabase
        .rpc('get_publications_by_locations', {
          location_ids: locationIds,
          max_results: pageSize,
          sort_by: sortBy,
          sort_order: sortOrder,
          offset_count: offset
        });

      if (fetchError) {
        console.error(' Error en consulta de publicaciones:', fetchError);
        throw fetchError;
      }

      console.log(' Publicaciones obtenidas:', data?.length || 0);
      return data || [];
    } catch (err) {
      console.error(' Error completo:', err);
      throw err;
    }
  }, [locationIds, sortBy, sortOrder, pageSize]);

  // Función para cargar más publicaciones (scroll infinito)
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || locationIds.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const offset = page * pageSize;
      const newPublications = await fetchPublications(offset);

      // Si obtenemos menos publicaciones que el límite, no hay más
      if (newPublications.length < pageSize) {
        setHasMore(false);
      }

      // Agregar nuevas publicaciones a las existentes
      setPublications(prev => [...prev, ...newPublications]);
      setPage(prev => prev + 1);

      console.log(' Publicaciones cargadas:', {
        nuevas: newPublications.length,
        total: publications.length + newPublications.length,
        hasMore: newPublications.length === pageSize
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error(' Error al cargar más publicaciones:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, locationIds, page, pageSize, fetchPublications, publications.length]);

  // Función para refrescar (resetear y cargar desde el inicio)
  const refresh = useCallback(async () => {
    if (locationIds.length === 0) {
      setPublications([]);
      setPage(0);
      setHasMore(true);
      return;
    }

    setLoading(true);
    setError(null);
    setPage(0);
    setHasMore(true);

    try {
      const newPublications = await fetchPublications(0);

      if (newPublications.length < pageSize) {
        setHasMore(false);
      }

      setPublications(newPublications);
      setPage(1); // La siguiente página será la 1

      console.log(' Publicaciones refrescadas:', {
        total: newPublications.length,
        hasMore: newPublications.length === pageSize
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error(' Error al refrescar publicaciones:', err);
      setPublications([]);
    } finally {
      setLoading(false);
    }
  }, [locationIds, pageSize, fetchPublications]);

  // Cargar publicaciones cuando cambien los locationIds
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    publications,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalLoaded: publications.length
  };
};





