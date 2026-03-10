import Fuse, { type IFuseOptions } from 'fuse.js';
import type { ServicioAX, AcronimoDocumento, EstadoDocumento } from '@/types';

/**
 * Crea una instancia de Fuse.js para buscar servicios AX.
 */
export function createServicioSearcher(servicios: ServicioAX[]): Fuse<ServicioAX> {
  const options: IFuseOptions<ServicioAX> = {
    keys: [
      { name: 'codigo', weight: 0.4 },
      { name: 'descripcion', weight: 0.35 },
      { name: 'tags', weight: 0.2 },
      { name: 'categoria', weight: 0.05 },
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
  };
  return new Fuse(servicios, options);
}

/**
 * Crea una instancia de Fuse.js para buscar acrónimos.
 */
export function createAcronimoSearcher(acronimos: AcronimoDocumento[]): Fuse<AcronimoDocumento> {
  const options: IFuseOptions<AcronimoDocumento> = {
    keys: [
      { name: 'codigo', weight: 0.5 },
      { name: 'descripcion', weight: 0.35 },
      { name: 'tags', weight: 0.15 },
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 1,
  };
  return new Fuse(acronimos, options);
}

/**
 * Crea una instancia de Fuse.js para buscar estados.
 */
export function createEstadoSearcher(estados: EstadoDocumento[]): Fuse<EstadoDocumento> {
  const options: IFuseOptions<EstadoDocumento> = {
    keys: [
      { name: 'codigo', weight: 0.5 },
      { name: 'descripcion', weight: 0.3 },
      { name: 'descripcionCompleta', weight: 0.2 },
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 1,
  };
  return new Fuse(estados, options);
}
