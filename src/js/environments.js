/**
 * environments.js — Six immersive worlds that surround the camera.
 * Only the two adjacent environments are visible/animated at any time.
 * Each environment fades in/out via mesh opacity + light intensity multiplied
 * by an "intensity" 0..1 driven by scroll progress.
 *
 * Add new environments by pushing another buildXxx() into the array at bottom.
 */

import * as THREE from 'three';

/* ===========================================================
   Palette helper — single source of truth for atmosphere data
   =========================================================== */
const pal = (bg, fog, fogDensity, ambient, ambientI, hud) =>
  ({ bg, fog, fogDensity, ambient, ambientI, hud });

/* ===========================================================
   Env base class — all worlds share the fade-in/out mechanism
   =========================================================== */
class Env {
  constructor(id, label, palette) {
    this.id = id;
    this.label = label;
    this.palette = palette;
    this.root = new THREE.Group();
    this.root.visible = false;
    this._lights = [];
    this._mats = [];
    this._intensity = 0;
    this.update = () => {};
  }
  add(obj) { this.root.add(obj); return obj; }
  addLight(light) {
    this._lights.push({ light, base: light.intensity });
    this.root.add(light);
    return light;
  }
  /** Track a material so its opacity/emissive scale with env intensity. */
  fade(mat) {
    mat.transparent = true;
    this._mats.push({
      mat,
      baseOpacity: mat.opacity ?? 1,
      baseEmissive: mat.emissiveIntensity ?? 0,
    });
    return mat;
  }
  setIntensity(v) {
    this._intensity = v;
    this.root.visible = v > 0.005;
    for (const l of this._lights) l.light.intensity = l.base * v;
    for (const m of this._mats) {
      m.mat.opacity = m.baseOpacity * v;
      if (m.mat.emissive) m.mat.emissiveIntensity = m.baseEmissive * v;
    }
  }
}

/* ===========================================================
   1 · ORIGEN — Vacío estelar, núcleo de luz, halo wireframe
   =========================================================== */
function buildGenesis() {
  const env = new Env('genesis', 'Origen',
    pal(0x02030f, 0x02030f, 0.012, 0x6680cc, 0.45, '#88aaff'));

  // Starfield (large radius so it surrounds the camera)
  const starCount = 1200;
  const sp = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    sp[i*3]   = (Math.random() - 0.5) * 150;
    sp[i*3+1] = (Math.random() - 0.5) * 120;
    sp[i*3+2] = (Math.random() - 0.5) * 150;
  }
  const starsGeo = new THREE.BufferGeometry();
  starsGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const stars = new THREE.Points(starsGeo, env.fade(new THREE.PointsMaterial({
    color: 0xffffff, size: 0.18, sizeAttenuation: true,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })));
  env.add(stars);

  // Central glowing core
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 1),
    env.fade(new THREE.MeshBasicMaterial({ color: 0xaaccff }))
  );
  core.position.set(0, 1.5, -8);
  env.add(core);

  // Wireframe halo
  const halo = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 1),
    env.fade(new THREE.MeshBasicMaterial({ color: 0x88aaff, wireframe: true, opacity: 0.55 }))
  );
  halo.position.copy(core.position);
  env.add(halo);

  // Outer slow ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.02, 8, 96),
    env.fade(new THREE.MeshBasicMaterial({ color: 0xaaddff, opacity: 0.4 }))
  );
  ring.position.copy(core.position);
  ring.rotation.x = Math.PI / 2.3;
  env.add(ring);

  env.update = (t) => {
    if (env._intensity < 0.01) return;
    core.rotation.y = t * 0.2;
    core.rotation.x = t * 0.1;
    halo.rotation.y = -t * 0.13;
    halo.rotation.z = t * 0.08;
    ring.rotation.z = t * 0.4;
    stars.rotation.y = t * 0.01;
  };
  return env;
}

/* ===========================================================
   2 · SISTEMA — Synthwave grid, sol neon, ciudad silueta
   =========================================================== */
