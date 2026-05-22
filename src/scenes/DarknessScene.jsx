import { useMemo } from 'react';
import './scenes.css';

function EmberParticles() {
  const embers = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    dur: `${4 + Math.random() * 6}s`,
    delay: `${-Math.random() * 8}s`,
    size: 1.5 + Math.random() * 2,
    drift: `${(Math.random() - 0.5) * 40}px`,
  })), []);

  return (
    <div className="ember-container">
      {embers.map(e => (
        <div key={e.id} className="ember"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            animationDuration: e.dur,
            animationDelay: e.delay,
            '--drift': e.drift,
          }}
        />
      ))}
    </div>
  );
}

export default function DarknessScene({ activeTriggers = [] }) {
  return (
    <div className="scene darkness-scene">
      <img className="scene-bg" src="/images/tbosw-darkness.png" alt=""
        style={{ objectPosition: 'center center' }} />
      <div className="scene-vignette"
        style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)' }} />
      <EmberParticles />
      <div className="darkness-swirl" />
    </div>
  );
}
