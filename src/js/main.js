/**
 * main.js — Entry point. Boots scene, environments, scroll, HUD, render loop.
 */

import * as THREE from 'three';
import { createStage, bindResize, blendScene } from './scene.js';
import { createEnvironments, updateEnvironments } from './environments.js';
import { bindScroll, bindCameraParallax } from './scroll.js';
import { bindHud } from './hud.js';

const canvas = document.getElementById('stage');
const sectionsRoot = document.getElementById('sections');

const { scene, camera, renderer } = createStage(canvas);
const envs = createEnvironments(scene);
const scrollState = bindScroll(sectionsRoot);
const updateCamera = bindCameraParallax(camera);
const updateHud = bindHud();
bindResize(camera, renderer);

const clock = new THREE.Clock();

function frame() {
  const t = clock.getElapsedTime();

  // 1. Advance the two adjacent environments + capture palettes
  const { paletteA, paletteB, local } =
    updateEnvironments(envs, t, scrollState.progress);

  // 2. Interpolate global atmosphere (fog, bg, ambient)
  blendScene(scene, paletteA, paletteB, local);

  // 3. Camera parallax + HUD
  updateCamera();
  updateHud(scrollState, paletteA, paletteB, local, camera);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
frame();

// ---------- Console banner ----------
console.log(
  '%c[Portafolio 3D] booted',
  'color:#88aaff;font-weight:700;text-shadow:0 0 6px rgba(136,170,255,0.5)'
);
console.log(`Environments: ${envs.map(e => e.id).join(' → ')}`);
console.log('Scroll para atravesar los mundos. Click en los indicadores para saltar.');
