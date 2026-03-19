export interface NomenclaturaFields {
  aliasCliente: string;
  servicioAX: string;
  periodoServicio: Date | null;
  acronimoDocumento: string;
  acronimoSufijo: string;
  fechaDocumento: Date | null;
  version: number;
  estadoDocumento: string;
}

export interface DbMatchRecord {
  hash: string;
  filename: string;
  alias_cliente: string;
  servicio_ax: string;
  periodo_servicio: string;
  acronimo: string;
  fecha_documento: string;
  version: number;
  estado_documento: string;
}

export interface FileEntry {
  id: string;
  file: File;
  originalName: string;
  extension: string;
  detectedVersion: number | null;
  fields: NomenclaturaFields;
  generatedName: string;
  isValid: boolean;
  validationErrors: ValidationError[];
  integrityWarning?: string | null;
  fileHash: string | null;
  dbMatch: DbMatchRecord | null;
}

export interface ValidationError {
  ruleId: string;
  field: keyof NomenclaturaFields | 'general';
  message: string;
  severity: 'error' | 'warning';
}

export type AppMode = 'single' | 'batch';

export function createDefaultFields(): NomenclaturaFields {
  return {
    aliasCliente: '',
    servicioAX: '',
    periodoServicio: null,
    acronimoDocumento: '',
    acronimoSufijo: '',
    fechaDocumento: new Date(),
    version: 1,
    estadoDocumento: 'DRF',
  };
}
