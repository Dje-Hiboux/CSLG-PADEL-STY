import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Booking, TimeSlot, getTimeSlotById, createBookingDateTime } from '../types/booking';
import { startOfDay, endOfDay, isBefore, startOfMinute } from 'date-fns';
import { getErrorMessage } from '../utils/errors';

export function useBookings(selectedDate: Date) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [selectedDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          id,
          court_id,
          user_id,
          slot_number,
          start_time,
          end_time,
          court:courts(id, name),
          user:users(
            id,
            first_name,
            last_name,
            nickname,
            avatar_url,
            is_active
          )
        `)
        .gte('start_time', startOfDay(selectedDate).toISOString())
        .lte('start_time', endOfDay(selectedDate).toISOString())
        .order('slot_number', { ascending: true });

      if (fetchError) throw fetchError;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (courtId: string, slotNumber: number) => {
    try {
      const timeSlot = getTimeSlotById(slotNumber);
      if (!timeSlot) throw new Error('Créneau invalide');

      const startTime = createBookingDateTime(selectedDate, timeSlot.start);
      const endTime = createBookingDateTime(selectedDate, timeSlot.end);

      if (isBefore(startTime, startOfMinute(new Date()))) {
        throw new Error('La réservation doit commencer dans le futur');
      }

      const { error } = await supabase
        .from('bookings')
        .insert([{
          court_id: courtId,
          slot_number: slotNumber,
          start_time: startTime,
          end_time: endTime
        }]);

      if (error) throw error;

      // Recharger les réservations pour avoir les données à jour
      await fetchBookings();
    } catch (err) {
      console.error('Error creating booking:', err);
      throw err;
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    refreshBookings: fetchBookings
  };
}