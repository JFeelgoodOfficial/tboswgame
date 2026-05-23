import { useState, useEffect, useRef } from 'react';
import './StillnessMechanic.css';

const HOLD_DURATION = 3000;

export default function StillnessMechanic({ onComplete }) {
  const [held, setHeld] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobile] = useState(() => 'ontouchstart' in window);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const doneRef = useRef(false);

  function startHold() {
    if (doneRef.current) return;
    setHeld(true);
    startRef.current = performance.now();
    tick();
  }

  function endHold() {
    setHeld(false);
    setProgress(0);
    cancelAnimationFrame(rafRef.current);
    startRef.current = null;
  }

  function tick() {
    rafRef.current = requestAnimationFrame(now => {
      if (!startRef.current) return;
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / HOLD_DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        doneRef.current = true;
        onComplete();
      } else {
        tick();
      }
    });
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.code === 'Space' && !e.repeat) { e.preventDefault(); startHold(); }
    }
    function onKeyUp(e) {
      if (e.code === 'Space') endHold();
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const r = 54;
  const circ = 2 * Math.PI * r;

  return (
    <div className="stillness-mechanic">
      <div
        className={`stillness-circle ${held ? 'held' : ''}`}
        onPointerDown={isMobile ? startHold : undefined}
        onPointerUp={isMobile ? endHold : undefined}
        onPointerLeave={isMobile ? endHold : undefined}
      >
        <svg viewBox="0 0 120 120" className="stillness-svg">
          <circle cx="60" cy="60" r={r} className="stillness-track" />
          <circle
            cx="60" cy="60" r={r}
            className="stillness-fill"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress)}
          />
        </svg>
        <div className="stillness-label">
          {isMobile ? 'HOLD' : 'SPACE'}
        </div>
      </div>
      <p className="stillness-hint">
        {isMobile ? 'Hold to breathe' : 'Hold SPACE to breathe'}
      </p>
    </div>
  );
}
