/**
 * Renombra un archivo usando File System Access API (Chrome/Edge)
 * o descarga con el nuevo nombre como fallback (Firefox/Safari).
 */

export interface RenameResult {
  success: boolean;
  method: 'fileSystemAccess' | 'download';
  message: string;
}

/**
 * Verifica si el navegador soporta File System Access API.
 */
export function supportsFileSystemAccess(): boolean {
  return 'showSaveFilePicker' in window;
}

/**
 * Renombra un archivo: intenta usar File System Access API,
 * si no está disponible, descarga con el nuevo nombre.
 */
export async function renameFile(file: File, newName: string): Promise<RenameResult> {
  if (supportsFileSystemAccess()) {
    return renameWithFileSystemAccess(file, newName);
  }
  return downloadWithNewName(file, newName);
}

async function renameWithFileSystemAccess(file: File, newName: string): Promise<RenameResult> {
  try {
    const extension = newName.split('.').pop() || '';
    const mimeType = file.type || 'application/octet-stream';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handle = await (window as any).showSaveFilePicker({
      suggestedName: newName,
      types: extension
        ? [
            {
              description: `Archivo ${extension.toUpperCase()}`,
              accept: { [mimeType]: [`.${extension}`] },
            },
          ]
        : undefined,
    });

    const writable = await handle.createWritable();
    await writable.write(file);
    await writable.close();

    return {
      success: true,
      method: 'fileSystemAccess',
      message: `Archivo guardado como "${newName}"`,
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        success: false,
        method: 'fileSystemAccess',
        message: 'Operación cancelada por el usuario',
      };
    }
    // Fallback a descarga
    return downloadWithNewName(file, newName);
  }
}

function downloadWithNewName(file: File, newName: string): RenameResult {
  try {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = newName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return {
      success: true,
      method: 'download',
      message: `Archivo descargado como "${newName}"`,
    };
  } catch {
    return {
      success: false,
      method: 'download',
      message: 'Error al descargar el archivo',
    };
  }
}
