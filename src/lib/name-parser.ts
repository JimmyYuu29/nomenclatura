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

  // El alias es el primer segmento
  const alias = parts[0];

  // Buscar el servicio AX (puede contener guiones bajos pero no guiones en la nomenclatura)
  // El servicio está en la posición 1 y puede ser compuesto (AUD_CAOIN)
  // Intentamos buscar servicio en posición 1
  let servicioIdx = 1;
  let servicio = parts[servicioIdx];

  // Verificar si el servicio existe en el catálogo
  const servicioEncontrado = serviciosAX.find(
    s => s.codigo.toUpperCase() === servicio.toUpperCase()
  );

  if (!servicioEncontrado) {
    // Intentar combinar partes con guion bajo (puede ser que el servicio tenga guiones bajos
    // que se representan como guiones en la nomenclatura, pero según la norma se mantienen
    // los guiones bajos dentro del código)
    return null;
  }

  // Periodo de servicio (posición 2): YYYYMMDD
  const periodoStr = parts[2];
  const periodo = parseDateYYYYMMDD(periodoStr);
  if (!periodo && periodoStr.length !== 8) return null;

  // Fecha del documento (posición -3 desde el final): YYYYMMDD
  const fechaIdx = parts.length - 3;
  const fechaStr = parts[fechaIdx];
  const fecha = parseDateYYYYMMDD(fechaStr);

  // Acrónimo: todo lo que está entre periodo y fecha
  const acronimoParts = parts.slice(3, fechaIdx);
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
function parseAcronimo(acronimo: string): { acronimoBase: string; acronimoSufijo: string } {
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
