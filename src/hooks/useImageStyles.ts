import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ImageStyle {
  id: string;
  name: string;
  label: string;
  description: string;
  example_prompt: string;
}

export const useImageStyles = () => {
  const [imageStyles, setImageStyles] = useState<ImageStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageStyles = async () => {
      try {
        setLoading(true);
        const { data, error } = await (supabase as any)
          .from('image_styles')
          .select('id, name, label, description, example_prompt')
          .order('label');

        console.log('[useImageStyles] data:', data, '| error:', error);

        if (error) {
          throw error;
        }

        setImageStyles(data || []);
        setError(null);
      } catch (err) {
        console.error('[useImageStyles] fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load image styles');
      } finally {
        setLoading(false);
      }
    };

    fetchImageStyles();
  }, []);

  return { imageStyles, loading, error };
};