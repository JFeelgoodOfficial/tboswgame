import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import './TransitionOverlay.css';

const TRANSITION_CONFIGS = {
  TRANSITION_TO_CLOAKED_FIGURE: { type: 'crossfade', duration: 1200 },
  TRANSITION_TO_LINE_SCENE:     { type: 'fade-black', duration: 1500 },
  TRANSITION_TO_DESERT:         { type: 'white-flash', duration: 600 },
  FADE_TO_ROUND_ROOM:           { type: 'fade-black', duration: 2000 },
  TRANSITION_TO_ROUND_ROOM:     { type: 'fade-black', duration: 1800 },
  TRANSITION_TO_GARDEN:         { type: 'dissolve', duration: 1500 },
  FADE_TO_CREDITS:              { type: 'fade-black', duration: 3000 },
  DARKNESS_EVENT:               { type: 'fade-black', duration: 1200 },
  ENDING_A:                     { type: 'fade-black', duration: 1500 },
  ENDING_B:                     { type: 'fade-black', duration: 1500 },
  DEFAULT:                      { type: 'fade-black', duration: 1000 },
};

export function getTransitionConfig(triggerName) {
  return TRANSITION_CONFIGS[triggerName] || TRANSITION_CONFIGS.DEFAULT;
}

const TransitionOverlay = forwardRef(function TransitionOverlay(_, ref) {
  const [state, setState] = useState(null); // null | 'in' | 'hold' | 'out'
  const [type, setType] = useState('fade-black');
  const [resolveRef] = useState({ fn: null });

  useImperativeHandle(ref, () => ({
    play(triggerName) {
      return new Promise(resolve => {
        const cfg = getTransitionConfig(triggerName);
        resolveRef.fn = resolve;
        setType(cfg.type);
        setState('in');
        const halfDur = cfg.type === 'white-flash' ? cfg.duration * 0.3 : cfg.duration / 2;
        setTimeout(() => {
          setState('hold');
          resolveRef.fn?.();
          resolveRef.fn = null;
        }, halfDur);
        setTimeout(() => setState('out'), halfDur + 80);
        setTimeout(() => setState(null), cfg.duration + 80);
      });
    },
  }));

  if (!state) return null;

  return (
    <div className={`transition-overlay type-${type} state-${state}`} />
  );
});

export default TransitionOverlay;
