import { useState, useEffect } from 'react';
import { FLAGS } from './dialogue/tbosw-dialogue-fixed.js';
import TitleScreen from './components/TitleScreen.jsx';
import SceneManager from './components/SceneManager.jsx';
import './App.css';

function persistFlags() {
  try {
    localStorage.setItem('tbosw_flags', JSON.stringify({ ...FLAGS }));
  } catch {}
}

export default function App() {
  const [phase, setPhase] = useState('title'); // 'title' | 'game'

  useEffect(() => {
    if (phase !== 'game') return;
    const id = setInterval(persistFlags, 2000);
    return () => clearInterval(id);
  }, [phase]);

  function handleGameEnd() {
    persistFlags();
    setTimeout(() => setPhase('title'), 4000);
  }

  return (
    <div className="app">
      {phase === 'title' && (
        <TitleScreen onStart={() => setPhase('game')} onNewGame={() => setPhase('game')} />
      )}
      {phase === 'game' && (
        <SceneManager onGameEnd={handleGameEnd} />
      )}
    </div>
  );
}
