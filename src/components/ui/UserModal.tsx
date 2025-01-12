import React from 'react';
import { User } from '../../types/auth';
import { X } from 'lucide-react';
import { Button } from './Button'; // Assurez-vous que le chemin est correct

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose }) => {
  if (!user || !isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative z-50 w-full max-w-md max-h-full bg-dark-100 rounded-lg shadow-xl flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-dark-300">
          <h3 className="text-lg font-medium text-primary-400">
            Informations sur l'utilisateur
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 p-4">
          <div className="text-center">
            {user.avatar_url && (
              <img src={user.avatar_url} alt={`${user.nickname}'s profile`} className="w-24 h-24 rounded-full mx-auto" />
            )}
            <h2 className="text-xl font-semibold mt-4 text-primary-400">{user.nickname}</h2>
            <p className="mt-2 text-gray-400">{user.first_name} {user.last_name}</p>
            <p className="mt-2 text-gray-400">{user.email}</p>
            <p className="mt-2 text-gray-400">{user.role}</p>
          </div>
        </div>
        
        <div className="p-4 border-t border-dark-300 text-center">
          <Button
            onClick={onClose}
            variant="primary"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;