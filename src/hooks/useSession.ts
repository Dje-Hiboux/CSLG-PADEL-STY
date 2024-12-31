import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../utils/errors';

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 secondes

    const initSession = async () => {
      try {
        setError(null);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          retryCount = 0; // Réinitialiser le compteur en cas de succès
        }
      } catch (err) {
        console.error('Session error:', err);
        if (mounted) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            retryTimeout = setTimeout(initSession, RETRY_DELAY * retryCount);
          } else {
            setError(getErrorMessage(err));
            setLoading(false);
          }
        }
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setError(null);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(retryTimeout);
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}