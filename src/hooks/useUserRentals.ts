import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useProvideAuth } from './useProvideAuth';
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

export function useUserRentals() {
  const { user } = useProvideAuth();
  const { userData } = useAuth();
  const [hasRentals, setHasRentals] = useState(false);
  const [hasReservations, setHasReservations] = useState(false);
  const [hasActiveRentals, setHasActiveRentals] = useState(false);
  const [rentalPublications, setRentalPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  const checkUserRentals = async () => {
    if (!user || !userData) {
      setHasRentals(false);
      setHasReservations(false);
      setHasActiveRentals(false);
      setRentalPublications([]);
      setLoading(false);
      return;
    }

    // Evitar consultar con UUIDs de prueba
    if (user.id === '00000000-0000-0000-0000-000000000001') {
      setHasRentals(false);
      setHasReservations(false);
      setHasActiveRentals(false);
      setRentalPublications([]);
      setLoading(false);
      return;
    }

    try {
      // Verificar si el usuario tiene alquileres
      const { data: alquileres, error: alquileresError } = await supabase
        .from('rentals')
        .select('publication_id')
        .eq('user_id', user.id);

      if (alquileresError) {
        console.error('Error checking rentals:', alquileresError);
      }

      // Obtener todos los IDs de publicaciones únicos
      const publicationIds = new Set<number>();
      
      if (alquileres) {
        alquileres.forEach(alquiler => {
          if (alquiler.publication_id) {
            publicationIds.add(alquiler.publication_id);
          }
        });
      }

      // Si hay publicaciones, obtener sus detalles
      if (publicationIds.size > 0) {
        const { data: publications, error: publicationsError } = await supabase
          .from('publications_test')
          .select('*, location(*)')
          .in('id', Array.from(publicationIds));

        if (publicationsError) {
          console.error('Error fetching rental publications:', publicationsError);
        } else {
          console.log('🏠 Publicaciones de alquiler cargadas:', publications?.length || 0);
          setRentalPublications(publications || []);
        }
      } else {
        setRentalPublications([]);
      }

      // Verificar si el usuario tiene alquileres
      const hasAnyRental = Boolean(alquileres && alquileres.length > 0);
      
      setHasReservations(false); // No hay tabla de reservas
      setHasActiveRentals(hasAnyRental);
      setHasRentals(hasAnyRental); // Solo alquileres
    } catch (error) {
      console.error('Error checking user rentals:', error);
      setHasRentals(false);
      setHasReservations(false);
      setHasActiveRentals(false);
      setRentalPublications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserRentals();
  }, [user, userData]);

  return { 
    hasRentals, 
    hasReservations,
    hasActiveRentals,
    loading, 
    rentalPublications,
    // Función para refrescar los alquileres
    refreshRentals: () => {
      if (user && userData) {
        checkUserRentals();
      }
    }
  };
} 