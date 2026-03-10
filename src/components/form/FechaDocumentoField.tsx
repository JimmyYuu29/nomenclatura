import { Label } from '@/components/ui/label';
import { DatePickerField } from '@/components/shared/DatePickerField';

interface FechaDocumentoFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
}

export function FechaDocumentoField({ value, onChange, disabled = false }: FechaDocumentoFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>Fecha del Documento</Label>
      <DatePickerField
        value={value}
        onChange={onChange}
        placeholder="Fecha de emisión"
        disabled={disabled}
      />
    </div>
  );
}
