import { Modal } from '../ui/Modal';
import { User } from '../../types/auth';

interface RoleChangeModalProps {
  user: User;
  newRole: 'member' | 'admin';
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isUpdating: boolean;
}

export function RoleChangeModal({
  user,
  newRole,
  isOpen,
  onClose,
  onConfirm,
  isUpdating
}: RoleChangeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`Changer le rôle de ${user.first_name} ${user.last_name}`}
      loading={isUpdating}
    >
      <div className="space-y-4">
        <p className="text-gray-400">
          Êtes-vous sûr de vouloir changer le rôle de cet utilisateur ?
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

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-dark-300">
            <span className="text-gray-400">Rôle actuel :</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              user.role === 'admin'
                ? 'bg-red-400/20 text-red-400'
                : 'bg-blue-400/20 text-blue-400'
            }`}>
              {user.role === 'admin' ? 'Administrateur' : 'Membre'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Nouveau rôle :</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              newRole === 'admin'
                ? 'bg-red-400/20 text-red-400'
                : 'bg-blue-400/20 text-blue-400'
            }`}>
              {newRole === 'admin' ? 'Administrateur' : 'Membre'}
            </span>
          </div>
        </div>

        {newRole === 'admin' && (
          <div className="bg-yellow-400/10 text-yellow-400 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">⚠️ Attention</p>
            <p>
              En donnant le rôle administrateur, cet utilisateur aura accès à :
            </p>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>La gestion complète des utilisateurs</li>
              <li>La gestion des terrains</li>
              <li>L'historique des réservations</li>
              <li>La gestion des actualités</li>
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}