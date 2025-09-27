import { supabase } from './supabaseClient';
import type { Tables } from '../types/database';

type Publication = Tables<'publications'>;
type PublicationInsert = Omit<Publication, 'id' | 'created_at' | 'updated_at'>;
type PublicationUpdate = Partial<Omit<Publication, 'id' | 'created_at' | 'updated_at'>>;
type Image = Tables<'images'>;
type ImageInsert = Omit<Image, 'id' | 'created_at'>;

export class AdminService {
  // 1. Obtener publicaciones del usuario (residencia)
  async getMyPublications(userId: string): Promise<Publication[]> {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select(`
          *,
          images(*),
          locations(*),
          states(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error al cargar publicaciones del usuario:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en getMyPublications:', error);
      throw error;
    }
  }

  // 2. Obtener publicación por ID
  async getPublicationById(publicationId: string, userId: string): Promise<Publication & { images: Image[], locations: any }> {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select(`
          *,
          images(*),
          locations(*)
        `)
        .eq('id', publicationId)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error al cargar publicación:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Publicación no encontrada');
      }

      return data;
    } catch (error) {
      console.error('Error en getPublicationById:', error);
      throw error;
    }
  }

  // 3. Crear nueva publicación
  async createPublication(publicationData: PublicationInsert): Promise<Publication> {
    try {
      console.log('AdminService: Insertando publicación en Supabase:', publicationData);
      
      const { data, error } = await supabase
        .from('publications')
        .insert(publicationData)
        .select()
        .single();

      if (error) {
        console.error('Error al crear publicación:', error);
        throw error;
      }

      console.log('AdminService: Publicación insertada exitosamente:', data);
      return data;
    } catch (error) {
      console.error('Error en createPublication:', error);
      throw error;
    }
  }

  // 3. Actualizar publicación
  async updatePublication(
    publicationId: string, 
    updateData: PublicationUpdate,
    userId: string
  ): Promise<Publication> {
    try {
      console.log('Actualizando publicación:', publicationId, 'con datos:', updateData);
      
      const { data, error } = await supabase
        .from('publications')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', publicationId)
        .eq('user_id', userId) // Asegurar que solo actualice publicaciones del usuario
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar publicación:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No se encontró la publicación para actualizar');
      }

      return data;
    } catch (error) {
      console.error('Error en updatePublication:', error);
      throw error;
    }
  }

  // 4. Eliminar publicación (soft delete)
  async deletePublication(publicationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('publications')
        .update({
          deleted_at: new Date().toISOString(),
          is_active: false
        })
        .eq('id', publicationId);

      if (error) {
        console.error('Error al eliminar publicación:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error en deletePublication:', error);
      throw error;
    }
  }

  // 5. Subir imagen al bucket images
  async uploadImage(
    file: File, 
    publicationId: string,
    orderIndex: number = 0
  ): Promise<Image> {
    try {
      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${publicationId}_${Date.now()}_${orderIndex}.${fileExt}`;
      const filePath = `publications/${fileName}`;

      // Subir archivo al bucket
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error al subir imagen:', uploadError);
        throw uploadError;
      }

      // Obtener URL pública de la imagen
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // Crear registro en la tabla images
      const imageData: ImageInsert = {
        publication_id: publicationId,
        url_imagen: urlData.publicUrl,
        tipo: 'publicacion'
      };

      const { data: imageRecord, error: imageError } = await supabase
        .from('images')
        .insert(imageData)
        .select()
        .single();

      if (imageError) {
        console.error('Error al crear registro de imagen:', imageError);
            // Intentar eliminar el archivo subido si falla el registro
            await supabase.storage.from('images').remove([filePath]);
        throw imageError;
      }

      return imageRecord;
    } catch (error) {
      console.error('Error en uploadImage:', error);
      throw error;
    }
  }

  // 6. Subir múltiples imágenes
  async uploadMultipleImages(
    files: File[], 
    publicationId: string
  ): Promise<Image[]> {
    try {
      const uploadPromises = files.map((file, index) => 
        this.uploadImage(file, publicationId, index)
      );

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Error en uploadMultipleImages:', error);
      throw error;
    }
  }

  // 7. Eliminar imagen
  async deleteImage(imageId: string): Promise<void> {
    try {
      // Obtener información de la imagen
      const { data: image, error: fetchError } = await supabase
        .from('images')
        .select('url_imagen')
        .eq('id', imageId)
        .single();

      if (fetchError) {
        console.error('Error al obtener imagen:', fetchError);
        throw fetchError;
      }

      // Extraer el path del archivo de la URL
      const url = new URL(image.url_imagen);
      const filePath = url.pathname.split('/').slice(-2).join('/'); // publications/filename

      // Eliminar archivo del storage
      const { error: deleteError } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (deleteError) {
        console.error('Error al eliminar archivo:', deleteError);
        // Continuar con la eliminación del registro aunque falle el archivo
      }

      // Eliminar registro de la base de datos
      const { error: recordError } = await supabase
        .from('images')
        .delete()
        .eq('id', imageId);

      if (recordError) {
        console.error('Error al eliminar registro de imagen:', recordError);
        throw recordError;
      }
    } catch (error) {
      console.error('Error en deleteImage:', error);
      throw error;
    }
  }

  // 8. Obtener estadísticas del usuario
  async getUserStats(userId: string) {
    try {
      // Obtener publicaciones del usuario
      const { data: publications, error: pubError } = await supabase
        .from('publications')
        .select('*')
        .eq('user_id', userId);

      if (pubError) {
        console.error('Error al obtener publicaciones para estadísticas:', pubError);
        throw pubError;
      }

      // Calcular estadísticas
      const totalPublications = publications?.length || 0;
      const activePublications = publications?.filter(p => p.is_active).length || 0;
      const totalRevenue = publications?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;
      const totalCapacity = publications?.reduce((sum, p) => sum + (p.capacidad || 0), 0) || 0;

      // TODO: Obtener reservas activas cuando esté implementado
      const activeReservations = 0;

      return {
        totalPublications,
        activePublications,
        totalRevenue,
        totalCapacity,
        activeReservations
      };
    } catch (error) {
      console.error('Error en getUserStats:', error);
      throw error;
    }
  }

  // 9. Cambiar estado de publicación
  async togglePublicationStatus(
    publicationId: string, 
    isActive: boolean
  ): Promise<Publication> {
    try {
      const { data, error } = await supabase
        .from('publications')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', publicationId)
        .select()
        .single();

      if (error) {
        console.error('Error al cambiar estado de publicación:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en togglePublicationStatus:', error);
      throw error;
    }
  }
}

// Exportar una instancia por defecto
export const adminService = new AdminService();