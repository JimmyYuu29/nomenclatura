import { useState, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';

interface UseCatalogSearchReturn<T> {
  query: string;
  setQuery: (q: string) => void;
  results: T[];
  allItems: T[];
}

export function useCatalogSearch<T>(
  items: T[],
  fuse: Fuse<T>
): UseCatalogSearchReturn<T> {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return items;
    return fuse.search(query).map(r => r.item);
  }, [query, items, fuse]);

  return {
    query,
    setQuery,
    results,
    allItems: items,
  };
}

/**
 * Hook simplificado para filtrar una lista con búsqueda de texto básica.
 */
export function useSimpleSearch<T>(
  items: T[],
  searchFn: (item: T, query: string) => boolean
) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter(item => searchFn(item, query.toLowerCase()));
  }, [query, items, searchFn]);

  const reset = useCallback(() => setQuery(''), []);

  return { query, setQuery, results, reset };
}
