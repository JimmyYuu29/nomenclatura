import { useState, useCallback } from 'react';
import { Upload, Check, X, Lock } from 'lucide-react';
import { read, utils } from 'xlsx';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { saveCustomAcronimos, getAcronimosDocumento } from '@/data/acronimos';
import { saveCustomServicios, getServiciosAX } from '@/data/servicios-ax';
import { saveCustomEstados, getEstadosDocumento } from '@/data/estados';


const ADMIN_PASSWORD = 'Admin123';

type CatalogType = 'acronimos' | 'servicios' | 'estados';

interface ConflictItem {
  codigo: string;
  newDesc: string;
  oldDesc: string;
  action: 'keep' | 'replace';
}

interface ParsedRow {
  codigo: string;
  descripcion: string;
}

interface CatalogUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCatalogUpdated: () => void;
}

export function CatalogUploadDialog({ open, onOpenChange, onCatalogUpdated }: CatalogUploadDialogProps) {
  const [step, setStep] = useState<'auth' | 'upload' | 'conflicts' | 'done'>('auth');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [catalogType, setCatalogType] = useState<CatalogType>('acronimos');
  const [, setParsedRows] = useState<ParsedRow[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [newItems, setNewItems] = useState<ParsedRow[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const reset = useCallback(() => {
    setStep('auth');
    setPassword('');
    setPasswordError(false);
    setParsedRows([]);
    setConflicts([]);
    setNewItems([]);
    setUploadedFileName('');
  }, []);

  const handleClose = useCallback((val: boolean) => {
    if (!val) reset();
    onOpenChange(val);
  }, [onOpenChange, reset]);

  const handleAuth = useCallback(() => {
    if (password === ADMIN_PASSWORD) {
      setStep('upload');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }, [password]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: unknown[][] = utils.sheet_to_json(ws, { header: 1 });

        // Expect two-column structure: Código | Descripción
        const parsed: ParsedRow[] = [];
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length < 2) continue;
          const codigo = String(row[0] ?? '').trim();
          const descripcion = String(row[1] ?? '').trim();
          // Skip header rows
          if (!codigo || !descripcion) continue;
          if (i === 0 && (codigo.toLowerCase().includes('acrónimo') || codigo.toLowerCase().includes('servicio') || codigo.toLowerCase().includes('estado') || codigo.toLowerCase().includes('codigo') || codigo.toLowerCase().includes('código'))) continue;
          parsed.push({ codigo, descripcion });
        }

        if (parsed.length === 0) {
          toast.error('No se encontraron datos válidos en el archivo. Asegúrese de que tenga dos columnas: Código y Descripción.');
          return;
        }

        setParsedRows(parsed);
        detectConflicts(parsed);
      } catch {
        toast.error('Error al leer el archivo Excel');
      }
    };
    reader.readAsArrayBuffer(file);
  }, [catalogType]);

  const detectConflicts = useCallback((parsed: ParsedRow[]) => {
    let existingCodes: string[] = [];
    if (catalogType === 'acronimos') {
      existingCodes = getAcronimosDocumento().map(a => a.codigo);
    } else if (catalogType === 'servicios') {
      existingCodes = getServiciosAX().map(s => s.codigo);
    } else {
      existingCodes = getEstadosDocumento().map(e => e.codigo);
    }

    const conflictItems: ConflictItem[] = [];
    const newEntries: ParsedRow[] = [];

    for (const item of parsed) {
      const existing = existingCodes.includes(item.codigo);
      if (existing) {
        let oldDesc = '';
        if (catalogType === 'acronimos') {
          oldDesc = getAcronimosDocumento().find(a => a.codigo === item.codigo)?.descripcion ?? '';
        } else if (catalogType === 'servicios') {
          oldDesc = getServiciosAX().find(s => s.codigo === item.codigo)?.descripcion ?? '';
        } else {
          oldDesc = getEstadosDocumento().find(e => e.codigo === item.codigo)?.descripcion ?? '';
        }
        if (oldDesc !== item.descripcion) {
          conflictItems.push({
            codigo: item.codigo,
            newDesc: item.descripcion,
            oldDesc,
            action: 'replace',
          });
        }
      } else {
        newEntries.push(item);
      }
    }

    setConflicts(conflictItems);
    setNewItems(newEntries);

    if (conflictItems.length > 0) {
      setStep('conflicts');
    } else if (newEntries.length > 0) {
      applyChanges(conflictItems, newEntries);
    } else {
      toast.info('No se encontraron cambios en el catálogo.');
    }
  }, [catalogType]);

  const applyChanges = useCallback((resolvedConflicts: ConflictItem[], additions: ParsedRow[]) => {
    if (catalogType === 'acronimos') {
      const current = getAcronimosDocumento();
      const updated = [...current];
      for (const c of resolvedConflicts) {
        if (c.action === 'replace') {
          const idx = updated.findIndex(a => a.codigo === c.codigo);
          if (idx >= 0) updated[idx] = { ...updated[idx], descripcion: c.newDesc };
        }
      }
      for (const n of additions) {
        const wildcard = n.codigo.endsWith('*');
        const code = wildcard ? n.codigo.replace('*', '') : n.codigo;
        if (!updated.find(a => a.codigo === code)) {
          updated.push({
            codigo: code,
            descripcion: n.descripcion,
            wildcard,
            tags: n.descripcion.toLowerCase().split(/\s+/).filter(t => t.length > 2),
          });
        }
      }
      const customOnly = updated.filter(u => {
        const orig = getAcronimosDocumento().find(a => a.codigo === u.codigo);
        return !orig || orig.descripcion !== u.descripcion;
      });
      saveCustomAcronimos(customOnly);
    } else if (catalogType === 'servicios') {
      const current = getServiciosAX();
      const updated = [...current];
      for (const c of resolvedConflicts) {
        if (c.action === 'replace') {
          const idx = updated.findIndex(s => s.codigo === c.codigo);
          if (idx >= 0) updated[idx] = { ...updated[idx], descripcion: c.newDesc };
        }
      }
      for (const n of additions) {
        if (!updated.find(s => s.codigo === n.codigo)) {
          updated.push({
            codigo: n.codigo,
            descripcion: n.descripcion,
            categoria: 'OTHER',
            tags: n.descripcion.toLowerCase().split(/\s+/).filter(t => t.length > 2),
          });
        }
      }
      const customOnly = updated.filter(u => {
        const orig = getServiciosAX().find(s => s.codigo === u.codigo);
        return !orig || orig.descripcion !== u.descripcion;
      });
      saveCustomServicios(customOnly);
    } else {
      const current = getEstadosDocumento();
      const updated = [...current];
      for (const c of resolvedConflicts) {
        if (c.action === 'replace') {
          const idx = updated.findIndex(e => e.codigo === c.codigo);
          if (idx >= 0) updated[idx] = { ...updated[idx], descripcion: c.newDesc, descripcionCompleta: c.newDesc };
        }
      }
      for (const n of additions) {
        if (!updated.find(e => e.codigo === n.codigo)) {
          updated.push({
            codigo: n.codigo,
            descripcion: n.descripcion,
            descripcionCompleta: n.descripcion,
            transicionesPermitidas: [],
            esFinal: false,
          });
        }
      }
      const customOnly = updated.filter(u => {
        const orig = getEstadosDocumento().find(e => e.codigo === u.codigo);
        return !orig || orig.descripcion !== u.descripcion;
      });
      saveCustomEstados(customOnly);
    }

    setStep('done');
    onCatalogUpdated();
    toast.success(`Catálogo actualizado: ${additions.length} nuevos, ${resolvedConflicts.filter(c => c.action === 'replace').length} reemplazados`);
  }, [catalogType, onCatalogUpdated]);

  const handleApplyConflicts = useCallback(() => {
    applyChanges(conflicts, newItems);
  }, [conflicts, newItems, applyChanges]);

  const toggleConflictAction = useCallback((idx: number) => {
    setConflicts(prev => prev.map((c, i) =>
      i === idx ? { ...c, action: c.action === 'replace' ? 'keep' : 'replace' } : c
    ));
  }, []);

  const catalogLabels: Record<CatalogType, string> = {
    acronimos: 'Acrónimo Documento',
    servicios: 'Servicio AX',
    estados: 'Estado Documento',
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Actualizar Catálogo
          </DialogTitle>
        </DialogHeader>

        {step === 'auth' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Introduzca la contraseña de administrador para actualizar los catálogos.
            </p>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setPasswordError(false); }}
                    onKeyDown={e => e.key === 'Enter' && handleAuth()}
                    placeholder="Contraseña de administrador"
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleAuth}>Acceder</Button>
              </div>
              {passwordError && (
                <p className="text-sm text-destructive">Contraseña incorrecta</p>
              )}
            </div>
          </div>
        )}

        {step === 'upload' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de catálogo</Label>
              <Select value={catalogType} onValueChange={(v) => { if (v) setCatalogType(v as CatalogType); }}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acronimos">Acrónimo Documento</SelectItem>
                  <SelectItem value="servicios">Servicio AX</SelectItem>
                  <SelectItem value="estados">Estado Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Archivo Excel (.xlsx)</Label>
              <p className="text-xs text-muted-foreground">
                El archivo debe tener dos columnas: <strong>Código</strong> y <strong>Descripción</strong>
              </p>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
              />
              {uploadedFileName && (
                <p className="text-xs text-muted-foreground">Archivo: {uploadedFileName}</p>
              )}
            </div>
          </div>
        )}

        {step === 'conflicts' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Se encontraron <strong>{conflicts.length}</strong> conflicto{conflicts.length !== 1 ? 's' : ''} en <strong>{catalogLabels[catalogType]}</strong>.
              {newItems.length > 0 && ` Además hay ${newItems.length} entrada${newItems.length !== 1 ? 's' : ''} nueva${newItems.length !== 1 ? 's' : ''}.`}
            </p>
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {conflicts.map((c, idx) => (
                  <div
                    key={c.codigo}
                    className="rounded-md border p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono">{c.codigo}</Badge>
                      <Button
                        variant={c.action === 'replace' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleConflictAction(idx)}
                      >
                        {c.action === 'replace' ? (
                          <><Check className="mr-1 h-3 w-3" /> Reemplazar</>
                        ) : (
                          <><X className="mr-1 h-3 w-3" /> Mantener</>
                        )}
                      </Button>
                    </div>
                    <div className="text-xs space-y-0.5">
                      <p className="text-muted-foreground line-through">{c.oldDesc}</p>
                      <p className="text-green-600 dark:text-green-400">{c.newDesc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {newItems.length > 0 && (
              <div className="text-sm">
                <p className="font-medium mb-1">Nuevas entradas ({newItems.length}):</p>
                <div className="text-xs text-muted-foreground space-y-0.5 max-h-[100px] overflow-y-auto">
                  {newItems.map(n => (
                    <p key={n.codigo}><span className="font-mono">{n.codigo}</span> — {n.descripcion}</p>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { reset(); handleClose(false); }}>Cancelar</Button>
              <Button onClick={handleApplyConflicts}>
                <Check className="mr-1 h-4 w-4" /> Aplicar cambios
              </Button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium">Catálogo actualizado correctamente</p>
            <p className="text-xs text-muted-foreground">
              Recargue la página para ver los cambios reflejados en los selectores.
            </p>
            <Button variant="outline" onClick={() => { reset(); handleClose(false); window.location.reload(); }}>
              Cerrar y recargar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
