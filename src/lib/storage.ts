import type { HistoryEntry, ExportData } from '@/types';

const STORAGE_KEYS = {
  HISTORY: 'nomenclatura_history',
  ALIASES: 'nomenclatura_aliases',
} as const;

const MAX_HISTORY = 50;
const MAX_ALIASES = 100;

// ── Historia ──

export function getHistory(): HistoryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: HistoryEntry): void {
  const history = getHistory();
  history.unshift(entry);
  if (history.length > MAX_HISTORY) {
    history.length = MAX_HISTORY;
  }
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function removeHistoryEntry(id: string): void {
  const history = getHistory().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function toggleFavorite(id: string): void {
  const history = getHistory().map(e =>
    e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
  );
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

// ── Alias de cliente ──

export function getClientAliases(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ALIASES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addClientAlias(alias: string): void {
  const upper = alias.toUpperCase().trim();
  if (!upper) return;
  const aliases = getClientAliases().filter(a => a !== upper);
  aliases.unshift(upper);
  if (aliases.length > MAX_ALIASES) {
    aliases.length = MAX_ALIASES;
  }
  localStorage.setItem(STORAGE_KEYS.ALIASES, JSON.stringify(aliases));
}

// ── Exportar / Importar ──

export function exportData(): ExportData {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    history: getHistory(),
    clientAliases: getClientAliases(),
  };
}

export function importData(data: ExportData): { success: boolean; message: string } {
  try {
    if (!data.version || !Array.isArray(data.history)) {
      return { success: false, message: 'Formato de datos no válido' };
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
    if (Array.isArray(data.clientAliases)) {
      localStorage.setItem(STORAGE_KEYS.ALIASES, JSON.stringify(data.clientAliases));
    }
    return { success: true, message: `Importados ${data.history.length} registros` };
  } catch {
    return { success: false, message: 'Error al importar los datos' };
  }
}
