import { useState, useCallback, useMemo } from 'react';
import { AlertCircle, Download, Loader2, RotateCcw } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Header } from '@/components/layout/Header';
import { FileDropZone } from '@/components/dropzone/FileDropZone';
import { FileList } from '@/components/dropzone/FileList';
import { NomenclaturaForm } from '@/components/form/NomenclaturaForm';
import { NamePreview } from '@/components/preview/NamePreview';
import { ValidationStatus } from '@/components/preview/ValidationStatus';
import { BatchRenamePanel } from '@/components/batch/BatchRenamePanel';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { CatalogUploadDialog } from '@/components/catalog/CatalogUploadDialog';

import { useFileDrop } from '@/hooks/use-file-drop';
import { useNomenclaturaForm } from '@/hooks/use-nomenclatura-form';
import { useHistory } from '@/hooks/use-history';
import { useClientAlias } from '@/hooks/use-client-alias';
import { useVersionSuggestion } from '@/hooks/use-version-suggestion';

import { buildFileName } from '@/lib/name-builder';
import { renameFile } from '@/lib/file-rename';
import { validateFields } from '@/lib/validation';
import { addClientAlias } from '@/lib/storage';
import { computeFileHash } from '@/lib/file-hash';
import { storeRecord } from '@/lib/api-client';
import { formatDateYYYYMMDD } from '@/lib/date-formatter';
import type { NomenclaturaFields, HistoryEntry } from '@/types';
import { createDefaultFields } from '@/types';
import { DatabaseIndicator } from '@/components/layout/DatabaseIndicator';

