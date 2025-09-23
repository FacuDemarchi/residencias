import { supabase } from './supabaseClient';
import type { Tables } from '../types/database';

type Publication = Tables<'publications'>;
type Rental = Tables<'rentals'>;

export interface RentalWithPublication extends Rental {
  publications: Publication;
}

// Función simple para obtener publicaciones por location IDs
export async function getPublications(locationIds: string[]): Promise<Publication[]> {
  console.log('🔍 getPublications called with locationIds:', locationIds);
  
  if (locationIds.length === 0) {
    console.log('⚠️ No locationIds provided, returning empty array');
    return [];
  }

  try {
    console.log('📡 Querying publications table with location_ids:', locationIds);
    
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .in('location_id', locationIds);

    console.log('📊 Publications query result:', { data, error });

    if (error) {
      console.error('❌ Error al cargar publicaciones:', error);
      return [];
    }

    console.log('✅ Publications found:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('💥 Exception al cargar publicaciones:', err);
    return [];
  }
}

export class PublicationsService {
  private static cache: Map<string, any> = new Map();

  // 1. Obtener publicaciones por locationIds
  static async getPublicationsByLocations(locationIds: string[]): Promise<Publication[]> {
    if (locationIds.length === 0) {
      return [];
    }

    const cacheKey = `locations-${locationIds.join(',')}`;
    
    if (this.cache.has(cacheKey)) {
      console.log('Publicaciones por ubicaciones obtenidas del cache');
      return this.cache.get(cacheKey)!;
    }

    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .in('location_id', locationIds);

      if (error) {
        console.error('Error al cargar publicaciones por ubicaciones:', error);
        return [];
      }

      const publications = data || [];
      this.cache.set(cacheKey, publications);
      console.log('Publicaciones por ubicaciones obtenidas de la base de datos:', publications);
      
      return publications;
    } catch (err) {
      console.error('Error al cargar publicaciones por ubicaciones:', err);
      return [];
    }
  }

  // 2. Obtener publicaciones por userId (residencias)
  static async getPublicationsByUserId(userId: string): Promise<Publication[]> {
    const cacheKey = `user-${userId}`;
    
    if (this.cache.has(cacheKey)) {
      console.log('Publicaciones por usuario obtenidas del cache');
      return this.cache.get(cacheKey)!;
    }

    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error al cargar publicaciones por usuario:', error);
        return [];
      }

      const publications = data || [];
      this.cache.set(cacheKey, publications);
      console.log('Publicaciones por usuario obtenidas de la base de datos:', publications);
      
      return publications;
    } catch (err) {
      console.error('Error al cargar publicaciones por usuario:', err);
      return [];
    }
  }

  // 3. Obtener rentals con publicaciones por userId
  static async getRentalsWithPublications(userId: string): Promise<RentalWithPublication[]> {
    const cacheKey = `rentals-${userId}`;
    
    if (this.cache.has(cacheKey)) {
      console.log('Rentals con publicaciones obtenidos del cache');
      return this.cache.get(cacheKey)!;
    }

    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('*, publications(*)')
        .eq('user_id', userId);

      if (error) {
        console.error('Error al cargar rentals con publicaciones:', error);
        return [];
      }

      const rentals = data || [];
      this.cache.set(cacheKey, rentals);
      console.log('Rentals con publicaciones obtenidos de la base de datos:', rentals);
      
      return rentals;
    } catch (err) {
      console.error('Error al cargar rentals con publicaciones:', err);
      return [];
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
