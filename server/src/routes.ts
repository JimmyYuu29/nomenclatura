import { Router } from 'express';
import { getDb, insertRecord, findMatches, findByHash, verifyByFilename } from './db.js';
import type { FileRecord } from './db.js';

export const router = Router();

router.get('/health', (_req, res) => {
  const db = getDb();
  res.json({ status: 'ok', db: db !== null });
});

router.post('/records', (req, res) => {
  try {
    const { hash, filename, fields } = req.body as {
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
    };

    if (!hash || !filename || !fields) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const acronimo = fields.acronimoSufijo
      ? `${fields.acronimoDocumento}${fields.acronimoSufijo}`
      : fields.acronimoDocumento;

    const record: FileRecord = {
      hash,
      filename,
      alias_cliente: fields.aliasCliente.toUpperCase(),
      servicio_ax: fields.servicioAX.toUpperCase(),
      periodo_servicio: fields.periodoServicio,
      acronimo: acronimo.toUpperCase(),
      fecha_documento: fields.fechaDocumento,
      version: fields.version,
      estado_documento: fields.estadoDocumento.toUpperCase(),
    };

    insertRecord(record);
    res.json({ success: true });
  } catch (err) {
    console.error('Error storing record:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/records/match', (req, res) => {
  try {
    const { aliasCliente, servicioAX, periodoServicio, acronimoDocumento, acronimoSufijo } = req.body as {
      aliasCliente: string;
      servicioAX: string;
      periodoServicio: string;
      acronimoDocumento: string;
      acronimoSufijo?: string;
    };

    if (!aliasCliente || !servicioAX || !periodoServicio || !acronimoDocumento) {
      res.json({ matches: [] });
      return;
    }

    const acronimo = acronimoSufijo
      ? `${acronimoDocumento}${acronimoSufijo}`
      : acronimoDocumento;

    const matches = findMatches(
      aliasCliente.toUpperCase(),
      servicioAX.toUpperCase(),
      periodoServicio,
      acronimo.toUpperCase()
    );

    res.json({ matches });
  } catch (err) {
    console.error('Error finding matches:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/records/lookup-by-hash', (req, res) => {
  try {
    const { hash } = req.body as { hash: string };

    if (!hash) {
      res.status(400).json({ error: 'Missing hash' });
      return;
    }

    const record = findByHash(hash);

    if (!record) {
      res.json({ found: false, record: null });
      return;
    }

    res.json({ found: true, record });
  } catch (err) {
    console.error('Error looking up by hash:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/records/verify', (req, res) => {
  try {
    const { hash, filename } = req.body as { hash: string; filename: string };

    if (!hash || !filename) {
      res.status(400).json({ error: 'Missing hash or filename' });
      return;
    }

    const record = verifyByFilename(filename);

    if (!record) {
      res.json({ found: false, hashMatch: null });
      return;
    }

    res.json({
      found: true,
      hashMatch: record.hash === hash,
      existingHash: record.hash,
    });
  } catch (err) {
    console.error('Error verifying hash:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
