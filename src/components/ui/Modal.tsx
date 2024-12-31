import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  loading?: boolean;
}

export function Modal({ isOpen, onClose, onConfirm, title, children, loading }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative z-50 w-full max-w-md max-h-[90vh] bg-dark-100 rounded-lg shadow-xl flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-dark-300">
          <h3 className="text-lg font-medium text-primary-400">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-dark-300 bg-dark-100">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Confirmation...' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </div>
  );
}