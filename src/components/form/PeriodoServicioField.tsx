import { Label } from '@/components/ui/label';
import { DatePickerField } from '@/components/shared/DatePickerField';

interface PeriodoServicioFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
}

export function PeriodoServicioField({ value, onChange, disabled = false }: PeriodoServicioFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>Período de Servicio</Label>
      <DatePickerField
        value={value}
        onChange={onChange}
        placeholder="Fecha de cierre del ejercicio"
        disabled={disabled}
      />
      <p className="text-xs text-muted-foreground">
        Fecha de cierre del ejercicio o período auditado
      </p>
    </div>
  );
}
