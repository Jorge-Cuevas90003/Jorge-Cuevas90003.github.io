/**
 * i18n.js — UI chrome strings (HUD, toggles, footer) + a tiny helper.
 * Section copy lives in content.js; this file is only the shell text.
 */

export const UI = {
  es: {
    tagline: 'FULL STACK · GUATEMALA',
    scrollHint: 'desplázate para viajar en el tiempo',
    progressTitle: 'LÍNEA DE TIEMPO',
    license: 'Modelos 3D © Naturhistorisches Museum Wien · Sketchfab · CC BY-NC',
    themeToDark: 'Tema oscuro',
    themeToLight: 'Tema claro',
    langToggle: 'English',
    viewCode: 'Ver código',
    open: 'Abrir',
  },
  en: {
    tagline: 'FULL STACK · GUATEMALA',
    scrollHint: 'scroll to travel through time',
    progressTitle: 'TIMELINE',
    license: '3D models © Naturhistorisches Museum Wien · Sketchfab · CC BY-NC',
    themeToDark: 'Dark theme',
    themeToLight: 'Light theme',
    langToggle: 'Español',
    viewCode: 'View code',
    open: 'Open',
  },
};

/** Resolve a possibly-localized value: returns v[lang] when v is {es,en}. */
export const t = (v, lang) =>
  v && typeof v === 'object' && !Array.isArray(v) && (lang in v) ? v[lang] : v;
