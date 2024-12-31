import { Modal } from '../ui/Modal';
import { User } from '../../types/auth';

interface DeleteUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function DeleteUserModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  isDeleting
}: DeleteUserModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Supprimer l'utilisateur"
      loading={isDeleting}
    >
      <div className="space-y-4">
        <p className="text-gray-400">
          Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ?
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
          
          <div className="text-sm text-gray-400">
            {user.email}
          </div>
        </div>

        <div className="bg-red-400/10 text-red-400 p-4 rounded-lg text-sm">
          <p>Cette action est irréversible et entraînera :</p>
          <ul className="list-disc ml-4 mt-2 space-y-1">
            <li>La suppression du compte utilisateur</li>
            <li>La suppression de toutes ses réservations</li>
            <li>La suppression de son avatar</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}