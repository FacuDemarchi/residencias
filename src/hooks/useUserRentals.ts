import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useProvideAuth } from './useProvideAuth';

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
  const [hasRentals, setHasRentals] = useState(false);
  const [hasReservations, setHasReservations] = useState(false);
  const [hasActiveRentals, setHasActiveRentals] = useState(false);
  const [rentalPublications, setRentalPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserRentals() {
      if (!user) {
        setHasRentals(false);
        setHasReservations(false);
        setHasActiveRentals(false);
        setRentalPublications([]);
        setLoading(false);
        return;
      }

      try {
        // Verificar si el usuario tiene reservas
        const { data: reservas, error: reservasError } = await supabase
          .from('reservas')
          .select('publication_id')
          .eq('user_id', user.id);

        if (reservasError) {
          console.error('Error checking reservas:', reservasError);
        }

        // Verificar si el usuario tiene alquileres
        const { data: alquileres, error: alquileresError } = await supabase
          .from('alquileres')
          .select('publication_id')
          .eq('user_id', user.id);

        if (alquileresError) {
          console.error('Error checking alquileres:', alquileresError);
        }

        // Obtener todos los IDs de publicaciones únicos
        const publicationIds = new Set<number>();
        
        if (reservas) {
          reservas.forEach(reserva => {
            if (reserva.publication_id) {
              publicationIds.add(reserva.publication_id);
            }
          });
        }
        
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

        // Separar las condiciones: reservas vs alquileres
        const hasAnyReservation = reservas && reservas.length > 0;
        const hasAnyRental = alquileres && alquileres.length > 0;
        
        setHasReservations(hasAnyReservation);
        setHasActiveRentals(hasAnyRental);
        setHasRentals(hasAnyReservation || hasAnyRental); // Mantener compatibilidad
      } catch (error) {
        console.error('Error checking user rentals:', error);
        setHasRentals(false);
        setHasReservations(false);
        setHasActiveRentals(false);
        setRentalPublications([]);
      } finally {
        setLoading(false);
      }
    }

    checkUserRentals();
  }, [user]);

  return { 
    hasRentals, 
    hasReservations,
    hasActiveRentals,
    loading, 
    rentalPublications,
    // Función para refrescar los alquileres
    refreshRentals: () => {
      if (user) {
        checkUserRentals();
      }
    }
  };
} 