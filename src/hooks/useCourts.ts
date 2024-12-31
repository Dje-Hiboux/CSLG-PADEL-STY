import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Court } from '../types/booking';
import { getErrorMessage } from '../utils/errors';

export function useCourts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .order('name');

      if (error) throw error;
      setCourts(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { courts, loading, error };
}