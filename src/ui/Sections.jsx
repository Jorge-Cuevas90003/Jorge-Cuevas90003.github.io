import { useEffect, useRef } from 'react';
import { ERAS } from '../eras.js';
import { CONTENT, SOCIALS } from '../content.js';
import { UI } from '../i18n.js';
import { useStore } from '../store.js';
import Icon from './Icon.jsx';

/**
 * Sections — the scrollable editorial layer. Each era is a full-viewport panel
 * laid out on a Swiss grid: a number/kicker, a large Fraunces title that reveals
 * character-by-character, and content typeset as clean hairline-ruled lists.
 * A passive scroll listener feeds 0..1 progress + nearest era to the store.
 */

const onImgError = (e) => { e.currentTarget.closest('.project-thumb').dataset.broken = 'true'; };
const cleanEyebrow = (s) => s.replace(/^\/\/\s*\d+\s*·\s*/, '');

/** Splits text into word-masks of rising characters for the title reveal. */
function Split({ text }) {
  let ci = 0;
  const words = text.split(' ');
  return (
    <span className="split" aria-label={text}>
      {words.map((word, wi) => (
        <span className="t-word" key={wi} aria-hidden="true">
          {[...word].map((ch, k) => (
            <span className="t-char" style={{ '--ci': ci++ }} key={k}>{ch}</span>
          ))}
        </span>
      ))}
    </span>
  );
}

function Reveal({ i = 0, className = '', as: Tag = 'div', ...rest }) {
  return <Tag className={`reveal ${className}`} style={{ '--i': i }} {...rest} />;
}

/* ── per-kind bodies ───────────────────────────────────────────── */

function About({ c }) {
  return (
    <>
      {c.paragraphs.map((p, k) => <Reveal as="p" key={k} i={2 + k} className="panel-body">{p}</Reveal>)}
      <Reveal i={2 + c.paragraphs.length} className="facts">
        {c.facts.map((f) => (
          <div className="row" key={f.k}><em>{f.k}</em><strong>{f.v}</strong></div>
        ))}
      </Reveal>
    </>
  );
}

function Experience({ c }) {
  return c.jobs.map((job, k) => (
    <Reveal key={k} i={2 + k} className="job">
      <div className="job-head">
        <strong>{job.role}</strong><span className="at">—</span><span className="co">{job.company}</span>
      </div>
      <div className="job-meta"><span>{job.period}</span><span>{job.place}</span></div>
      <ul className="job-points">{job.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
      <div className="tags">{job.stack.map((s) => <span key={s}>{s}</span>)}</div>
    </Reveal>
  ));
}

function Skills({ c }) {
  return c.groups.map((g, k) => (
    <Reveal key={g.name} i={2 + k} className="skill-row">
      <span className="grp">{g.name}</span>
      <span className="items">{g.items.map((s) => <span key={s}>{s}</span>)}</span>
    </Reveal>
  ));
}

function Projects({ c, ui }) {
  return c.projects.map((p, k) => (
    <Reveal key={p.name} i={2 + k} className="project">
      <div className="project-info">
        <span className="project-num">{String(k + 1).padStart(2, '0')}</span>
        <h3 className="project-name">{p.name}</h3>
        <p className="project-desc">{p.desc}</p>
        <div className="tags" style={{ marginBottom: '0.9rem' }}>{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
        <a className="project-repo" href={p.repo} target="_blank" rel="noopener noreferrer">
          {ui.viewCode} <Icon name="arrowUpRight" size={14} />
        </a>
      </div>
      <span className="project-thumb" data-broken="false">
        <img src={p.img} alt={p.name} loading="lazy" onError={onImgError} />
        <span className="project-thumb-fallback"><Icon name="code" size={22} /></span>
      </span>
    </Reveal>
  ));
}

function Certs({ c }) {
  return (
    <>
      {c.certGroups.map((g, k) => (
        <Reveal key={g.name} i={2 + k} className="cert-row">
          <span className="grp">{g.name}</span>
          <ul>{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
        </Reveal>
      ))}
      <Reveal i={2 + c.certGroups.length} className="badges">
        <div className="b-title">{c.badgesLabel}</div>
        {c.badges.map((b) => (
          <div className="badge-line" key={b.plat}>
            <span className="plat">
              <Icon name={b.plat === 'HackTheBox' ? 'target' : 'shield'} size={14} />{b.plat}
            </span>
            <div className="tags">{b.items.map((it) => <span key={it}>{it}</span>)}</div>
          </div>
        ))}
      </Reveal>
    </>
  );
}

function Contact({ c }) {
  return (
    <>
      <Reveal as="p" i={2} className="panel-body">{c.body}</Reveal>
      <Reveal i={3} className="contact-list">
        {SOCIALS.map((s, k) => (
          <a
            className="contact-row"
            key={s.id}
            href={s.href}
            target={s.href.startsWith('http') ? '_blank' : undefined}
            rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <span className="c-label">{s.label}</span>
            <span className="c-val">{s.value}</span>
            <Icon name="arrowUpRight" size={18} />
          </a>
        ))}
      </Reveal>
    </>
  );
}

const BODY = { about: About, experience: Experience, skills: Skills, projects: Projects, certs: Certs, contact: Contact };

export default function Sections() {
  const setProgress = useStore((s) => s.setProgress);
  const activeEra = useStore((s) => s.activeEra);
  const lang = useStore((s) => s.lang);
  const ui = UI[lang];
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const max = document.body.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        const era = Math.round(p * (ERAS.length - 1));
        setProgress(p, era);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [setProgress]);

  return (
    <div id="sections">
      <span id="top" />
      {ERAS.map((era, i) => {
        const c = CONTENT[era.id][lang];
        const Body = BODY[era.kind];
        return (
          <section
            key={era.id}
            className={`section section-${era.kind}${i === activeEra ? ' is-active' : ''}`}
            data-index={i}
          >
            <article className={`panel panel-${era.kind}`}>
              <Reveal i={0} className="kicker">
                <span className="k-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="k-rule" />
                <span className="k-label">{cleanEyebrow(c.eyebrow)}</span>
              </Reveal>
              <h2 className="panel-title"><Split text={c.title} /></h2>
              <Reveal as="p" i={1} className="panel-lead">{c.lead}</Reveal>
              <Body c={c} ui={ui} />
            </article>
          </section>
        );
      })}
    </div>
  );
}
