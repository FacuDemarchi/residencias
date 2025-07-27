import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

// Tipos
interface Publication {
  id: number;
  user_id: number;
  location_id: number;
  estado: string;
  titulo: string;
  descripcion: string;
  precio: number;
  capacidad: number;
  metros_cuadrados: number;
  created_at: string;
  updated_at: string;
  latitud: number;
  longitud: number;
}

type OrderType = 'recomendados' | 'menor_precio' | 'mayor_precio' | 'recientes' | 'antiguos';

interface PublicationsContextType {
  publications: Publication[];
  loading: boolean;
  error: string | null;
  orderBy: OrderType;
  setOrderBy: (order: OrderType) => void;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

const PublicationsContext = createContext<PublicationsContextType | undefined>(undefined);

export const usePublications = () => {
  const context = useContext(PublicationsContext);
  if (!context) {
    throw new Error('usePublications debe usarse dentro de PublicationsProvider');
  }
  return context;
};

export const PublicationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderBy, setOrderByState] = useState<OrderType>('recomendados');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPublications = async (reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const newOffset = reset ? 0 : offset;
      
      const { data, error: supabaseError } = await supabase.rpc('get_publications_for_sidebar', {
        offset_count: newOffset,
        limit_count: 20,
        order_type: orderBy
      });

      if (supabaseError) {
        throw supabaseError;
      }

      if (reset) {
        setPublications(data || []);
        setOffset(20);
      } else {
        setPublications([...publications, ...(data || [])]);
        setOffset(offset + 20);
      }
      
      setHasMore((data || []).length === 20);
    } catch (err) {
      console.error('Error cargando publicaciones:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const setOrderByAndRefresh = async (newOrder: OrderType) => {
    setOrderByState(newOrder);
    setOffset(0);
    await loadPublications(true);
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    await loadPublications(false);
  };

  // Cargar publicaciones al montar
  useEffect(() => {
    loadPublications(true);
  }, []);

  const value: PublicationsContextType = {
    publications,
    loading,
    error,
    orderBy,
    setOrderBy: setOrderByAndRefresh,
    hasMore,
    loadMore,
    refresh: () => loadPublications(true)
  };

  return (
    <PublicationsContext.Provider value={value}>
      {children}
    </PublicationsContext.Provider>
  );
}; 