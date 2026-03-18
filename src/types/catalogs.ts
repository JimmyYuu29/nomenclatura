export type CategoriaServicio =
  | 'SUS' | 'AUD' | 'IES' | 'ECO' | 'GRC' | 'SUB'
  | 'COM' | 'IT' | 'OTA' | 'CFIN' | 'ACC' | 'TAX' | 'LEGAL'
  | 'INTERNAL' | 'ACT' | 'OTHER'
  | 'BC' | 'RF' | 'AUP' | 'ASS' | 'NAS' | 'EXP' | 'CIG';

export interface ServicioAX {
  codigo: string;
  descripcion: string;
  categoria: CategoriaServicio;
  tags: string[];
}

export interface CategoriaInfo {
  codigo: CategoriaServicio;
  nombre: string;
}

export interface AcronimoDocumento {
  codigo: string;
  descripcion: string;
  wildcard: boolean;
  tags: string[];
}

export interface EstadoDocumento {
  codigo: string;
  descripcion: string;
  descripcionCompleta: string;
  transicionesPermitidas: string[];
  esFinal: boolean;
}
