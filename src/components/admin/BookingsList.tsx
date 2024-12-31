import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface AdminBooking {
  id: string;
  court: {
    name: string;
  };
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  start_time: string;
  end_time: string;
}

export function BookingsList() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          end_time,
          court:courts(name),
          user:users(first_name, last_name, email)
        `)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-dark-300">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Horaire
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Court
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Membre
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-300">
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-100">
                  {format(new Date(booking.start_time), 'EEEE d MMMM yyyy', { locale: fr })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-100">
                  {format(new Date(booking.start_time), 'HH:mm')} - 
                  {format(new Date(booking.end_time), 'HH:mm')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-primary-400 font-medium">
                  {booking.court.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">
                  <div className="text-gray-100">
                    {booking.user.first_name} {booking.user.last_name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {booking.user.email}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}