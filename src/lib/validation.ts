import type { NomenclaturaFields, ValidationError } from '@/types';
import { serviciosAX } from '@/data/servicios-ax';
import { acronimosDocumento } from '@/data/acronimos';
import { estadosDocumento } from '@/data/estados';
import { formatDateYYYYMMDD } from './date-formatter';

/**
 * Ejecuta todas las reglas de validación (R1-R10) sobre los campos.
 * Devuelve un array de errores de validación.
 */
export function validateFields(fields: NomenclaturaFields): ValidationError[] {
  const errors: ValidationError[] = [];

  // R1: Alias cliente obligatorio, sin espacios ni guiones
  if (!fields.aliasCliente.trim()) {
    errors.push({
      ruleId: 'R1',
      field: 'aliasCliente',
      message: 'El alias del cliente es obligatorio',
      severity: 'error',
    });
  } else if (/[\s\-]/.test(fields.aliasCliente.trim())) {
    errors.push({
      ruleId: 'R1',
      field: 'aliasCliente',
      message: 'El alias no puede contener espacios ni guiones',
      severity: 'error',
    });
  }

  // R2: Servicio AX obligatorio y válido
  if (!fields.servicioAX) {
    errors.push({
      ruleId: 'R2',
      field: 'servicioAX',
      message: 'El servicio AX es obligatorio',
      severity: 'error',
    });
  } else {
    const servicioValido = serviciosAX.some(
      s => s.codigo.toUpperCase() === fields.servicioAX.toUpperCase()
    );
    if (!servicioValido) {
      errors.push({
        ruleId: 'R2',
        field: 'servicioAX',
        message: 'El servicio AX seleccionado no es válido',
        severity: 'error',
      });
    }
  }

  // R3: Período de servicio obligatorio y en formato YYYYMMDD
  if (!fields.periodoServicio) {
    errors.push({
      ruleId: 'R3',
      field: 'periodoServicio',
      message: 'El período de servicio es obligatorio',
      severity: 'error',
    });
  } else {
    const dateStr = formatDateYYYYMMDD(fields.periodoServicio);
    if (!dateStr || dateStr.length !== 8) {
      errors.push({
        ruleId: 'R3',
        field: 'periodoServicio',
        message: 'La fecha del período debe tener formato YYYYMMDD',
        severity: 'error',
      });
    }
  }

  // R4: Acrónimo de documento obligatorio y válido
  if (!fields.acronimoDocumento) {
    errors.push({
      ruleId: 'R4',
      field: 'acronimoDocumento',
      message: 'El acrónimo del documento es obligatorio',
      severity: 'error',
    });
  } else {
    const acronimo = acronimosDocumento.find(
      a => a.codigo.toUpperCase() === fields.acronimoDocumento.toUpperCase()
    );
    if (!acronimo) {
      errors.push({
        ruleId: 'R4',
        field: 'acronimoDocumento',
        message: 'El acrónimo seleccionado no es válido',
        severity: 'warning',
      });
    } else if (acronimo.wildcard && !fields.acronimoSufijo.trim()) {
      errors.push({
        ruleId: 'R4',
        field: 'acronimoDocumento',
        message: `El acrónimo ${acronimo.codigo} requiere un sufijo adicional`,
        severity: 'warning',
      });
    }
  }

  // R5: Fecha del documento obligatoria y en formato YYYYMMDD
  if (!fields.fechaDocumento) {
    errors.push({
      ruleId: 'R5',
      field: 'fechaDocumento',
      message: 'La fecha del documento es obligatoria',
      severity: 'error',
    });
  } else {
    const dateStr = formatDateYYYYMMDD(fields.fechaDocumento);
    if (!dateStr || dateStr.length !== 8) {
      errors.push({
        ruleId: 'R5',
        field: 'fechaDocumento',
        message: 'La fecha del documento debe tener formato YYYYMMDD',
        severity: 'error',
      });
    }
  }

  // R6: Versión obligatoria, entre 1 y 99
  if (fields.version < 1 || fields.version > 99) {
    errors.push({
      ruleId: 'R6',
      field: 'version',
      message: 'La versión debe estar entre 1 y 99',
      severity: 'error',
    });
  }

  // R7: Estado del documento obligatorio y válido
  if (!fields.estadoDocumento) {
    errors.push({
      ruleId: 'R7',
      field: 'estadoDocumento',
      message: 'El estado del documento es obligatorio',
      severity: 'error',
    });
  } else {
    const estadoValido = estadosDocumento.some(
      e => e.codigo === fields.estadoDocumento
    );
    if (!estadoValido) {
      errors.push({
        ruleId: 'R7',
        field: 'estadoDocumento',
        message: 'El estado seleccionado no es válido',
        severity: 'error',
      });
    }
  }

  // R8: No se permiten espacios en ningún segmento
  const segmentos = [
    fields.aliasCliente,
    fields.servicioAX,
    fields.acronimoDocumento,
    fields.acronimoSufijo,
    fields.estadoDocumento,
  ];
  for (const seg of segmentos) {
    if (/\s/.test(seg)) {
      errors.push({
        ruleId: 'R8',
        field: 'general',
        message: 'Los segmentos no pueden contener espacios en blanco',
        severity: 'error',
      });
      break;
    }
  }

  // R9: Separador debe ser exclusivamente guión (-)
  // Esta regla se aplica en el builder, no en la validación de campos

  // R10: Estado DEF/FDO no puede retroceder
  // Esta regla se aplica mediante transiciones de estado permitidas

  return errors;
}

/**
 * Verifica si una transición de estado es válida.
 */
export function isValidTransition(fromEstado: string, toEstado: string): boolean {
  if (!fromEstado || fromEstado === toEstado) return true;
  const estado = estadosDocumento.find(e => e.codigo === fromEstado);
  if (!estado) return true;
  return estado.transicionesPermitidas.includes(toEstado);
}

/**
 * Obtiene los estados permitidos desde un estado dado.
 */
export function getAllowedTransitions(currentEstado: string): string[] {
  if (!currentEstado) return estadosDocumento.map(e => e.codigo);
  const estado = estadosDocumento.find(e => e.codigo === currentEstado);
  if (!estado) return estadosDocumento.map(e => e.codigo);
  return estado.transicionesPermitidas;
}
