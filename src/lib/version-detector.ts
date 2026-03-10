/**
 * Detecta la versión de un nombre de archivo.
 * Patrones reconocidos: v1, V1, v01, V01, version1, -v1, _v1, (v1)
 * Devuelve el número de versión o null si no se detecta.
 */
export function detectVersion(filename: string): number | null {
  // Quitar extensión para analizar solo el nombre
  const baseName = filename.replace(/\.[^.]+$/, '');

  // Patrones de versión ordenados de más a menos específicos
  const patterns: RegExp[] = [
    /[_\-\s.]?[vV](?:ersion)?[_\-\s.]?(\d{1,3})(?:\b|[_\-\s.]|$)/,
    /\(v(\d{1,3})\)/i,
    /[_\-](\d{1,2})$/,  // solo números al final precedidos por _ o -
  ];

  for (const pattern of patterns) {
    const match = baseName.match(pattern);
    if (match?.[1]) {
      const version = parseInt(match[1], 10);
      if (version >= 1 && version <= 99) {
        return version;
      }
    }
  }

  return null;
}

/**
 * Formatea el número de versión al formato normalizado: v1, v2, etc.
 */
export function formatVersion(version: number): string {
  return `v${version}`;
}
