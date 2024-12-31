import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { SortableHeader } from './SortableHeader';
import { BookingHistoryFilters } from './BookingHistoryFilters';
import { useFilteredBookings } from '../../hooks/useFilteredBookings';
import { User } from 'lucide-react';
import { BookingHistory as BookingHistoryType } from '../../types/booking';

type SortField = 'date' | 'court' | 'user';
type SortDirection = 'asc' | 'desc';

export function BookingHistory() {
  const [bookings, setBookings] = useState<BookingHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    selectedDate: null as string | null,
    userSearch: '',
  });
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: 'date',
    direction: 'desc',
  });

  const filteredBookings = useFilteredBookings(bookings, filters);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_time,
          end_time,
          court:courts(name),
          user:users(
            first_name,
            last_name,
            nickname,
            avatar_url
          )
        `)
        .order('start_time', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;

    switch (sortConfig.field) {
      case 'date':
        return direction * (new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
      
      case 'court':
        return direction * a.court.name.localeCompare(b.court.name);
      
      case 'user':
        const nameA = `${a.user.last_name} ${a.user.first_name}`;
        const nameB = `${b.user.last_name} ${b.user.first_name}`;
        return direction * nameA.localeCompare(nameB);
      
      default:
        return 0;
    }
  });

  const requestSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-4">
      <BookingHistoryFilters onFilterChange={setFilters} />
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left">
                  <SortableHeader
                    label="Date"
                    field="date"
                    currentField={sortConfig.field}
                    direction={sortConfig.direction}
                    onSort={requestSort}
                  />
                </th>
                <th className="px-6 py-3 text-left">
                  <SortableHeader
                    label="Terrain"
                    field="court"
                    currentField={sortConfig.field}
                    direction={sortConfig.direction}
                    onSort={requestSort}
                  />
                </th>
                <th className="px-6 py-3 text-left">
                  <SortableHeader
                    label="Membre"
                    field="user"
                    currentField={sortConfig.field}
                    direction={sortConfig.direction}
                    onSort={requestSort}
                  />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-300">
              {sortedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-dark-100/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="text-gray-100">
                        {format(new Date(booking.start_time), 'EEEE d MMMM yyyy', { locale: fr })}
                      </div>
                      <div className="text-gray-400">
                        {format(new Date(booking.start_time), 'HH:mm')} - 
                        {format(new Date(booking.end_time), 'HH:mm')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-primary-400 font-medium">
                      {booking.court.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {booking.user.avatar_url ? (
                        <img
                          src={booking.user.avatar_url}
                          alt=""
                          className="h-8 w-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-dark-300 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div className="text-sm">
                        <div className="text-gray-100">
                          {booking.user.first_name} {booking.user.last_name}
                        </div>
                        {booking.user.nickname && (
                          <div className="text-gray-400 text-xs">
                            ({booking.user.nickname})
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}