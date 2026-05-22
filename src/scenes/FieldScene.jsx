import { useEffect, useRef, useState } from 'react';
import './scenes.css';

const FIELD_IMAGES = {
  approaching: '/images/tbosw-lady2.jpg',
  byRiver:     '/images/tbosw-lady1.png',
  crossing:    '/images/tbosw-rivercrossing.png',
  facingCloak: '/images/tbosw-boycloak.jpg',
};

export default function FieldScene({ activeTriggers = [] }) {
  const [fieldState, setFieldState] = useState('approaching');
  const [imgOpacity, setImgOpacity] = useState(1);
  const [particles, setParticles] = useState([]);
  const activeState = useRef('approaching');

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

  function dissolveToState(newState, delayMs = 0) {
    setTimeout(() => {
      setImgOpacity(0);
      setTimeout(() => {
        activeState.current = newState;
        setFieldState(newState);
        setImgOpacity(1);
      }, 350);
    }, delayMs);
  }

  useEffect(() => {
    if (activeTriggers.includes('SHOW_RIVER_CHOICE') && activeState.current === 'approaching') {
      dissolveToState('byRiver');
    }
    if (activeTriggers.includes('TRANSITION_TO_CLOAKED_FIGURE') && activeState.current !== 'facingCloak') {
      dissolveToState('crossing');
      dissolveToState('facingCloak', 2200);
    }
  }, [activeTriggers]);

  const showRiver = fieldState === 'approaching' || fieldState === 'byRiver';

  return (
    <div className="scene field-scene">
      <img
        className="scene-bg"
        src={FIELD_IMAGES[fieldState]}
        style={{ opacity: imgOpacity, transition: 'opacity 0.35s ease' }}
        alt=""
      />
      <div className="scene-vignette" />
      {showRiver && <div className="river-shimmer-overlay" />}
      {showRiver && particles.map(p => (
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