function buildNeonCity() {
  const env = new Env('neon', 'Sistema',
    pal(0x2a0a3a, 0x3a0a4d, 0.035, 0xff2e92, 0.55, '#ff2e92'));

  // Infinite grid
  const grid = new THREE.GridHelper(100, 80, 0xff2e92, 0x5e17eb);
  env.fade(grid.material);
  grid.material.opacity = 0.85;
  grid.position.y = -1;
  env.add(grid);

  // Neon sun (filled circle with horizontal cut bars)
  const sun = new THREE.Mesh(
    new THREE.CircleGeometry(5.5, 64),
    env.fade(new THREE.MeshBasicMaterial({ color: 0xffaa3a, side: THREE.DoubleSide }))
  );
  sun.position.set(0, 3, -28);
  env.add(sun);
  for (let i = 0; i < 5; i++) {
    const bar = new THREE.Mesh(
      new THREE.PlaneGeometry(13, 0.35),
      env.fade(new THREE.MeshBasicMaterial({ color: 0x2a0a3a }))
    );
    bar.position.set(0, 1.2 - i * 0.65, -27.9);
    env.add(bar);
  }

  // City silhouettes
  const cityMat = env.fade(new THREE.MeshBasicMaterial({ color: 0x14082a }));
  for (let i = 0; i < 16; i++) {
    const h = 2 + Math.random() * 5;
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(1 + Math.random()*1.4, h, 1.2),
      cityMat
    );
    b.position.set(-14 + i * 1.85, h/2 - 1, -20 + Math.random()*4);
    env.add(b);
  }

  // Neon side beams
  for (let i = 0; i < 6; i++) {
    const beam = new THREE.Mesh(
      new THREE.PlaneGeometry(0.06, 80),
      env.fade(new THREE.MeshBasicMaterial({ color: 0xff2e92, opacity: 0.6 }))
    );
    beam.position.set((i - 2.5) * 5, 4, -25);
    beam.rotation.z = Math.PI / 2;
    env.add(beam);
  }

  env.update = () => {
    if (env._intensity < 0.01) return;
    grid.position.z = (performance.now() * 0.001) % 2.5;
  };
  return env;
}

/* ===========================================================
   3 · FORJA — Bloques flotantes naranjas, brasas ascendiendo
   =========================================================== */
function buildForge() {
  const env = new Env('forge', 'Forja',
    pal(0x180802, 0x2d1100, 0.045, 0xff8a3a, 0.55, '#ff9d3a'));

  // Floating blocks ring
  const blocks = [];
  for (let i = 0; i < 14; i++) {
    const mat = env.fade(new THREE.MeshStandardMaterial({
      color: 0xff7a18, emissive: 0xff4a00, emissiveIntensity: 0.7,
      metalness: 0.5, roughness: 0.4,
    }));
    const size = 0.4 + Math.random() * 0.7;
    const b = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), mat);
    const angle = (i / 14) * Math.PI * 2;
    const radius = 3.5 + Math.random() * 2.5;
    b.position.set(Math.cos(angle) * radius, 0.5 + Math.random() * 3.5, -3 + Math.sin(angle) * radius);
    b.userData = {
      baseY: b.position.y,
      offset: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.5,
      spin: 0.2 + Math.random() * 0.6,
    };
    env.add(b);
    blocks.push(b);
  }

  // Rising embers
  const emberCount = 500;
  const ePos = new Float32Array(emberCount * 3);
  const eVel = new Float32Array(emberCount);
  for (let i = 0; i < emberCount; i++) {
    ePos[i*3]   = (Math.random() - 0.5) * 30;
    ePos[i*3+1] = Math.random() * 18 - 4;
    ePos[i*3+2] = (Math.random() - 0.5) * 28 - 4;
    eVel[i] = 0.02 + Math.random() * 0.05;
  }
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
  const embers = new THREE.Points(eGeo, env.fade(new THREE.PointsMaterial({
    color: 0xffaa3a, size: 0.14,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })));
  env.add(embers);

  // Central forge glow
  const glow = new THREE.PointLight(0xff7a18, 4, 30, 1.5);
  glow.position.set(0, 3, -3);
  env.addLight(glow);

  env.update = (t) => {
    if (env._intensity < 0.01) return;
    for (const b of blocks) {
      b.position.y = b.userData.baseY + Math.sin(t * b.userData.speed + b.userData.offset) * 0.6;
      b.rotation.x = t * b.userData.spin;
      b.rotation.y = t * b.userData.spin * 0.7;
    }
    const pos = embers.geometry.attributes.position.array;
    for (let i = 0; i < emberCount; i++) {
      pos[i*3+1] += eVel[i];
      if (pos[i*3+1] > 14) {
        pos[i*3+1] = -5;
        pos[i*3]   = (Math.random() - 0.5) * 30;
        pos[i*3+2] = (Math.random() - 0.5) * 28 - 4;
      }
    }
    embers.geometry.attributes.position.needsUpdate = true;
  };
  return env;
}

