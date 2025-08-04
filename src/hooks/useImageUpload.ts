import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface ImageUploadResult {
  url: string;
  id: number;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, publicationId?: number): Promise<ImageUploadResult | null> => {
    setUploading(true);
    setError(null);

    try {
      // Generar un nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `publicacion_imagenes/${fileName}`;

      // Subir archivo al bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('publicacion_imagenes')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Error al subir imagen: ${uploadError.message}`);
      }

      // Obtener la URL pública de la imagen
      const { data: urlData } = supabase.storage
        .from('publicacion_imagenes')
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // Si se proporciona un publicationId, guardar en la tabla images
      if (publicationId) {
        const { data: imageData, error: insertError } = await supabase
          .from('images')
          .insert({
            publication_test_id: publicationId,
            url: imageUrl
          })
          .select()
          .single();

        if (insertError) {
          throw new Error(`Error al guardar imagen en BD: ${insertError.message}`);
        }

        return {
          url: imageUrl,
          id: imageData.id
        };
      }

      return {
        url: imageUrl,
        id: -1 // ID temporal para imágenes no guardadas en BD
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al subir imagen';
      setError(errorMessage);
      console.error('Error uploading image:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId: number, imageUrl: string): Promise<boolean> => {
    try {
      // Extraer el path del archivo de la URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `publicacion_imagenes/${fileName}`;

      // Eliminar de la tabla images si tiene ID válido
      if (imageId > 0) {
        const { error: deleteError } = await supabase
          .from('images')
          .delete()
          .eq('id', imageId);

        if (deleteError) {
          console.error('Error deleting image from DB:', deleteError);
        }
      }

      // Eliminar archivo del storage
      const { error: storageError } = await supabase.storage
        .from('publicacion_imagenes')
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error deleting image:', err);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    error
  };
}; 