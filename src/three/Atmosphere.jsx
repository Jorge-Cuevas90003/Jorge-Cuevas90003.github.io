import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store.js';
import { ERAS } from '../eras.js';

/**
 * Atmosphere — the living environment driver. Each frame it converts global
 * scroll progress into a fractional era index, lerps fog color/density,
 * background and ambient between the two adjacent era palettes, and pushes
 * the blended accent color into CSS custom properties so the HTML HUD morphs
 * in perfect sync with the 3D world.
 */
function hexToRgb(hex) {
  const c = new THREE.Color(hex);
  return [Math.round(c.r * 255), Math.round(c.g * 255), Math.round(c.b * 255)];
}

export default function Atmosphere() {
  const { scene } = useThree();
  const fog = useMemo(() => new THREE.FogExp2('#04030f', 0.02), []);
  const bg = useMemo(() => new THREE.Color('#04030f'), []);
  const root = useMemo(() => document.documentElement, []);

  // scratch colors reused each frame
  const cA = useRef(new THREE.Color());
  const cB = useRef(new THREE.Color());
  const accent = useRef(new THREE.Color());

  useFrame(() => {
    const progress = useStore.getState().progress;
    const fIndex = progress * (ERAS.length - 1);
    const i = Math.min(ERAS.length - 1, Math.floor(fIndex));
    const j = Math.min(ERAS.length - 1, i + 1);
    const t = fIndex - i;

    const a = ERAS[i].palette;
    const b = ERAS[j].palette;

    // background — lifted out of pure black so the artifacts read against it
    cA.current.set(a.bg); cB.current.set(b.bg);
    bg.copy(cA.current).lerp(cB.current, t);
    bg.offsetHSL(0, 0, 0.06);
    scene.background = bg;

    // fog color + density — thinner + lighter so objects aren't swallowed
    cA.current.set(a.fog); cB.current.set(b.fog);
    fog.color.copy(cA.current).lerp(cB.current, t);
    fog.color.offsetHSL(0, 0, 0.05);
    fog.density = THREE.MathUtils.lerp(a.fogDensity, b.fogDensity, t) * 0.5;
    scene.fog = fog;

    // accent → CSS custom properties (drive HUD)
    accent.current.set(a.hud).lerp(cB.current.set(b.hud), t);
    const [r, g, bl] = hexToRgb('#' + accent.current.getHexString());
    root.style.setProperty('--accent', `rgb(${r},${g},${bl})`);
    root.style.setProperty('--accent-glow', `rgba(${r},${g},${bl},0.55)`);
    root.style.setProperty('--accent-soft', `rgba(${r},${g},${bl},0.18)`);
  });

  return null;
}
