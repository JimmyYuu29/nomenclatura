import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { CatalogCombobox, type ComboboxItem } from '@/components/shared/CatalogCombobox';
import { serviciosAX } from '@/data/servicios-ax';
import { categorias } from '@/data/categorias';

interface ServicioAXFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ServicioAXField({ value, onChange, disabled = false }: ServicioAXFieldProps) {
  const items: ComboboxItem[] = useMemo(
    () =>
      serviciosAX.map(s => ({
        value: s.codigo,
        label: s.descripcion,
        description: s.descripcion,
        group: categorias.find(c => c.codigo === s.categoria)?.nombre || s.categoria,
      })),
    []
  );

  return (
    <div className="space-y-1.5">
      <Label>Servicio AX</Label>
      <CatalogCombobox
        items={items}
        value={value}
        onSelect={onChange}
        placeholder="Seleccionar servicio..."
        searchPlaceholder="Buscar servicio..."
        emptyMessage="No se encontró el servicio."
        grouped
        disabled={disabled}
      />
    </div>
  );
}
