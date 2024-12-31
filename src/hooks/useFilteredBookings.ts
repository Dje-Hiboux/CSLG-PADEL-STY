import { useMemo } from 'react';
import { parseISO, isSameDay, isValid } from 'date-fns';
import { BookingHistory } from '../types/booking';

interface Filters {
  selectedDate: string | null;
  userSearch: string;
}

export function useFilteredBookings(bookings: BookingHistory[], filters: Filters) {
  return useMemo(() => {
    return bookings.filter(booking => {
      let matchesFilters = true;

      // Filtre par date si une date est sélectionnée et valide
      if (filters.selectedDate) {
        try {
          const bookingDate = new Date(booking.start_time);
          const filterDate = parseISO(filters.selectedDate);
          
          if (!isValid(filterDate)) {
            console.warn('Date de filtre invalide:', filters.selectedDate);
            return false;
          }
          
          matchesFilters = matchesFilters && isSameDay(bookingDate, filterDate);
        } catch (error) {
          console.error('Erreur lors du parsing de la date:', error);
          return false;
        }
      }

      // Filtre par utilisateur si une recherche est effectuée
      if (filters.userSearch.trim()) {
        const searchTerms = filters.userSearch.toLowerCase().split(' ').filter(Boolean);
        const userData = {
          fullName: `${booking.user.first_name} ${booking.user.last_name}`.toLowerCase(),
          reverseName: `${booking.user.last_name} ${booking.user.first_name}`.toLowerCase(),
          nickname: (booking.user.nickname || '').toLowerCase()
        };

        // Vérifie si tous les termes de recherche correspondent
        matchesFilters = matchesFilters && searchTerms.every(term => 
          userData.fullName.includes(term) || 
          userData.reverseName.includes(term) || 
          userData.nickname.includes(term)
        );
      }

      return matchesFilters;
    });
  }, [bookings, filters.selectedDate, filters.userSearch]);
}