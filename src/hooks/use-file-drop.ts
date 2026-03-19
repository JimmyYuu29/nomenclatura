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
import { lookupByHash } from '@/lib/api-client';

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

        // Update the hash on the entry
        setFiles(prev =>
          prev.map(f =>
            f.id === entry.id ? { ...f, fileHash: hash } : f
          )
        );

        // Look up by hash in the database
        const result = await lookupByHash(hash);

        if (result?.found && result.record) {
          const dbMatch: DbMatchRecord = {
            hash: result.record.hash,
            filename: result.record.filename,
            alias_cliente: result.record.alias_cliente,
            servicio_ax: result.record.servicio_ax,
            periodo_servicio: result.record.periodo_servicio,
            acronimo: result.record.acronimo,
            fecha_documento: result.record.fecha_documento,
            version: result.record.version,
            estado_documento: result.record.estado_documento,
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
        }
      } catch {
        // Silently ignore — DB may be unavailable
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
