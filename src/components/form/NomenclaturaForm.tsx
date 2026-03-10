import type { NomenclaturaFields } from '@/types';
import { AliasClienteField } from './AliasClienteField';
import { ServicioAXField } from './ServicioAXField';
import { PeriodoServicioField } from './PeriodoServicioField';
import { AcronimoField } from './AcronimoField';
import { FechaDocumentoField } from './FechaDocumentoField';
import { VersionField } from './VersionField';
import { EstadoDocumentoField } from './EstadoDocumentoField';

interface NomenclaturaFormProps {
  fields: NomenclaturaFields;
  setField: <K extends keyof NomenclaturaFields>(key: K, value: NomenclaturaFields[K]) => void;
  clientSuggestions: string[];
  detectedVersion?: number | null;
  disabled?: boolean;
}

export function NomenclaturaForm({
  fields,
  setField,
  clientSuggestions,
  detectedVersion,
  disabled = false,
}: NomenclaturaFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AliasClienteField
        value={fields.aliasCliente}
        onChange={v => setField('aliasCliente', v)}
        suggestions={clientSuggestions}
        disabled={disabled}
      />
      <ServicioAXField
        value={fields.servicioAX}
        onChange={v => setField('servicioAX', v)}
        disabled={disabled}
      />
      <PeriodoServicioField
        value={fields.periodoServicio}
        onChange={v => setField('periodoServicio', v)}
        disabled={disabled}
      />
      <AcronimoField
        value={fields.acronimoDocumento}
        sufijo={fields.acronimoSufijo}
        onChangeAcronimo={v => setField('acronimoDocumento', v)}
        onChangeSufijo={v => setField('acronimoSufijo', v)}
        disabled={disabled}
      />
      <FechaDocumentoField
        value={fields.fechaDocumento}
        onChange={v => setField('fechaDocumento', v)}
        disabled={disabled}
      />
      <VersionField
        value={fields.version}
        onChange={v => setField('version', v)}
        detectedVersion={detectedVersion}
        disabled={disabled}
      />
      <EstadoDocumentoField
        value={fields.estadoDocumento}
        onChange={v => setField('estadoDocumento', v)}
        disabled={disabled}
      />
    </div>
  );
}
