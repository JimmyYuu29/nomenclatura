import { format, parse, isValid } from 'date-fns';

/**
 * Convierte un Date a formato YYYYMMDD.
 */
export function formatDateYYYYMMDD(date: Date | null): string {
  if (!date || !isValid(date)) return '';
  return format(date, 'yyyyMMdd');
}

/**
 * Convierte un Date a formato YYYY (solo año).
 */
export function formatDateYYYY(date: Date | null): string {
  if (!date || !isValid(date)) return '';
  return format(date, 'yyyy');
}

/**
 * Parsea una cadena YYYYMMDD a Date.
 */
export function parseDateYYYYMMDD(dateStr: string): Date | null {
  if (!dateStr || dateStr.length !== 8) return null;
  const parsed = parse(dateStr, 'yyyyMMdd', new Date());
  return isValid(parsed) ? parsed : null;
}

/**
 * Parsea una cadena YYYY a Date (1 de enero de ese año).
 */
export function parseDateYYYY(dateStr: string): Date | null {
  if (!dateStr || dateStr.length !== 4) return null;
  const parsed = parse(dateStr, 'yyyy', new Date());
  return isValid(parsed) ? parsed : null;
}

/**
 * Valida si una cadena es una fecha válida en formato YYYYMMDD.
 */
export function isValidDateString(dateStr: string): boolean {
  return parseDateYYYYMMDD(dateStr) !== null;
}
