import { sha256 } from 'js-sha256';

export async function computeFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();

  // crypto.subtle is only available in secure contexts (HTTPS / localhost).
  // Fall back to a pure-JS SHA-256 when running over plain HTTP.
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  return sha256(buffer);
}
