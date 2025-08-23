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
}

export function useUserPublications() {
  const { user, userData } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPublications = async () => {
      // Solo buscar publicaciones si el usuario está autenticado y es de tipo residencia
      if (!user || userData?.user_type !== 'residencia') {
        setPublications([]);
        setLoading(false);
        setError(null);
        return;
      }

      // Evitar consultar con UUIDs de prueba
      if (user.id === '00000000-0000-0000-0000-000000000001') {
        setPublications([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user publications:', error);
          setError('Error al cargar las publicaciones');
          setPublications([]);
        } else {
          setPublications(data || []);
        }
      } catch (err) {
        console.error('Error fetching user publications:', err);
        setError('Error al cargar las publicaciones');
        setPublications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPublications();
  }, [user, userData]);

  return {
    publications,
    loading,
    error,
    // Función para refrescar las publicaciones
    refreshPublications: () => {
      if (user && userData?.user_type === 'residencia' && user.id !== '00000000-0000-0000-0000-000000000001') {
        const fetchUserPublications = async () => {
          setLoading(true);
          setError(null);

          try {
            const { data, error } = await supabase
              .from('publications')
              .select('*')
              .eq('user_id', user.id);

            if (error) {
              console.error('Error fetching user publications:', error);
              setError('Error al cargar las publicaciones');
              setPublications([]);
            } else {
              setPublications(data || []);
            }
          } catch (err) {
            console.error('Error fetching user publications:', err);
            setError('Error al cargar las publicaciones');
            setPublications([]);
          } finally {
            setLoading(false);
          }
        };

        fetchUserPublications();
      }
    }
  };
} 