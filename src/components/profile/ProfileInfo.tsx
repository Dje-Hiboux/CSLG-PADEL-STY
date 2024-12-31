import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { User } from '../../types/auth';
import { EditProfileModal } from './EditProfileModal';

interface ProfileInfoProps {
  profile: User;
  onProfileUpdate: (updatedProfile: User) => void;
}

export function ProfileInfo({ profile, onProfileUpdate }: ProfileInfoProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-medium text-primary-400">
          Informations personnelles
        </h3>
        <button
          onClick={() => setShowEditModal(true)}
          className="p-2 text-gray-400 hover:text-primary-400 transition-colors rounded-full hover:bg-dark-300"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      <dl className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <dt className="text-sm font-medium text-gray-400">Nom complet</dt>
          <dd className="text-sm text-gray-100 col-span-2">
            {profile.first_name} {profile.last_name}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <dt className="text-sm font-medium text-gray-400">Surnom</dt>
          <dd className="text-sm text-gray-100 col-span-2">
            {profile.nickname || '-'}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <dt className="text-sm font-medium text-gray-400">Email</dt>
          <dd className="text-sm text-gray-100 col-span-2">
            {profile.email}
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <dt className="text-sm font-medium text-gray-400">Statut</dt>
          <dd className="text-sm col-span-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              profile.is_active 
                ? 'bg-green-400/20 text-green-400' 
                : 'bg-red-400/20 text-red-400'
            }`}>
              {profile.is_active ? 'Actif' : 'Inactif'}
            </span>
          </dd>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <dt className="text-sm font-medium text-gray-400">Rôle</dt>
          <dd className="text-sm col-span-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              profile.role === 'admin'
                ? 'bg-red-400/20 text-red-400'
                : 'bg-blue-400/20 text-blue-400'
            }`}>
              {profile.role === 'admin' ? 'Administrateur' : 'Membre'}
            </span>
          </dd>
        </div>
      </dl>

      <EditProfileModal
        user={profile}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={onProfileUpdate}
      />
    </>
  );
}