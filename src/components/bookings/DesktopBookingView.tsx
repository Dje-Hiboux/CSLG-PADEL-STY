import { TimeSlot, Booking, Court } from '../../types/booking';
import { BookingSlot } from './BookingSlot';

interface DesktopBookingViewProps {
  timeSlots: TimeSlot[];
  courts: Court[];
  getBookingForSlot: (courtId: string, slotId: number) => Booking | null;
  handleBooking: (courtId: string, slotId: number) => Promise<void>;
  isBooking: boolean;
}

export function DesktopBookingView({
  timeSlots,
  courts,
  getBookingForSlot,
  handleBooking,
  isBooking,
}: DesktopBookingViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
              Créneau
            </th>
            {courts.map(court => (
              <th key={court.id} className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                <div className="flex items-center space-x-2">
                  <span>{court.name}</span>
                  {!court.is_active && (
                    <span className="text-xs text-red-400">(Indisponible)</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-300">
          {timeSlots.map((slot) => (
            <tr key={slot.id} className="hover:bg-dark-100/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                {slot.label}
              </td>
              {courts.map((court) => {
                const booking = getBookingForSlot(court.id, slot.id);
                
                return (
                  <td key={court.id} className="px-6 py-4 whitespace-nowrap">
                    <BookingSlot
                      booking={booking}
                      onBook={() => handleBooking(court.id, slot.id)}
                      isBooking={isBooking}
                      isDisabled={!court.is_active}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}