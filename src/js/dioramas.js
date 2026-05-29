/**
 * dioramas.js — Six placeholder "islands" representing historical eras.
 * Each island is a THREE.Group at a diagonal-descending position.
 * Real GLB models (Sketchfab) will replace the placeholder meshes later
 * by loading into the same Group via GLTFLoader, no other code changes.
 */

import * as THREE from 'three';

/**
 * Era configuration — single source of truth.
 * keep positions, colors, and metadata aligned with HTML sections.
 */
export const ERAS = [
  {
    id: 'classic',
    label: 'Sobre mí',
    color: 0xd4af37,         // marble + gold
    accent: 0xfff4d6,
    position: new THREE.Vector3(0, 0, 0),
    cameraOffset: new THREE.Vector3(0, 3, 8),
    builder: buildClassic,
  },
  {
    id: 'medieval',
    label: 'Experiencia',
    color: 0x8b5a2b,         // wood/stone
    accent: 0xd9b382,
    position: new THREE.Vector3(8, -10, -8),
    cameraOffset: new THREE.Vector3(7, -7, -1),
    builder: buildMedieval,
  },
  {
    id: 'steampunk',
    label: 'Habilidades',
    color: 0xb87333,         // bronze copper
    accent: 0xffb347,
    position: new THREE.Vector3(-8, -20, -16),
    cameraOffset: new THREE.Vector3(-7, -17, -9),
    builder: buildSteampunk,
  },
  {
    id: 'retro',
    label: 'Proyectos',
    color: 0xff00aa,         // neon magenta
    accent: 0x00d4ff,
    position: new THREE.Vector3(8, -30, -24),
    cameraOffset: new THREE.Vector3(7, -27, -17),
    builder: buildRetro,
  },
  {
    id: 'space',
    label: 'Certificados',
    color: 0x3b82f6,         // tech blue
    accent: 0xe0e7ff,
    position: new THREE.Vector3(-8, -40, -32),
    cameraOffset: new THREE.Vector3(-7, -37, -25),
    builder: buildSpace,
  },
  {
    id: 'cyber',
    label: 'Contacto',
    color: 0x00ffff,         // cyber cyan
    accent: 0xff2e92,
    position: new THREE.Vector3(0, -50, -40),
    cameraOffset: new THREE.Vector3(0, -47, -33),
    builder: buildCyber,
  },
];

/**
 * Create all six dioramas + their per-era lights, return array of Group references
 * for visibility culling and later GLB swapping.
 */
export function createDioramas(scene) {
  const islands = [];

  for (let i = 0; i < ERAS.length; i++) {
    const era = ERAS[i];
    const group = new THREE.Group();
    group.position.copy(era.position);
    group.userData.era = era;
    group.userData.index = i;

    // Pedestal — shared base under every diorama
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3.4, 0.4, 32),
      new THREE.MeshStandardMaterial({
        color: 0x0a0f1f,
        metalness: 0.6,
        roughness: 0.4,
        emissive: era.color,
        emissiveIntensity: 0.05,
      })
    );
    pedestal.position.y = -0.2;
    pedestal.receiveShadow = true;
    group.add(pedestal);

    // Era-specific shape (placeholder until GLB arrives)
    era.builder(group, era);

    // Per-era point light — colored to match the era palette
    const light = new THREE.PointLight(era.color, 8, 25, 1.6);
    light.position.set(0, 4, 2);
    light.castShadow = true;
    light.shadow.mapSize.set(512, 512);
    light.shadow.bias = -0.001;
    group.add(light);

    // Accent rim light (opposite side)
    const rim = new THREE.PointLight(era.accent, 3, 15, 2);
    rim.position.set(-2, 1, -2);
    group.add(rim);

    scene.add(group);
    islands.push(group);
  }

  return islands;
}

// =========================================================
// PLACEHOLDER BUILDERS — one per era
// Replace these with GLTFLoader().load(...) when GLBs are ready.
// =========================================================

function buildClassic(group, era) {
  // Greek column (cylinder + capital + base) + a small statue cube
  const colMat = new THREE.MeshStandardMaterial({
    color: 0xf2eedb, roughness: 0.6, metalness: 0.1,
  });
  for (let i = -1; i <= 1; i++) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 4, 16, 1, false), colMat);
    col.position.set(i * 1.6, 2, -0.8);
    col.castShadow = true;
    group.add(col);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 1), colMat);
    cap.position.set(i * 1.6, 4.1, -0.8);
    cap.castShadow = true;
    group.add(cap);
  }
  // Pedestal centerpiece
  const statue = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.8, 0),
    new THREE.MeshStandardMaterial({ color: era.color, metalness: 0.7, roughness: 0.3 })
  );
  statue.position.set(0, 1.2, 0.8);
  statue.castShadow = true;
  group.add(statue);
}

