import { useState, useEffect, useRef, useCallback } from 'react';
import { DialogueEngine } from '../engine/DialogueEngine.js';
import ContinueButton from './ContinueButton.jsx';
import {
  FLAGS,
  SCENE_MANIFEST,
  fieldScene_LadyInWhite,
  fieldScene_CloakedFigure,
  lineScene_Crowd,
  desertScene_Warrior,
  darknessEvent,
  pillowScene,
  roundRoom_Monster,
  gardenScene_Stranger,
  gardenScene_MaskFarewell,
  ending_A,
  ending_B,
} from '../dialogue/tbosw-dialogue-fixed.js';
import DialogueRenderer from './DialogueRenderer.jsx';
import TransitionOverlay from '../effects/TransitionOverlay.jsx';
import StillnessMechanic from '../effects/StillnessMechanic.jsx';
import FieldScene from '../scenes/FieldScene.jsx';
import FieldCloakedScene from '../scenes/FieldCloakedScene.jsx';
import LineScene from '../scenes/LineScene.jsx';
import DesertScene from '../scenes/DesertScene.jsx';
import DarknessScene from '../scenes/DarknessScene.jsx';
import PillowScene from '../scenes/PillowScene.jsx';
import RoundRoomScene from '../scenes/RoundRoomScene.jsx';
import GardenScene from '../scenes/GardenScene.jsx';
import EndingScene from '../scenes/EndingScene.jsx';
import './SceneManager.css';

function getButtonMode(line, choices, showStillness, isTyping, activeTriggers) {
  if (showStillness) return 'hidden';
  if (!line) return 'hidden';
  if (activeTriggers.includes('CREDITS_ROLL')) return 'hidden';
  if (choices.length > 0) return 'choice';
  if (isTyping) return 'typing';
  return 'ready';
}

const TREES = {
  field_lady:     fieldScene_LadyInWhite,
  field_cloaked:  fieldScene_CloakedFigure,
  line_crowd:     lineScene_Crowd,
  desert_warrior: desertScene_Warrior,
  darkness_event: darknessEvent,
  pillow_scene:   pillowScene,
  round_room:     roundRoom_Monster,
  garden_stranger:gardenScene_Stranger,
  garden_mask:    gardenScene_MaskFarewell,
  ending_a:       ending_A,
  ending_b:       ending_B,
};

const TRANSITION_TRIGGERS = new Set([
  'TRANSITION_TO_LINE_SCENE',
  'TRANSITION_TO_DESERT',
  'FADE_TO_ROUND_ROOM',
  'TRANSITION_TO_ROUND_ROOM',
  'TRANSITION_TO_GARDEN',
  'FADE_TO_CREDITS',
  'FADE_TO_DARKNESS',
  'ENDING_A',
  'ENDING_B',
]);

function SceneBackground({ sceneId, activeTriggers, currentLineId, onComplete }) {
  switch (sceneId) {
    case 'field_lady':     return <FieldScene activeTriggers={activeTriggers} currentLineId={currentLineId} />;
    case 'field_cloaked':  return <FieldCloakedScene activeTriggers={activeTriggers} currentLineId={currentLineId} />;
    case 'line_crowd':     return <LineScene activeTriggers={activeTriggers} />;
    case 'desert_warrior': return <DesertScene activeTriggers={activeTriggers} />;
    case 'darkness_event': return <DarknessScene activeTriggers={activeTriggers} />;
    case 'pillow_scene':   return <PillowScene activeTriggers={activeTriggers} currentLineId={currentLineId} />;
    case 'round_room':     return <RoundRoomScene activeTriggers={activeTriggers} />;
    case 'garden_stranger':
    case 'garden_mask':    return <GardenScene activeTriggers={activeTriggers} currentLineId={currentLineId} />;
    case 'ending_a':
    case 'ending_b':       return <EndingScene activeTriggers={activeTriggers} onComplete={onComplete} />;
    default:               return <div className="scene scene-fallback" />;
  }
}

function getSceneLabel(sceneId) {
  const labels = {
    field_lady:     'The Endless Field',
    field_cloaked:  'The Endless Field',
    line_crowd:     'The Line',
    desert_warrior: 'The Desert of the Warrior',
    darkness_event: 'The Dark',
    pillow_scene:   'Outside the Cottage',
    round_room:     'The Round Room',
    garden_stranger:'The Garden',
    garden_mask:    'The Garden',
    ending_a:       'The Field',
    ending_b:       'The Field',
  };
  return labels[sceneId] || '';
}

