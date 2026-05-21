import { useEffect, useState } from 'react';
import './scenes.css';

export default function DesertScene({ activeTriggers = [], onEffectDone }) {
  const [ashParticles, setAshParticles] = useState([]);
  const [warriorVisible, setWarriorVisible] = useState(true);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (activeTriggers.includes('SCREEN_SHAKE') && !shaking) {
      setShaking(true);
      setTimeout(() => setShaking(false), 420);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('ASH_DISSOLVE') && warriorVisible) {
      const ps = Array.from({ length: 200 }, (_, i) => ({
        id: i,
        x: 45 + (Math.random() - 0.5) * 12,
        dx: (Math.random() - 0.5) * 8,
        dy: -(20 + Math.random() * 30),
        delay: Math.random() * 1.2,
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.6 + Math.random() * 0.4,
        dur: 2.5 + Math.random() * 1.5,
      }));
      setAshParticles(ps);
      setTimeout(() => {
        setWarriorVisible(false);
        setAshParticles([]);
      }, 3500);
    }
  }, [activeTriggers]);

  const embraceActive = activeTriggers.includes('EMBRACE_ANIMATION');

  return (
    <div className={`scene desert-scene ${shaking ? 'screen-shake' : ''}`}>
      <div className="desert-sky" />
      <div className="desert-haze" />
      <div className="desert-ground" />
      <div className="desert-cracks" />
      {/* Thinking stone */}
      <div className="thinking-stone" />
      {/* Warrior silhouette */}
      {warriorVisible && (
        <div className={`silhouette warrior-silhouette ${embraceActive ? 'embracing' : ''}`} />
      )}
      {/* Player + Girl approaching */}
      <div className={`silhouette desert-boy ${embraceActive ? 'embracing-player' : ''}`} />
      <div className={`silhouette desert-girl ${embraceActive ? 'embracing-girl' : ''}`} />
      {/* Ash particles */}
      {ashParticles.map(p => (
        <div
          key={p.id}
          className="ash-particle"
          style={{
            left: `${p.x}%`,
            bottom: '46%',
            width: p.size,
            height: p.size,
            '--dx': `${p.dx}vw`,
            '--dy': `${p.dy}vh`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
