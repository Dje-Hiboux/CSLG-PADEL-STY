import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { News } from '../types/news';
import { getErrorMessage } from '../utils/errors';

export function useNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });

        if (fetchError) throw fetchError;
        if (mounted) setNews(data || []);
      } catch (err) {
        console.error('Error fetching news:', err);
        if (mounted) setError(getErrorMessage(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Charger les actualités initiales
    fetchNews();

    // S'abonner aux changements
    const channel = supabase
      .channel('news-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news'
        },
        () => {
          // Recharger toutes les actualités lors d'un changement
          fetchNews();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, []);

  return { news, loading, error };
}