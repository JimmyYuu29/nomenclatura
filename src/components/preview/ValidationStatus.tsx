import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import type { ValidationError } from '@/types';
import { cn } from '@/lib/utils';

interface ValidationStatusProps {
  errors: ValidationError[];
  isValid: boolean;
}

export function ValidationStatus({ errors, isValid }: ValidationStatusProps) {
  if (errors.length === 0 && isValid) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <span>Todos los campos son válidos</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {errors.map((err, i) => (
        <div
          key={`${err.ruleId}-${i}`}
          className={cn(
            'flex items-start gap-2 rounded-md p-2 text-sm',
            err.severity === 'error'
              ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
          )}
        >
          {err.severity === 'error' ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{err.message}</span>
        </div>
      ))}
    </div>
  );
}
