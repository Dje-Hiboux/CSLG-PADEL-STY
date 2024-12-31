import { useState } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { useCourts } from '../../hooks/useCourts';
import { TIME_SLOTS } from '../../types/booking';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileBookingView } from './MobileBookingView';
import { DesktopBookingView } from './DesktopBookingView';
import { BookingConfirmation } from './BookingConfirmation';
import { getErrorMessage } from '../../utils/errors';

interface BookingTimeSlotsProps {
  selectedDate: Date;
}

export function BookingTimeSlots({ selectedDate }: BookingTimeSlotsProps) {
  const { bookings, loading: bookingsLoading, error: bookingsError, createBooking } = useBookings(selectedDate);
  const { courts, loading: courtsLoading, error: courtsError } = useCourts();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [confirmationData, setConfirmationData] = useState<{
    courtId: string;
    slotId: number;
  } | null>(null);

  const loading = bookingsLoading || courtsLoading;
  const error = bookingsError || courtsError;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-red-400 text-center p-4">
        {error}
      </div>
    );
  }

  const getBookingForSlot = (courtId: string, slotId: number) => {
    return bookings.find(
      booking => 
        booking.court_id === courtId && 
        booking.slot_number === slotId
    );
  };

  const handleBookingRequest = (courtId: string, slotId: number) => {
    const court = courts.find(c => c.id === courtId);
    if (!court?.is_active) {
      setBookingError('Ce terrain n\'est pas disponible pour le moment');
      return;
    }
    
    setBookingError(null);
    setConfirmationData({ courtId, slotId });
  };

  const handleBookingConfirm = async () => {
    if (!confirmationData) return;

    try {
      setIsBooking(true);
      setBookingError(null);
      await createBooking(confirmationData.courtId, confirmationData.slotId);
      setConfirmationData(null);
    } catch (err) {
      setBookingError(getErrorMessage(err));
    } finally {
      setIsBooking(false);
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationData(null);
    setBookingError(null);
  };

  return (
    <div className="space-y-4">
      {isMobile ? (
        <MobileBookingView
          timeSlots={TIME_SLOTS}
          courts={courts}
          getBookingForSlot={getBookingForSlot}
          handleBooking={handleBookingRequest}
          isBooking={isBooking}
        />
      ) : (
        <DesktopBookingView
          timeSlots={TIME_SLOTS}
          courts={courts}
          getBookingForSlot={getBookingForSlot}
          handleBooking={handleBookingRequest}
          isBooking={isBooking}
        />
      )}

      {confirmationData && (
        <BookingConfirmation
          isOpen={true}
          onClose={handleConfirmationClose}
          onConfirm={handleBookingConfirm}
          court={courts.find(c => c.id === confirmationData.courtId)!}
          timeSlot={TIME_SLOTS.find(s => s.id === confirmationData.slotId)!}
          date={selectedDate}
          isBooking={isBooking}
          error={bookingError}
        />
      )}
    </div>
  );
}