import { useState, useEffect, useMemo } from 'react';
import './scenes.css';

function PillowScatter() {
  const pillows = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i,
    color: ['#7a8fd4','#c46060','#6aaa72','#c4a23a','#9a6ab8','#d4824a','#5a9ab8','#b86a7a','#c4c060','#7ab8a8'][i],
    angle: (i / 10) * 360 + (Math.random() - 0.5) * 25,
    dist: 12 + Math.random() * 22,
    size: 26 + Math.random() * 22,
    dur: 0.55 + Math.random() * 0.45,
    startX: 35 + Math.random() * 30,
    startY: 35 + Math.random() * 30,
    delay: Math.random() * 0.25,
  })), []);

  return (
    <div className="pillow-scatter">
      {pillows.map(p => (
        <div key={p.id} className="scatter-pillow"
          style={{
            background: p.color,
            width: p.size,
            height: p.size * 0.72,
            left: `${p.startX}%`,
            top: `${p.startY}%`,
            '--angle': `${p.angle}deg`,
            '--dist': `${p.dist}vw`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function PillowScene({ onSceneComplete }) {
  const [phase, setPhase] = useState(1);
  const [imgOpacity, setImgOpacity] = useState(0);

  useEffect(() => {
    setTimeout(() => setImgOpacity(1), 100);

    setTimeout(() => setImgOpacity(0), 2800);
    setTimeout(() => { setPhase(2); setImgOpacity(1); }, 3150);

    setTimeout(() => setImgOpacity(0), 5700);
    setTimeout(() => onSceneComplete?.(), 6100);
  }, []);

  return (
    <div className="scene pillow-scene">
      <img
        className="scene-bg"
        src={phase === 1 ? '/images/tbosw-pillow1.jpg' : '/images/tbosw-pillows2.png'}
        style={{ opacity: imgOpacity, transition: 'opacity 0.35s ease', objectPosition: 'center top' }}
        alt=""
      />
      <div className="scene-vignette" />
      {phase === 2 && <PillowScatter />}
    </div>
  );
}
