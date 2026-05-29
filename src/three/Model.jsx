import { useMemo, useRef } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Loads a GLB, auto-normalizes it to a target max-dimension `size`, re-centers
 * it at the origin, and (optionally) wraps it in drei <Float> for organic idle
 * motion. Museum scans arrive at wildly different scales — this makes them
 * uniform and composable.
 *
 * `spin` (radians/sec) turns the artifact continuously around its own centre,
 * like a museum turntable. A per-model phase offset (hashed from the url) keeps
 * the whole biome from rotating in lockstep. The spin lives on a group OUTSIDE
 * the centring group so it rotates about the visual centre, not the scan origin.
 */
function hashPhase(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 6283;
  return h / 1000; // 0..~6.28 rad
}

export default function Model({
  url, size = 2, position = [0, 0, 0], rotationY = 0, spin = 0,
  float = true, floatSpeed = 1.1, floatRot = 0.35, floatPos = 0.5,
}) {
  const { scene } = useGLTF(url);

  // Clone so the cached scene can be reused safely (StrictMode double-mount).
  const cloned = useMemo(() => scene.clone(true), [scene]);

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const dims = new THREE.Vector3();
    box.getSize(dims);
    const maxDim = Math.max(dims.x, dims.y, dims.z) || 1;
    const s = size / maxDim;
    const center = new THREE.Vector3();
    box.getCenter(center);
    return { scale: s, offset: center.multiplyScalar(-s) };
  }, [cloned, size]);

  const spinner = useRef();
  const phase = useMemo(() => hashPhase(url), [url]);

  // Drive rotation from the clock (not accumulation) so it survives re-renders.
  useFrame((state) => {
    if (spinner.current) {
      spinner.current.rotation.y = rotationY + phase + state.clock.elapsedTime * spin;
    }
  });

  const content = (
    <group ref={spinner} rotation={[0, rotationY + phase, 0]}>
      <group scale={scale} position={offset}>
        <primitive object={cloned} />
      </group>
    </group>
  );

  if (!float) {
    return <group position={position}>{content}</group>;
  }

  return (
    <Float position={position} speed={floatSpeed} rotationIntensity={floatRot} floatIntensity={floatPos}>
      {content}
    </Float>
  );
}
