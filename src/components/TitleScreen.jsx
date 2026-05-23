import { useState, useMemo } from 'react';
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
  FLAGS.waitedOnce = false;
  FLAGS.waitedTwice = false;
  localStorage.removeItem('tbosw_flags');
}

export default function TitleScreen({ onStart, onNewGame }) {
  const [hasSave, setHasSave] = useState(() => {
    try {
      const saved = localStorage.getItem('tbosw_flags');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(FLAGS, parsed);
        return true;
      }
    } catch {}
    return false;
  });
  const [visible, setVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Stable particle positions — never re-randomized
  const particles = useMemo(() => [...Array(20)].map((_, i) => ({
    id: i,
    left: `${(i * 5.1 + 2) % 100}%`,
    animationDuration: `${8 + i * 0.7}s`,
    animationDelay: `${-i * 0.5}s`,
  })), []);

  useState(() => { setTimeout(() => setVisible(true), 100); });

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
        {particles.map(p => (
          <div key={p.id} className="title-particle"
            style={{
              left: p.left,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
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
              <button className="title-btn secondary" onClick={() => setShowConfirm(true)}>
                New Game
              </button>
            </>
          ) : (
            <button className="title-btn primary" onClick={handleStart}>
              Begin
            </button>
          )}
        </div>

        <div className="title-hint">Use the button to advance dialogue</div>
      </div>

      {/* New Game confirmation */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p className="confirm-text">Start over? All progress will be lost.</p>
            <div className="confirm-buttons">
              <button className="title-btn primary" onClick={handleNewGame}>
                Yes, start over
              </button>
              <button className="title-btn secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
