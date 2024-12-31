import { User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Booking } from '../../types/booking';
import { useAuth } from '../../hooks/useAuth';

interface BookingSlotProps {
  booking: Booking | null;
  onBook: () => Promise<void>;
  isBooking: boolean;
  isDisabled?: boolean;
}

export function BookingSlot({ booking, onBook, isBooking, isDisabled }: BookingSlotProps) {
  const { user, isAdmin } = useAuth();

  if (!booking) {
    return (
      <Button
        size="sm"
        onClick={onBook}
        disabled={isBooking || isDisabled}
        variant={isDisabled ? "secondary" : "primary"}
      >
        {isDisabled ? 'Indisponible' : 'Réserver'}
      </Button>
    );
  }

  // Si c'est notre réservation ou si on est admin, afficher les détails
  if (booking.user_id === user?.id || isAdmin) {
    const displayName = booking.user?.nickname || 
      (booking.user?.first_name && booking.user?.last_name 
        ? `${booking.user.first_name} ${booking.user.last_name}`
        : 'Utilisateur inconnu');

    return (
      <div className="flex items-center space-x-3">
        {booking.user?.avatar_url ? (
          <img
            src={booking.user.avatar_url}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-dark-300 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <span className="text-sm text-gray-400">
          {displayName}
        </span>
      </div>
    );
  }

  // Pour les autres réservations, afficher simplement "Réservé"
  return (
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8 rounded-full bg-dark-300 flex items-center justify-center">
        <User className="h-4 w-4 text-gray-400" />
      </div>
      <span className="text-sm text-gray-400">Réservé</span>
    </div>
  );
}