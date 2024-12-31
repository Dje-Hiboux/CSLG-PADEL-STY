import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseImageUploadOptions {
  bucket: string;
  path?: string;
}

export function useImageUpload({ bucket, path = '' }: UseImageUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      const fileExt = file.name.split('.').pop();
      const filePath = `${path}${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl.publicUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du téléchargement';
      setError(message);
      throw new Error(message);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
    error
  };
}