import { useState } from 'react';
import { Modal } from '../ui/Modal';

interface Court {
  id: string;
  name: string;
  is_active: boolean;
}

interface EditCourtModalProps {
  court: Court;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (court: Court) => Promise<void>;
}

export function EditCourtModal({
  court,
  isOpen,
  onClose,
  onConfirm
}: EditCourtModalProps) {
  const [name, setName] = useState(court.name);
  const [isActive, setIsActive] = useState(court.is_active);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm({
        ...court,
        name,
        is_active: isActive
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit}
      title="Modifier le terrain"
      loading={isSubmitting}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Nom du terrain
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="is_active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-100 bg-dark-300 rounded"
          />
          <label
            htmlFor="is_active"
            className="text-sm font-medium text-gray-400"
          >
            Terrain actif
          </label>
        </div>
      </div>
    </Modal>
  );
}