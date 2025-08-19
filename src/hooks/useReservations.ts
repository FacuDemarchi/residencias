import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useProvideAuth } from './useProvideAuth';

interface Reservation {
  id: number;
  user_id: string;
  publication_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  total_personas: number;
  monto_total: number;
  created_at: string;
}

export function useReservations() {
  const { user } = useProvideAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);

  const createReservation = async (publicationId: number): Promise<boolean> => {
    if (!user) {
      setError('Debes estar autenticado para crear una reserva');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Obtener información de la publicación para calcular el precio
      const { data: publication, error: publicationFetchError } = await supabase
        .from('publications_test')
        .select('price, estado')
        .eq('id', publicationId)
        .single();

      if (publicationFetchError) {
        console.error('Error fetching publication:', publicationFetchError);
        setError('Error al obtener información de la publicación: ' + publicationFetchError.message);
        return false;
      }

      if (!publication) {
        setError('Publicación no encontrada');
        return false;
      }

      if (publication.estado !== 'activo') {
        setError('La publicación no está disponible para reservar');
        return false;
      }

      // Calcular fechas (30 días de reserva)
      const fechaInicio = new Date().toISOString().split('T')[0];
      const fechaFin = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const montoTotal = publication.price * 30; // 30 días * precio por día

      // 2. Crear la reserva
      console.log('🔄 Intentando crear reserva con publicationId:', publicationId);
      const { data: reservation, error: reservationError } = await supabase
        .from('reservas')
        .insert({
          user_id: user.id,
          publication_id: publicationId,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          estado: 'pendiente',
          total_personas: 1,
          monto_total: montoTotal
        })
        .select()
        .single();

      if (reservationError) {
        console.error('Error creating reservation:', reservationError);
        setError('Error al crear la reserva: ' + reservationError.message);
        return false;
      }

      // 3. Actualizar el estado de la publicación a 'reservado'
      const { error: publicationUpdateError } = await supabase
        .from('publications_test')
        .update({ estado: 'reservado' })
        .eq('id', publicationId);

      if (publicationUpdateError) {
        console.error('Error updating publication status:', publicationUpdateError);
        setError('Error al actualizar el estado de la publicación: ' + publicationUpdateError.message);
        return false;
      }

      console.log('✅ Reserva creada exitosamente:', reservation);
      return true;

    } catch (err) {
      console.error('Error in createReservation:', err);
      setError('Error inesperado al crear la reserva');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId: number, publicationId: number): Promise<boolean> => {
    if (!user) {
      setError('Debes estar autenticado para cancelar una reserva');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Actualizar el estado de la reserva a 'cancelada'
      const { error: reservationError } = await supabase
        .from('reservas')
        .update({ estado: 'cancelada' })
        .eq('id', reservationId)
        .eq('user_id', user.id);

      if (reservationError) {
        console.error('Error canceling reservation:', reservationError);
        setError('Error al cancelar la reserva: ' + reservationError.message);
        return false;
      }

      // 2. Actualizar el estado de la publicación a 'activo'
      const { error: publicationError } = await supabase
        .from('publications_test')
        .update({ estado: 'activo' })
        .eq('id', publicationId);

      if (publicationError) {
        console.error('Error updating publication status:', publicationError);
        setError('Error al actualizar el estado de la publicación: ' + publicationError.message);
        return false;
      }

      console.log('✅ Reserva cancelada exitosamente');
      return true;

    } catch (err) {
      console.error('Error in cancelReservation:', err);
      setError('Error inesperado al cancelar la reserva');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getUserReservations = async (): Promise<Reservation[]> => {
    if (!user) {
      return [];
    }

    try {
      const { data: reservations, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('user_id', user.id)
        .eq('estado', 'pendiente');

      if (error) {
        console.error('Error fetching user reservations:', error);
        return [];
      }

      setUserReservations(reservations || []);
      return reservations || [];
    } catch (err) {
      console.error('Error in getUserReservations:', err);
      return [];
    }
  };

  return {
    createReservation,
    cancelReservation,
    getUserReservations,
    userReservations,
    loading,
    error
  };
}
