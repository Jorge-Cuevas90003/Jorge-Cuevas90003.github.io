/**
 * content.js — All human-readable copy for the portfolio, bilingual (es/en),
 * decoupled from the 3D data in eras.js. Keyed by era id.
 *
 * Each era exposes:
 *   label   — short word for the progress rail / HUD status
 *   eyebrow — // NN · SECTION code shown above the title and in the footer
 *   title   — the section heading
 *   lead    — the poetic biome line + the section's purpose
 *   ...kind-specific structured fields consumed by Sections.jsx
 *
 * Assets reference the live GitHub Pages site so the original project shots
 * and profile photo show up with zero extra files to ship.
 */

const IMG = 'https://jorge-cuevas90003.github.io/img';
// Original profile photo (imgur) is dead; the hex monogram fallback is used
// instead. Drop a real URL here to restore the photo.
const PROFILE = '';

export const SOCIALS = [
  { id: 'email',   icon: 'mail',   label: 'Email',      value: 'JDCM502@gmail.com',           href: 'mailto:JDCM502@gmail.com', primary: true },
  { id: 'github',  icon: 'github', label: 'GitHub',     value: 'Jorge-Cuevas90003',           href: 'https://github.com/Jorge-Cuevas90003' },
  { id: 'htb',     icon: 'target', label: 'HackTheBox', value: 'app.hackthebox.com',          href: 'https://app.hackthebox.com/public/users/2359387' },
  { id: 'thm',     icon: 'shield', label: 'TryHackMe',  value: 'tryhackme.com/p/DCuevas',     href: 'https://tryhackme.com/p/DCuevas' },
  { id: 'solo',    icon: 'spark',  label: 'SoloLearn',  value: 'profile/4770015',             href: 'https://www.sololearn.com/en/profile/4770015' },
];

