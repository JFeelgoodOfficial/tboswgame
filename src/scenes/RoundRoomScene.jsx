import { useEffect, useState } from 'react';
import './scenes.css';

function ElectricTendrils() {
  return (
    <div className="tendrils-container">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="tendril-glow"
          style={{
            left: i < 3 ? `${2 + i * 8}%` : `${70 + (i - 3) * 10}%`,
            top: `${15 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function RoundRoomScene({ activeTriggers = [] }) {
  const [shadowPulsing, setShadowPulsing] = useState(false);
  const [fractured, setFractured] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    if (activeTriggers.includes('MONSTER_PULSE')) {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 800);
    }
    if (activeTriggers.includes('REVEAL_SHADOW_BOY') && !shadowPulsing) {
      setShadowPulsing(true);
    }
    if (activeTriggers.includes('ROOM_FRACTURE') && !fractured) {
      setFractured(true);
    }
  }, [activeTriggers]);

  const stillnessActive = activeTriggers.includes('ENABLE_STILLNESS_MECHANIC');

  return (
    <div className={`scene round-room-scene ${fractured ? 'fractured' : ''}`}>
      <img className="scene-bg" src="/images/tbosw-roundroom.png" alt=""
        style={{ objectPosition: 'center center' }} />
      <div className="scene-vignette"
        style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.65) 100%)' }} />
      <div className="spotlight-flicker" />
      <div className={`room-shadows ${stillnessActive ? 'receding' : ''} ${pulsing ? 'pulsing' : ''}`} />
      <ElectricTendrils />
      {shadowPulsing && <div className="shadow-reveal" />}
      {fractured && (
        <div className="fracture-overlay">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`fracture-line frac-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}
