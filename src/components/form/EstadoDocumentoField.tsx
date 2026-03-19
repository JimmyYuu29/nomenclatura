import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CatalogCombobox, type ComboboxItem } from '@/components/shared/CatalogCombobox';
import { estadosDocumento } from '@/data/estados';
import type { HashComparison } from '@/hooks/use-version-suggestion';

interface EstadoDocumentoFieldProps {
  value: string;
  onChange: (value: string) => void;
  hashComparison?: HashComparison | null;
  disabled?: boolean;
}

export function EstadoDocumentoField({
  value,
  onChange,
  hashComparison,
  disabled = false,
}: EstadoDocumentoFieldProps) {
  const items: ComboboxItem[] = useMemo(
    () =>
      estadosDocumento.map(e => ({
        value: e.codigo,
        label: e.descripcion,
        description: e.descripcionCompleta,
      })),
    []
  );

  const showEstadoHint = hashComparison && hashComparison.matchedEstado && hashComparison.matchedEstado !== value;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <Label>Estado del Documento</Label>
        {hashComparison?.hashMatched && hashComparison.matchedEstado && (
          <Badge
            variant="outline"
            className="text-[10px] border-emerald-400 text-emerald-600 cursor-pointer hover:bg-emerald-50"
            onClick={() => onChange(hashComparison.matchedEstado!)}
          >
            BD: {hashComparison.matchedEstado}
          </Badge>
        )}
        {hashComparison && !hashComparison.hashMatched && hashComparison.matchedEstado == null && (
          <Badge
            variant="outline"
            className="text-[10px] border-amber-400 text-amber-600"
          >
            Contenido modificado — verificar estado
          </Badge>
        )}
      </div>
      <CatalogCombobox
        items={items}
        value={value}
        onSelect={onChange}
        placeholder="Seleccionar estado..."
        searchPlaceholder="Buscar estado..."
        emptyMessage="No se encontró el estado."
        disabled={disabled}
      />
      {showEstadoHint && (
        <p className="text-[10px] text-amber-600">
          Estado en BD: {hashComparison.matchedEstado} — estado actual: {value}
        </p>
      )}
    </div>
  );
}