export const CONTENT = {
  /* ── 01 · ABOUT ─────────────────────────────────────────────── */
  cosmic: {
    es: {
      label: 'Origen',
      eyebrow: '// 01 · ORIGEN CÓSMICO',
      title: 'Sobre mí',
      lead: 'Donde comienza todo: polvo de estrellas, roca y curiosidad.',
      photo: PROFILE,
      name: 'Jorge Cuevas',
      role: 'Software Developer · Full Stack',
      paragraphs: [
        'Estudiante de último año de Ingeniería en Ciencias de la Computación y desarrollador full-stack. Construyo software de punta a punta con foco en código mantenible, arquitectura sólida, seguridad y experiencia de usuario.',
        'De lo más bajo nivel —sistemas operativos en C— hasta apps móviles y web empresariales sobre .NET. Me mueve entender cómo funciona todo por dentro.',
      ],
      facts: [
        { k: 'Ubicación', v: 'Guatemala' },
        { k: 'Estado', v: 'Disponible' },
        { k: 'Enfoque', v: '.NET · Full Stack' },
      ],
    },
    en: {
      label: 'Origin',
      eyebrow: '// 01 · COSMIC ORIGIN',
      title: 'About me',
      lead: 'Where it all begins: stardust, rock and curiosity.',
      photo: PROFILE,
      name: 'Jorge Cuevas',
      role: 'Software Developer · Full Stack',
      paragraphs: [
        'Final-year Computer Science Engineering student and full-stack developer. I build software end to end with a focus on maintainable code, solid architecture, security and user experience.',
        'From the lowest level —operating systems in C— up to enterprise mobile and web apps on .NET. I am driven by understanding how everything works underneath.',
      ],
      facts: [
        { k: 'Location', v: 'Guatemala' },
        { k: 'Status', v: 'Available' },
        { k: 'Focus', v: '.NET · Full Stack' },
      ],
    },
  },

  /* ── 02 · EXPERIENCE ────────────────────────────────────────── */
  ocean: {
    es: {
      label: 'Océano',
      eyebrow: '// 02 · OCÉANO PRIMORDIAL',
      title: 'Experiencia',
      lead: 'La primera vida. Forjando software empresarial cada día.',
      jobs: [
        {
          role: 'Software Developer',
          company: 'Apparel Links, S.A.',
          place: 'Guatemala · Presencial',
          period: '2025 — Presente',
          points: [
            'Apps Android nativas con .NET MAUI, listas para distribución en Google Play.',
            'Aplicaciones web con Blazor Hybrid y APIs REST sobre ASP.NET Core.',
            'Persistencia en SQL Server y servicios en Azure; autenticación con JWT.',
          ],
          stack: ['.NET MAUI', 'Blazor', 'ASP.NET Core', 'SQL Server', 'Azure', 'JWT'],
        },
      ],
    },
    en: {
      label: 'Ocean',
      eyebrow: '// 02 · PRIMORDIAL OCEAN',
      title: 'Experience',
      lead: 'The first life. Forging enterprise software every day.',
      jobs: [
        {
          role: 'Software Developer',
          company: 'Apparel Links, S.A.',
          place: 'Guatemala · On-site',
          period: '2025 — Present',
          points: [
            'Native Android apps with .NET MAUI, prepared for Google Play distribution.',
            'Web apps with Blazor Hybrid and REST APIs on ASP.NET Core.',
            'SQL Server persistence and Azure services; JWT-based authentication.',
          ],
          stack: ['.NET MAUI', 'Blazor', 'ASP.NET Core', 'SQL Server', 'Azure', 'JWT'],
        },
      ],
    },
  },

  /* ── 03 · SKILLS ────────────────────────────────────────────── */
  dino: {
    es: {
      label: 'Dinosaurios',
      eyebrow: '// 03 · ERA DE LOS DINOSAURIOS',
      title: 'Habilidades',
      lead: 'Criaturas colosales. Las herramientas que muevo cada día.',
      groups: [
        { name: 'Lenguajes', items: ['C#', 'JavaScript', 'Python', 'Java', 'C', 'PHP', 'HTML/CSS', 'Assembly'] },
        { name: 'Frameworks', items: ['.NET MAUI', 'Blazor', 'ASP.NET Core', 'WinForms', 'Android Native', 'React'] },
        { name: 'Datos & Nube', items: ['SQL Server', 'MySQL', 'Azure', 'AWS', 'Firebase'] },
        { name: 'Seguridad & Tools', items: ['JWT', 'SAP Crystal Reports', 'Git', 'GitLab'] },
      ],
    },
    en: {
      label: 'Dinosaurs',
      eyebrow: '// 03 · AGE OF DINOSAURS',
      title: 'Skills',
      lead: 'Colossal creatures. The tools I move every day.',
      groups: [
        { name: 'Languages', items: ['C#', 'JavaScript', 'Python', 'Java', 'C', 'PHP', 'HTML/CSS', 'Assembly'] },
        { name: 'Frameworks', items: ['.NET MAUI', 'Blazor', 'ASP.NET Core', 'WinForms', 'Android Native', 'React'] },
        { name: 'Data & Cloud', items: ['SQL Server', 'MySQL', 'Azure', 'AWS', 'Firebase'] },
        { name: 'Security & Tools', items: ['JWT', 'SAP Crystal Reports', 'Git', 'GitLab'] },
      ],
    },
  },

  /* ── 04 · PROJECTS ──────────────────────────────────────────── */
  ice: {
    es: {
      label: 'Hielo',
      eyebrow: '// 04 · ERA DE HIELO',
      title: 'Proyectos',
      lead: 'Megafauna del Pleistoceno. Lo que he construido.',
      projects: [
        {
          name: 'BareMetal OS · BeagleBone',
          desc: 'Sistema operativo multitarea desde cero: scheduler round-robin cooperativo, gestión de memoria y CLI propia sobre BeagleBone Black.',
          img: `${IMG}/os-beaglebone.png`,
          tags: ['C', 'Bajo nivel', 'OS'],
          repo: 'https://github.com/Jorge-Cuevas90003/BareMetal-OS-BeagleBone',
        },
        {
          name: 'Android Community Hub',
          desc: 'App Android nativa con votación en tiempo real, visor de documentos y módulos de transparencia financiera.',
          img: `${IMG}/app-demo.gif`,
          tags: ['Java', 'Android', 'Firebase'],
          repo: 'https://github.com/Jorge-Cuevas90003/Android-Community-Hub',
        },
        {
          name: 'Desktop Sales Manager',
          desc: 'Sistema de gestión de ventas e inventario en C# WinForms con MySQL y reportes SAP Crystal Reports.',
          img: `${IMG}/sales-manager.png`,
          tags: ['C#', 'WinForms', 'MySQL', 'SAP'],
          repo: 'https://github.com/Jorge-Cuevas90003/CSharp-Desktop-Sales-Manager',
        },
        {
          name: 'Runge-Kutta Solver',
          desc: 'Resuelve EDOs con métodos numéricos (RK1, RK2, RK4); incluye graficado dinámico y análisis de error.',
          img: `${IMG}/runge-kutta.png`,
          tags: ['C#', 'Métodos numéricos', 'WinForms'],
          repo: 'https://github.com/Jorge-Cuevas90003/CSharp-Runge-Kutta-Solver',
        },
      ],
    },
    en: {
      label: 'Ice',
      eyebrow: '// 04 · ICE AGE',
      title: 'Projects',
      lead: 'Pleistocene megafauna. What I have built.',
      projects: [
        {
          name: 'BareMetal OS · BeagleBone',
          desc: 'A multitasking OS from scratch: cooperative round-robin scheduler, memory management and a custom CLI on the BeagleBone Black.',
          img: `${IMG}/os-beaglebone.png`,
          tags: ['C', 'Low-level', 'OS'],
          repo: 'https://github.com/Jorge-Cuevas90003/BareMetal-OS-BeagleBone',
        },
        {
          name: 'Android Community Hub',
          desc: 'Native Android app with real-time voting, a document viewer and financial-transparency modules.',
          img: `${IMG}/app-demo.gif`,
          tags: ['Java', 'Android', 'Firebase'],
          repo: 'https://github.com/Jorge-Cuevas90003/Android-Community-Hub',
        },
        {
          name: 'Desktop Sales Manager',
          desc: 'Sales & inventory management system in C# WinForms with MySQL and SAP Crystal Reports.',
          img: `${IMG}/sales-manager.png`,
          tags: ['C#', 'WinForms', 'MySQL', 'SAP'],
          repo: 'https://github.com/Jorge-Cuevas90003/CSharp-Desktop-Sales-Manager',
        },
        {
          name: 'Runge-Kutta Solver',
          desc: 'Solves ODEs with numerical methods (RK1, RK2, RK4); features dynamic plotting and error analysis.',
          img: `${IMG}/runge-kutta.png`,
          tags: ['C#', 'Numerical methods', 'WinForms'],
          repo: 'https://github.com/Jorge-Cuevas90003/CSharp-Runge-Kutta-Solver',
        },
      ],
    },
  },

  /* ── 05 · CERTIFICATES ──────────────────────────────────────── */
  civ: {
    es: {
      label: 'Civilización',
      eyebrow: '// 05 · CIVILIZACIÓN',
      title: 'Certificados',
      lead: 'El arte humano nace. Cada artefacto, una credencial ganada.',
      certGroups: [
        { name: 'Nube & DevOps', items: ['AWS Academy · Cloud Foundations S1', 'GitLab Remote Foundation'] },
        { name: 'Microsoft Office Specialist', items: ['Access 2016', 'Word 2016'] },
        { name: 'SoloLearn', items: ['SQL', 'Python for Beginners', 'HTML · CSS · Java', 'Tech for Everyone'] },
        { name: 'Otros', items: ['Progrentis PRO · Nivel 1', 'Canva · 200 Designs'] },
      ],
      badgesLabel: 'Ciberseguridad',
      badges: [
        { plat: 'TryHackMe', items: ['Hash Cracker', 'OWASP Top 10', 'Blue'] },
        { plat: 'HackTheBox', items: ['Titanic', 'Code', 'EscapeTwo'] },
      ],
    },
    en: {
      label: 'Civilization',
      eyebrow: '// 05 · CIVILIZATION',
      title: 'Certificates',
      lead: 'Human art is born. Each artifact, a credential earned.',
      certGroups: [
        { name: 'Cloud & DevOps', items: ['AWS Academy · Cloud Foundations S1', 'GitLab Remote Foundation'] },
        { name: 'Microsoft Office Specialist', items: ['Access 2016', 'Word 2016'] },
        { name: 'SoloLearn', items: ['SQL', 'Python for Beginners', 'HTML · CSS · Java', 'Tech for Everyone'] },
        { name: 'Others', items: ['Progrentis PRO · Level 1', 'Canva · 200 Designs'] },
      ],
      badgesLabel: 'Cybersecurity',
      badges: [
        { plat: 'TryHackMe', items: ['Hash Cracker', 'OWASP Top 10', 'Blue'] },
        { plat: 'HackTheBox', items: ['Titanic', 'Code', 'EscapeTwo'] },
      ],
    },
  },

  /* ── 06 · CONTACT ───────────────────────────────────────────── */
  future: {
    es: {
      label: 'Futuro',
      eyebrow: '// 06 · FUTURO',
      title: 'Contacto',
      lead: 'La humanidad alcanza las estrellas. Construyamos algo juntos.',
      body: 'El siguiente capítulo se escribe en equipo. Escríbeme y hablemos.',
    },
    en: {
      label: 'Future',
      eyebrow: '// 06 · FUTURE',
      title: 'Contact',
      lead: 'Humanity reaches the stars. Let us build something together.',
      body: 'The next chapter is written as a team. Reach out and let us talk.',
    },
  },
};
