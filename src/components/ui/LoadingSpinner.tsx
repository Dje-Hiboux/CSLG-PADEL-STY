import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-200">
      <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
    </div>
  );
}