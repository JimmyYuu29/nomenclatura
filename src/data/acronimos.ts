import type { AcronimoDocumento } from '@/types';

const STORAGE_KEY = 'nomenclatura_custom_acronimos';

const defaultAcronimosDocumento: AcronimoDocumento[] = [
  { codigo: 'CACEPNARM', descripcion: 'Carta de Aceptación Nombramiento como Auditor para RM', wildcard: false, tags: ['carta', 'aceptacion', 'nombramiento', 'auditor', 'RM'] },
  { codigo: 'ACKAPPx', descripcion: 'Acknowledgement Appendix X', wildcard: false, tags: ['acknowledgement', 'appendix', 'aprobacion'] },
  { codigo: 'ACT', descripcion: 'Acta', wildcard: true, tags: ['acta', 'actas'] },
  { codigo: 'C', descripcion: 'Carta', wildcard: true, tags: ['carta', 'certificado'] },
  { codigo: 'CACT', descripcion: 'Carta de Actas', wildcard: false, tags: ['carta', 'actas'] },
  { codigo: 'CCAA', descripcion: 'Cuentas Anuales', wildcard: false, tags: ['cuentas anuales'] },
  { codigo: 'EF', descripcion: 'Estados Financieros', wildcard: false, tags: ['estados financieros'] },
  { codigo: 'BCE', descripcion: 'Balance', wildcard: false, tags: ['balance'] },
  { codigo: 'CM', descripcion: 'Carta de Manifestaciones', wildcard: false, tags: ['carta', 'manifestaciones'] },
  { codigo: 'CRI', descripcion: 'Carta Recepción de Informe', wildcard: false, tags: ['carta', 'recepcion', 'informe'] },
  { codigo: 'CSEFF', descripcion: 'Carta solicitud Estados financieros formulados', wildcard: false, tags: ['carta', 'solicitud', 'estados financieros', 'formulados'] },
  { codigo: 'CEIA', descripcion: 'Carta envío borrador informe auditoría', wildcard: false, tags: ['carta', 'envio', 'borrador', 'informe', 'auditoria'] },
  { codigo: 'CE', descripcion: 'Carta de encargo / Contrato', wildcard: false, tags: ['carta', 'encargo', 'contrato'] },
  { codigo: 'CEIACA', descripcion: 'Carta envío Informe Adicional a la Comisión de Auditoría', wildcard: false, tags: ['carta', 'envio', 'informe', 'comision', 'auditoria'] },
  { codigo: 'EFRM', descripcion: 'Formularios Estados Financieros Registro Mercantil', wildcard: false, tags: ['formularios', 'estados financieros', 'registro mercantil'] },
  { codigo: 'FAX', descripcion: 'Fax', wildcard: true, tags: ['fax'] },
  { codigo: 'IA', descripcion: 'Informe auditoría', wildcard: false, tags: ['informe', 'auditoria'] },
  { codigo: 'IACA', descripcion: 'Informe Adicional a la Comisión de Auditoría', wildcard: false, tags: ['informe', 'adicional', 'comision', 'auditoria'] },
  { codigo: 'IECCA', descripcion: 'Informe Especial y Complementario al de Auditoria de Cuentas Anuales', wildcard: false, tags: ['informe', 'especial', 'complementario', 'auditoria', 'cuentas anuales'] },
  { codigo: 'IE', descripcion: 'Informe Especial', wildcard: true, tags: ['informe', 'especial'] },
  { codigo: 'IPA', descripcion: 'Informe Procedimientos Acordados', wildcard: true, tags: ['informe', 'procedimientos', 'acordados'] },
  { codigo: 'INF', descripcion: 'Informe', wildcard: false, tags: ['informe'] },
  { codigo: 'MAIL', descripcion: 'e_mail', wildcard: true, tags: ['correo', 'email', 'mail'] },
  { codigo: 'ACTNA', descripcion: 'Acta nombramiento como auditor', wildcard: false, tags: ['acta', 'nombramiento', 'auditor'] },
  { codigo: 'NSFY', descripcion: 'Nota Síntesis Full Year', wildcard: false, tags: ['nota', 'sintesis', 'full year'] },
  { codigo: 'NSHY', descripcion: 'Nota Síntesis Half Year', wildcard: false, tags: ['nota', 'sintesis', 'half year'] },
  { codigo: 'NSIN', descripcion: 'Nota Síntesis Interino', wildcard: false, tags: ['nota', 'sintesis', 'interino'] },
  { codigo: 'NSHC', descripcion: 'Nota Síntesis Hard Close', wildcard: false, tags: ['nota', 'sintesis', 'hard close'] },
  { codigo: 'PROCOM', descripcion: 'Propuesta comercial', wildcard: false, tags: ['propuesta', 'comercial'] },
  { codigo: 'PRERGE', descripcion: 'Presentación a Responsables de Gobierno de la Entidad', wildcard: false, tags: ['presentacion', 'responsables', 'gobierno', 'entidad'] },
  { codigo: 'QCONTENC', descripcion: 'Cuestionario continuidad encargo', wildcard: false, tags: ['cuestionario', 'continuidad', 'encargo'] },
  { codigo: 'QACEPENC', descripcion: 'Cuestionario aceptación encargo', wildcard: false, tags: ['cuestionario', 'aceptacion', 'encargo'] },
  { codigo: 'QRISKCLI', descripcion: 'Cuestionario riesgo cliente', wildcard: false, tags: ['cuestionario', 'riesgo', 'cliente'] },
  { codigo: 'QKYC', descripcion: 'Cuestionario Know Your Client', wildcard: false, tags: ['cuestionario', 'know your client', 'KYC'] },
  { codigo: 'DOI', descripcion: 'Declaración Objetividad e Independencia', wildcard: false, tags: ['declaracion', 'objetividad', 'independencia'] },
];

function loadCustomAcronimos(): AcronimoDocumento[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCustomAcronimos(items: AcronimoDocumento[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getAcronimosDocumento(): AcronimoDocumento[] {
  const custom = loadCustomAcronimos();
  if (custom.length === 0) return defaultAcronimosDocumento;
  const merged = [...defaultAcronimosDocumento];
  for (const c of custom) {
    const idx = merged.findIndex(m => m.codigo === c.codigo);
    if (idx >= 0) merged[idx] = c;
    else merged.push(c);
  }
  return merged;
}

export const acronimosDocumento: AcronimoDocumento[] = defaultAcronimosDocumento;
