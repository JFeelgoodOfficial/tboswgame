import { useEffect, useState } from 'react';
import './scenes.css';

const IMAGE_MAP = {
  waiting:  '/images/tbosw-line1.jpg',
  impact:   '/images/tbosw-line2.jpg',
  together: '/images/tbosw-line3.jpg',
};

export default function LineScene({ activeTriggers = [] }) {
  const [lineState, setLineState] = useState('waiting');
  const [imgOpacity, setImgOpacity] = useState(1);
  const [shaking, setShaking] = useState(false);
  const [dustParticles, setDustParticles] = useState([]);

  useEffect(() => {
    if (activeTriggers.includes('SCREEN_SHAKE') && lineState === 'waiting') {
      // Screen shake
      setShaking(true);
      setTimeout(() => setShaking(false), 420);

      // Dust burst at impact
      const ps = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 35 + Math.random() * 15,
        dx: (Math.random() - 0.5) * 10,
        dy: -(15 + Math.random() * 20),
        size: 3 + Math.random() * 4,
        delay: Math.random() * 0.15,
      }));
      setDustParticles(ps);
      setTimeout(() => setDustParticles([]), 700);

      // Cross-dissolve: waiting → impact
      setImgOpacity(0);
      setTimeout(() => { setLineState('impact'); setImgOpacity(1); }, 300);

      // Cross-dissolve: impact → together
      setTimeout(() => setImgOpacity(0), 1400);
      setTimeout(() => { setLineState('together'); setImgOpacity(1); }, 1700);
    }
  }, [activeTriggers]);

  return (
    <div className={`scene line-scene ${shaking ? 'screen-shake' : ''}`}>
      <img
        className="scene-bg"
        src={IMAGE_MAP[lineState]}
        style={{ opacity: imgOpacity, transition: 'opacity 0.3s ease' }}
        alt=""
      />
      <div className="scene-vignette" />
      {dustParticles.map(p => (
        <div
          key={p.id}
          className="dust-particle"
          style={{
            left: `${p.x}%`,
            bottom: '42%',
            width: p.size,
            height: p.size,
            '--dx': `${p.dx}vw`,
            '--dy': `${p.dy}vh`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
