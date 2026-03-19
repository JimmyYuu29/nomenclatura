import { useEffect, useState, useRef } from 'react';
import { findMatches, type MatchRecord } from '@/lib/api-client';
import { formatDateYYYYMMDD } from '@/lib/date-formatter';
import type { NomenclaturaFields } from '@/types';

export interface HashComparison {
  /** The file's hash matches an existing record in DB */
  hashMatched: boolean;
  /** The version of the matching record (if hash matched) */
  matchedVersion: number | null;
  /** The estado of the matching record (if hash matched) */
  matchedEstado: string | null;
}

interface VersionSuggestion {
  suggestedVersion: number | null;
  matchingRecords: MatchRecord[];
  hashComparison: HashComparison | null;
}

export function useVersionSuggestion(
  fields: NomenclaturaFields,
  fileHash?: string | null
): VersionSuggestion {
  const [suggestion, setSuggestion] = useState<VersionSuggestion>({
    suggestedVersion: null,
    matchingRecords: [],
    hashComparison: null,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const alias = fields.aliasCliente;
  const servicio = fields.servicioAX;
  const periodo = formatDateYYYYMMDD(fields.periodoServicio);
  const acronimo = fields.acronimoDocumento;
  const sufijo = fields.acronimoSufijo;

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!alias || !servicio || !periodo || !acronimo) {
      setSuggestion({ suggestedVersion: null, matchingRecords: [], hashComparison: null });
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

        // Compare file hash with matching records
        let hashComparison: HashComparison | null = null;
        if (fileHash) {
          const hashMatch = matches.find(m => m.hash === fileHash);
          if (hashMatch) {
            hashComparison = {
              hashMatched: true,
              matchedVersion: hashMatch.version,
              matchedEstado: hashMatch.estado_documento,
            };
          } else {
            hashComparison = {
              hashMatched: false,
              matchedVersion: null,
              matchedEstado: null,
            };
          }
        }

        setSuggestion({
          suggestedVersion: hashComparison?.hashMatched
            ? hashComparison.matchedVersion
            : maxVersion + 1,
          matchingRecords: matches,
          hashComparison,
        });
      } else {
        setSuggestion({ suggestedVersion: null, matchingRecords: [], hashComparison: null });
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [alias, servicio, periodo, acronimo, sufijo, fileHash]);

  return suggestion;
}
