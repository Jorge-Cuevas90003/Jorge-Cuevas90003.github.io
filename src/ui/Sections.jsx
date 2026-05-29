import { useEffect, useRef } from 'react';
import { ERAS } from '../eras.js';
import { CONTENT, SOCIALS } from '../content.js';
import { UI } from '../i18n.js';
import { useStore } from '../store.js';
import Icon from './Icon.jsx';

/**
 * Sections — the scrollable HTML layer. Each era gets a full-viewport panel
 * whose layout is chosen by `era.kind`. A passive scroll listener converts
 * scrollTop into 0..1 progress + nearest era index and writes them to the
 * store, which the whole 3D scene reads from. Children tagged `.reveal`
 * animate in with a stagger driven by the inline --i custom property.
 */

/* hide a broken remote image gracefully instead of showing an alt box */
const onImgError = (e) => { e.currentTarget.parentElement.dataset.broken = 'true'; };

function Reveal({ i = 0, className = '', as: Tag = 'div', ...rest }) {
  return <Tag className={`reveal ${className}`} style={{ '--i': i }} {...rest} />;
}

/* ── per-kind panel bodies ─────────────────────────────────────── */

function About({ c }) {
  return (
    <>
      <Reveal i={2} className="about-head">
        <span className="about-photo" data-broken={c.photo ? 'false' : 'true'}>
          {c.photo && <img src={c.photo} alt={c.name} loading="lazy" onError={onImgError} />}
          <span className="about-photo-fallback">{c.name.split(' ').map((w) => w[0]).join('')}</span>
        </span>
        <span className="about-id">
          <strong>{c.name}</strong>
          <em>{c.role}</em>
        </span>
      </Reveal>
      {c.paragraphs.map((p, k) => (
        <Reveal as="p" key={k} i={3 + k} className="panel-body">{p}</Reveal>
      ))}
      <Reveal i={3 + c.paragraphs.length} className="fact-grid">
        {c.facts.map((f) => (
          <span key={f.k} className="fact">
            <em>{f.k}</em>
            <strong>{f.v}</strong>
          </span>
        ))}
      </Reveal>
    </>
  );
}

function Experience({ c }) {
  return c.jobs.map((job, k) => (
    <Reveal key={k} i={2 + k} className="job">
      <span className="job-top">
        <Icon name="briefcase" size={18} />
        <span>
          <strong>{job.role}</strong>
          <em>{job.company}</em>
        </span>
        <span className="job-period">{job.period}</span>
      </span>
      <span className="job-place"><Icon name="pin" size={13} /> {job.place}</span>
      <ul className="job-points">
        {job.points.map((p, j) => <li key={j}>{p}</li>)}
      </ul>
      <span className="chip-row">
        {job.stack.map((s) => <span key={s} className="chip">{s}</span>)}
      </span>
    </Reveal>
  ));
}

function Skills({ c }) {
  return c.groups.map((g, k) => (
    <Reveal key={g.name} i={2 + k} className="skill-group">
      <em className="skill-group-name">{g.name}</em>
      <span className="chip-row">
        {g.items.map((s) => <span key={s} className="chip">{s}</span>)}
      </span>
    </Reveal>
  ));
}

function Projects({ c, ui }) {
  return c.projects.map((p, k) => (
    <Reveal key={p.name} i={2 + k} className="project">
      <span className="project-thumb" data-broken="false">
        <img src={p.img} alt={p.name} loading="lazy" onError={onImgError} />
        <span className="project-thumb-fallback"><Icon name="code" size={26} /></span>
      </span>
      <span className="project-body">
        <strong className="project-name">{p.name}</strong>
        <span className="project-desc">{p.desc}</span>
        <span className="chip-row">
          {p.tags.map((tg) => <span key={tg} className="chip">{tg}</span>)}
        </span>
        <a className="project-repo" href={p.repo} target="_blank" rel="noopener noreferrer">
          <Icon name="github" size={15} /> {ui.viewCode}
          <Icon name="external" size={13} className="trail" />
        </a>
      </span>
    </Reveal>
  ));
}

function Certs({ c }) {
  return (
    <>
      <div className="cert-grid">
        {c.certGroups.map((g, k) => (
          <Reveal key={g.name} i={2 + k} className="cert-group">
            <em className="cert-group-name">{g.name}</em>
            <ul>{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </Reveal>
        ))}
      </div>
      <Reveal i={2 + c.certGroups.length} className="badge-block">
        <em className="cert-group-name">{c.badgesLabel}</em>
        {c.badges.map((b) => (
          <span key={b.plat} className="badge-line">
            <span className="badge-plat">
              <Icon name={b.plat === 'HackTheBox' ? 'target' : 'shield'} size={14} />
              {b.plat}
            </span>
            <span className="chip-row">
              {b.items.map((it) => <span key={it} className="chip chip-badge">{it}</span>)}
            </span>
          </span>
        ))}
      </Reveal>
    </>
  );
}

function Contact({ c }) {
  return (
    <>
      <Reveal as="p" i={2} className="panel-body">{c.body}</Reveal>
      <div className="contact-grid">
        {SOCIALS.map((s, k) => (
          <Reveal
            as="a"
            key={s.id}
            i={3 + k}
            className={`contact-card${s.primary ? ' primary' : ''}`}
            href={s.href}
            target={s.href.startsWith('http') ? '_blank' : undefined}
            rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <Icon name={s.icon} size={20} />
            <span>
              <strong>{s.label}</strong>
              <em>{s.value}</em>
            </span>
            <Icon name="arrow" size={15} className="contact-arrow" />
          </Reveal>
        ))}
      </div>
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
              <Reveal as="span" i={0} className="panel-eyebrow">{c.eyebrow}</Reveal>
              <Reveal as="h2" i={1} className="panel-title">{c.title}</Reveal>
              <Reveal as="p" i={1} className="panel-lead">{c.lead}</Reveal>
              <Body c={c} ui={ui} />
            </article>
          </section>
        );
      })}
    </div>
  );
}
