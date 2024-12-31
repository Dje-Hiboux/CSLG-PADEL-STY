import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';

export function PendingUsersNotification() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', false);

        if (error) throw error;
        setPendingCount(count || 0);
      } catch (err) {
        console.error('Error fetching pending users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  if (loading || pendingCount === 0) return null;

  return (
    <Card className="bg-yellow-400/10 border-yellow-400/20 mb-8">
      <div className="p-4 flex items-center gap-4">
        <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-yellow-400">
            {pendingCount} utilisateur{pendingCount > 1 ? 's' : ''} en attente de validation
          </p>
        </div>
        <Link
          to="/admin"
          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
        >
          Voir les utilisateurs
        </Link>
      </div>
    </Card>
  );
}