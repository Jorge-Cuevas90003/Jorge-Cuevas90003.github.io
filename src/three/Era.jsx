import { Suspense } from 'react';
import Model from './Model.jsx';
import Particles from './Particles.jsx';
import { eraCenter } from '../eras.js';

const BASE = import.meta.env.BASE_URL || '/';
const modelUrl = (file) => `${BASE}models/${file}.glb`;

/**
 * Era — one evolutionary biome. Positions all of its models + lights +
 * particle field around the era's world-space center (z = -index*SPACING).
 * Rendered only when within the active window (parent culls), so the heavy
 * GLBs of distant eras never mount.
 */
export default function Era({ era, index, active }) {
  const [cx, cy, cz] = eraCenter(index);
  const { palette } = era;

  return (
    <group position={[cx, cy, cz]}>
      {/* Per-biome key + ambient light, tinted to the palette */}
      <ambientLight color={palette.ambient} intensity={palette.ambientI} />
      <pointLight
        color={palette.light}
        intensity={palette.lightI * 6}
        distance={60}
        decay={2}
        position={[0, 6, 8]}
      />
      <pointLight
        color={palette.light}
        intensity={palette.lightI * 2}
        distance={40}
        decay={2}
        position={[-8, -4, 4]}
      />

      <Particles type={era.particles} seed={index + 1} />

      <Suspense fallback={null}>
        {era.models.map((m, i) => (
          <Model
            key={m.file}
            url={modelUrl(m.file)}
            size={m.size}
            position={m.pos}
            rotationY={m.rotY || 0}
            float={!m.hero}
            floatSpeed={0.8 + (i % 3) * 0.25}
            floatRot={m.hero ? 0.15 : 0.3}
            floatPos={m.hero ? 0.3 : 0.6}
          />
        ))}
      </Suspense>
    </group>
  );
}
