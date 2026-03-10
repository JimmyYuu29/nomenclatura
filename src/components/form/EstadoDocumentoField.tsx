import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { CatalogCombobox, type ComboboxItem } from '@/components/shared/CatalogCombobox';
import { estadosDocumento } from '@/data/estados';

interface EstadoDocumentoFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function EstadoDocumentoField({
  value,
  onChange,
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

  return (
    <div className="space-y-1.5">
      <Label>Estado del Documento</Label>
      <CatalogCombobox
        items={items}
        value={value}
        onSelect={onChange}
        placeholder="Seleccionar estado..."
        searchPlaceholder="Buscar estado..."
        emptyMessage="No se encontró el estado."
        disabled={disabled}
      />
    </div>
  );
}
