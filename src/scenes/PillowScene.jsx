import { useState, useEffect, useRef } from 'react';
import './scenes.css';

const PILLOW_IMAGES = {
  magic:     '/images/tbosw-pillows0.jpg',
  hesitate:  '/images/tbosw-pillows1.jpg',
  crash:     '/images/tbosw-pillows2.png',
  aftermath: '/images/tbosw-pillows3.jpg',
};

function getImageState(lineId, activeTriggers) {
  if (activeTriggers.includes('PILLOW_CRASH') || lineId === 'pillow_06') return 'crash';
  if (lineId === 'pillow_07') return 'aftermath';
  if (['pillow_03', 'pillow_04', 'pillow_05'].includes(lineId)) return 'hesitate';
  return 'magic';
}

function PillowScatter() {
  const pillows = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    color: ['#7a8fd4','#c46060','#6aaa72','#c4a23a','#9a6ab8','#d4824a','#5a9ab8','#b86a7a','#c4c060','#7ab8a8'][i],
    angle: (i / 10) * 360 + (Math.random() - 0.5) * 25,
    dist: 12 + Math.random() * 22,
    size: 26 + Math.random() * 22,
    dur: 0.55 + Math.random() * 0.45,
    startX: 35 + Math.random() * 30,
    startY: 35 + Math.random() * 30,
    delay: Math.random() * 0.25,
  }));
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

export default function PillowScene({ activeTriggers = [], currentLineId }) {
  const [imgState, setImgState] = useState('magic');
  const [imgOpacity, setImgOpacity] = useState(1);
  const [shaking, setShaking] = useState(false);
  const prevState = useRef('magic');

  useEffect(() => {
    const next = getImageState(currentLineId, activeTriggers);
    if (next !== prevState.current) {
      setImgOpacity(0);
      setTimeout(() => {
        setImgState(next);
        setImgOpacity(1);
        prevState.current = next;
      }, 320);
    }
  }, [currentLineId, activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('PILLOW_CRASH')) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }, [activeTriggers]);

  return (
    <div className={`scene pillow-scene ${shaking ? 'screen-shake' : ''}`}>
      <img
        className="scene-bg"
        src={PILLOW_IMAGES[imgState]}
        style={{ opacity: imgOpacity, transition: 'opacity 0.32s ease', objectPosition: 'center top' }}
        alt=""
      />
      <div className="scene-vignette" />
      {imgState === 'crash' && <PillowScatter />}
    </div>
  );
}
