import { useEffect, useRef, useState } from 'react';
import './scenes.css';

function Particle({ style }) {
  return <div className="particle" style={style} />;
}

export default function FieldScene({ activeTriggers = [] }) {
  const [particles, setParticles] = useState([]);
  const [cloakedVisible, setCloakedVisible] = useState(false);

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

  useEffect(() => {
    if (activeTriggers.includes('TRANSITION_TO_CLOAKED_FIGURE')) {
      setTimeout(() => setCloakedVisible(true), 800);
    }
  }, [activeTriggers]);

  return (
    <div className="scene field-scene">
      {/* Sky gradient */}
      <div className="field-sky" />
      {/* Stars */}
      <div className="field-stars" />
      {/* Horizon glow */}
      <div className="field-horizon" />
      {/* River */}
      <div className="field-river">
        <div className="river-shimmer" />
      </div>
      {/* Grass layers */}
      <div className="field-grass-far" />
      <div className="field-grass-near" />
      {/* Lady in White silhouette */}
      <div className="silhouette lady-silhouette" />
      {/* Cloaked Figure across river */}
      {cloakedVisible && (
        <div className="silhouette cloak-silhouette field-cloak" />
      )}
      {/* Dandelion particles */}
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
