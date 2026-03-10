/**
 * Mensajes de validación en español para la interfaz.
 */
export const VALIDATION_MESSAGES = {
  R1: 'R1: El alias del cliente es obligatorio y no debe contener espacios ni guiones',
  R2: 'R2: El servicio AX debe ser un código válido del catálogo',
  R3: 'R3: El período de servicio debe ser una fecha válida (YYYYMMDD)',
  R4: 'R4: El acrónimo debe ser un código válido del catálogo',
  R5: 'R5: La fecha del documento debe ser una fecha válida (YYYYMMDD)',
  R6: 'R6: La versión debe estar entre 1 y 99',
  R7: 'R7: El estado del documento debe ser un código válido',
  R8: 'R8: Ningún segmento puede contener espacios en blanco',
  R9: 'R9: El separador entre campos es exclusivamente el guión (-)',
  R10: 'R10: Los estados DEF y FDO no pueden retroceder a estados anteriores',
} as const;

export const UI_MESSAGES = {
  dropzoneDefault: 'Arrastra archivos aquí o haz clic para seleccionar',
  dropzoneActive: 'Suelta los archivos aquí...',
  dropzoneReject: 'Tipo de archivo no permitido',
  noFiles: 'No hay archivos seleccionados',
  renameSuccess: 'Archivo renombrado correctamente',
  renameError: 'Error al renombrar el archivo',
  batchSuccess: 'Todos los archivos renombrados correctamente',
  historyEmpty: 'No hay entradas en el historial',
  exportSuccess: 'Datos exportados correctamente',
  importSuccess: 'Datos importados correctamente',
  importError: 'Error al importar los datos',
  confirmClearHistory: '¿Estás seguro de que quieres borrar todo el historial?',
  wildcardHint: 'Este acrónimo requiere un sufijo adicional',
} as const;
