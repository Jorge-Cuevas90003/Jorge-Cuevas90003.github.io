import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Particles — one GPU points cloud per era, themed by `type`.
 * All variants share a buffer of randomized positions inside a box volume;
 * the per-type config tweaks count, size, color, opacity and drift motion so
 * each biome breathes differently (stars twinkle, bubbles rise, snow falls…).
 */
const CONFIG = {
  stars:   { count: 420, size: 0.06, color: '#aabbff', opacity: 0.9, drift: [0, 0.02, 0], twinkle: true },
  bubbles: { count: 260, size: 0.10, color: '#9fe8ff', opacity: 0.6, drift: [0, 0.35, 0] },
  spores:  { count: 300, size: 0.05, color: '#d4e08a', opacity: 0.7, drift: [0.05, 0.04, 0] },
  snow:    { count: 380, size: 0.07, color: '#eaf6ff', opacity: 0.85, drift: [0.04, -0.3, 0] },
  embers:  { count: 240, size: 0.06, color: '#ffae5a', opacity: 0.8, drift: [0.02, 0.45, 0], twinkle: true },
  grid:    { count: 320, size: 0.05, color: '#c060ff', opacity: 0.75, drift: [0, 0.06, 0], twinkle: true },
};

const VOL = new THREE.Vector3(26, 18, 26); // particle box half-extents per axis

export default function Particles({ type = 'stars', seed = 0 }) {
  const cfg = CONFIG[type] || CONFIG.stars;
  const ref = useRef();

  const positions = useMemo(() => {
    const arr = new Float32Array(cfg.count * 3);
    let s = seed * 9301 + 49297;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < cfg.count; i++) {
      arr[i * 3 + 0] = (rnd() - 0.5) * VOL.x;
      arr[i * 3 + 1] = (rnd() - 0.5) * VOL.y;
      arr[i * 3 + 2] = (rnd() - 0.5) * VOL.z;
    }
    return arr;
  }, [cfg.count, seed]);

  useFrame((_, dt) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array;
    const [dx, dy, dz] = cfg.drift;
    for (let i = 0; i < cfg.count; i++) {
      let y = arr[i * 3 + 1] + dy * dt;
      let x = arr[i * 3 + 0] + dx * dt;
      // wrap within the volume so the field is endless
      if (y > VOL.y / 2) y = -VOL.y / 2;
      if (y < -VOL.y / 2) y = VOL.y / 2;
      if (x > VOL.x / 2) x = -VOL.x / 2;
      if (x < -VOL.x / 2) x = VOL.x / 2;
      arr[i * 3 + 0] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] += dz * dt;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    if (cfg.twinkle && pts.material) {
      pts.material.opacity = cfg.opacity * (0.7 + 0.3 * Math.sin(performance.now() * 0.002 + seed));
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={cfg.count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={cfg.size}
        color={cfg.color}
        transparent
        opacity={cfg.opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
