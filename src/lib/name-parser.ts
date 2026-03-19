import type { NomenclaturaFields } from '@/types';
import { parseDateYYYYMMDD } from './date-formatter';
import { serviciosAX } from '@/data/servicios-ax';
import { acronimosDocumento } from '@/data/acronimos';
import { estadosDocumento } from '@/data/estados';

/**
 * Intenta parsear un nombre de archivo que ya sigue la nomenclatura.
 * Formato esperado: ALIAS-SERVICIO-PERIODO-ACRONIMO-FECHA-VERSION-ESTADO.ext
 *
 * Devuelve los campos rellenados o null si no se pudo parsear.
 */
export function parseNomenclaturaName(filename: string): Partial<NomenclaturaFields> | null {
  // Quitar extensión
  const baseName = filename.replace(/\.[^.]+$/, '');

  // Patrón: segmentos separados por guiones
  // Al menos 7 segmentos: alias-servicio-periodo-acronimo-fecha-version-estado
  const parts = baseName.split('-');

  if (parts.length < 7) return null;

  // La versión siempre está en la penúltima posición y es vN
  // El estado siempre es el último segmento
  const estadoPart = parts[parts.length - 1];
  const versionPart = parts[parts.length - 2];

  // Validar versión (vN o vNN)
  const versionMatch = versionPart.match(/^[vV](\d{1,3})$/);
  if (!versionMatch) return null;

  // Validar estado
  const estadoValido = estadosDocumento.some(e => e.codigo === estadoPart.toUpperCase());
  if (!estadoValido) return null;

  // Fecha del documento (posición -3 desde el final): YYYYMMDD
  const fechaStr = parts[parts.length - 3];
  const fecha = parseDateYYYYMMDD(fechaStr);

  // El alias es el primer segmento
  const alias = parts[0];

  // Middle parts: everything between alias and fecha
  // Contains: SERVICE, PERIODO, ACRONIMO
  const middleParts = parts.slice(1, parts.length - 3);

  // Find PERIODO: first valid 8-digit date in middle parts
  let periodoLocalIdx = -1;
  for (let i = 0; i < middleParts.length; i++) {
    if (/^\d{8}$/.test(middleParts[i]) && parseDateYYYYMMDD(middleParts[i])) {
      periodoLocalIdx = i;
      break;
    }
  }
  if (periodoLocalIdx < 0) return null;

  // SERVICE: parts before periodo (may contain hyphens, e.g. CON_GRC-ER)
  const servicioParts = middleParts.slice(0, periodoLocalIdx);
  if (servicioParts.length === 0) return null;

  const servicio = servicioParts.join('-');
  const servicioEncontrado = serviciosAX.find(
    s => s.codigo.toUpperCase() === servicio.toUpperCase()
  );
  if (!servicioEncontrado) return null;

  // PERIODO
  const periodoStr = middleParts[periodoLocalIdx];
  const periodo = parseDateYYYYMMDD(periodoStr);

  // ACRONIMO: parts after periodo (within middle)
  const acronimoParts = middleParts.slice(periodoLocalIdx + 1);
  if (acronimoParts.length === 0) return null;

  const acronimoCompleto = acronimoParts.join('-');

  // Intentar separar acrónimo base y sufijo
  const { acronimoBase, acronimoSufijo } = parseAcronimo(acronimoCompleto);

  return {
    aliasCliente: alias,
    servicioAX: servicioEncontrado.codigo,
    periodoServicio: periodo,
    acronimoDocumento: acronimoBase,
    acronimoSufijo: acronimoSufijo,
    fechaDocumento: fecha,
    version: parseInt(versionMatch[1], 10),
    estadoDocumento: estadoPart.toUpperCase(),
  };
}

/**
 * Intenta separar un acrónimo en base + sufijo.
 * Ej: "ACTCOMITE" → { acronimoBase: "ACT", acronimoSufijo: "COMITE" }
 */
export function parseAcronimo(acronimo: string): { acronimoBase: string; acronimoSufijo: string } {
  const upper = acronimo.toUpperCase();

  // Primero intentar coincidencia exacta
  const exactMatch = acronimosDocumento.find(a => a.codigo.toUpperCase() === upper);
  if (exactMatch) {
    return { acronimoBase: exactMatch.codigo, acronimoSufijo: '' };
  }

  // Intentar con acrónimos wildcard (de más largo a más corto)
  const wildcards = acronimosDocumento
    .filter(a => a.wildcard)
    .sort((a, b) => b.codigo.length - a.codigo.length);

  for (const wc of wildcards) {
    const base = wc.codigo.toUpperCase();
    if (upper.startsWith(base)) {
      return {
        acronimoBase: wc.codigo,
        acronimoSufijo: acronimo.slice(base.length),
      };
    }
  }

  // Si no se encontró, devolver como base sin sufijo
  return { acronimoBase: acronimo, acronimoSufijo: '' };
}
