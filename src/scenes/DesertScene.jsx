import { useEffect, useState } from 'react';
import './scenes.css';

export default function DesertScene({ activeTriggers = [] }) {
  const [ashParticles, setAshParticles] = useState([]);
  const [warriorGone, setWarriorGone] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [embraceGlow, setEmbraceGlow] = useState(false);

  useEffect(() => {
    if (activeTriggers.includes('SCREEN_SHAKE') && !shaking) {
      setShaking(true);
      setTimeout(() => setShaking(false), 420);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('EMBRACE_ANIMATION') && !embraceGlow) {
      setEmbraceGlow(true);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('ASH_DISSOLVE') && !warriorGone) {
      const ps = Array.from({ length: 200 }, (_, i) => ({
        id: i,
        x: 42 + (Math.random() - 0.5) * 10,
        dx: (Math.random() - 0.5) * 8,
        dy: -(20 + Math.random() * 30),
        delay: Math.random() * 1.2,
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.6 + Math.random() * 0.4,
        dur: 2.5 + Math.random() * 1.5,
      }));
      setAshParticles(ps);
      setTimeout(() => {
        setWarriorGone(true);
        setAshParticles([]);
      }, 3500);
    }
  }, [activeTriggers]);

  return (
    <div className={`scene desert-scene ${shaking ? 'screen-shake' : ''}`}>
      <img className="scene-bg" src="/images/tbosw-warrior.jpg" alt="" />
      <div className="scene-vignette" />
      {embraceGlow && <div className="embrace-glow" />}
      {ashParticles.map(p => (
        <div
          key={p.id}
          className="ash-particle"
          style={{
            left: `${p.x}%`,
            bottom: '50%',
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
