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

export default function EndingScene({ activeTriggers = [] }) {
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (activeTriggers.includes('CREDITS_ROLL')) {
      setTimeout(() => setRolling(true), 400);
    }
  }, [activeTriggers]);

  return (
    <div className="scene ending-scene">
      {/* Field — emptier, different light */}
      <div className="ending-sky" />
      <div className="ending-horizon" />
      <div className="ending-ground" />
      <div className="ending-mist" />
      {/* Subtle particles */}
      {[...Array(14)].map((_, i) => (
        <div key={i} className="ending-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + i * 1.3}s`,
            animationDelay: `${-i * 0.9}s`,
          }}
        />
      ))}
      {/* Credits */}
      {rolling && (
        <div className="credits-scroll">
          <div className="credits-inner">
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
