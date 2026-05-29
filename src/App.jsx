import { Suspense } from 'react';
import { Loader } from '@react-three/drei';
import Scene from './three/Scene.jsx';
import Hud from './ui/Hud.jsx';
import Sections from './ui/Sections.jsx';

/**
 * App — composes the fixed full-screen 3D canvas behind the scrollable HTML
 * content and the fixed HUD overlay. The drei <Loader> shows GLB download
 * progress on first paint.
 */
export default function App() {
  return (
    <>
      <div className="stage-wrap">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <div className="stage-veil" />
        <div className="stage-grain" />
      </div>
      <Hud />
      <Sections />
      <Loader
        containerStyles={{ background: 'rgba(2,3,15,0.85)' }}
        barStyles={{ background: 'var(--accent, #88aaff)' }}
        dataStyles={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem' }}
      />
    </>
  );
}
