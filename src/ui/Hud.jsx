import { ERAS } from '../eras.js';
import { CONTENT } from '../content.js';
import { UI } from '../i18n.js';
import { useStore } from '../store.js';
import Icon from './Icon.jsx';

/**
 * Hud — minimal editorial chrome: a name lockup, text controls (language /
 * theme), a numbered side index, a first-load scroll hint, faint margin grid
 * rules and a footer. Accent appears only on the active index number, kept in
 * sync with the biome by Atmosphere.jsx.
 */
const cleanEyebrow = (s) => s.replace(/^\/\/\s*\d+\s*·\s*/, '');

function scrollToEra(i) {
  const max = document.body.scrollHeight - window.innerHeight;
  const y = (i / (ERAS.length - 1)) * max;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

export default function Hud() {
  const activeEra = useStore((s) => s.activeEra);
  const progress = useStore((s) => s.progress);
  const lang = useStore((s) => s.lang);
  const theme = useStore((s) => s.theme);
  const toggleLang = useStore((s) => s.toggleLang);
  const toggleTheme = useStore((s) => s.toggleTheme);

  const ui = UI[lang];
  const active = CONTENT[ERAS[activeEra]?.id]?.[lang];

  return (
    <>
      <div className="grid-lines" aria-hidden="true"><i /><i /></div>

      <header className="hud-top">
        <a className="hud-brand" href="#top">
          <strong>Jorge Cuevas</strong>
          <em>Software Developer — Full Stack</em>
        </a>

        <div className="hud-controls">
          <button type="button" className="hud-btn-text lang" onClick={toggleLang} aria-label={ui.langToggle}>
            <span className={lang === 'es' ? 'on' : ''}>ES</span>
            <span className="sep">/</span>
            <span className={lang === 'en' ? 'on' : ''}>EN</span>
          </button>
          <button
            type="button"
            className="hud-btn-text"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? ui.themeToLight : ui.themeToDark}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
          </button>
        </div>
      </header>

      <nav className="hud-progress" aria-label={ui.progressTitle}>
        <span className="rail-title">{ui.progressTitle}</span>
        <ol>
          {ERAS.map((era, i) => {
            const c = CONTENT[era.id][lang];
            return (
              <li key={era.id} className={i === activeEra ? 'active' : ''} onClick={() => scrollToEra(i)}>
                <em>{c.title}</em>
                <span className="rail-num">{String(i + 1).padStart(2, '0')}</span>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="scroll-hint" data-hidden={progress > 0.02}>
        <Icon name="arrow" size={14} />
        <span>{ui.scrollHint}</span>
      </div>

      <footer className="hud-bottom">
        <span className="footer-coord">{active?.eyebrow && cleanEyebrow(active.eyebrow)}</span>
        <span className="footer-version">{ui.license}</span>
      </footer>
    </>
  );
}
