export interface HistoryEntry {
  id: string;
  originalName: string;
  newName: string;
  aliasCliente: string;
  servicioAX: string;
  acronimoDocumento: string;
  estadoDocumento: string;
  timestamp: string;
  isFavorite: boolean;
}

export interface ExportData {
  version: string;
  exportedAt: string;
  history: HistoryEntry[];
  clientAliases: string[];
}
