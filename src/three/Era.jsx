import { Suspense } from 'react';
import Model from './Model.jsx';
import Particles from './Particles.jsx';
import { eraCenter } from '../eras.js';

const BASE = import.meta.env.BASE_URL || '/';
const modelUrl = (file) => `${BASE}models/${file}.glb`;

/**
 * Era — one evolutionary biome. Positions its museum scans, biome lights and
 * thematic particle field around the era's world-space center (z=-index*SPACING).
 * Models are presented honestly (gently floating, well-lit) so the artifacts —
 * not gimmicks — carry the scene. Rendered only inside the active window
 * (parent culls), so distant heavy GLBs never mount.
 */
export default function Era({ era, index, active }) {
  const [cx, cy, cz] = eraCenter(index);
  const { palette } = era;

  return (
    <group position={[cx, cy, cz]}>
      {/* Lighting: a hemisphere + ambient give a strong, distance-independent
          base fill so no artifact is in shadow; three point lights add tinted
          directional shaping and cover the full width where models sit. */}
      <ambientLight color={palette.ambient} intensity={1.1} />
      <hemisphereLight color={palette.light} groundColor={palette.fog} intensity={1.9} />
      <pointLight color={palette.light} intensity={palette.lightI * 14} distance={100} decay={2} position={[0, 7, 9]} />
      <pointLight color={palette.light} intensity={palette.lightI * 7} distance={80} decay={2} position={[-9, -3, 5]} />
      <pointLight color={palette.light} intensity={palette.lightI * 7} distance={80} decay={2} position={[9, 2, 6]} />

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
            /* continuous turntable spin — hero slow & centred, satellites a
               touch faster and in alternating directions for variety */
            spin={m.hero ? 0.22 : (i % 2 ? -1 : 1) * (0.3 + (i % 3) * 0.07)}
          />
        ))}
      </Suspense>
    </group>
  );
}
