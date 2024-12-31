import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from '../../types/auth';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { getErrorMessage } from '../../utils/errors';
import { UsersList } from './UsersList';
import { RoleChangeModal } from './RoleChangeModal';
import { DeleteUserModal } from './DeleteUserModal';

interface RoleChange {
  user: User;
  newRole: 'member' | 'admin';
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [roleChange, setRoleChange] = useState<RoleChange | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'member' | 'admin') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    setRoleChange({ user, newRole });
  };

  const confirmRoleChange = async () => {
    if (!roleChange) return;

    try {
      setUpdating(roleChange.user.id);
      const { error } = await supabase
        .from('users')
        .update({ role: roleChange.newRole })
        .eq('id', roleChange.user.id);

      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === roleChange.user.id 
          ? { ...user, role: roleChange.newRole }
          : user
      ));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdating(null);
      setRoleChange(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setUpdating(userToDelete.id);

      // Supprimer l'avatar si présent
      if (userToDelete.avatar_url) {
        const avatarPath = userToDelete.avatar_url.split('/').pop();
        if (avatarPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${userToDelete.id}/${avatarPath}`]);
        }
      }

      // Appeler la fonction RPC pour supprimer complètement l'utilisateur
      const { error } = await supabase
        .rpc('delete_user_completely', {
          user_id: userToDelete.id
        });

      if (error) throw error;

      // Mettre à jour la liste des utilisateurs
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdating(null);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      setUpdating(userId);
      const { error } = await supabase
        .from('users')
        .update({ is_active: !isActive })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_active: !isActive }
          : user
      ));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <Card>
      <UsersList
        users={users}
        onRoleChange={handleRoleChange}
        onStatusToggle={toggleUserStatus}
        onDeleteUser={setUserToDelete}
        updating={updating}
      />

      {roleChange && (
        <RoleChangeModal
          user={roleChange.user}
          newRole={roleChange.newRole}
          isOpen={true}
          onClose={() => setRoleChange(null)}
          onConfirm={confirmRoleChange}
          isUpdating={updating === roleChange.user.id}
        />
      )}

      {userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          isOpen={true}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleDeleteUser}
          isDeleting={updating === userToDelete.id}
        />
      )}
    </Card>
  );
}