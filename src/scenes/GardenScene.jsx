import { useEffect, useRef, useState } from 'react';
import './scenes.css';

const IMAGES = {
  meeting:    '/images/tbosw-stranger1.jpg',
  plants:     '/images/tbosw-stranger2.png',
  leaving:    '/images/tbosw-stranger3.png',
  hugging:    '/images/tbosw-stranger4.png',
  maskUp:     '/images/tbosw-cloakremoveshismask2.png',
  dissolving: '/images/tbosw-cloakremoveshismask1.jpg',
  maskDown:   '/images/tbosw-cloakremoveshismask3.png',
};

const PLANT_LINES = new Set(['stranger_potato', 'stranger_love', 'stranger_selfish']);
const LEAVE_LINES = new Set(['stranger_leave', 'stranger_where', 'stranger_why_go', 'stranger_love_self']);

export default function GardenScene({ activeTriggers = [], currentLineId }) {
  const [state, setState] = useState('meeting');
  const [imgOpacity, setImgOpacity] = useState(1);
  const activeState = useRef('meeting');

  function dissolve(fn, delay = 0) {
    setTimeout(() => {
      setImgOpacity(0);
      setTimeout(() => { fn(); setImgOpacity(1); }, 380);
    }, delay);
  }

  useEffect(() => {
    if (PLANT_LINES.has(currentLineId) && activeState.current === 'meeting') {
      activeState.current = 'plants';
      dissolve(() => setState('plants'));
    }
  }, [currentLineId]);

  useEffect(() => {
    if (LEAVE_LINES.has(currentLineId) && (activeState.current === 'plants' || activeState.current === 'meeting')) {
      activeState.current = 'leaving';
      dissolve(() => setState('leaving'));
    }
  }, [currentLineId]);

  useEffect(() => {
    if (activeTriggers.includes('HUG_ANIMATION') && activeState.current !== 'hugging') {
      activeState.current = 'hugging';
      dissolve(() => setState('hugging'));
    }
    if (activeTriggers.includes('MASK_DROP_ANIMATION') && activeState.current !== 'maskUp') {
      activeState.current = 'maskUp';
      dissolve(() => setState('maskUp'), 300);
    }
    if (activeTriggers.includes('CLOAKED_DISSOLVE') && activeState.current !== 'dissolving') {
      activeState.current = 'dissolving';
      dissolve(() => setState('dissolving'), 600);
    }
    if (activeTriggers.includes('MASK_CHOICE_ENABLE') && activeState.current !== 'maskDown') {
      activeState.current = 'maskDown';
      dissolve(() => setState('maskDown'), 1200);
    }
  }, [activeTriggers]);

  return (
    <div className="scene garden-scene">
      <img
        className="scene-bg"
        src={IMAGES[state]}
        style={{ opacity: imgOpacity, transition: 'opacity 0.38s ease', objectPosition: 'center top' }}
        alt=""
      />
      <div className="scene-vignette" />
      {(state === 'meeting' || state === 'plants') && <div className="garden-warmth" />}
      {(state === 'maskUp' || state === 'maskDown') && <div className="mask-glow-pulse" />}
      {state === 'dissolving' && <div className="dissolve-shimmer" />}
    </div>
  );
}
