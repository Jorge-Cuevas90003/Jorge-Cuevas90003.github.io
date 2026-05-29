/**
 * visibility.js — Per-frame dynamic visibility for dioramas
 * Uses frustum culling + a generous "render window" around the active era
 * to keep draw calls low while preserving smooth fly-through transitions.
 */

import * as THREE from 'three';

const WINDOW_SIZE = 2; // render activeIndex ± WINDOW_SIZE islands

const frustum = new THREE.Frustum();
const projScreenMatrix = new THREE.Matrix4();
const sphere = new THREE.Sphere(new THREE.Vector3(), 6); // approx bounding sphere per island

export function updateVisibility(camera, islands, state) {
  // 1. Recompute frustum from current camera
  projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  frustum.setFromProjectionMatrix(projScreenMatrix);

  // 2. Decide per island
  for (let i = 0; i < islands.length; i++) {
    const island = islands[i];
    const inWindow = Math.abs(i - state.activeIndex) <= WINDOW_SIZE;
    if (!inWindow) {
      island.visible = false;
      continue;
    }
    // Within window — only render if frustum agrees
    sphere.center.copy(island.position);
    island.visible = frustum.intersectsSphere(sphere);
  }
}
