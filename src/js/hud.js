/**
 * hud.js — Dynamic HUD updates: active section indicator + accent color
 * tweening + camera coord readout. CSS reads --accent / --accent-glow /
 * --accent-soft (set on :root) so every HUD element morphs in sync.
 */

const progressItems = document.querySelectorAll('.hud-progress li');
const coordEl = document.getElementById('cam-coord');
const sectionEls = document.querySelectorAll('.section');
const root = document.documentElement;

function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

export function bindHud() {
  // Click-to-jump on progress indicators
  progressItems.forEach((li) => {
    li.addEventListener('click', () => {
      const target = Number(li.dataset.target);
      const sec = document.querySelector(`.section[data-index="${target}"]`);
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  let lastActive = -1;

  return function update(state, palA, palB, local, camera) {
    // Active progress indicator
    if (state.activeIndex !== lastActive) {
      lastActive = state.activeIndex;
      progressItems.forEach((li, i) => {
        li.classList.toggle('active', i === state.activeIndex);
        li.classList.toggle('passed', i < state.activeIndex);
      });
      sectionEls.forEach((s, i) => {
        s.classList.toggle('is-active', i === state.activeIndex);
      });
    }

    // Blend HUD accent color between the two adjacent env palettes
    const [ar, ag, ab] = hexToRgb(palA.hud);
    const [br, bg, bb] = hexToRgb(palB.hud);
    const r = Math.round(ar * (1 - local) + br * local);
    const g = Math.round(ag * (1 - local) + bg * local);
    const b = Math.round(ab * (1 - local) + bb * local);
    root.style.setProperty('--accent', `rgb(${r}, ${g}, ${b})`);
    root.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.55)`);
    root.style.setProperty('--accent-soft', `rgba(${r}, ${g}, ${b}, 0.18)`);

    // Camera coords
    const p = camera.position;
    coordEl.textContent =
      `CAM // ${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}`;
  };
}
