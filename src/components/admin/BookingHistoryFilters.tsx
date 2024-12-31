import { useState, useCallback } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingHistoryFiltersProps {
  onFilterChange: (filters: {
    selectedDate: string | null;
    userSearch: string;
  }) => void;
}

export function BookingHistoryFilters({ onFilterChange }: BookingHistoryFiltersProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [userSearch, setUserSearch] = useState('');

  const handleDateChange = useCallback((date: string) => {
    // Valider la date avant de l'appliquer
    if (date && !isValid(parseISO(date))) {
      console.warn('Date invalide sélectionnée');
      return;
    }

    setSelectedDate(date);
    onFilterChange({
      selectedDate: date || null,
      userSearch,
    });
  }, [userSearch, onFilterChange]);

  const handleUserSearchChange = useCallback((search: string) => {
    setUserSearch(search);
    onFilterChange({
      selectedDate: selectedDate || null,
      userSearch: search,
    });
  }, [selectedDate, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setSelectedDate('');
    setUserSearch('');
    onFilterChange({
      selectedDate: null,
      userSearch: '',
    });
  }, [onFilterChange]);

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="p-4 bg-dark-100 rounded-lg mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Filtrer par date
          </label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              max={today}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Rechercher un membre
          </label>
          <input
            type="text"
            value={userSearch}
            onChange={(e) => handleUserSearchChange(e.target.value)}
            placeholder="Nom, prénom ou surnom..."
            className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {(selectedDate || userSearch) && (
        <div className="flex justify-end mt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Réinitialiser les filtres</span>
            <span className="sm:hidden">Réinitialiser</span>
          </Button>
        </div>
      )}
    </div>
  );
}