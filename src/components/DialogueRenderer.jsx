import { useState, useEffect, useRef } from 'react';
import './DialogueRenderer.css';

const PLAYER = 'BOY';

const SPEAKER_LABELS = {
  NARRATOR: null,
  BOY: 'You',
  GIRL: 'Girl',
  WARRIOR: 'Warrior',
  STRANGER: 'Stranger',
  CLOAKED_FIGURE: 'Cloaked Figure',
  LADY_IN_WHITE: 'Lady in White',
  NPC: 'Stranger in Line',
};

const SPEAKER_ICONS = {
  NARRATOR: '✦',
  BOY: '◈',
  GIRL: '◇',
  WARRIOR: '◆',
  STRANGER: '◉',
  CLOAKED_FIGURE: '◑',
  LADY_IN_WHITE: '✿',
  NPC: '○',
};

export default function DialogueRenderer({ line, choices, onAdvance, onChoice }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const fullText = useRef('');
  const timerRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!line) return;
    setDisplayed('');
    setDone(false);
    setShowChoices(false);
    fullText.current = line.text || '';
    indexRef.current = 0;
    clearInterval(timerRef.current);

    if (fullText.current === '...') {
      setDisplayed('...');
      setDone(true);
      return;
    }

    timerRef.current = setInterval(() => {
      indexRef.current++;
      setDisplayed(fullText.current.slice(0, indexRef.current));
      if (indexRef.current >= fullText.current.length) {
        clearInterval(timerRef.current);
        setDone(true);
      }
    }, 28);

    return () => clearInterval(timerRef.current);
  }, [line?.id]);

  useEffect(() => {
    if (done && choices.length > 0) {
      const t = setTimeout(() => setShowChoices(true), 200);
      return () => clearTimeout(t);
    }
  }, [done, choices.length]);

  function handleClick() {
    if (!done) {
      clearInterval(timerRef.current);
      setDisplayed(fullText.current);
      setDone(true);
      return;
    }
    if (choices.length > 0) return;
    onAdvance();
  }

  if (!line) return null;

  const isNarrator = line.speaker === 'NARRATOR';
  const isPlayer = line.speaker === PLAYER;
  const label = SPEAKER_LABELS[line.speaker];
  const icon = SPEAKER_ICONS[line.speaker] || '○';

  return (
    <div className={`dialogue-overlay emotion-${line.emotion || 'neutral'}`} onClick={handleClick}>
      <div className={`dialogue-box ${isNarrator ? 'narrator' : ''} ${isPlayer ? 'player' : ''}`}>
        {!isNarrator && label && (
          <div className="dialogue-speaker">
            <span className="speaker-icon">{icon}</span>
            <span className="speaker-name">{label}</span>
          </div>
        )}
        <div className={`dialogue-text ${isNarrator ? 'narrator-text' : ''}`}>
          {displayed}
          {!done && <span className="cursor">▌</span>}
        </div>
        {done && choices.length === 0 && (
          <div className="continue-indicator">▼</div>
        )}
      </div>

      {showChoices && (
        <div className="choices-container" onClick={e => e.stopPropagation()}>
          {choices.map((c, i) => (
            <button
              key={i}
              className="choice-btn"
              onClick={() => onChoice(i)}
            >
              <span className="choice-arrow">▶</span>
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
