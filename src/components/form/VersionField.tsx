import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { MatchRecord } from '@/lib/api-client';

interface VersionFieldProps {
  value: number;
  onChange: (value: number) => void;
  detectedVersion?: number | null;
  suggestedVersion?: number | null;
  matchingRecords?: MatchRecord[];
  disabled?: boolean;
}

export function VersionField({
  value,
  onChange,
  detectedVersion,
  suggestedVersion,
  matchingRecords,
  disabled = false,
}: VersionFieldProps) {
  const [showMatches, setShowMatches] = useState(false);
  const versions = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <Label>Versión</Label>
        {detectedVersion && (
          <Badge variant="outline" className="text-[10px]">
            Detectada: v{detectedVersion}
          </Badge>
        )}
        {suggestedVersion && (
          <Badge
            variant="outline"
            className="text-[10px] border-amber-400 text-amber-600 cursor-pointer hover:bg-amber-50"
            onClick={() => onChange(suggestedVersion)}
          >
            Sugerida: v{suggestedVersion}
          </Badge>
        )}
      </div>
      <Select
        value={String(value)}
        onValueChange={v => { if (v !== null) onChange(parseInt(v, 10)); }}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Versión" />
        </SelectTrigger>
        <SelectContent>
          {versions.map(v => (
            <SelectItem key={v} value={String(v)}>
              v{v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {matchingRecords && matchingRecords.length > 0 && (
        <div>
          <button
            type="button"
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowMatches(!showMatches)}
          >
            {showMatches ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {matchingRecords.length} archivo{matchingRecords.length > 1 ? 's' : ''} relacionado{matchingRecords.length > 1 ? 's' : ''} en la base de datos
          </button>
          {showMatches && (
            <ul className="mt-1 space-y-0.5 text-[10px] text-muted-foreground max-h-24 overflow-y-auto">
              {matchingRecords.map((r, i) => (
                <li key={i} className="font-mono truncate">
                  v{r.version} · {r.filename}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
