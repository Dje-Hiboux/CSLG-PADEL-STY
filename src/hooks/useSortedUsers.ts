import { useState, useMemo } from 'react';
import { User } from '../types/auth';

type SortField = 'name' | 'email' | 'role' | 'status';
type SortDirection = 'asc' | 'desc';

export function useSortedUsers(users: User[]) {
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: 'name',
    direction: 'asc',
  });

  const sortedUsers = useMemo(() => {
    const sorted = [...users];
    sorted.sort((a, b) => {
      switch (sortConfig.field) {
        case 'name':
          const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
          const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
          return sortConfig.direction === 'asc'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        
        case 'email':
          return sortConfig.direction === 'asc'
            ? a.email.localeCompare(b.email)
            : b.email.localeCompare(a.email);
        
        case 'role':
          return sortConfig.direction === 'asc'
            ? a.role.localeCompare(b.role)
            : b.role.localeCompare(a.role);
        
        case 'status':
          return sortConfig.direction === 'asc'
            ? Number(a.is_active) - Number(b.is_active)
            : Number(b.is_active) - Number(a.is_active);
        
        default:
          return 0;
      }
    });
    return sorted;
  }, [users, sortConfig]);

  const requestSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction:
        current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return {
    items: sortedUsers,
    sortConfig,
    requestSort,
  };
}