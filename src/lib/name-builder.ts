import type { NomenclaturaFields } from '@/types';
import { formatDateYYYYMMDD } from './date-formatter';
import { formatVersion } from './version-detector';

/**
 * Construye el nombre final del archivo a partir de los 7 campos + extensión.
 * Formato: <ALIAS>-<SERVICIO>-<PERIODO>-<ACRONIMO>-<FECHA>-<VERSION>-<ESTADO>.<ext>
 */
export function buildFileName(fields: NomenclaturaFields, extension: string): string {
  const parts = [
    normalizeSegment(fields.aliasCliente),
    normalizeSegment(fields.servicioAX),
    formatDateYYYYMMDD(fields.periodoServicio),
    buildAcronimo(fields.acronimoDocumento, fields.acronimoSufijo),
    formatDateYYYYMMDD(fields.fechaDocumento),
    formatVersion(fields.version),
    fields.estadoDocumento,
  ];

  const name = parts.join('-');
  return extension ? `${name}.${extension}` : name;
}

/**
 * Construye el acrónimo con sufijo si aplica.
 * Ej: "ACT" + "COMITE" → "ACTCOMITE"
 */
function buildAcronimo(acronimo: string, sufijo: string): string {
  const base = normalizeSegment(acronimo);
  const suf = normalizeSegment(sufijo);
  return suf ? `${base}${suf}` : base;
}

/**
 * Normaliza un segmento: elimina espacios, convierte a mayúsculas.
 */
function normalizeSegment(value: string): string {
  return value.trim().replace(/\s+/g, '').toUpperCase();
}

/**
 * Genera un nombre de vista previa con segmentos coloreados.
 * Devuelve un array de objetos con texto y clave de color.
 */
export interface NameSegment {
  key: string;
  value: string;
  label: string;
}

export function buildNameSegments(fields: NomenclaturaFields): NameSegment[] {
  return [
    { key: 'aliasCliente', value: normalizeSegment(fields.aliasCliente) || '___', label: 'Alias cliente' },
    { key: 'servicioAX', value: normalizeSegment(fields.servicioAX) || '___', label: 'Servicio AX' },
    { key: 'periodoServicio', value: formatDateYYYYMMDD(fields.periodoServicio) || '________', label: 'Período servicio' },
    { key: 'acronimoDocumento', value: buildAcronimo(fields.acronimoDocumento, fields.acronimoSufijo) || '___', label: 'Acrónimo' },
    { key: 'fechaDocumento', value: formatDateYYYYMMDD(fields.fechaDocumento) || '________', label: 'Fecha documento' },
    { key: 'version', value: formatVersion(fields.version), label: 'Versión' },
    { key: 'estadoDocumento', value: fields.estadoDocumento || '___', label: 'Estado' },
  ];
}
