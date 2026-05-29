/**
 * scroll.js — GSAP ScrollTrigger that drives env blending + camera parallax.
 * Camera barely moves (subtle drift via mouse); the WORLD changes around it.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SECTION_COUNT = 6;

export function bindScroll(sectionsRoot) {
  const state = { progress: 0, activeIndex: 0 };

  ScrollTrigger.create({
    trigger: sectionsRoot,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    onUpdate: (self) => {
      state.progress = self.progress;
      state.activeIndex = Math.min(
        SECTION_COUNT - 1,
        Math.round(self.progress * (SECTION_COUNT - 1))
      );
    },
  });

  return state;
}

/**
 * Subtle camera drift based on mouse position (parallax depth).
 * Returns a per-frame update function for the render loop.
 */
export function bindCameraParallax(camera) {
  const target = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 0.6;
    target.y = (e.clientY / window.innerHeight - 0.5) * 0.35;
  }, { passive: true });

  return function updateCamera() {
    camera.position.x += (target.x - camera.position.x) * 0.04;
    camera.position.y += ((1.6 - target.y) - camera.position.y) * 0.04;
    camera.lookAt(0, 1.5, -4);
  };
}
