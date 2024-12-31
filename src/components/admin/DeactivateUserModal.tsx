import { Modal } from '../ui/Modal';
import { User } from '../../types/auth';

interface DeactivateUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeactivating: boolean;
}

export function DeactivateUserModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  isDeactivating,
}: DeactivateUserModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Désactiver le membre"
      loading={isDeactivating}
    >
      <div className="space-y-4">
        <p className="text-gray-400">
          Êtes-vous sûr de vouloir désactiver le compte de ce membre ?
        </p>
        
        <div className="bg-dark-200 p-4 rounded-lg space-y-2">
          <div className="flex items-center space-x-3">
            {user.avatar_url && (
              <img
                src={user.avatar_url}
                alt=""
                className="h-10 w-10 rounded-full"
              />
            )}
            <div>
              <div className="font-medium text-gray-100">
                {user.first_name} {user.last_name}
              </div>
              {user.nickname && (
                <div className="text-sm text-gray-400">
                  ({user.nickname})
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-gray-400 mt-2">
            {user.email}
          </div>
        </div>

        <div className="bg-red-400/10 text-red-400 p-4 rounded-lg text-sm">
          <p>
            En désactivant ce compte :
          </p>
          <ul className="list-disc ml-4 mt-2 space-y-1">
            <li>Le membre ne pourra plus se connecter</li>
            <li>Ses réservations futures seront annulées</li>
            <li>Il ne pourra plus effectuer de nouvelles réservations</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}