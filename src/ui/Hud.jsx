import { ERAS } from '../eras.js';
import { CONTENT } from '../content.js';
import { UI } from '../i18n.js';
import { useStore } from '../store.js';
import Icon from './Icon.jsx';

/**
 * Hud — the fixed overlay chrome: brand + controls (language / theme), the
 * left timeline rail, a first-load scroll hint, and the bottom status/license
 * bar. Accent colors come from CSS vars driven by Atmosphere, so every element
 * morphs in sync with the active biome.
 */
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
      <header className="hud-top">
        <a className="hud-brand" href="#top" aria-label="Jorge Cuevas">
          <span className="hud-mark">JC</span>
          <span className="hud-brand-text">
            <strong>JORGE&nbsp;CUEVAS</strong>
            <em>{ui.tagline}</em>
          </span>
        </a>

        <div className="hud-controls">
          <span className="hud-status">
            <span className="status-dot" />
            {active?.label?.toUpperCase()} · {Math.round(progress * 100)}%
          </span>
          <button
            type="button"
            className="hud-toggle"
            onClick={toggleLang}
            title={ui.langToggle}
            aria-label={ui.langToggle}
          >
            <Icon name="globe" size={15} />
            <span>{lang === 'es' ? 'ES' : 'EN'}</span>
          </button>
          <button
            type="button"
            className="hud-toggle icon-only"
            onClick={toggleTheme}
            title={theme === 'dark' ? ui.themeToLight : ui.themeToDark}
            aria-label={theme === 'dark' ? ui.themeToLight : ui.themeToDark}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
          </button>
        </div>
      </header>

      <nav className="hud-progress" aria-label={ui.progressTitle}>
        <span className="rail-title">{ui.progressTitle}</span>
        <ol>
          {ERAS.map((era, i) => {
            const c = CONTENT[era.id][lang];
            return (
              <li
                key={era.id}
                className={i === activeEra ? 'active' : i < activeEra ? 'passed' : ''}
                onClick={() => scrollToEra(i)}
              >
                <span className="rail-num">{String(i + 1).padStart(2, '0')}</span>
                <em>{c.title}</em>
                <i className="rail-dot" />
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="scroll-hint" data-hidden={progress > 0.02}>
        <span>{ui.scrollHint}</span>
        <Icon name="arrow" size={16} />
      </div>

      <footer className="hud-bottom">
        <span className="footer-coord">◇ {active?.eyebrow}</span>
        <span className="footer-version">{ui.license}</span>
      </footer>
    </>
  );
}
