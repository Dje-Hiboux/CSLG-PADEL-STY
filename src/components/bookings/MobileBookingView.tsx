import { TimeSlot, Booking, Court } from '../../types/booking';
import { BookingSlot } from './BookingSlot';

interface MobileBookingViewProps {
  timeSlots: TimeSlot[];
  courts: Court[];
  getBookingForSlot: (courtId: string, slotId: number) => Booking | null;
  handleBooking: (courtId: string, slotId: number) => Promise<void>;
  isBooking: boolean;
}

export function MobileBookingView({
  timeSlots,
  courts,
  getBookingForSlot,
  handleBooking,
  isBooking,
}: MobileBookingViewProps) {
  return (
    <div className="space-y-4">
      {timeSlots.map((slot) => (
        <div
          key={slot.id}
          className="bg-dark-100 rounded-lg p-4 space-y-4"
        >
          <h3 className="text-lg font-medium text-primary-400">
            {slot.label}
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {courts.map((court) => {
              const booking = getBookingForSlot(court.id, slot.id);
              
              return (
                <div
                  key={court.id}
                  className="flex items-center justify-between bg-dark-200 p-3 rounded-lg"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-400">
                      {court.name}
                    </span>
                    {!court.is_active && (
                      <span className="text-xs text-red-400 block">
                        (Indisponible)
                      </span>
                    )}
                  </div>
                  
                  <BookingSlot
                    booking={booking}
                    onBook={() => handleBooking(court.id, slot.id)}
                    isBooking={isBooking}
                    isDisabled={!court.is_active}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}