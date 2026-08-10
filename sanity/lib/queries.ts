/* Consultas GROQ del frontend. `loc(campo)` resuelve el idioma pedido con
   fallback inglés → español, igual que hacía lib/localize con los JSON. */

const loc = (field: string) =>
  `coalesce(${field}[_key==$locale][0].value, ${field}[_key=="en"][0].value, ${field}[_key=="es"][0].value)`;

export const FLEET_QUERY = /* groq */ `*[_type == "boat"] | order(order asc) {
  "slug": slug.current,
  name,
  shortName,
  lengthM,
  capacity,
  year,
  specs,
  active,
  video,
  "tagline": ${loc('tagline')},
  "description": ${loc('description')},
  "image": image.asset->url,
  "slides": slides[].asset->url,
  "heroImage": heroImage.asset->url,
  "videoPoster": videoPoster.asset->url,
  "gallery": gallery[]{ "url": asset->url, "alt": ${loc('alt')} }
}`;

export const FAQS_QUERY = /* groq */ `*[_type == "faq"] | order(order asc) {
  "q": ${loc('question')},
  "a": ${loc('answer')}
}`;

export const TESTIMONIALS_QUERY = /* groq */ `*[_type == "testimonial"] | order(order asc) {
  author,
  "quote": ${loc('quote')},
  "role": ${loc('role')}
}`;

export const STATS_QUERY = /* groq */ `*[_type == "stat"] | order(order asc) {
  value,
  suffix,
  "label": ${loc('label')}
}`;

export const MILESTONES_QUERY = /* groq */ `*[_type == "milestone"] | order(order asc) {
  year,
  highlight,
  "title": ${loc('title')},
  "desc": ${loc('desc')}
}`;

export const TIERS_QUERY = /* groq */ `*[_type == "tier"] | order(order asc) {
  "id": tierId,
  "name": ${loc('name')},
  price,
  featured,
  "period": ${loc('period')},
  "tagline": ${loc('tagline')},
  "features": features[]{ "text": ${loc('text')} }
}`;

export const LEGAL_QUERY = /* groq */ `*[_type == "legalDoc" && _id == $id][0] {
  "title": ${loc('title')},
  "updated": ${loc('updated')},
  "intro": ${loc('intro')},
  "sections": sections[]{ "heading": ${loc('heading')}, "body": ${loc('body')} }
}`;

export const REEL_QUERY = /* groq */ `*[_id == "lifestyleGallery"][0].images[] {
  "url": asset->url,
  "alt": ${loc('alt')}
}`;

export const SETTINGS_QUERY = /* groq */ `*[_id == "siteSettings"][0] {
  telephone,
  email,
  sameAs
}`;
