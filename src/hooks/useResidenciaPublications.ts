import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

interface Publication {
  id: number;
  user_id: number;
  location_id: number;
  estado: string;
  titulo: string;
  descripcion: string;
  price: number;
  direccion: string;
  capacidad: number;
  metros_cuadrados: number;
  amenidades: string[];
  created_at: string;
  updated_at: string;
  imagen?: string;
  location?: {
    id: number;
    latitud: number;
    longitud: number;
    direccion: string;
  };
}

export function useResidenciaPublications() {
  const { user, userData } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResidenciaPublications = async () => {
      // Solo buscar publicaciones si el usuario está autenticado y es de tipo residencia
      if (!user || userData?.user_type !== 'residencia') {
        setPublications([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('publications_test')
          .select('*, location(*)')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching residencia publications:', error);
          setError('Error al cargar las publicaciones de la residencia');
          setPublications([]);
        } else {
          console.log('📋 Publicaciones de residencia cargadas:', data?.length || 0);
          setPublications(data || []);
        }
      } catch (err) {
        console.error('Error fetching residencia publications:', err);
        setError('Error al cargar las publicaciones de la residencia');
        setPublications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResidenciaPublications();
  }, [user, userData]);

  return {
    publications,
    loading,
    error,
    // Función para refrescar las publicaciones
    refreshPublications: () => {
      if (user && userData?.user_type === 'residencia') {
        const fetchResidenciaPublications = async () => {
          setLoading(true);
          setError(null);

          try {
            const { data, error } = await supabase
              .from('publications_test')
              .select('*, location(*)')
              .eq('user_id', user.id);

            if (error) {
              console.error('Error fetching residencia publications:', error);
              setError('Error al cargar las publicaciones de la residencia');
              setPublications([]);
            } else {
              setPublications(data || []);
            }
          } catch (err) {
            console.error('Error fetching residencia publications:', err);
            setError('Error al cargar las publicaciones de la residencia');
            setPublications([]);
          } finally {
            setLoading(false);
          }
        };

        fetchResidenciaPublications();
      }
    }
  };
}
