import { useState, useEffect } from 'react';
import { format, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { DeleteBookingModal } from './DeleteBookingModal';
import { getErrorMessage } from '../../utils/errors';
import { useAuth } from '../../hooks/useAuth';

interface Booking {
  id: string;
  court: {
    name: string;
  };
  start_time: string;
  end_time: string;
}

const MAX_ACTIVE_BOOKINGS = 2;

export function UpcomingBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  useEffect(() => {
    if (user) {
      fetchUpcomingBookings();
    }
  }, [user]);

  async function fetchUpcomingBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          end_time,
          court:courts(name)
        `)
        .eq('user_id', user?.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingToDelete.id)
        .eq('user_id', user?.id); // Sécurité supplémentaire

      if (error) throw error;

      setBookings(prev => prev.filter(b => b.id !== bookingToDelete.id));
      setBookingToDelete(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  // Ne compter que les réservations futures
  const futureBookingsCount = bookings.filter(booking => 
    isFuture(new Date(booking.start_time))
  ).length;

  if (loading) {
    return <div className="text-gray-400">Chargement des réservations...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-400">
          Mes réservations actives
        </h4>
        <span className="text-xs text-primary-400">
          {futureBookingsCount}/{MAX_ACTIVE_BOOKINGS} créneaux utilisés
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Aucune réservation à venir</p>
        </div>
      ) : (
        <ul className="divide-y divide-dark-300">
          {bookings.map((booking) => (
            <li key={booking.id} className="py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-primary-400 font-medium">
                    {booking.court.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {format(new Date(booking.start_time), 'EEEE d MMMM', { locale: fr })}
                  </p>
                  <p className="text-sm text-gray-400">
                    {format(new Date(booking.start_time), 'HH:mm')} - 
                    {format(new Date(booking.end_time), 'HH:mm')}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setBookingToDelete(booking)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {bookingToDelete && (
        <DeleteBookingModal
          isOpen={true}
          onClose={() => setBookingToDelete(null)}
          onConfirm={handleDeleteBooking}
          booking={bookingToDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}