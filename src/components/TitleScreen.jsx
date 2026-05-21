import { useState, useEffect } from 'react';
import { FLAGS } from '../dialogue/tbosw-dialogue-fixed.js';
import './TitleScreen.css';

function resetFlags() {
  FLAGS.crossedRiver = false;
  FLAGS.heardNPCStory = false;
  FLAGS.leftTheLine = false;
  FLAGS.embracedWarrior = false;
  FLAGS.sawShadowSelf = false;
  FLAGS.metStranger = false;
  FLAGS.pickedUpMask = null;
  localStorage.removeItem('tbosw_flags');
}

export default function TitleScreen({ onStart, onNewGame }) {
  const [hasSave, setHasSave] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tbosw_flags');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(FLAGS, parsed);
        setHasSave(true);
      } catch {}
    }
    setTimeout(() => setVisible(true), 100);
  }, []);

  function handleStart() {
    setVisible(false);
    setTimeout(onStart, 600);
  }

  function handleNewGame() {
    resetFlags();
    setVisible(false);
    setTimeout(onNewGame, 600);
  }

  return (
    <div className={`title-screen ${visible ? 'visible' : ''}`}>
      {/* Particle field */}
      <div className="title-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="title-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${8 + i * 0.7}s`,
              animationDelay: `${-i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="title-content">
        <div className="title-eyebrow">J. Feelgood presents</div>
        <h1 className="title-main">
          <span className="title-the">The</span>
          <span className="title-book">Book of Shadow Work</span>
        </h1>
        <div className="title-rule" />
        <p className="title-sub">A journey through the shadow self</p>

        <div className="title-buttons">
          {hasSave ? (
            <>
              <button className="title-btn primary" onClick={handleStart}>
                Continue
              </button>
              <button className="title-btn secondary" onClick={handleNewGame}>
                New Game
              </button>
            </>
          ) : (
            <button className="title-btn primary" onClick={handleStart}>
              Begin
            </button>
          )}
        </div>

        <div className="title-hint">Click or press any key to advance dialogue</div>
      </div>
    </div>
  );
}
