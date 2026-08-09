/* Consentimiento de cookies: clave de almacenamiento y aviso de decisión.
   El banner de descuento se espera a que el visitante resuelva las cookies —
   si no, en la primera visita se abrían dos diálogos superpuestos. */

export const CONSENT_KEY = 'fyc-cookie-consent';
export const CONSENT_EVENT = 'fyc:cookie-consent';

export function hasConsentDecision(): boolean {
  try {
    return Boolean(localStorage.getItem(CONSENT_KEY));
  } catch {
    // Sin localStorage (modo privado estricto) no hay banner que esperar.
    return true;
  }
}
