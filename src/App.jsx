import { useState, useEffect } from 'react';
import { FLAGS } from './dialogue/tbosw-dialogue-fixed.js';
import { IMAGE_PATHS } from './assets/imagePaths.js';
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

  // Preload all scene images on mount so first transitions are instant
  useEffect(() => {
    IMAGE_PATHS.forEach(src => { new Image().src = src; });
  }, []);

  useEffect(() => {
    if (phase !== 'game') return;
    const id = setInterval(persistFlags, 2000);
    return () => clearInterval(id);
  }, [phase]);

  function handleGameEnd() {
    persistFlags();
    setPhase('title');
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
