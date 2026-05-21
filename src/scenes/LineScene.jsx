import { useEffect, useState } from 'react';
import './scenes.css';

export default function LineScene({ activeTriggers = [] }) {
  const [girlVisible, setGirlVisible] = useState(false);
  const [girlPos, setGirlPos] = useState(110);

  useEffect(() => {
    if (activeTriggers.includes('SPAWN_THE_GIRL') && !girlVisible) {
      setGirlVisible(true);
      setGirlPos(110);
      requestAnimationFrame(() => {
        setTimeout(() => setGirlPos(68), 50);
      });
    }
  }, [activeTriggers]);

  const figures = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div className="scene line-scene">
      {/* Hazy sky */}
      <div className="line-sky" />
      {/* Ground */}
      <div className="line-ground" />
      {/* Dust shimmer */}
      <div className="line-dust" />
      {/* Perspective queue */}
      <div className="queue-container">
        {figures.map(i => (
          <div
            key={i}
            className="queue-figure"
            style={{
              left: `${20 + i * 6.5}%`,
              height: `${36 - i * 2}%`,
              opacity: 1 - i * 0.07,
              zIndex: 10 - i,
            }}
          />
        ))}
        {/* Player (BOY) in line */}
        <div
          className="queue-figure player-figure"
          style={{ left: '24%', height: '34%', zIndex: 12 }}
        />
        {/* Cloaked figure beside player */}
        <div
          className="queue-figure cloak-figure"
          style={{ left: '19%', height: '36%', zIndex: 11 }}
        />
      </div>
      {/* The Girl running in */}
      {girlVisible && (
        <div
          className="silhouette girl-running"
          style={{
            left: `${girlPos}%`,
            transition: 'left 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
      )}
    </div>
  );
}
