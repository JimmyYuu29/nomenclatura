import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface VersionFieldProps {
  value: number;
  onChange: (value: number) => void;
  detectedVersion?: number | null;
  disabled?: boolean;
}

export function VersionField({
  value,
  onChange,
  detectedVersion,
  disabled = false,
}: VersionFieldProps) {
  const versions = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label>Versión</Label>
        {detectedVersion && (
          <Badge variant="outline" className="text-[10px]">
            Detectada: v{detectedVersion}
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
    </div>
  );
}
