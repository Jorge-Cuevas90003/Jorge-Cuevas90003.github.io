/**
 * eras.js — Single source of truth for the 6-era evolutionary timeline (3D).
 * Each era is a "biome" centered at z = -index * SPACING along the camera path.
 * Models reference GLB files in /public/models (auto-normalized + centered at load).
 *
 * Text content (bilingual ES/EN) lives in content.js, keyed by era id.
 * `kind` selects which rich panel layout Sections.jsx renders.
 *
 * palette: { bg, fog, fogDensity, ambient, ambientI, light, lightI, hud }
 * particles: visual system id rendered around the biome ('stars' | 'bubbles' | ...)
 * models[]: { file, size (target max-dimension), pos [x,y,z], rotY?, hero? }
 */

export const SPACING = 55; // world units between era centers along -Z

export const ERAS = [
  /* ============ 1 · CÓSMICO ============ */
  {
    id: 'cosmic',
    kind: 'about',
    palette: {
      bg: '#04030f', fog: '#06040f', fogDensity: 0.013,
      ambient: '#5566aa', ambientI: 0.45, light: '#aabbff', lightI: 2.2, hud: '#88aaff',
    },
    particles: 'stars',
    models: [
      { file: '1a_meteorite_youndegin', size: 3.4, pos: [0, 1.6, 0], hero: true },
      { file: '1b_meteorite_hraschina', size: 1.7, pos: [-4.5, 3.0, -4] },
      { file: '1c_meteorite_cabincreek', size: 2.2, pos: [4.2, 0.4, -3] },
      { file: '1d_turquoise_talisman', size: 1.5, pos: [2.4, 3.4, -5] },
    ],
  },

  /* ============ 2 · OCÉANO PRIMORDIAL ============ */
  {
    id: 'ocean',
    kind: 'experience',
    palette: {
      bg: '#021a2e', fog: '#02283f', fogDensity: 0.032,
      ambient: '#2a7faa', ambientI: 0.5, light: '#40c0ff', lightI: 2.4, hud: '#2ec5ff',
    },
    particles: 'bubbles',
    models: [
      { file: '2a_giant_crabs', size: 4.2, pos: [0, 0.8, 0], hero: true },
      { file: '2b_ammonite_giant', size: 2.6, pos: [-5, 2.6, -4] },
      { file: '2c_hammerhead_jaw', size: 2.2, pos: [5, 3.0, -3] },
      { file: '2d_giant_clam', size: 2.4, pos: [-3.5, -0.6, -2] },
      { file: '2e_madagascar_ammonite', size: 1.8, pos: [4, -0.4, -5] },
      { file: '2f_sunfish', size: 2.6, pos: [-6, 0.4, -7] },
      { file: '2g_beluga_sturgeon', size: 3.0, pos: [3, 1.4, -8] },
    ],
  },

  /* ============ 3 · DINOSAURIOS & FÓSILES ============ */
  {
    id: 'dino',
    kind: 'skills',
    palette: {
      bg: '#14160a', fog: '#1f2410', fogDensity: 0.022,
      ambient: '#8a9a4a', ambientI: 0.5, light: '#d4c060', lightI: 2.6, hud: '#c5d44a',
    },
    particles: 'spores',
    models: [
      { file: '3a_plateosaurus', size: 5.0, pos: [0, 1.4, 0], hero: true },
      { file: '3c_terror_bird', size: 3.6, pos: [-5.5, 1.6, -4] },
      { file: '3b_protoceratops', size: 2.8, pos: [5, 0.6, -3] },
      { file: '3f_psittacosaurus', size: 2.2, pos: [-3.5, 0.2, -6] },
      { file: '3d_trilobite', size: 1.6, pos: [3.5, 2.8, -5] },
      { file: '3e_megalodon_tooth', size: 1.4, pos: [-1.5, 3.4, -7] },
    ],
  },

  /* ============ 4 · ERA DE HIELO ============ */
  {
    id: 'ice',
    kind: 'projects',
    palette: {
      bg: '#0a1a2a', fog: '#16334d', fogDensity: 0.026,
      ambient: '#88bbdd', ambientI: 0.6, light: '#d0eeff', lightI: 2.8, hud: '#a8e0ff',
    },
    particles: 'snow',
    models: [
      { file: '4a_sabertooth', size: 3.6, pos: [0, 1.2, 0], hero: true },
      { file: '4b_giant_deer', size: 4.4, pos: [-6, 1.8, -5] },
      { file: '4c_cave_bear', size: 3.4, pos: [5.5, 1.2, -4] },
      { file: '4d_bison', size: 3.4, pos: [-4, 0.8, -8] },
      { file: '4e_hoe_tusker', size: 2.4, pos: [4, 2.6, -7] },
      { file: '4f_primeval_horse', size: 2.6, pos: [1.5, 0.4, -10] },
    ],
  },

  /* ============ 5 · CIVILIZACIÓN ============ */
  {
    id: 'civ',
    kind: 'certs',
    palette: {
      bg: '#1a0e06', fog: '#2d1608', fogDensity: 0.026,
      ambient: '#c08040', ambientI: 0.5, light: '#ffae5a', lightI: 2.8, hud: '#ff9d4a',
    },
    particles: 'embers',
    models: [
      { file: '5a_venus_willendorf', size: 2.4, pos: [0, 1.5, 0], hero: true },
      { file: '5b_antenna_dagger', size: 3.4, pos: [-5, 2.0, -4] },
      { file: '5c_situla_kuffarn', size: 2.2, pos: [5, 1.0, -3] },
      { file: '5d_seated_idol', size: 2.0, pos: [-3.5, 0.4, -6] },
      { file: '5e_bronze_sword', size: 2.8, pos: [3.5, 2.8, -5] },
      { file: '5f_bird_wagon', size: 2.6, pos: [-1.5, 0.2, -8] },
      { file: '5g_bull_figure', size: 1.8, pos: [4.5, -0.2, -9] },
    ],
  },

  /* ============ 6 · FUTURO ============ */
  {
    id: 'future',
    kind: 'contact',
    palette: {
      bg: '#0a0518', fog: '#160a2e', fogDensity: 0.02,
      ambient: '#6a4ad4', ambientI: 0.5, light: '#c060ff', lightI: 2.6, hud: '#c050ff',
    },
    particles: 'grid',
    models: [
      { file: '6a_spacesuit', size: 4.4, pos: [0, 1.6, 0], hero: true },
      { file: '6c_helios', size: 3.4, pos: [-5.5, 2.2, -4] },
      { file: '6b_selene_moon', size: 2.6, pos: [5, 1.4, -3] },
      { file: '6d_mercury_figure', size: 2.4, pos: [-3.5, 0.6, -6] },
      { file: '6g_air_figure', size: 2.4, pos: [4, 2.6, -5] },
      { file: '6e_typewriter', size: 1.8, pos: [-1.5, 0.0, -8] },
      { file: '6f_beam_scale', size: 2.0, pos: [4, -0.2, -9] },
    ],
  },
];

/** World-space center of an era biome. */
export const eraCenter = (i) => [0, 0, -i * SPACING];
