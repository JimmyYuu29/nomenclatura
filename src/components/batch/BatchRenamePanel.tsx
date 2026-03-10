import { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { FileEntry, NomenclaturaFields } from '@/types';
import { NomenclaturaForm } from '@/components/form/NomenclaturaForm';
import { buildFileName } from '@/lib/name-builder';
import { validateFields } from '@/lib/validation';
import { renameFile } from '@/lib/file-rename';
import { cn } from '@/lib/utils';

interface BatchRenamePanelProps {
  files: FileEntry[];
  onUpdateFields: (id: string, fields: Partial<NomenclaturaFields>) => void;
  clientSuggestions: string[];
  onRenameComplete: (originalName: string, newName: string, fields: NomenclaturaFields) => void;
}

export function BatchRenamePanel({
  files,
  onUpdateFields,
  clientSuggestions,
  onRenameComplete,
}: BatchRenamePanelProps) {
  const [sharedFields, setSharedFields] = useState<Partial<NomenclaturaFields>>({});
  const [renaming, setRenaming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<Record<string, 'success' | 'error'>>({});

  const applySharedFields = () => {
    for (const file of files) {
      const updates: Partial<NomenclaturaFields> = {};
      if (sharedFields.aliasCliente) updates.aliasCliente = sharedFields.aliasCliente;
      if (sharedFields.servicioAX) updates.servicioAX = sharedFields.servicioAX;
      if (sharedFields.periodoServicio) updates.periodoServicio = sharedFields.periodoServicio;
      if (sharedFields.estadoDocumento) updates.estadoDocumento = sharedFields.estadoDocumento;
      onUpdateFields(file.id, updates);
    }
  };

  const handleBatchRename = async () => {
    setRenaming(true);
    setProgress(0);
    setResults({});

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const errors = validateFields(file.fields);
      const hasErrors = errors.some(e => e.severity === 'error');

      if (hasErrors) {
        setResults(prev => ({ ...prev, [file.id]: 'error' }));
      } else {
        const newName = buildFileName(file.fields, file.extension);
        const result = await renameFile(file.file, newName);
        setResults(prev => ({
          ...prev,
          [file.id]: result.success ? 'success' : 'error',
        }));
        if (result.success) {
          onRenameComplete(file.originalName, newName, file.fields);
        }
      }
      setProgress(((i + 1) / files.length) * 100);
    }

    setRenaming(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Campos compartidos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Rellena los campos comunes y aplícalos a todos los archivos
          </p>
          <NomenclaturaForm
            fields={{
              aliasCliente: sharedFields.aliasCliente || '',
              servicioAX: sharedFields.servicioAX || '',
              periodoServicio: sharedFields.periodoServicio || null,
              acronimoDocumento: sharedFields.acronimoDocumento || '',
              acronimoSufijo: sharedFields.acronimoSufijo || '',
              fechaDocumento: sharedFields.fechaDocumento || null,
              version: sharedFields.version || 1,
              estadoDocumento: sharedFields.estadoDocumento || '',
            }}
            setField={(key, value) =>
              setSharedFields(prev => ({ ...prev, [key]: value }))
            }
            clientSuggestions={clientSuggestions}
          />
          <Button onClick={applySharedFields} variant="secondary" className="w-full">
            Aplicar a todos los archivos
          </Button>
        </CardContent>
      </Card>

      {/* File list with individual previews */}
      <div className="space-y-2">
        {files.map(file => {
          const newName = buildFileName(file.fields, file.extension);
          const errors = validateFields(file.fields);
          const hasErrors = errors.some(e => e.severity === 'error');
          const result = results[file.id];

          return (
            <div
              key={file.id}
              className={cn(
                'rounded-md border p-3 text-sm',
                result === 'success' && 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/20',
                result === 'error' && 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-muted-foreground">{file.originalName}</span>
                {result === 'success' && <Check className="h-4 w-4 text-emerald-600" />}
                {hasErrors && !result && (
                  <Badge variant="destructive" className="text-[10px]">
                    {errors.length} error(es)
                  </Badge>
                )}
              </div>
              <div className="mt-1 truncate font-mono text-xs">
                → {newName}
              </div>
            </div>
          );
        })}
      </div>

      {renaming && <Progress value={progress} className="h-2" />}

      <Button
        onClick={handleBatchRename}
        disabled={renaming || files.length === 0}
        className="w-full"
      >
        {renaming ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Renombrando...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Renombrar todos ({files.length} archivos)
          </>
        )}
      </Button>
    </div>
  );
}
