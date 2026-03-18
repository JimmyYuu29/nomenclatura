import { useEffect, useState, useRef } from 'react';
import { findMatches, type MatchRecord } from '@/lib/api-client';
import { formatDateYYYYMMDD } from '@/lib/date-formatter';
import type { NomenclaturaFields } from '@/types';

interface VersionSuggestion {
  suggestedVersion: number | null;
  matchingRecords: MatchRecord[];
}

export function useVersionSuggestion(fields: NomenclaturaFields): VersionSuggestion {
  const [suggestion, setSuggestion] = useState<VersionSuggestion>({
    suggestedVersion: null,
    matchingRecords: [],
  });
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const alias = fields.aliasCliente;
  const servicio = fields.servicioAX;
  const periodo = formatDateYYYYMMDD(fields.periodoServicio);
  const acronimo = fields.acronimoDocumento;
  const sufijo = fields.acronimoSufijo;

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!alias || !servicio || !periodo || !acronimo) {
      setSuggestion({ suggestedVersion: null, matchingRecords: [] });
      return;
    }

    timerRef.current = setTimeout(async () => {
      const matches = await findMatches({
        aliasCliente: alias,
        servicioAX: servicio,
        periodoServicio: periodo,
        acronimoDocumento: acronimo,
        acronimoSufijo: sufijo,
      });

      if (matches.length > 0) {
        const maxVersion = Math.max(...matches.map(m => m.version));
        setSuggestion({
          suggestedVersion: maxVersion + 1,
          matchingRecords: matches,
        });
      } else {
        setSuggestion({ suggestedVersion: null, matchingRecords: [] });
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [alias, servicio, periodo, acronimo, sufijo]);

  return suggestion;
}
