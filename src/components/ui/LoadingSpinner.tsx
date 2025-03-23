import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function LoadingSpinner({ size = 'lg', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  if (size === 'lg') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-200">
        <Loader2 className={cn(sizeClasses[size], 'animate-spin text-primary-400', className)} />
      </div>
    );
  }

  return (
    <Loader2 className={cn(sizeClasses[size], 'animate-spin text-primary-400', className)} />
  );
}