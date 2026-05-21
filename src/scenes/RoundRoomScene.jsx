import { useEffect, useState } from 'react';
import './scenes.css';

export default function RoundRoomScene({ activeTriggers = [] }) {
  const [shadowVisible, setShadowVisible] = useState(false);
  const [fractured, setFractured] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [stillnessActive, setStillnessActive] = useState(false);

  useEffect(() => {
    if (activeTriggers.includes('MONSTER_PULSE')) {
      setPulsing(true);
      setTimeout(() => setPulsing(false), 800);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('REVEAL_SHADOW_BOY') && !shadowVisible) {
      setShadowVisible(true);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('ROOM_FRACTURE') && !fractured) {
      setFractured(true);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('ENABLE_STILLNESS_MECHANIC')) {
      setStillnessActive(true);
    }
  }, [activeTriggers]);

  return (
    <div className={`scene round-room-scene ${pulsing ? 'pulsing' : ''} ${fractured ? 'fractured' : ''}`}>
      <img className="scene-bg" src="/images/tbosw-roundroom.jpg" alt="" />
      <div className="scene-vignette" />
      <div className="spotlight-flicker" />
      <div className={`room-shadows ${stillnessActive ? 'receding' : ''}`} />
      {shadowVisible && <div className="shadow-reveal" />}
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
