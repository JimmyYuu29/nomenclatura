import { useState, useCallback, useMemo } from 'react';
import type { NomenclaturaFields, ValidationError } from '@/types';
import { createDefaultFields } from '@/types';
import { validateFields } from '@/lib/validation';
import { buildFileName } from '@/lib/name-builder';

interface UseNomenclaturaFormReturn {
  fields: NomenclaturaFields;
  setField: <K extends keyof NomenclaturaFields>(key: K, value: NomenclaturaFields[K]) => void;
  setFields: (fields: Partial<NomenclaturaFields>) => void;
  resetFields: () => void;
  validationErrors: ValidationError[];
  isValid: boolean;
  generatedName: string;
  generateName: (extension: string) => string;
}

export function useNomenclaturaForm(initialFields?: Partial<NomenclaturaFields>): UseNomenclaturaFormReturn {
  const [fields, setFieldsState] = useState<NomenclaturaFields>(() => ({
    ...createDefaultFields(),
    ...initialFields,
  }));

  const setField = useCallback(<K extends keyof NomenclaturaFields>(key: K, value: NomenclaturaFields[K]) => {
    setFieldsState(prev => ({ ...prev, [key]: value }));
  }, []);

  const setFields = useCallback((partial: Partial<NomenclaturaFields>) => {
    setFieldsState(prev => ({ ...prev, ...partial }));
  }, []);

  const resetFields = useCallback(() => {
    setFieldsState(createDefaultFields());
  }, []);

  const validationErrors = useMemo(() => validateFields(fields), [fields]);
  const isValid = validationErrors.filter(e => e.severity === 'error').length === 0;

  const generatedName = useMemo(() => {
    if (!fields.aliasCliente && !fields.servicioAX) return '';
    return buildFileName(fields, '');
  }, [fields]);

  const generateName = useCallback((extension: string) => {
    return buildFileName(fields, extension);
  }, [fields]);

  return {
    fields,
    setField,
    setFields,
    resetFields,
    validationErrors,
    isValid,
    generatedName,
    generateName,
  };
}
