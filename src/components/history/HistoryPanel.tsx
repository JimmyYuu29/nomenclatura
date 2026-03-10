import { useState } from 'react';
import { Star, Trash2, RotateCcw, Search, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { HistoryEntry } from '@/types';
import { exportData, importData } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface HistoryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: HistoryEntry[];
  favorites: HistoryEntry[];
  onReuse: (entry: HistoryEntry) => void;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onRefresh: () => void;
}

export function HistoryPanel({
  open,
  onOpenChange,
  history,
  favorites,
  onReuse,
  onToggleFavorite,
  onRemove,
  onClearAll,
  onRefresh,
}: HistoryPanelProps) {
  const [search, setSearch] = useState('');

  const filteredHistory = search.trim()
    ? history.filter(
        e =>
          e.originalName.toLowerCase().includes(search.toLowerCase()) ||
          e.newName.toLowerCase().includes(search.toLowerCase()) ||
          e.aliasCliente.toLowerCase().includes(search.toLowerCase())
      )
    : history;

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nomenclatura-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const result = importData(data);
        if (result.success) {
          onRefresh();
        }
      } catch {
        // Import error handled silently
      }
    };
    input.click();
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Historial</SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en historial..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="flex-1">
              <Download className="mr-1 h-3 w-3" /> Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport} className="flex-1">
              <Upload className="mr-1 h-3 w-3" /> Importar
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                Todos ({history.length})
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex-1">
                Favoritos ({favorites.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-2 max-h-[calc(100vh-280px)] overflow-y-auto">
              {filteredHistory.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No hay entradas en el historial
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredHistory.map(entry => (
                    <HistoryItem
                      key={entry.id}
                      entry={entry}
                      onReuse={onReuse}
                      onToggleFavorite={onToggleFavorite}
                      onRemove={onRemove}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-2 max-h-[calc(100vh-280px)] overflow-y-auto">
              {favorites.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No hay favoritos
                </p>
              ) : (
                <div className="space-y-2">
                  {favorites.map(entry => (
                    <HistoryItem
                      key={entry.id}
                      entry={entry}
                      onReuse={onReuse}
                      onToggleFavorite={onToggleFavorite}
                      onRemove={onRemove}
                      formatDate={formatDate}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Separator />
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={onClearAll}
          >
            <Trash2 className="mr-1 h-3 w-3" /> Borrar todo el historial
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function HistoryItem({
  entry,
  onReuse,
  onToggleFavorite,
  onRemove,
  formatDate,
}: {
  entry: HistoryEntry;
  onReuse: (entry: HistoryEntry) => void;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  formatDate: (ts: string) => string;
}) {
  return (
    <div className="rounded-md border p-2.5 text-sm">
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <p className="truncate text-muted-foreground">{entry.originalName}</p>
          <p className="mt-0.5 truncate font-mono text-xs font-medium">{entry.newName}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            <Badge variant="outline" className="text-[10px]">{entry.aliasCliente}</Badge>
            <Badge variant="outline" className="text-[10px]">{entry.servicioAX}</Badge>
            <Badge variant="outline" className="text-[10px]">{entry.estadoDocumento}</Badge>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {formatDate(entry.timestamp)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onToggleFavorite(entry.id)}
          >
            <Star
              className={cn(
                'h-3 w-3',
                entry.isFavorite
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-muted-foreground'
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onReuse(entry)}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive"
            onClick={() => onRemove(entry.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
