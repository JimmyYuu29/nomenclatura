import { useEffect, useState } from 'react';
import { Database, WifiOff } from 'lucide-react';
import { checkHealth } from '@/lib/api-client';

export function DatabaseIndicator() {
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    const check = async () => {
      const result = await checkHealth();
      setDbConnected(result?.db ?? false);
    };

    check();
    timer = setInterval(check, 30_000);
    return () => clearInterval(timer);
  }, []);

  if (dbConnected === null) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1">
      {dbConnected ? (
        <>
          <Database className="h-3 w-3 text-emerald-500" />
          <span>Base de datos conectada</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-red-400" />
          <span>Base de datos no disponible</span>
        </>
      )}
    </div>
  );
}
