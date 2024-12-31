import { Trash2 } from 'lucide-react';
import { User } from '../../types/auth';
import { Button } from '../ui/Button';
import { RoleSelect } from './RoleSelect';
import { SortableHeader } from './SortableHeader';
import { useSortedUsers } from '../../hooks/useSortedUsers';

interface UsersListProps {
  users: User[];
  onRoleChange: (userId: string, newRole: 'member' | 'admin') => void;
  onStatusToggle: (userId: string, isActive: boolean) => void;
  onDeleteUser: (user: User) => void;
  updating: string | null;
}

export function UsersList({
  users,
  onRoleChange,
  onStatusToggle,
  onDeleteUser,
  updating
}: UsersListProps) {
  const { items: sortedUsers, sortConfig, requestSort } = useSortedUsers(users);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left">
              <SortableHeader
                label="Nom"
                field="name"
                currentField={sortConfig.field}
                direction={sortConfig.direction}
                onSort={requestSort}
              />
            </th>
            <th className="px-6 py-3 text-left">
              <SortableHeader
                label="Email"
                field="email"
                currentField={sortConfig.field}
                direction={sortConfig.direction}
                onSort={requestSort}
              />
            </th>
            <th className="px-6 py-3 text-left">
              <SortableHeader
                label="Rôle"
                field="role"
                currentField={sortConfig.field}
                direction={sortConfig.direction}
                onSort={requestSort}
              />
            </th>
            <th className="px-6 py-3 text-left">
              <SortableHeader
                label="Statut"
                field="status"
                currentField={sortConfig.field}
                direction={sortConfig.direction}
                onSort={requestSort}
              />
            </th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-300">
          {sortedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-dark-100/50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {user.avatar_url && (
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="h-8 w-8 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <div className="text-sm text-gray-100">
                      {user.first_name} {user.last_name}
                    </div>
                    {user.nickname && (
                      <div className="text-xs text-gray-400">
                        ({user.nickname})
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-400">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <RoleSelect
                  value={user.role}
                  onChange={(newRole) => onRoleChange(user.id, newRole)}
                  disabled={updating === user.id}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  user.is_active
                    ? 'bg-green-400/20 text-green-400'
                    : 'bg-red-400/20 text-red-400'
                }`}>
                  {user.is_active ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={user.is_active ? "secondary" : "primary"}
                    onClick={() => onStatusToggle(user.id, user.is_active)}
                    disabled={updating === user.id || user.role === 'admin'}
                  >
                    {updating === user.id
                      ? 'Mise à jour...'
                      : user.is_active
                      ? 'Désactiver'
                      : 'Activer'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onDeleteUser(user)}
                    disabled={updating === user.id || user.role === 'admin'}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}