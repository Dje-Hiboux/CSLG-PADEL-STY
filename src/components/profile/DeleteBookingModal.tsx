import { Modal } from '../ui/Modal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DeleteBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  booking: {
    court: { name: string };
    start_time: string;
    end_time: string;
  };
  isDeleting: boolean;
}

export function DeleteBookingModal({
  isOpen,
  onClose,
  onConfirm,
  booking,
  isDeleting
}: DeleteBookingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Supprimer la réservation"
      loading={isDeleting}
    >
      <div className="space-y-4">
        <p className="text-gray-400">
          Êtes-vous sûr de vouloir supprimer cette réservation ?
        </p>
        
        <div className="bg-dark-200 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Terrain</span>
            <span className="text-primary-400 font-medium">{booking.court.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Date</span>
            <span className="text-gray-100">
              {format(new Date(booking.start_time), 'EEEE d MMMM yyyy', { locale: fr })}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Horaire</span>
            <span className="text-gray-100">
              {format(new Date(booking.start_time), 'HH:mm')} - 
              {format(new Date(booking.end_time), 'HH:mm')}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}