'use client';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { projectId, dataset } from './sanity/env';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';

/* Panel de edición del cliente, embebido en /studio de la propia web.
   Los tipos con documento único no deben poder crearse desde "New document". */
const SINGLETONS = new Set(['legalDoc', 'lifestyleGallery', 'siteSettings']);

export default defineConfig({
  name: 'flamingo',
  title: 'Flamingo Yacht Club',
  basePath: '/studio',
  // Placeholder hasta crear el proyecto en sanity.io (ver PROXIMOS-PASOS.md):
  // el Studio no conectará, pero la web compila y funciona con datos locales.
  projectId: projectId || 'pendiente0',
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool(),
    internationalizedArray({
      languages: [
        { id: 'es', title: 'Español' },
        { id: 'en', title: 'English' },
        { id: 'sv', title: 'Svenska' },
        { id: 'ru', title: 'Русский' },
        { id: 'de', title: 'Deutsch' },
        { id: 'fr', title: 'Français' },
      ],
      defaultLanguages: ['es'],
      fieldTypes: ['string', 'text'],
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (prev) => prev.filter((item) => !SINGLETONS.has(item.templateId)),
  },
});
