import { useEffect, useState } from 'react';
import './scenes.css';

export default function RoundRoomScene({ activeTriggers = [] }) {
  const [shadowVisible, setShadowVisible] = useState(false);
  const [fractured, setFractured] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [stillnessActive, setStillnessActive] = useState(false);
  const [darknessReceding, setDarknessReceding] = useState(false);

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
      {/* Room base */}
      <div className="room-floor" />
      {/* Concentric rings */}
      {[1,2,3,4,5].map(i => (
        <div key={i} className={`room-ring ring-${i}`} />
      ))}
      {/* Shadow edges */}
      <div className={`room-shadows ${stillnessActive ? 'receding' : ''}`} />
      {/* Shadow boy */}
      {shadowVisible && <div className="silhouette shadow-boy" />}
      {/* Fracture lines */}
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
