import { File, X, AlertTriangle, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FileEntry } from '@/types';

interface FileListProps {
  files: FileEntry[];
  onRemove: (id: string) => void;
  selectedId?: string;
  onSelect?: (id: string) => void;
}

export function FileList({ files, onRemove, selectedId, onSelect }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-1">
      {files.map(entry => (
        <div key={entry.id}>
          <div
            onClick={() => onSelect?.(entry.id)}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors cursor-pointer ${
              selectedId === entry.id
                ? 'border-primary bg-primary/5'
                : 'border-transparent hover:bg-muted/50'
            }`}
          >
            <File className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">{entry.originalName}</span>
            {entry.dbMatch && (
              <Badge variant="outline" className="text-[10px] border-emerald-400 text-emerald-600 gap-1">
                <Database className="h-2.5 w-2.5" />
                Reconocido
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {entry.extension.toUpperCase() || '?'}
            </Badge>
            {entry.detectedVersion && (
              <Badge variant="outline" className="text-xs">
                v{entry.detectedVersion}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={e => {
                e.stopPropagation();
                onRemove(entry.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          {entry.integrityWarning && (
            <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20 px-3 py-2 mx-1 mt-0.5 text-xs text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{entry.integrityWarning}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
