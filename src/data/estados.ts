import type { EstadoDocumento } from '@/types';

export const estadosDocumento: EstadoDocumento[] = [
  {
    codigo: 'DRF',
    descripcion: 'Borrador',
    descripcionCompleta: 'Draft – Documento en fase de redacción inicial',
    transicionesPermitidas: ['REV'],
    esFinal: false,
  },
  {
    codigo: 'REV',
    descripcion: 'En revisión',
    descripcionCompleta: 'Review – Documento enviado para revisión por un superior o par',
    transicionesPermitidas: ['OBS', 'APR'],
    esFinal: false,
  },
  {
    codigo: 'OBS',
    descripcion: 'Observaciones',
    descripcionCompleta: 'Observations – Revisión devuelta con comentarios u observaciones pendientes',
    transicionesPermitidas: ['REV'],
    esFinal: false,
  },
  {
    codigo: 'APR',
    descripcion: 'Aprobado',
    descripcionCompleta: 'Approved – Documento aprobado internamente, pendiente de emisión definitiva',
    transicionesPermitidas: ['DEF'],
    esFinal: false,
  },
  {
    codigo: 'DEF',
    descripcion: 'Definitivo',
    descripcionCompleta: 'Definitive – Versión definitiva emitida; no admite modificaciones de contenido',
    transicionesPermitidas: ['FDO'],
    esFinal: false,
  },
  {
    codigo: 'FDO',
    descripcion: 'Firmado',
    descripcionCompleta: 'Signed – Documento con firma(s) electrónica(s) o manuscrita(s) válida(s)',
    transicionesPermitidas: ['VIG'],
    esFinal: false,
  },
  {
    codigo: 'VIG',
    descripcion: 'Vigente',
    descripcionCompleta: 'Vigente – Documento actualmente en vigor y con efectos legales/normativos',
    transicionesPermitidas: ['SUS', 'OBSOL'],
    esFinal: false,
  },
  {
    codigo: 'SUS',
    descripcion: 'Suspendido',
    descripcionCompleta: 'Suspended – Vigencia temporalmente suspendida por decisión interna o externa',
    transicionesPermitidas: ['VIG', 'OBSOL'],
    esFinal: false,
  },
  {
    codigo: 'OBSOL',
    descripcion: 'Obsoleto',
    descripcionCompleta: 'Obsolete – Documento reemplazado por una versión posterior; conservar para trazabilidad',
    transicionesPermitidas: ['ARC'],
    esFinal: false,
  },
  {
    codigo: 'ARC',
    descripcion: 'Archivado',
    descripcionCompleta: 'Archived – Documento almacenado a largo plazo; solo lectura, sin modificaciones ni transiciones',
    transicionesPermitidas: [],
    esFinal: true,
  },
];
