import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CatalogCombobox, type ComboboxItem } from '@/components/shared/CatalogCombobox';
import { acronimosDocumento } from '@/data/acronimos';

interface AcronimoFieldProps {
  value: string;
  sufijo: string;
  onChangeAcronimo: (value: string) => void;
  onChangeSufijo: (value: string) => void;
  disabled?: boolean;
}

export function AcronimoField({
  value,
  sufijo,
  onChangeAcronimo,
  onChangeSufijo,
  disabled = false,
}: AcronimoFieldProps) {
  const items: ComboboxItem[] = useMemo(
    () =>
      acronimosDocumento.map(a => ({
        value: a.codigo,
        label: a.descripcion,
        description: a.wildcard ? `${a.descripcion} (sufijo variable)` : a.descripcion,
      })),
    []
  );

  const selectedAcronimo = acronimosDocumento.find(
    a => a.codigo === value
  );
  const isWildcard = selectedAcronimo?.wildcard ?? false;

  return (
    <div className="space-y-1.5">
      <Label>Acrónimo del Documento</Label>
      <CatalogCombobox
        items={items}
        value={value}
        onSelect={onChangeAcronimo}
        placeholder="Seleccionar acrónimo..."
        searchPlaceholder="Buscar acrónimo..."
        emptyMessage="No se encontró el acrónimo."
        disabled={disabled}
        renderItem={(item) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{item.value}</span>
            <span className="text-xs text-muted-foreground">{item.label}</span>
            {acronimosDocumento.find(a => a.codigo === item.value)?.wildcard && (
              <Badge variant="outline" className="text-[10px]">*</Badge>
            )}
          </div>
        )}
      />
      {isWildcard && (
        <div className="mt-1.5">
          <Input
            placeholder={`Sufijo para ${value}...`}
            value={sufijo}
            onChange={e => onChangeSufijo(e.target.value.toUpperCase().replace(/[\s\-]/g, ''))}
            disabled={disabled}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Resultado: {value}{sufijo || '___'}
          </p>
        </div>
      )}
    </div>
  );
}
