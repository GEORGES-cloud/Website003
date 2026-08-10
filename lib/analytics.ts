'use client';
import { track } from '@vercel/analytics';

/* Envoltorio único de analítica: los componentes llaman a trackEvent y si
   algún día se cambia Vercel Analytics por Plausible/Umami solo se toca
   este archivo. Nota: los eventos custom requieren el plan Pro de Vercel;
   en el plan Hobby las pageviews se registran y los eventos se ignoran. */
export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  try {
    track(name, props);
  } catch {
    /* la analítica nunca debe romper la web */
  }
}
