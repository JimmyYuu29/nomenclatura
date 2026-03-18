import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_DIR = process.env.DB_PATH || '/home/rootadmin/data/nomenclatura';
const DB_FILE = path.join(DB_DIR, 'nomenclatura.db');

let db: Database.Database | null = null;

export function initDatabase(): boolean {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
    db = new Database(DB_FILE);
    db.pragma('journal_mode = WAL');

    db.exec(`
      CREATE TABLE IF NOT EXISTS file_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash TEXT NOT NULL,
        filename TEXT NOT NULL,
        alias_cliente TEXT NOT NULL,
        servicio_ax TEXT NOT NULL,
        periodo_servicio TEXT NOT NULL,
        acronimo TEXT NOT NULL,
        fecha_documento TEXT NOT NULL,
        version INTEGER NOT NULL,
        estado_documento TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_hash ON file_records(hash);
      CREATE INDEX IF NOT EXISTS idx_base ON file_records(alias_cliente, servicio_ax, periodo_servicio, acronimo);
      CREATE INDEX IF NOT EXISTS idx_filename ON file_records(filename);
    `);

    console.log(`Database initialized at ${DB_FILE}`);
    return true;
  } catch (err) {
    console.error('Failed to initialize database:', err);
    return false;
  }
}

export function getDb(): Database.Database | null {
  return db;
}

export interface FileRecord {
  hash: string;
  filename: string;
  alias_cliente: string;
  servicio_ax: string;
  periodo_servicio: string;
  acronimo: string;
  fecha_documento: string;
  version: number;
  estado_documento: string;
}

export function insertRecord(record: FileRecord): void {
  const stmt = db!.prepare(`
    INSERT INTO file_records (hash, filename, alias_cliente, servicio_ax, periodo_servicio, acronimo, fecha_documento, version, estado_documento)
    VALUES (@hash, @filename, @alias_cliente, @servicio_ax, @periodo_servicio, @acronimo, @fecha_documento, @version, @estado_documento)
  `);
  stmt.run(record);
}

export function findMatches(alias_cliente: string, servicio_ax: string, periodo_servicio: string, acronimo: string) {
  const stmt = db!.prepare(`
    SELECT filename, version, fecha_documento, estado_documento, created_at
    FROM file_records
    WHERE alias_cliente = ? AND servicio_ax = ? AND periodo_servicio = ? AND acronimo = ?
    ORDER BY version DESC
  `);
  return stmt.all(alias_cliente, servicio_ax, periodo_servicio, acronimo);
}

export function verifyByFilename(filename: string) {
  const stmt = db!.prepare(`
    SELECT hash, filename FROM file_records WHERE filename = ? ORDER BY created_at DESC LIMIT 1
  `);
  return stmt.get(filename) as { hash: string; filename: string } | undefined;
}
