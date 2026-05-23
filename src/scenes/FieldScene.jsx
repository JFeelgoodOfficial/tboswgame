import { useEffect, useRef, useState } from 'react';
import './scenes.css';

const FIELD_IMAGES = {
  arrival:     '/images/tbosw-lady0.png',
  approaching: '/images/tbosw-lady2.jpg',
  byRiver:     '/images/tbosw-lady1.png',
  crossing:    '/images/tbosw-rivercrossing.png',
  facingCloak: '/images/tbosw-boycloak.jpg',
};

export default function FieldScene({ activeTriggers = [], currentLineId }) {
  const [fieldState, setFieldState] = useState('arrival');
  const [imgOpacity, setImgOpacity] = useState(1);
  const [particles] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${(i * 3.7 + 1) % 100}%`,
      animationDuration: `${8 + (i % 7) * 1.7}s`,
      animationDelay: `${-(i * 0.43)}s`,
      size: `${3 + (i % 5) * 1}px`,
      opacity: 0.3 + (i % 4) * 0.1,
    }))
  );
  const activeState = useRef('arrival');

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
    if (currentLineId === 'lady_03' && activeState.current === 'arrival') {
      dissolveToState('approaching');
    }
    if (currentLineId === 'lady_cross' && !['crossing', 'facingCloak'].includes(activeState.current)) {
      dissolveToState('crossing');
    }
  }, [currentLineId]);

  useEffect(() => {
    if (activeTriggers.includes('SHOW_RIVER_CHOICE') && activeState.current === 'approaching') {
      dissolveToState('byRiver');
    }
    if (activeTriggers.includes('TRANSITION_TO_CLOAKED_FIGURE') && activeState.current !== 'facingCloak') {
      dissolveToState('facingCloak');
    }
  }, [activeTriggers]);

  const showRiver = fieldState === 'approaching' || fieldState === 'byRiver';
  const showParticles = fieldState === 'arrival' || fieldState === 'approaching' || fieldState === 'byRiver';

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
      {showParticles && particles.map(p => (
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
