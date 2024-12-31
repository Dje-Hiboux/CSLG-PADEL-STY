import { useState, useMemo } from 'react';
import { News } from '../types/news';

type SortField = 'date' | 'title';
type SortDirection = 'asc' | 'desc';

export function useSortedNews(news: News[]) {
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: 'date',
    direction: 'desc', // Par défaut, les plus récentes en premier
  });

  const sortedNews = useMemo(() => {
    const sorted = [...news];
    sorted.sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;

      switch (sortConfig.field) {
        case 'date':
          return direction * (new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        
        case 'title':
          return direction * a.title.localeCompare(b.title);
        
        default:
          return 0;
      }
    });
    return sorted;
  }, [news, sortConfig]);

  const requestSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return {
    items: sortedNews,
    sortConfig,
    requestSort,
  };
}