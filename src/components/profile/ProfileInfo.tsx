import { User } from '../../types/auth';

interface ProfileInfoProps {
  profile: User;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  return (
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
  );
}