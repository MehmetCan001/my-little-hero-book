import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Language {
  id: string;
  name: string;
  code: string;
}

export const useLanguages = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const { data, error } = await (supabase as any)
          .from('languages')
          .select('id, name, code')
          .order('name');

        if (error) {
          throw error;
        }

        setLanguages(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching languages:', err);
        setError('Failed to load languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return { languages, loading, error };
};