import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { User } from '../../types/auth';
import { supabase } from '../../lib/supabase';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

export function EditProfileModal({
  user,
  isOpen,
  onClose,
  onUpdate
}: EditProfileModalProps) {
  const [nickname, setNickname] = useState(user.nickname || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('users')
        .update({ nickname })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (!data) throw new Error('Erreur lors de la mise à jour du profil');

      onUpdate(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit}
      title="Modifier le profil"
      loading={loading}
    >
      <div className="space-y-4">
        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Surnom
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Entrez votre surnom"
          />
          <p className="mt-1 text-sm text-gray-400">
            Le surnom est optionnel et sera affiché sur vos réservations
          </p>
        </div>
      </div>
    </Modal>
  );
}