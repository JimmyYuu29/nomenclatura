/**
 * Extrae la extensión de un nombre de archivo (sin el punto).
 * Ej: "informe.pdf" → "pdf"
 */
export function extractExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === filename.length - 1) return '';
  return filename.slice(lastDot + 1).toLowerCase();
}

/**
 * Extrae el nombre base sin extensión.
 * Ej: "informe.pdf" → "informe"
 */
export function extractBaseName(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return filename;
  return filename.slice(0, lastDot);
}
