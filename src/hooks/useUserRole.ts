import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getErrorMessage } from '../utils/errors';

export function useUserRole(user: User | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 seconde

    const fetchRole = async () => {
      if (!user?.id) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (mounted) {
          setIsAdmin(userData?.role === 'admin');
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching role:', getErrorMessage(err));
        
        if (mounted) {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(fetchRole, retryDelay * retryCount);
          } else {
            setIsAdmin(false);
            setError(getErrorMessage(err));
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchRole();

    // Écouter les changements de rôle en temps réel
    const channel = supabase.channel('role-changes');
    
    const subscription = channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user?.id}`,
        },
        () => {
          fetchRole();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user?.id]);

  return { isAdmin, loading, error };
}