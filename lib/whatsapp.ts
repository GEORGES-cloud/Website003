/* WhatsApp del club: número + mensaje de interés genérico por idioma.
   Lo usan el botón flotante y los atajos "escríbenos ahora" de los quiz. */

export const WA_INTEREST_MSG: Record<string, string> = {
  es: 'Hola, me interesa la membresía del Flamingo Yacht Club.',
  en: 'Hello, I am interested in the Flamingo Yacht Club membership.',
  sv: 'Hej, jag är intresserad av medlemskap hos Flamingo Yacht Club.',
  ru: 'Здравствуйте, меня интересует членство в Flamingo Yacht Club.',
  de: 'Hallo, ich interessiere mich für die Mitgliedschaft im Flamingo Yacht Club.',
  fr: 'Bonjour, je suis intéressé(e) par l’adhésion au Flamingo Yacht Club.',
};

export const WA_PHONE = process.env.NEXT_PUBLIC_WHATSAPP ?? '34722454277';

export function waInterestHref(locale: string) {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_INTEREST_MSG[locale] ?? WA_INTEREST_MSG.en)}`;
}
