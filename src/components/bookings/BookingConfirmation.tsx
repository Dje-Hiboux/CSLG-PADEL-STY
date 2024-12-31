import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Modal } from '../ui/Modal';
import { Court, TimeSlot } from '../../types/booking';

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  court: Court;
  timeSlot: TimeSlot;
  date: Date;
  isBooking: boolean;
  error: string | null;
}

export function BookingConfirmation({
  isOpen,
  onClose,
  onConfirm,
  court,
  timeSlot,
  date,
  isBooking,
  error
}: BookingConfirmationProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Confirmer la réservation"
      loading={isBooking}
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-red-400/20 text-red-400 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <p className="text-gray-400">
          Voulez-vous confirmer la réservation suivante ?
        </p>
        
        <div className="bg-dark-200 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Terrain</span>
            <span className="text-primary-400 font-medium">{court.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Date</span>
            <span className="text-gray-100">
              {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Horaire</span>
            <span className="text-gray-100">{timeSlot.label}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}