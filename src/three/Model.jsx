import { useMemo } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Loads a GLB, auto-normalizes it to a target max-dimension `size`, re-centers
 * it at the origin, and (optionally) wraps it in drei <Float> for organic idle
 * motion. Museum scans arrive at wildly different scales — this makes them
 * uniform and composable.
 */
export default function Model({
  url, size = 2, position = [0, 0, 0], rotationY = 0,
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

  const content = (
    <group scale={scale} position={offset}>
      <primitive object={cloned} />
    </group>
  );

  if (!float) {
    return (
      <group position={position} rotation={[0, rotationY, 0]}>
        {content}
      </group>
    );
  }

  return (
    <Float
      position={position}
      rotation={[0, rotationY, 0]}
      speed={floatSpeed}
      rotationIntensity={floatRot}
      floatIntensity={floatPos}
    >
      {content}
    </Float>
  );
}
