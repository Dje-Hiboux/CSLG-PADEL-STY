import { cn } from '../../utils/cn';

interface RoleSelectProps {
  value: string;
  onChange: (newRole: 'member' | 'admin') => void;
  disabled?: boolean;
  className?: string;
}

export function RoleSelect({ value, onChange, disabled, className }: RoleSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as 'member' | 'admin')}
      disabled={disabled}
      className={cn(
        'px-2 py-1 text-xs font-semibold rounded-md bg-dark-300 border border-dark-100 text-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-primary-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      <option value="member">Membre</option>
      <option value="admin">Administrateur</option>
    </select>
  );
}