/* ===========================================================
   4 · CODIGO — Lluvia digital verde, wireframes pulsantes
   =========================================================== */
function buildDigitalRain() {
  const env = new Env('rain', 'Codigo',
    pal(0x000f08, 0x002414, 0.035, 0x00ff88, 0.4, '#00ff88'));

  // Falling code particles
  const count = 1400;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i*3]   = (Math.random() - 0.5) * 40;
    positions[i*3+1] = Math.random() * 30 - 5;
    positions[i*3+2] = (Math.random() - 0.5) * 32 - 4;
    speeds[i] = 0.08 + Math.random() * 0.18;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const rain = new THREE.Points(geo, env.fade(new THREE.PointsMaterial({
    color: 0x00ff88, size: 0.16,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })));
  env.add(rain);

  // Central pulsing icosahedron + nested octahedron
  const icos = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.6, 1),
    env.fade(new THREE.MeshBasicMaterial({ color: 0x00ff88, wireframe: true, opacity: 0.7 }))
  );
  icos.position.set(0, 1.6, -4);
  env.add(icos);

  const oct = new THREE.Mesh(
    new THREE.OctahedronGeometry(1, 0),
    env.fade(new THREE.MeshBasicMaterial({ color: 0x88ffcc, wireframe: true, opacity: 0.55 }))
  );
  oct.position.copy(icos.position);
  env.add(oct);

  env.update = (t) => {
    if (env._intensity < 0.01) return;
    const pos = rain.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i*3+1] -= speeds[i];
      if (pos[i*3+1] < -8) pos[i*3+1] = 22;
    }
    rain.geometry.attributes.position.needsUpdate = true;
    icos.rotation.y = t * 0.4;
    icos.rotation.x = t * 0.2;
    oct.rotation.y = -t * 0.7;
    const s = 1 + Math.sin(t * 2) * 0.12;
    oct.scale.setScalar(s);
  };
  return env;
}

/* ===========================================================
   5 · CONSTELACION — Red de nodos cyan conectados
   =========================================================== */
function buildConstellation() {
  const env = new Env('constellation', 'Constelacion',
    pal(0x040824, 0x0a1635, 0.025, 0x4080ff, 0.5, '#00d4ff'));

  const nodeCount = 22;
  const nodes = [];
  const pts = [];
  for (let i = 0; i < nodeCount; i++) {
    const v = new THREE.Vector3(
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.2) * 8,
      -3 + (Math.random() - 0.5) * 12,
    );
    pts.push(v);
    const mat = env.fade(new THREE.MeshBasicMaterial({ color: 0x00d4ff }));
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), mat);
    n.position.copy(v);
    n.userData = { base: v.clone(), phase: Math.random() * Math.PI * 2 };
    env.add(n);
    nodes.push(n);
    // Soft glow halo
    const g = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 12, 12),
      env.fade(new THREE.MeshBasicMaterial({ color: 0x00d4ff, opacity: 0.25,
        blending: THREE.AdditiveBlending, depthWrite: false }))
    );
    g.position.copy(v);
    env.add(g);
    n.userData.halo = g;
  }
  // Lines between close nodes
  const lineVerts = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (pts[i].distanceTo(pts[j]) < 5.5) {
        lineVerts.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
  const lines = new THREE.LineSegments(lineGeo, env.fade(new THREE.LineBasicMaterial({
    color: 0x00d4ff, opacity: 0.3,
  })));
  env.add(lines);

  env.update = (t) => {
    if (env._intensity < 0.01) return;
    for (const n of nodes) {
      const dy = Math.sin(t * 0.6 + n.userData.phase) * 0.35;
      n.position.y = n.userData.base.y + dy;
      n.userData.halo.position.y = n.position.y;
    }
    env.root.rotation.y = Math.sin(t * 0.08) * 0.15;
  };
  return env;
}

/* ===========================================================
   6 · HORIZONTE — Atardecer, agua, montañas, luciérnagas
   =========================================================== */
