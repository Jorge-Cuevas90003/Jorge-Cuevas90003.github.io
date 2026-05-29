/**
 * scene.js — Three.js stage + dynamic atmosphere blending.
 * The scene's fog, background, and ambient light are interpolated each frame
 * between the palettes of the two adjacent environments based on scroll progress.
 */

import * as THREE from 'three';

export function createStage(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02030f);
  scene.fog = new THREE.FogExp2(0x02030f, 0.018);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.set(0, 1.6, 6);
  camera.lookAt(0, 1.5, -3);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // Single shared ambient — color + intensity tween per environment
  const ambient = new THREE.AmbientLight(0x88aaff, 0.5);
  scene.add(ambient);
  scene.userData.ambient = ambient;

  return { scene, camera, renderer };
}

export function bindResize(camera, renderer) {
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize, { passive: true });
  return () => window.removeEventListener('resize', onResize);
}

// Reusable colors to avoid GC churn each frame
const _a = new THREE.Color();
const _b = new THREE.Color();

/**
 * Interpolate global scene atmosphere between two environment palettes.
 */
export function blendScene(scene, paletteA, paletteB, t) {
  _a.set(paletteA.bg);
  _b.set(paletteB.bg);
  scene.background.copy(_a).lerp(_b, t);

  _a.set(paletteA.fog);
  _b.set(paletteB.fog);
  scene.fog.color.copy(_a).lerp(_b, t);
  scene.fog.density = paletteA.fogDensity * (1 - t) + paletteB.fogDensity * t;

  _a.set(paletteA.ambient);
  _b.set(paletteB.ambient);
  scene.userData.ambient.color.copy(_a).lerp(_b, t);
  scene.userData.ambient.intensity =
    paletteA.ambientI * (1 - t) + paletteB.ambientI * t;
}
