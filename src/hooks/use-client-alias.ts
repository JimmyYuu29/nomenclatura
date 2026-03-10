import { useState, useCallback, useEffect, useMemo } from 'react';
import { getClientAliases, addClientAlias } from '@/lib/storage';

interface UseClientAliasReturn {
  aliases: string[];
  suggestions: string[];
  query: string;
  setQuery: (q: string) => void;
  saveAlias: (alias: string) => void;
}

export function useClientAlias(): UseClientAliasReturn {
  const [aliases, setAliases] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setAliases(getClientAliases());
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim()) return aliases.slice(0, 10);
    const upper = query.toUpperCase();
    return aliases.filter(a => a.includes(upper)).slice(0, 10);
  }, [query, aliases]);

  const saveAlias = useCallback((alias: string) => {
    addClientAlias(alias);
    setAliases(getClientAliases());
  }, []);

  return {
    aliases,
    suggestions,
    query,
    setQuery,
    saveAlias,
  };
}
