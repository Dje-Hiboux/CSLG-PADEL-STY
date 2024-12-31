import { Modal } from '../ui/Modal';
import { AlertTriangle } from 'lucide-react';

interface AuthErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function AuthErrorModal({ isOpen, onClose, message }: AuthErrorModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClose}
      title="Compte inactif"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-yellow-400">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="font-medium">Validation en attente</p>
        </div>
        
        <p className="text-gray-400">
          {message}
        </p>

        <div className="bg-dark-200 p-4 rounded-lg text-sm text-gray-400">
          <p>
            Un administrateur examinera votre demande dans les plus brefs délais.
            Vous recevrez une notification par email une fois votre compte activé.
          </p>
        </div>
      </div>
    </Modal>
  );
}