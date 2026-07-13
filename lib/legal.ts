export interface LegalSection {
  heading: string;
  body: string[];
}
export interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

// Placeholders in [BRACKETS] should be completed by the client with their
// registered company details and reviewed by a lawyer before launch.
const COMPANY = '[RAZÓN SOCIAL]';
const CIF = '[CIF/NIF]';
const ADDR = 'Puerto Banús, 29660 Marbella, Málaga';
const EMAIL = 'info@navigante.com';

export const legal: Record<'privacy' | 'terms' | 'notice', Record<'es' | 'en', LegalDoc>> = {
  privacy: {
    es: {
      title: 'Política de Privacidad',
      updated: 'Última actualización: junio de 2026',
      intro:
        `En Flamingo Yacht Club (operado por ${COMPANY}, CIF ${CIF}) respetamos tu privacidad y tratamos tus datos conforme al Reglamento (UE) 2016/679 (RGPD) y la LOPDGDD.`,
      sections: [
        { heading: 'Responsable del tratamiento', body: [`${COMPANY} · CIF ${CIF} · ${ADDR} · ${EMAIL}.`] },
        { heading: 'Datos que recopilamos', body: ['Datos identificativos y de contacto que nos facilitas a través del formulario de contacto o el proceso de membresía (nombre, email, teléfono y el contenido de tu mensaje), así como datos de navegación mediante cookies.'] },
        { heading: 'Finalidad', body: ['Atender tus solicitudes de información, gestionar tu membresía y, si lo autorizas, enviarte comunicaciones sobre el club. No tomamos decisiones automatizadas con tus datos.'] },
        { heading: 'Legitimación', body: ['El consentimiento que prestas al contactarnos, la ejecución de la relación contractual de membresía y nuestro interés legítimo en responder a tus consultas.'] },
        { heading: 'Conservación', body: ['Conservamos tus datos mientras dure la relación y, después, durante los plazos legalmente exigibles.'] },
        { heading: 'Destinatarios', body: ['No cedemos tus datos a terceros salvo obligación legal o a proveedores que nos prestan servicios (p. ej. gestión de reservas), siempre bajo contrato de encargo de tratamiento.'] },
        { heading: 'Tus derechos', body: [`Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${EMAIL}. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).`] },
      ],
    },
    en: {
      title: 'Privacy Policy',
      updated: 'Last updated: June 2026',
      intro:
        `At Flamingo Yacht Club (operated by ${COMPANY}, Tax ID ${CIF}) we respect your privacy and process your data in accordance with Regulation (EU) 2016/679 (GDPR).`,
      sections: [
        { heading: 'Data controller', body: [`${COMPANY} · Tax ID ${CIF} · ${ADDR} · ${EMAIL}.`] },
        { heading: 'Data we collect', body: ['Identifying and contact data you provide through the contact form or the membership process (name, email, phone and your message), as well as browsing data via cookies.'] },
        { heading: 'Purpose', body: ['To respond to your enquiries, manage your membership and, with your consent, send you communications about the club. We do not carry out automated decision-making.'] },
        { heading: 'Legal basis', body: ['Your consent when contacting us, the performance of the membership relationship and our legitimate interest in answering your requests.'] },
        { heading: 'Retention', body: ['We keep your data for as long as the relationship lasts and, afterwards, for the legally required periods.'] },
        { heading: 'Recipients', body: ['We do not share your data with third parties except where legally required or with service providers (e.g. booking management), always under a data-processing agreement.'] },
        { heading: 'Your rights', body: [`You may exercise your rights of access, rectification, erasure, objection, restriction and portability by writing to ${EMAIL}.`] },
      ],
    },
  },
  terms: {
    es: {
      title: 'Términos y Condiciones',
      updated: 'Última actualización: junio de 2026',
      intro: 'Estos términos regulan el uso de este sitio web y la información sobre la membresía del club náutico Flamingo Yacht Club.',
      sections: [
        { heading: 'Objeto', body: ['Este sitio tiene carácter informativo sobre el club de membresía náutica Flamingo Yacht Club. La contratación de la membresía y las reservas se rigen por las condiciones particulares que se faciliten en cada caso.'] },
        { heading: 'Uso del sitio', body: ['Te comprometes a usar el sitio conforme a la ley y a no realizar un uso que pueda dañar su funcionamiento o los derechos de terceros.'] },
        { heading: 'Membresía y reservas', body: ['Las características, precios y disponibilidad de la flota pueden variar. La información publicada no constituye una oferta vinculante hasta la formalización de la membresía.'] },
        { heading: 'Propiedad intelectual', body: ['Los contenidos, marcas y diseño de este sitio están protegidos y no pueden reproducirse sin autorización.'] },
        { heading: 'Responsabilidad', body: ['No nos responsabilizamos de errores u omisiones en los contenidos ni de interrupciones del servicio ajenas a nuestro control.'] },
        { heading: 'Legislación aplicable', body: ['Estos términos se rigen por la legislación española y se someten a los juzgados de Marbella, salvo norma imperativa en contrario.'] },
      ],
    },
    en: {
      title: 'Terms & Conditions',
      updated: 'Last updated: June 2026',
      intro: 'These terms govern the use of this website and the information about the Flamingo Yacht Club membership club.',
      sections: [
        { heading: 'Purpose', body: ['This site is informational about the Flamingo Yacht Club yacht membership club. Membership and bookings are governed by the specific conditions provided in each case.'] },
        { heading: 'Use of the site', body: ['You agree to use the site lawfully and not to do anything that could harm its operation or third-party rights.'] },
        { heading: 'Membership and bookings', body: ['Fleet features, prices and availability may change. Published information is not a binding offer until membership is formalised.'] },
        { heading: 'Intellectual property', body: ['The content, trademarks and design of this site are protected and may not be reproduced without authorisation.'] },
        { heading: 'Liability', body: ['We are not liable for errors or omissions in the content or for service interruptions beyond our control.'] },
        { heading: 'Governing law', body: ['These terms are governed by Spanish law and subject to the courts of Marbella, unless mandatory rules provide otherwise.'] },
      ],
    },
  },
  notice: {
    es: {
      title: 'Aviso Legal',
      updated: 'Última actualización: junio de 2026',
      intro: 'En cumplimiento de la Ley 34/2002 (LSSI-CE), se facilitan los datos identificativos del titular de este sitio web.',
      sections: [
        { heading: 'Titular', body: [`Denominación: ${COMPANY}.`, `CIF/NIF: ${CIF}.`, `Domicilio: ${ADDR}.`, `Email: ${EMAIL}.`] },
        { heading: 'Condiciones de uso', body: ['El acceso a este sitio atribuye la condición de usuario e implica la aceptación del presente aviso legal.'] },
        { heading: 'Propiedad intelectual e industrial', body: ['Todos los derechos sobre los contenidos del sitio pertenecen a su titular o a terceros que han autorizado su uso.'] },
      ],
    },
    en: {
      title: 'Legal Notice',
      updated: 'Last updated: June 2026',
      intro: 'In compliance with Spanish Law 34/2002 (LSSI-CE), the identifying details of the owner of this website are provided.',
      sections: [
        { heading: 'Owner', body: [`Company: ${COMPANY}.`, `Tax ID: ${CIF}.`, `Address: ${ADDR}.`, `Email: ${EMAIL}.`] },
        { heading: 'Terms of use', body: ['Accessing this site grants user status and implies acceptance of this legal notice.'] },
        { heading: 'Intellectual property', body: ['All rights to the site content belong to its owner or to third parties who have authorised its use.'] },
      ],
    },
  },
};
