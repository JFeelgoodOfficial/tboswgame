import { useEffect, useRef, useState } from 'react';
import './scenes.css';

const DESERT_IMAGES = {
  default:    '/images/tbosw-warrior1.png',
  embracing:  '/images/tbosw-warrior2.jpg',
  dissolving: '/images/tbosw-warrior3.jpg',
};

export default function DesertScene({ activeTriggers = [] }) {
  const [desertState, setDesertState] = useState('default');
  const [imgOpacity, setImgOpacity] = useState(1);
  const [shaking, setShaking] = useState(false);
  const activeState = useRef('default');

  useEffect(() => {
    if (activeTriggers.includes('SCREEN_SHAKE') && !shaking) {
      setShaking(true);
      setTimeout(() => setShaking(false), 420);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('EMBRACE_ANIMATION') && activeState.current === 'default') {
      activeState.current = 'embracing';
      setImgOpacity(0);
      setTimeout(() => { setDesertState('embracing'); setImgOpacity(1); }, 350);
    }
    if (activeTriggers.includes('ASH_DISSOLVE') && activeState.current === 'embracing') {
      activeState.current = 'dissolving';
      setTimeout(() => {
        setImgOpacity(0);
        setTimeout(() => { setDesertState('dissolving'); setImgOpacity(1); }, 350);
      }, 800);
    }
  }, [activeTriggers]);

  return (
    <div className={`scene desert-scene ${shaking ? 'screen-shake' : ''}`}>
      <img
        className="scene-bg"
        src={DESERT_IMAGES[desertState]}
        style={{ opacity: imgOpacity, transition: 'opacity 0.35s ease' }}
        alt=""
      />
      <div className="scene-vignette" />
      {desertState === 'embracing' && <div className="embrace-glow" />}
      {desertState === 'dissolving' && <div className="vortex-pulse" />}
    </div>
  );
}
