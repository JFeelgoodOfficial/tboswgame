import { useEffect, useRef, useState, useMemo } from 'react';
import './scenes.css';

const IMAGES = {
  facing:      '/images/tbosw-boycloak.jpg',
  walking:     '/images/tbosw-boywalkswithcloaktocrowd.png',
  crowd:       '/images/tbosw-peterhivets0.jpg',
  approaching: '/images/tbosw-peterhivets1.jpg',
  closeup:     '/images/tbosw-peterhivets2.png',
};

function WalkingParticles() {
  const stars = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${(i * 11 + 3) % 100}%`,
    top: `${5 + (i % 5) * 7}%`,
    dur: `${3 + i * 0.5}s`,
    delay: `${-i * 0.4}s`,
  })), []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
      {stars.map(s => (
        <div key={s.id} className="walk-star"
          style={{
            left: s.left,
            top: s.top,
            animationDuration: s.dur,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function FieldCloakedScene({ activeTriggers = [], currentLineId }) {
  const [state, setState] = useState('facing');
  const [imgOpacity, setImgOpacity] = useState(1);
  const activeState = useRef('facing');

  function dissolve(fn, delay = 0) {
    setTimeout(() => {
      setImgOpacity(0);
      setTimeout(() => { fn(); setImgOpacity(1); }, 350);
    }, delay);
  }

  // "You begin to walk together" — transition to walking image
  useEffect(() => {
    if (currentLineId === 'cloak_03' && activeState.current === 'facing') {
      activeState.current = 'walking';
      dissolve(() => setState('walking'));
    }
  }, [currentLineId]);

  // Approaching the crowd — show peterhivets0 when trigger fires
  useEffect(() => {
    if (activeTriggers.includes('TRANSITION_TO_LINE_SCENE') && activeState.current === 'walking') {
      activeState.current = 'crowd';
      dissolve(() => setState('crowd'));
    }
  }, [activeTriggers]);

  // NPC story — advance images as lines play
  useEffect(() => {
    if (currentLineId === 'cloak_peterhivets_01' && activeState.current === 'crowd') {
      activeState.current = 'approaching';
      dissolve(() => setState('approaching'));
    }
    if (currentLineId === 'cloak_peterhivets_03' && activeState.current === 'approaching') {
      activeState.current = 'closeup';
      dissolve(() => setState('closeup'));
    }
  }, [currentLineId]);

  return (
    <div className="scene field-cloaked-scene">
      <img
        className="scene-bg"
        src={IMAGES[state]}
        style={{ opacity: imgOpacity, transition: 'opacity 0.35s ease', objectPosition: 'center top' }}
        alt=""
      />
      <div className="scene-vignette" />
      {state === 'walking' && <WalkingParticles />}
    </div>
  );
}