function getNextSceneId(currentId) {
  const manifest = SCENE_MANIFEST.find(s => s.id === currentId);
  if (!manifest) return null;

  if (currentId === 'garden_mask') {
    return FLAGS.pickedUpMask === true ? 'ending_a' : 'ending_b';
  }

  return manifest.next || null;
}

export default function SceneManager({ onGameEnd }) {
  const [sceneId, setSceneId] = useState('field_lady');
  const [line, setLine] = useState(null);
  const [choices, setChoices] = useState([]);
  const [activeTriggers, setActiveTriggers] = useState([]);
  const [showStillness, setShowStillness] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const engineRef = useRef(null);
  const transitionRef = useRef(null);
  const pendingNextScene = useRef(null);
  const snapRef = useRef(null);

  const handleTrigger = useCallback((trigger) => {
    setActiveTriggers(prev => [...new Set([...prev, trigger])]);

    if (trigger === 'ENABLE_STILLNESS_MECHANIC') {
      setShowStillness(true);
    }

    if (TRANSITION_TRIGGERS.has(trigger)) {
      pendingNextScene.current = trigger;
    }
  }, []);

  const handleFlagSet = useCallback((key, val) => {
    console.log(`FLAG: ${key} = ${val}`);
  }, []);

  const doSceneTransition = useCallback(async (trigger) => {
    if (!transitionRef.current) return;
    await transitionRef.current.play(trigger);
  }, []);

  const loadScene = useCallback(async (nextId, transitionTrigger) => {
    if (transitionTrigger && transitionRef.current) {
      await doSceneTransition(transitionTrigger);
    }

    setSceneId(nextId);
    setActiveTriggers([]);
    setShowStillness(false);

    const tree = TREES[nextId];
    if (!tree) {
      console.error(`[SceneManager] Unknown scene: ${nextId}`);
      onGameEnd?.();
      return;
    }

    const engine = new DialogueEngine(
      tree,
      handleTrigger,
      handleFlagSet,
      () => handleSceneComplete(nextId),
    );
    engineRef.current = engine;
    engine.start(); // deferred so engineRef is set before trigger handlers fire
    setLine(engine.getCurrentLine());
    setChoices(engine.getChoices());
  }, [handleTrigger, handleFlagSet, onGameEnd]);

  function handleSceneComplete(currentSceneId) {
    // Ending scenes delegate onGameEnd to EndingScene via onComplete prop
    if (currentSceneId === 'ending_a' || currentSceneId === 'ending_b') return;

    const nextId = getNextSceneId(currentSceneId);
    if (!nextId) {
      onGameEnd?.();
      return;
    }
    const trigger = pendingNextScene.current;
    pendingNextScene.current = null;
    loadScene(nextId, trigger);
  }

  function handleAdvance() {
    const engine = engineRef.current;
    if (!engine) return;
    engine.advance();
    updateFromEngine(engine);
  }

  function handleChoice(index) {
    const engine = engineRef.current;
    if (!engine) return;
    engine.advance(index);
    updateFromEngine(engine);
  }

  function updateFromEngine(engine) {
    const current = engine.getCurrentLine();
    setLine(current);
    setChoices(engine.getChoices());
    if (showStillness) setShowStillness(false);
  }

  function handleStillnessComplete() {
    setShowStillness(false);
    handleAdvance();
  }

  useEffect(() => {
    setIsTyping(true);
  }, [line?.id]);

  useEffect(() => {
    loadScene('field_lady', null);
  }, []);

  const label = getSceneLabel(sceneId);

  return (
    <div className="scene-manager">
      <SceneBackground
        sceneId={sceneId}
        activeTriggers={activeTriggers}
        currentLineId={line?.id}
        onComplete={onGameEnd}
      />

      {label && (
        <div className="scene-label">
          <span className="scene-label-deco">◆──</span>
          <span className="scene-label-text">{label}</span>
          <span className="scene-label-deco">──◆</span>
        </div>
      )}

      {showStillness && (
        <StillnessMechanic onComplete={handleStillnessComplete} />
      )}

      {line && (
        <DialogueRenderer
          line={line}
          choices={choices}
          onAdvance={handleAdvance}
          onChoice={handleChoice}
          onTextComplete={() => setIsTyping(false)}
          onRegisterSnap={(fn) => { snapRef.current = fn; }}
        />
      )}

      <ContinueButton
        mode={getButtonMode(line, choices, showStillness, isTyping, activeTriggers)}
        onSnap={() => { setIsTyping(false); snapRef.current?.(); }}
        onAdvance={handleAdvance}
      />

      <TransitionOverlay ref={transitionRef} />
    </div>
  );
}
