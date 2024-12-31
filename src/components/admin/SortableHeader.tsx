import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortableHeaderProps {
  label: string;
  field: string;
  currentField: string;
  direction: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export function SortableHeader({
  label,
  field,
  currentField,
  direction,
  onSort,
}: SortableHeaderProps) {
  const isActive = field === currentField;

  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 text-xs font-medium text-gray-400 uppercase tracking-wider hover:text-primary-400 transition-colors"
    >
      <span>{label}</span>
      {isActive ? (
        direction === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-4 w-4 opacity-50" />
      )}
    </button>
  );
}