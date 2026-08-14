/* Teléfono público del club — el mismo número que atiende el WhatsApp, así que
   sale de WA_PHONE (y del env de Hostinger) en vez de repetirse a mano.
   Dos formatos: E.164 para el href tel: y agrupado para leerlo en pantalla. */
import { WA_PHONE } from './whatsapp';

export const CLUB_PHONE_E164 = `+${WA_PHONE}`;

/** +34722454277 → +34 722 45 42 77. Si el número no es un móvil español de
 *  9 dígitos se queda como está: mejor sin agrupar que mal agrupado. */
export const CLUB_PHONE_DISPLAY = CLUB_PHONE_E164.replace(
  /^(\+34)(\d{3})(\d{2})(\d{2})(\d{2})$/,
  '$1 $2 $3 $4 $5',
);

export const PHONE_LABEL: Record<string, string> = {
  es: 'Teléfono',
  en: 'Phone',
  sv: 'Telefon',
  ru: 'Телефон',
  de: 'Telefon',
  fr: 'Téléphone',
};
