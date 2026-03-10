import { FileText, History, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenHelp: () => void;
}

export function Header({ onOpenHistory, onOpenHelp }: HeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-lg font-semibold leading-tight">Nomenclatura</h1>
            <p className="text-xs text-muted-foreground">Forvis Mazars</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={onOpenHistory}><History className="h-4 w-4" /></Button>} />
              <TooltipContent>Historial</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" size="icon" onClick={onOpenHelp}><HelpCircle className="h-4 w-4" /></Button>} />
              <TooltipContent>Ayuda</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
