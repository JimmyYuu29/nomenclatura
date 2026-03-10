import type { NomenclaturaFields } from '@/types';
import { buildNameSegments } from '@/lib/name-builder';
import { SEGMENT_COLORS } from '@/constants/colors';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NamePreviewProps {
  fields: NomenclaturaFields;
  extension: string;
}

export function NamePreview({ fields, extension }: NamePreviewProps) {
  const segments = buildNameSegments(fields);
  const hasContent = fields.aliasCliente || fields.servicioAX;

  if (!hasContent) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        Rellena los campos para ver la vista previa del nombre
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Nombre completo */}
      <div className="rounded-lg border bg-muted/30 p-3">
        <p className="mb-1 text-xs font-medium text-muted-foreground">Vista previa</p>
        <div className="flex flex-wrap items-center gap-0.5 font-mono text-sm">
          {segments.map((seg, i) => {
            const colors = SEGMENT_COLORS[seg.key] || SEGMENT_COLORS.aliasCliente;
            return (
              <span key={seg.key} className="flex items-center">
                <span
                  className={cn(
                    'rounded px-1 py-0.5',
                    colors.bg,
                    colors.text
                  )}
                >
                  {seg.value}
                </span>
                {i < segments.length - 1 && (
                  <span className="text-muted-foreground">-</span>
                )}
              </span>
            );
          })}
          {extension && (
            <span className="text-muted-foreground">.{extension}</span>
          )}
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-2">
        {segments.map(seg => {
          const colors = SEGMENT_COLORS[seg.key] || SEGMENT_COLORS.aliasCliente;
          return (
            <Badge
              key={seg.key}
              variant="outline"
              className={cn('text-[10px]', colors.border, colors.text)}
            >
              {seg.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
