import { useEffect, useState } from 'react';
import './scenes.css';

const CREDITS = [
  'THE BOOK OF SHADOW WORK',
  '',
  'Written by J. Feelgood',
  '',
  '',
  'A journey through the shadow self',
  '',
  '',
  '— Characters —',
  '',
  'The Boy',
  'The Girl',
  'The Warrior',
  'The Stranger',
  'The Cloaked Figure',
  'The Lady in White',
  '',
  '',
  '— With gratitude —',
  '',
  'To everyone who waits in the line',
  'and wonders if they should leave.',
  '',
  '',
  'You are loved.',
];

export default function EndingScene({ activeTriggers = [], onComplete }) {
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (activeTriggers.includes('CREDITS_ROLL')) {
      setTimeout(() => setRolling(true), 600);
    }
  }, [activeTriggers]);

  function handleCreditsEnd() {
    setRolling(false);
    onComplete?.();
  }

  return (
    <div className="scene ending-scene">
      <img className="scene-bg" src="/images/tbosw-ending.png" alt=""
        style={{ objectPosition: 'center bottom' }} />
      <div className="scene-vignette"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)' }} />
      <div className="ending-star-shimmer" />
      {[...Array(12)].map((_, i) => (
        <div key={i} className="ending-particle"
          style={{
            left: `${(i * 8.3) % 100}%`,
            animationDuration: `${9 + i * 1.1}s`,
            animationDelay: `${-i * 0.8}s`,
          }}
        />
      ))}
      {rolling && (
        <div className="credits-scroll" onClick={handleCreditsEnd}>
          <div className="credits-inner" onAnimationEnd={handleCreditsEnd}>
            {CREDITS.map((line, i) => (
              <div key={i} className={`credits-line ${line === '' ? 'spacer' : ''} ${i === 0 ? 'credits-title' : ''}`}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
