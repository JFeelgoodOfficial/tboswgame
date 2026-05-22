import './ContinueButton.css';

export default function ContinueButton({ mode, onSnap, onAdvance }) {
  const isHidden = mode === 'hidden';
  const isChoice = mode === 'choice';
  const isReady  = mode === 'ready';
  const isTyping = mode === 'typing';

  function handleClick() {
    if (isTyping) onSnap?.();
    else if (isReady) onAdvance?.();
  }

  return (
    <div className={`continue-btn-wrapper${isHidden ? ' hidden' : ''}`}>
      <button
        className={`continue-btn${isChoice ? ' choice-mode' : ''}`}
        onClick={handleClick}
        aria-label="Continue story"
      >
        {(isReady || isChoice) && (
          <span className={`continue-ring${isChoice ? ' amber' : ''}`} />
        )}
        {isReady  && <span className="continue-arrow" />}
        {isChoice && <span className="continue-question">?</span>}
      </button>
    </div>
  );
}
