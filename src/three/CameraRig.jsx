import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store.js';
import { SPACING, ERAS } from '../eras.js';

/**
 * CameraRig — flies the camera along -Z through the biomes as the user scrolls.
 * Target Z = 12 - progress * (N-1) * SPACING (starts just in front of era 0).
 * Adds subtle pointer parallax and critically-damped easing so motion feels
 * weighty rather than snapping to the scroll value.
 */
export default function CameraRig() {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const targetZ = useRef(12);

  // pointer parallax (normalized -1..1)
  if (typeof window !== 'undefined' && !CameraRig._bound) {
    CameraRig._bound = true;
    window.addEventListener('pointermove', (e) => {
      CameraRig._px = (e.clientX / window.innerWidth) * 2 - 1;
      CameraRig._py = (e.clientY / window.innerHeight) * 2 - 1;
    });
  }

  useFrame((_, dt) => {
    const progress = useStore.getState().progress;
    const span = (ERAS.length - 1) * SPACING;
    targetZ.current = 12 - progress * span;

    const px = CameraRig._px || 0;
    const py = CameraRig._py || 0;

    // damping factor independent of frame rate
    const k = 1 - Math.pow(0.0015, dt);

    const desiredX = px * 2.2;
    const desiredY = 1.2 - py * 1.4;
    const desiredZ = targetZ.current;

    camera.position.x += (desiredX - camera.position.x) * k;
    camera.position.y += (desiredY - camera.position.y) * k;
    camera.position.z += (desiredZ - camera.position.z) * k;

    // always look a little ahead down the path
    const lookZ = desiredZ - 14;
    camera.lookAt(px * 1.2, 1.0, lookZ);
  });

  return null;
}
