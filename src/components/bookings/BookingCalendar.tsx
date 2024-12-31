import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { BookingTimeSlots } from './BookingTimeSlots';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isMobile = useMediaQuery('(max-width: 768px)');

  const goToPreviousDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const goToNextDay = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-dark-100 p-4 rounded-lg">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousDay}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {!isMobile && "Précédent"}
        </Button>

        <h2 className="text-xl font-semibold text-primary-400">
          {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
        </h2>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextDay}
          className="flex items-center gap-1"
        >
          {!isMobile && "Suivant"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <BookingTimeSlots selectedDate={selectedDate} />
    </div>
  );
}