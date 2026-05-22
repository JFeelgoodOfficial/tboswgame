import { useEffect, useRef, useState } from 'react';
import './scenes.css';

const LINE_IMAGES = {
  waiting:  '/images/tbosw-line1.jpg',
  impact:   '/images/tbosw-line2.jpg',
  together: '/images/tbosw-line3.jpg',
  running:  '/images/tbosw-boygirlcloakruntowarrior.png',
};

function DustBurst() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * 360,
    dist: 8 + Math.random() * 12,
    size: 4 + Math.random() * 6,
    dur: 0.4 + Math.random() * 0.3,
  }));
  return (
    <div className="dust-burst-container">
      {particles.map(p => (
        <div key={p.id} className="dust-particle"
          style={{
            '--angle': `${p.angle}deg`,
            '--dist': `${p.dist}vw`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function LineScene({ activeTriggers = [] }) {
  const [lineState, setLineState] = useState('waiting');
  const [imgOpacity, setImgOpacity] = useState(1);
  const hasImpacted = useRef(false);
  const hasLeft = useRef(false);

  function dissolve(fn, delay = 0) {
    setTimeout(() => {
      setImgOpacity(0);
      setTimeout(() => { fn(); setImgOpacity(1); }, 350);
    }, delay);
  }

  useEffect(() => {
    if (activeTriggers.includes('SCREEN_SHAKE') && !hasImpacted.current) {
      hasImpacted.current = true;
      dissolve(() => setLineState('impact'));
      dissolve(() => setLineState('together'), 1700);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('TRANSITION_TO_DESERT') && !hasLeft.current) {
      hasLeft.current = true;
      dissolve(() => setLineState('running'), 400);
    }
  }, [activeTriggers]);

  const shaking = activeTriggers.includes('SCREEN_SHAKE') && lineState === 'impact';

  return (
    <div className={`scene line-scene ${shaking ? 'screen-shake' : ''}`}>
      <img
        className="scene-bg"
        src={LINE_IMAGES[lineState]}
        style={{ opacity: imgOpacity, transition: 'opacity 0.35s ease' }}
        alt=""
      />
      <div className="scene-vignette" />
      {lineState === 'impact' && <DustBurst />}
    </div>
  );
}
