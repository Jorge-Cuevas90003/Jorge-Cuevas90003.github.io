import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import Atmosphere from './Atmosphere.jsx';
import CameraRig from './CameraRig.jsx';
import Era from './Era.jsx';
import { ERAS } from '../eras.js';
import { useStore } from '../store.js';

const BASE = import.meta.env.BASE_URL || '/';
const modelUrl = (file) => `${BASE}models/${file}.glb`;

/**
 * Eras — renders only the active era and its immediate neighbours so distant
 * (heavy) GLBs never mount. Preloads the models of the next/previous era so a
 * biome is ready by the time the camera arrives.
 */
function Eras() {
  const activeEra = useStore((s) => s.activeEra);

  useEffect(() => {
    [activeEra - 1, activeEra, activeEra + 1].forEach((idx) => {
      const era = ERAS[idx];
      if (era) era.models.forEach((m) => useGLTF.preload(modelUrl(m.file)));
    });
  }, [activeEra]);

  return ERAS.map((era, i) =>
    Math.abs(i - activeEra) <= 1 ? (
      <Era key={era.id} era={era} index={i} active={i === activeEra} />
    ) : null
  );
}

export default function Scene() {
  return (
    <Canvas
      className="r3f-canvas"
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.2, 12], fov: 50, near: 0.1, far: 400 }}
    >
      <Atmosphere />
      <CameraRig />
      <Suspense fallback={null}>
        <Eras />
      </Suspense>
      <EffectComposer disableNormalPass>
        <Bloom
          intensity={0.85}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
