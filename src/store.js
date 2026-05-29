import { create } from 'zustand';

/**
 * Global UI + scroll state.
 *  - ScrollTrigger / Sections write `progress` (0..1); everything 3D reads it.
 *  - `activeEra` is the nearest era index (culling + HUD).
 *  - `lang` / `theme` are user preferences, persisted to localStorage and
 *    mirrored onto <html data-lang data-theme> so CSS + markup react together.
 */

const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};

const persist = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode / disabled storage — ignore */
  }
};

/** Reflect a preference on the <html> element so CSS selectors can target it. */
export const applyDoc = (lang, theme) => {
  const el = document.documentElement;
  el.dataset.lang = lang;
  el.dataset.theme = theme;
  el.setAttribute('lang', lang);
};

const initialLang = read('p3d-lang', 'es');
const initialTheme = read('p3d-theme', 'dark');
applyDoc(initialLang, initialTheme);

export const useStore = create((set, get) => ({
  progress: 0,
  activeEra: 0,
  ready: false,
  lang: initialLang,
  theme: initialTheme,

  setProgress: (progress, activeEra) => set({ progress, activeEra }),
  setReady: (ready) => set({ ready }),

  toggleLang: () => {
    const lang = get().lang === 'es' ? 'en' : 'es';
    persist('p3d-lang', lang);
    applyDoc(lang, get().theme);
    set({ lang });
  },

  toggleTheme: () => {
    const theme = get().theme === 'dark' ? 'light' : 'dark';
    persist('p3d-theme', theme);
    applyDoc(get().lang, theme);
    set({ theme });
  },
}));
