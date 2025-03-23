import { Modal } from '../ui/Modal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BookingHistory } from '../../types/booking';

interface DeleteBookingModalProps {
  booking: BookingHistory | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingId: string) => Promise<void>;
  isLoading: boolean;
}

export function DeleteBookingModal({
  booking,
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: DeleteBookingModalProps) {
  if (!booking) return null;

  const handleConfirm = async () => {
    await onConfirm(booking.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Confirmer la suppression"
      loading={isLoading}
    >
      <div className="space-y-4">
        <p className="text-gray-300">
          Êtes-vous sûr de vouloir supprimer cette réservation ?
        </p>
        
        <div className="bg-dark-200 p-4 rounded-md space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Date :</span>
            <span className="text-gray-100 font-medium">
              {format(new Date(booking.start_time), 'EEEE d MMMM yyyy', { locale: fr })}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Horaire :</span>
            <span className="text-gray-100 font-medium">
              {format(new Date(booking.start_time), 'HH:mm')} - 
              {format(new Date(booking.end_time), 'HH:mm')}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Terrain :</span>
            <span className="text-primary-400 font-medium">
              {booking.court.name}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Membre :</span>
            <span className="text-gray-100 font-medium">
              {booking.user.first_name} {booking.user.last_name}
              {booking.user.nickname && ` (${booking.user.nickname})`}
            </span>
          </div>
        </div>
        
        <p className="text-red-400 text-sm">
          Cette action est irréversible et supprimera définitivement la réservation.
        </p>
      </div>
    </Modal>
  );
}