function App() {
  const {
    files,
    removeFile,
    clearFiles,
    updateFileFields,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useFileDrop();

  const {
    fields,
    setField,
    setFields,
    resetFields,
  } = useNomenclaturaForm();

  const {
    history,
    favorites,
    addEntry,
    removeEntry,
    toggleFavorite,
    clearAll,
    refresh: refreshHistory,
  } = useHistory();

  const { suggestions: clientSuggestions, saveAlias } = useClientAlias();

  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [catalogUploadOpen, setCatalogUploadOpen] = useState(false);
  const [department, setDepartment] = useState('auditoria');

  const selectedFile = files.find(f => f.id === selectedFileId) || files[0] || null;
  const isBatchMode = files.length > 1;
  const activeTab = isBatchMode ? 'batch' : 'single';

  // Use file-specific fields when a file is selected, otherwise use global fields
  const currentFields = selectedFile
    ? selectedFile.fields
    : fields;

  // Version suggestion from database
  const { suggestedVersion, matchingRecords } = useVersionSuggestion(currentFields);

  // Compute validation from the actual fields being displayed/edited
  const currentValidationErrors = useMemo(
    () => validateFields(currentFields),
    [currentFields]
  );
  const currentIsValid = currentValidationErrors.filter(e => e.severity === 'error').length === 0;

  // When a file is selected, field updates go to that file's fields;
  // otherwise they go to the global form fields.
  const handleSetField = useCallback(
    <K extends keyof NomenclaturaFields>(key: K, value: NomenclaturaFields[K]) => {
      if (selectedFile) {
        updateFileFields(selectedFile.id, { [key]: value });
      } else {
        setField(key, value);
      }
    },
    [selectedFile, updateFileFields, setField]
  );

  // Reset fields for the selected file or the global form
  const handleResetFields = useCallback(() => {
    if (selectedFile) {
      updateFileFields(selectedFile.id, createDefaultFields());
    } else {
      resetFields();
    }
  }, [selectedFile, updateFileFields, resetFields]);

  const handleRename = useCallback(async () => {
    if (!selectedFile || !currentIsValid) return;
    setRenaming(true);

    try {
      const newName = buildFileName(currentFields, selectedFile.extension);
      const result = await renameFile(selectedFile.file, newName);

      if (result.success) {
        // Save to history
        addEntry({
          originalName: selectedFile.originalName,
          newName,
          aliasCliente: currentFields.aliasCliente,
          servicioAX: currentFields.servicioAX,
          acronimoDocumento: currentFields.acronimoDocumento,
          estadoDocumento: currentFields.estadoDocumento,
        });

        // Save alias for autocomplete
        saveAlias(currentFields.aliasCliente);

        // Store hash + record in database (fire-and-forget)
        computeFileHash(selectedFile.file).then(hash => {
          storeRecord({
            hash,
            filename: newName,
            fields: {
              aliasCliente: currentFields.aliasCliente,
              servicioAX: currentFields.servicioAX,
              periodoServicio: formatDateYYYYMMDD(currentFields.periodoServicio),
              acronimoDocumento: currentFields.acronimoDocumento,
              acronimoSufijo: currentFields.acronimoSufijo,
              fechaDocumento: formatDateYYYYMMDD(currentFields.fechaDocumento),
              version: currentFields.version,
              estadoDocumento: currentFields.estadoDocumento,
            },
          });
        }).catch(() => {});

        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('Error al renombrar el archivo');
    } finally {
      setRenaming(false);
    }
  }, [selectedFile, currentIsValid, currentFields, addEntry, saveAlias]);

  const handleReuse = useCallback(
    (entry: HistoryEntry) => {
      setFields({
        aliasCliente: entry.aliasCliente,
        servicioAX: entry.servicioAX,
        acronimoDocumento: entry.acronimoDocumento,
        estadoDocumento: entry.estadoDocumento,
      });
      setHistoryOpen(false);
      toast.success('Campos cargados desde historial');
    },
    [setFields]
  );

  const handleBatchRenameComplete = useCallback(
    (originalName: string, newName: string, batchFields: NomenclaturaFields, file: File) => {
      addEntry({
        originalName,
        newName,
        aliasCliente: batchFields.aliasCliente,
        servicioAX: batchFields.servicioAX,
        acronimoDocumento: batchFields.acronimoDocumento,
        estadoDocumento: batchFields.estadoDocumento,
      });
      addClientAlias(batchFields.aliasCliente);

      // Store hash + record in database (fire-and-forget)
      computeFileHash(file).then(hash => {
        storeRecord({
          hash,
          filename: newName,
          fields: {
            aliasCliente: batchFields.aliasCliente,
            servicioAX: batchFields.servicioAX,
            periodoServicio: formatDateYYYYMMDD(batchFields.periodoServicio),
            acronimoDocumento: batchFields.acronimoDocumento,
            acronimoSufijo: batchFields.acronimoSufijo,
            fechaDocumento: formatDateYYYYMMDD(batchFields.fechaDocumento),
            version: batchFields.version,
            estadoDocumento: batchFields.estadoDocumento,
          },
        });
      }).catch(() => {});
    },
    [addEntry]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenCatalogUpload={() => setCatalogUploadOpen(true)}
        department={department}
        onDepartmentChange={setDepartment}
      />

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="space-y-6">
          {/* Dropzone */}
          <FileDropZone
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            hasFiles={files.length > 0}
          />

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {files.length} archivo{files.length > 1 ? 's' : ''} seleccionado{files.length > 1 ? 's' : ''}
                </p>
                <Button variant="ghost" size="sm" onClick={clearFiles}>
                  Limpiar todo
                </Button>
              </div>
              <FileList
                files={files}
                onRemove={removeFile}
                selectedId={selectedFileId ?? undefined}
                onSelect={setSelectedFileId}
              />
            </div>
          )}

          {/* Main content: single vs batch */}
          {files.length > 0 && department === 'otros' && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  Este departamento no tiene reglas de nomenclatura definidas
                </p>
                <p className="mt-2 text-xs text-muted-foreground/70 max-w-md">
                  Actualmente solo el departamento de Auditoría dispone de reglas de nomenclatura.
                  En el futuro, cada departamento proporcionará sus propias reglas y catálogos de forma completamente independiente.
                </p>
              </CardContent>
            </Card>
          )}

          {files.length > 0 && department === 'auditoria' && (
            <Tabs value={activeTab} className="space-y-4">
              {files.length > 1 && (
                <TabsList>
                  <TabsTrigger value="single">Individual</TabsTrigger>
                  <TabsTrigger value="batch">Lote ({files.length})</TabsTrigger>
                </TabsList>
              )}

              <TabsContent value="single" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Campos de nomenclatura</CardTitle>
                      <Button variant="ghost" size="sm" onClick={handleResetFields}>
                        <RotateCcw className="mr-1 h-3 w-3" /> Resetear
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <NomenclaturaForm
                      fields={currentFields}
                      setField={handleSetField}
                      clientSuggestions={clientSuggestions}
                      detectedVersion={selectedFile?.detectedVersion}
                      suggestedVersion={suggestedVersion}
                      matchingRecords={matchingRecords}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Vista previa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <NamePreview
                      fields={currentFields}
                      extension={selectedFile?.extension || ''}
                    />
                    <Separator />
                    <ValidationStatus
                      errors={currentValidationErrors}
                      isValid={currentIsValid}
                    />
                  </CardContent>
                </Card>

                <Button
                  onClick={handleRename}
                  disabled={!currentIsValid || !selectedFile || renaming}
                  className="w-full"
                  size="lg"
                >
                  {renaming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Renombrando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Renombrar y guardar
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="batch">
                <BatchRenamePanel
                  files={files}
                  onUpdateFields={updateFileFields}
                  clientSuggestions={clientSuggestions}
                  onRenameComplete={handleBatchRenameComplete}
                />
              </TabsContent>
            </Tabs>
          )}

          {/* Empty state */}
          {files.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Arrastra uno o varios archivos para comenzar
                </p>
                {department === 'auditoria' ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Los archivos que ya siguen la nomenclatura se rellenarán automáticamente
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    Este departamento aún no tiene reglas de nomenclatura definidas
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* History panel */}
      <HistoryPanel
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        history={history}
        favorites={favorites}
        onReuse={handleReuse}
        onToggleFavorite={toggleFavorite}
        onRemove={removeEntry}
        onClearAll={clearAll}
        onRefresh={refreshHistory}
      />

      {/* Help dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ayuda - Nomenclatura</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>
              Esta herramienta genera nombres de archivo según la nomenclatura
              unificada de Forvis Mazars:
            </p>
            <code className="block rounded bg-muted p-2 text-xs">
              ALIAS-SERVICIO-PERIODO-ACRONIMO-FECHA-VERSION-ESTADO.ext
            </code>
            <div className="space-y-1">
              <p className="font-medium">Instrucciones:</p>
              <ol className="ml-4 list-decimal space-y-1 text-muted-foreground">
                <li>Arrastra uno o más archivos a la zona de carga</li>
                <li>Rellena los 7 campos del formulario</li>
                <li>Revisa la vista previa y las validaciones</li>
                <li>Haz clic en "Renombrar y guardar"</li>
              </ol>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Características:</p>
              <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
                <li>Detección automática de versión en el nombre original</li>
                <li>Parseo automático de archivos que ya siguen la nomenclatura</li>
                <li>Modo lote para renombrar múltiples archivos</li>
                <li>Historial de renombramientos con favoritos</li>
                <li>Exportar/importar historial en JSON</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Catalog upload dialog */}
      <CatalogUploadDialog
        open={catalogUploadOpen}
        onOpenChange={setCatalogUploadOpen}
        onCatalogUpdated={() => {}}
      />

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="mx-auto max-w-5xl px-4 py-3 text-center">
          <DatabaseIndicator />
          <p className="text-xs text-muted-foreground">
            Desarrollado por IT Innovation V2.0 · Carrer de la Diputació, 260, Eixample, 08007 Barcelona
          </p>
        </div>
      </footer>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
