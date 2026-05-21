import { useEffect, useState } from 'react';
import './scenes.css';

export default function FieldScene({ activeTriggers = [] }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const ps = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 12}s`,
      animationDelay: `${-Math.random() * 12}s`,
      size: `${3 + Math.random() * 5}px`,
      opacity: 0.3 + Math.random() * 0.4,
    }));
    setParticles(ps);
  }, []);

  return (
    <div className="scene field-scene">
      <img className="scene-bg" src="/images/tbosw-lady.jpg" alt="" />
      <div className="scene-vignette" />
      <div className="river-shimmer-overlay" />
      {particles.map(p => (
        <div
          key={p.id}
          className="dandelion"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
