import React, { useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import UserModal from '../ui/UserModal';
import { Booking } from '../../types/booking';
import { User } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';

interface BookingSlotProps {
  booking: Booking | null;
  onBook: () => Promise<void>;
  isBooking: boolean;
  isDisabled?: boolean;
}

export function BookingSlot({ booking, onBook, isBooking, isDisabled }: BookingSlotProps) {
  const { user, isAdmin } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    console.log('user', user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

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
      <div>
        <div className="flex items-center space-x-3">
          {booking.user?.avatar_url ? (
            <img
              src={booking.user.avatar_url}
              alt=""
              className="h-8 w-8 rounded-full object-cover cursor-pointer"
              onClick={() => isAdmin && booking.user && handleUserClick(booking.user)}
            />
          ) : (
            <div
              className="h-8 w-8 rounded-full bg-dark-300 flex items-center justify-center cursor-pointer"
              onClick={() => isAdmin && booking.user && handleUserClick(booking.user)}
            >
              <UserIcon className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <span
            className="text-sm text-gray-400 cursor-pointer"
            onClick={() => isAdmin && booking.user && handleUserClick(booking.user)}
          >
            {displayName}
          </span>
        </div>

        <UserModal user={selectedUser} isOpen={isModalOpen} onClose={closeModal} />
      </div>
    );
  }

  // Pour les autres réservations, afficher simplement "Réservé"
  return (
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8 rounded-full bg-dark-300 flex items-center justify-center">
        <UserIcon className="h-4 w-4 text-gray-400" />
      </div>
      <span className="text-sm text-gray-400">Réservé</span>
    </div>
  );
}