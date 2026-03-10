import { useState, useCallback, useEffect } from 'react';
import type { HistoryEntry } from '@/types';
import {
  getHistory,
  addHistoryEntry,
  removeHistoryEntry,
  toggleFavorite as toggleFav,
  clearHistory as clearHist,
} from '@/lib/storage';

interface UseHistoryReturn {
  history: HistoryEntry[];
  favorites: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp' | 'isFavorite'>) => void;
  removeEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearAll: () => void;
  refresh: () => void;
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const refresh = useCallback(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addEntry = useCallback(
    (entry: Omit<HistoryEntry, 'id' | 'timestamp' | 'isFavorite'>) => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        isFavorite: false,
      };
      addHistoryEntry(newEntry);
      refresh();
    },
    [refresh]
  );

  const removeEntry = useCallback(
    (id: string) => {
      removeHistoryEntry(id);
      refresh();
    },
    [refresh]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      toggleFav(id);
      refresh();
    },
    [refresh]
  );

  const clearAll = useCallback(() => {
    clearHist();
    refresh();
  }, [refresh]);

  const favorites = history.filter(e => e.isFavorite);

  return {
    history,
    favorites,
    addEntry,
    removeEntry,
    toggleFavorite,
    clearAll,
    refresh,
  };
}
