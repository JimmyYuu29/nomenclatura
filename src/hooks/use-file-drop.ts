import { useCallback, useState } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import type { FileEntry } from '@/types';
import { createDefaultFields } from '@/types';
import { extractExtension } from '@/lib/file-utils';
import { detectVersion } from '@/lib/version-detector';
import { parseNomenclaturaName } from '@/lib/name-parser';

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
    };
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const entries = newFiles.map(processFile);
    setFiles(prev => [...prev, ...entries]);
  }, [processFile]);

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
    noKeyboard: false,
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
