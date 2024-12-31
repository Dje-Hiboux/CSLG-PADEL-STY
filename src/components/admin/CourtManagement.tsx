import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { getErrorMessage } from '../../utils/errors';
import { EditCourtModal } from './EditCourtModal';

interface Court {
  id: string;
  name: string;
  is_active: boolean;
}

export function CourtManagement() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

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

  const handleUpdateCourt = async (court: Court) => {
    try {
      const { error } = await supabase
        .from('courts')
        .update({
          name: court.name,
          is_active: court.is_active
        })
        .eq('id', court.id);

      if (error) throw error;
      
      await fetchCourts();
      setEditingCourt(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <Card>
      <div className="px-4 sm:px-6 py-5 border-b border-dark-300">
        <h2 className="text-xl font-medium text-primary-400">
          Gestion des terrains
        </h2>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-4">
          {courts.map((court) => (
            <div
              key={court.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-dark-200 rounded-lg gap-4"
            >
              <div className="flex items-center space-x-4">
                <span className={`w-3 h-3 rounded-full ${
                  court.is_active ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <div>
                  <span className="text-gray-100">{court.name}</span>
                  <span className="block sm:hidden text-sm text-gray-400">
                    {court.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditingCourt(court)}
                className="w-full sm:w-auto"
              >
                Modifier
              </Button>
            </div>
          ))}
        </div>
      </div>

      {editingCourt && (
        <EditCourtModal
          court={editingCourt}
          isOpen={true}
          onClose={() => setEditingCourt(null)}
          onConfirm={handleUpdateCourt}
        />
      )}
    </Card>
  );
}