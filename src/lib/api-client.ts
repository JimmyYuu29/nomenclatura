const BASE_URL = '/api';

export interface HealthResponse {
  status: string;
  db: boolean;
}

export interface MatchRecord {
  hash: string;
  filename: string;
  version: number;
  fecha_documento: string;
  estado_documento: string;
  created_at: string;
}

export interface LookupByHashResponse {
  found: boolean;
  record: {
    hash: string;
    filename: string;
    alias_cliente: string;
    servicio_ax: string;
    periodo_servicio: string;
    acronimo: string;
    fecha_documento: string;
    version: number;
    estado_documento: string;
  } | null;
}

export interface VerifyResponse {
  found: boolean;
  hashMatch: boolean | null;
  existingHash?: string;
}

export async function checkHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function storeRecord(payload: {
  hash: string;
  filename: string;
  fields: {
    aliasCliente: string;
    servicioAX: string;
    periodoServicio: string;
    acronimoDocumento: string;
    acronimoSufijo?: string;
    fechaDocumento: string;
    version: number;
    estadoDocumento: string;
  };
}): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function findMatches(fields: {
  aliasCliente: string;
  servicioAX: string;
  periodoServicio: string;
  acronimoDocumento: string;
  acronimoSufijo?: string;
}): Promise<MatchRecord[]> {
  try {
    const res = await fetch(`${BASE_URL}/records/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.matches || [];
  } catch {
    return [];
  }
}

export async function lookupByHash(hash: string): Promise<LookupByHashResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/records/lookup-by-hash`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function lookupByFilename(filename: string): Promise<LookupByHashResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/records/lookup-by-filename`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function verifyHash(hash: string, filename: string): Promise<VerifyResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/records/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash, filename }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
