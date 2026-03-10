import type { EstadoDocumento } from '@/types';

const STORAGE_KEY = 'nomenclatura_custom_estados';

const defaultEstadosDocumento: EstadoDocumento[] = [
  {
    codigo: 'DRF',
    descripcion: 'Borrador',
    descripcionCompleta: 'Borrador (Draft) Documento en fase inicial de redacción. Puede sufrir modificaciones estructurales o de contenido. No válido para uso operativo.',
    transicionesPermitidas: ['REV'],
    esFinal: false,
  },
  {
    codigo: 'REV',
    descripcion: 'En revisión',
    descripcionCompleta: 'En revisión. Documento en proceso de validación por parte de responsables designados (IT, Legal, Compliance, Dirección, etc.).',
    transicionesPermitidas: ['OBS', 'APR'],
    esFinal: false,
  },
  {
    codigo: 'OBS',
    descripcion: 'Con observaciones',
    descripcionCompleta: 'Con observaciones. Documento revisado que requiere ajustes antes de su aprobación. Contiene comentarios pendientes de resolver.',
    transicionesPermitidas: ['REV'],
    esFinal: false,
  },
  {
    codigo: 'APR',
    descripcion: 'Aprobado',
    descripcionCompleta: 'Aprobado. Documento validado formalmente por el responsable designado. Pendiente de firma si aplica.',
    transicionesPermitidas: ['DEF'],
    esFinal: false,
  },
  {
    codigo: 'DEF',
    descripcion: 'Definitivo',
    descripcionCompleta: 'Definitivo. Versión final aprobada y publicada. Vigente para su aplicación.',
    transicionesPermitidas: ['FDO'],
    esFinal: false,
  },
  {
    codigo: 'FDO',
    descripcion: 'Firmado',
    descripcionCompleta: 'Firmado. Documento formalmente firmado por la Dirección o responsable autorizado. Tiene validez oficial.',
    transicionesPermitidas: ['VIG'],
    esFinal: false,
  },
  {
    codigo: 'VIG',
    descripcion: 'Vigente',
    descripcionCompleta: 'Vigente. Documento actualmente en aplicación dentro de la organización.',
    transicionesPermitidas: ['SUS', 'OBSOL'],
    esFinal: false,
  },
  {
    codigo: 'SUS',
    descripcion: 'Suspendido',
    descripcionCompleta: 'Suspendido. Documento temporalmente fuera de aplicación.',
    transicionesPermitidas: ['VIG', 'OBSOL'],
    esFinal: false,
  },
  {
    codigo: 'OBSOL',
    descripcion: 'Obsoleto',
    descripcionCompleta: 'Obsoleto. Documento retirado oficialmente y sustituido por una nueva versión.',
    transicionesPermitidas: ['ARC'],
    esFinal: false,
  },
  {
    codigo: 'ARC',
    descripcion: 'Archivado',
    descripcionCompleta: 'Archivado. Documento histórico sin vigencia operativa, conservado por requisitos legales o normativos.',
    transicionesPermitidas: [],
    esFinal: true,
  },
];

function loadCustomEstados(): EstadoDocumento[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCustomEstados(items: EstadoDocumento[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getEstadosDocumento(): EstadoDocumento[] {
  const custom = loadCustomEstados();
  if (custom.length === 0) return defaultEstadosDocumento;
  const merged = [...defaultEstadosDocumento];
  for (const c of custom) {
    const idx = merged.findIndex(m => m.codigo === c.codigo);
    if (idx >= 0) merged[idx] = c;
    else merged.push(c);
  }
  return merged;
}

export const estadosDocumento: EstadoDocumento[] = defaultEstadosDocumento;