function buildMedieval(group, era) {
  // Stone tower with cone roof + small wall stubs
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6b6760, roughness: 0.9 });
  const woodMat  = new THREE.MeshStandardMaterial({ color: era.color, roughness: 0.7 });

  const tower = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.1, 4, 16), stoneMat);
  tower.position.y = 2;
  tower.castShadow = true;
  group.add(tower);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.5, 12), woodMat);
  roof.position.y = 4.75;
  roof.castShadow = true;
  group.add(roof);

  // Wing wall
  const wall = new THREE.Mesh(new THREE.BoxGeometry(3, 1.6, 0.4), stoneMat);
  wall.position.set(2.2, 0.8, 0);
  wall.castShadow = true;
  group.add(wall);
}

function buildSteampunk(group, era) {
  // Big brass gear (torus) + smaller gears + chimney
  const brass = new THREE.MeshStandardMaterial({ color: era.color, metalness: 0.85, roughness: 0.3 });
  const copper = new THREE.MeshStandardMaterial({ color: era.accent, metalness: 0.9, roughness: 0.25 });

  const gear = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.4, 16, 24), brass);
  gear.position.set(0, 2, 0);
  gear.rotation.x = Math.PI / 2;
  gear.castShadow = true;
  group.add(gear);

  const gearSmall = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.25, 12, 18), copper);
  gearSmall.position.set(2, 1.4, 0.4);
  gearSmall.rotation.x = Math.PI / 2;
  gearSmall.castShadow = true;
  group.add(gearSmall);

  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 3.5, 12), brass);
  chimney.position.set(-1.8, 1.75, -0.5);
  chimney.castShadow = true;
  group.add(chimney);
}

function buildRetro(group, era) {
  // CRT monitor (box + screen) with magenta/cyan neon strips
  const caseMat = new THREE.MeshStandardMaterial({ color: 0x222230, roughness: 0.5 });
  const screenMat = new THREE.MeshStandardMaterial({
    color: era.accent, emissive: era.accent, emissiveIntensity: 1.2, roughness: 0.2,
  });
  const neonMat = new THREE.MeshStandardMaterial({
    color: era.color, emissive: era.color, emissiveIntensity: 1.8, roughness: 0.3,
  });

  const crt = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 1.6), caseMat);
  crt.position.set(0, 1.2, 0);
  crt.castShadow = true;
  group.add(crt);

  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.3), screenMat);
  screen.position.set(0, 1.25, 0.81);
  group.add(screen);

  for (let i = 0; i < 3; i++) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.08), neonMat);
    strip.position.set(0, 0.25 + i * 0.2, 0.85);
    group.add(strip);
  }
}

function buildSpace(group, era) {
  // Satellite dish + console (icosahedron + box)
  const metal = new THREE.MeshStandardMaterial({ color: 0xd6d8db, metalness: 0.9, roughness: 0.25 });
  const tech  = new THREE.MeshStandardMaterial({
    color: era.color, emissive: era.color, emissiveIntensity: 0.6, metalness: 0.4, roughness: 0.3,
  });

  // Dish — half-sphere (sphere clipped via geometry parameters)
  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    metal
  );
  dish.position.set(0, 2.8, 0);
  dish.rotation.x = Math.PI;
  dish.castShadow = true;
  group.add(dish);

  // Pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3, 8), metal);
  pole.position.set(0, 1.5, 0);
  group.add(pole);

  // Console
  const console_ = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 1.4), tech);
  console_.position.set(0, 0.3, 1.2);
  console_.castShadow = true;
  group.add(console_);

  // Beacon icosahedron
  const beacon = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.4, 0),
    new THREE.MeshStandardMaterial({
      color: era.accent, emissive: era.accent, emissiveIntensity: 1.5,
    })
  );
  beacon.position.set(-1.8, 0.8, 1.2);
  group.add(beacon);
}

function buildCyber(group, era) {
  // Holographic torus-knot + neon ring base
  const holo = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.32, 96, 16),
    new THREE.MeshStandardMaterial({
      color: era.color, emissive: era.color, emissiveIntensity: 1.4,
      metalness: 0.6, roughness: 0.2,
    })
  );
  holo.position.set(0, 2.2, 0);
  holo.castShadow = true;
  group.add(holo);

  // Magenta neon ring around base
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.4, 0.05, 8, 64),
    new THREE.MeshStandardMaterial({
      color: era.accent, emissive: era.accent, emissiveIntensity: 2,
    })
  );
  ring.position.y = 0.05;
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
}

/**
 * Tick — per-frame motion for the dioramas (gentle rotation of the centerpiece).
 * Called from main render loop.
 */
export function animateDioramas(islands, elapsed) {
  for (const island of islands) {
    // Rotate only if visible — avoid wasted work
    if (!island.visible) continue;
    const era = island.userData.era;
    // Spin the era's centerpiece-ish first non-pedestal-non-light child
    for (const child of island.children) {
      if (child.isMesh && child.geometry.type !== 'CylinderGeometry') {
        if (era.id === 'cyber' || era.id === 'steampunk' || era.id === 'classic') {
          child.rotation.y = elapsed * 0.4;
        }
        break;
      }
    }
  }
}
