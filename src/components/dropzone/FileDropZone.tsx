import { Upload, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  getRootProps: () => Record<string, unknown>;
  getInputProps: () => Record<string, unknown>;
  isDragActive: boolean;
  hasFiles: boolean;
}

export function FileDropZone({
  getRootProps,
  getInputProps,
  isDragActive,
  hasFiles,
}: FileDropZoneProps) {
  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
        isDragActive
          ? 'border-primary bg-primary/5'
          : hasFiles
            ? 'border-muted-foreground/25 bg-muted/50'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <>
          <FileUp className="mb-3 h-10 w-10 text-primary animate-bounce" />
          <p className="text-sm font-medium text-primary">Suelta los archivos aquí...</p>
        </>
      ) : (
        <>
          <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">
            {hasFiles
              ? 'Arrastra más archivos o haz clic para añadir'
              : 'Arrastra archivos aquí o haz clic para seleccionar'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Cualquier tipo de archivo es aceptado
          </p>
        </>
      )}
    </div>
  );
}