function buildAurora() {
  const env = new Env('aurora', 'Horizonte',
    pal(0xff8a6a, 0xffb88a, 0.025, 0xffd4a3, 0.7, '#ffd4a3'));

  // Sky dome with vertical gradient (custom shader)
  const skyMat = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    uniforms: {
      uTop: { value: new THREE.Color(0xff5e8a) },
      uMid: { value: new THREE.Color(0xff9a6a) },
      uBot: { value: new THREE.Color(0xffd4a3) },
      uOpacity: { value: 1 },
    },
    vertexShader: `
      varying float vY;
      void main(){
        vY = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying float vY;
      uniform vec3 uTop, uMid, uBot;
      uniform float uOpacity;
      void main(){
        float t = clamp((vY + 5.0) / 35.0, 0.0, 1.0);
        vec3 c = mix(uBot, uMid, smoothstep(0.0, 0.5, t));
        c = mix(c, uTop, smoothstep(0.5, 1.0, t));
        gl_FragColor = vec4(c, uOpacity);
      }`,
  });
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(60, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.5),
    skyMat
  );
  env.add(sky);

  // Reflective water
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80, 40, 40),
    env.fade(new THREE.MeshStandardMaterial({
      color: 0x1a1838, metalness: 0.92, roughness: 0.35, opacity: 0.95,
    }))
  );
  water.rotation.x = -Math.PI / 2;
  water.position.y = -1;
  env.add(water);

  // Distant mountains
  const mountMat = env.fade(new THREE.MeshBasicMaterial({ color: 0x2a1438 }));
  for (let i = 0; i < 7; i++) {
    const m = new THREE.Mesh(
      new THREE.ConeGeometry(4 + Math.random()*2, 5 + Math.random()*3, 4),
      mountMat
    );
    m.position.set(-18 + i * 6, 1, -24 + Math.random()*4);
    env.add(m);
  }

  // Fireflies
  const ffCount = 220;
  const ffPos = new Float32Array(ffCount * 3);
  const ffPhase = new Float32Array(ffCount);
  for (let i = 0; i < ffCount; i++) {
    ffPos[i*3]   = (Math.random() - 0.5) * 28;
    ffPos[i*3+1] = Math.random() * 6;
    ffPos[i*3+2] = (Math.random() - 0.5) * 22 - 3;
    ffPhase[i] = Math.random() * Math.PI * 2;
  }
  const ffGeo = new THREE.BufferGeometry();
  ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
  const fireflies = new THREE.Points(ffGeo, env.fade(new THREE.PointsMaterial({
    color: 0xffffaa, size: 0.2,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })));
  env.add(fireflies);

  // Override setIntensity to also tween the sky shader opacity
  const _setI = env.setIntensity.bind(env);
  env.setIntensity = (v) => {
    _setI(v);
    skyMat.uniforms.uOpacity.value = v;
    sky.visible = v > 0.005;
  };

  env.update = (t) => {
    if (env._intensity < 0.01) return;
    // Wave water surface
    const wp = water.geometry.attributes.position.array;
    for (let i = 0; i < wp.length; i += 3) {
      const x = wp[i], z = wp[i+1]; // plane was rotated; use orig coords
      wp[i+2] = Math.sin(x*0.3 + t)*0.08 + Math.cos(z*0.25 + t*0.7)*0.06;
    }
    water.geometry.attributes.position.needsUpdate = true;
    // Fireflies gentle drift
    const fp = fireflies.geometry.attributes.position.array;
    for (let i = 0; i < ffCount; i++) {
      fp[i*3+1] += Math.sin(t + ffPhase[i]) * 0.004;
      fp[i*3]   += Math.cos(t * 0.5 + ffPhase[i]) * 0.003;
    }
    fireflies.geometry.attributes.position.needsUpdate = true;
  };
  return env;
}

/* ===========================================================
   PUBLIC API
   =========================================================== */
export function createEnvironments(scene) {
  const envs = [
    buildGenesis(),
    buildNeonCity(),
    buildForge(),
    buildDigitalRain(),
    buildConstellation(),
    buildAurora(),
  ];
  for (const e of envs) scene.add(e.root);
  envs[0].setIntensity(1);
  return envs;
}

/**
 * Drives the two adjacent environments based on scroll progress 0..1.
 * Returns the active palettes + local blend factor (for fog/HUD interpolation).
 */
export function updateEnvironments(envs, elapsed, scrollT) {
  const N = envs.length;
  const seg = Math.min(N - 2, Math.max(0, Math.floor(scrollT * (N - 1))));
  const local = THREE.MathUtils.clamp(scrollT * (N - 1) - seg, 0, 1);

  for (let i = 0; i < N; i++) {
    if (i === seg)        envs[i].setIntensity(1 - local);
    else if (i === seg+1) envs[i].setIntensity(local);
    else                  envs[i].setIntensity(0);
  }
  envs[seg].update(elapsed);
  envs[seg+1].update(elapsed);

  return {
    seg,
    local,
    paletteA: envs[seg].palette,
    paletteB: envs[seg+1].palette,
  };
}
