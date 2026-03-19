import { useCallback, useState } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import type { FileEntry, DbMatchRecord } from '@/types';
import { createDefaultFields } from '@/types';
import { extractExtension } from '@/lib/file-utils';
import { detectVersion } from '@/lib/version-detector';
import { parseNomenclaturaName, parseAcronimo } from '@/lib/name-parser';
import { parseDateYYYYMMDD } from '@/lib/date-formatter';
import { computeFileHash } from '@/lib/file-hash';
import { lookupByHash, lookupByFilename } from '@/lib/api-client';
import { buildFileName } from '@/lib/name-builder';

interface UseFileDropReturn {
  files: FileEntry[];
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateFileFields: (id: string, fields: Partial<FileEntry['fields']>) => void;
  getRootProps: ReturnType<typeof useDropzone>['getRootProps'];
  getInputProps: ReturnType<typeof useDropzone>['getInputProps'];
  isDragActive: boolean;
}

function dbRecordToFields(record: DbMatchRecord) {
  const { acronimoBase, acronimoSufijo } = parseAcronimo(record.acronimo);
  return {
    aliasCliente: record.alias_cliente,
    servicioAX: record.servicio_ax,
    periodoServicio: parseDateYYYYMMDD(record.periodo_servicio),
    acronimoDocumento: acronimoBase,
    acronimoSufijo: acronimoSufijo,
    fechaDocumento: parseDateYYYYMMDD(record.fecha_documento),
    version: record.version,
    estadoDocumento: record.estado_documento,
  };
}

export function useFileDrop(): UseFileDropReturn {
  const [files, setFiles] = useState<FileEntry[]>([]);

  const processFile = useCallback((file: File): FileEntry => {
    const extension = extractExtension(file.name);
    const detectedVersion = detectVersion(file.name);
    const parsedFields = parseNomenclaturaName(file.name);

    const fields = parsedFields
      ? { ...createDefaultFields(), ...parsedFields }
      : {
          ...createDefaultFields(),
          ...(detectedVersion ? { version: detectedVersion } : {}),
        };

    return {
      id: uuidv4(),
      file,
      originalName: file.name,
      extension,
      detectedVersion,
      fields,
      generatedName: '',
      isValid: false,
      validationErrors: [],
      integrityWarning: null,
      fileHash: null,
      dbMatch: null,
    };
  }, []);

  const resolveFromDatabase = useCallback(async (entries: FileEntry[]) => {
    for (const entry of entries) {
      try {
        const hash = await computeFileHash(entry.file);

        // Update the hash on the entry immediately
        setFiles(prev =>
          prev.map(f =>
            f.id === entry.id ? { ...f, fileHash: hash } : f
          )
        );

        // Strategy 1: Look up by hash (most accurate — same content)
        const hashResult = await lookupByHash(hash);

        if (hashResult?.found && hashResult.record) {
          const dbMatch: DbMatchRecord = {
            hash: hashResult.record.hash,
            filename: hashResult.record.filename,
            alias_cliente: hashResult.record.alias_cliente,
            servicio_ax: hashResult.record.servicio_ax,
            periodo_servicio: hashResult.record.periodo_servicio,
            acronimo: hashResult.record.acronimo,
            fecha_documento: hashResult.record.fecha_documento,
            version: hashResult.record.version,
            estado_documento: hashResult.record.estado_documento,
          };

          const autoFields = dbRecordToFields(dbMatch);

          setFiles(prev =>
            prev.map(f =>
              f.id === entry.id
                ? {
                    ...f,
                    fileHash: hash,
                    dbMatch,
                    fields: { ...createDefaultFields(), ...autoFields },
                  }
                : f
            )
          );
          continue; // Done — hash matched
        }

        // Strategy 2: Look up by filename (for files with same name but modified content)
        // Try the original filename first, then the nomenclatura-built name from parsed fields
        const filenameCandidates: string[] = [entry.originalName];

        // If filename parsing filled the fields, also try the canonical built name
        const parsedFields = parseNomenclaturaName(entry.originalName);
        if (parsedFields && entry.extension) {
          const builtName = buildFileName(
            { ...createDefaultFields(), ...parsedFields },
            entry.extension
          );
          if (builtName !== entry.originalName) {
            filenameCandidates.push(builtName);
          }
        }

        for (const candidate of filenameCandidates) {
          const fnResult = await lookupByFilename(candidate);
          if (fnResult?.found && fnResult.record) {
            const dbMatch: DbMatchRecord = {
              hash: fnResult.record.hash,
              filename: fnResult.record.filename,
              alias_cliente: fnResult.record.alias_cliente,
              servicio_ax: fnResult.record.servicio_ax,
              periodo_servicio: fnResult.record.periodo_servicio,
              acronimo: fnResult.record.acronimo,
              fecha_documento: fnResult.record.fecha_documento,
              version: fnResult.record.version,
              estado_documento: fnResult.record.estado_documento,
            };

            const autoFields = dbRecordToFields(dbMatch);

            setFiles(prev =>
              prev.map(f =>
                f.id === entry.id
                  ? {
                      ...f,
                      fileHash: hash,
                      dbMatch,
                      fields: { ...createDefaultFields(), ...autoFields },
                    }
                  : f
              )
            );
            break; // Done — filename matched
          }
        }

        // Strategy 3: Filename parsing (already done in processFile — fields are set)
        // Nothing extra needed here.

      } catch (e) {
        console.warn('[nomenclatura] resolveFromDatabase failed for', entry.originalName, e);
      }
    }
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const entries = newFiles.map(processFile);
    setFiles(prev => [...prev, ...entries]);
    resolveFromDatabase(entries);
  }, [processFile, resolveFromDatabase]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const updateFileFields = useCallback((id: string, fieldUpdates: Partial<FileEntry['fields']>) => {
    setFiles(prev =>
      prev.map(f =>
        f.id === id ? { ...f, fields: { ...f.fields, ...fieldUpdates } } : f
      )
    );
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles);
  }, [addFiles]);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    multiple: true,
    noClick: false,
    noKeyboard: true,
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
    updateFileFields,
    getRootProps,
    getInputProps,
    isDragActive,
  };
}
