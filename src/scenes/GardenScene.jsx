import { useEffect, useState } from 'react';
import './scenes.css';

export default function GardenScene({ activeTriggers = [] }) {
  const [strangerGone, setStrangerGone] = useState(false);
  const [cloakGone, setCloakGone] = useState(false);
  const [maskVisible, setMaskVisible] = useState(false);
  const [maskDropped, setMaskDropped] = useState(false);
  const [hugging, setHugging] = useState(false);

  useEffect(() => {
    if (activeTriggers.includes('STRANGER_WALKS_OFFSCREEN') && !strangerGone) {
      setStrangerGone(true);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('HUG_ANIMATION') && !hugging) {
      setHugging(true);
      setTimeout(() => setHugging(false), 2000);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('MASK_DROP_ANIMATION') && !maskVisible) {
      setMaskVisible(true);
      setTimeout(() => setMaskDropped(true), 300);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('CLOAKED_DISSOLVE') && !cloakGone) {
      setTimeout(() => setCloakGone(true), 2500);
    }
  }, [activeTriggers]);

  return (
    <div className="scene garden-scene">
      {/* Sky */}
      <div className="garden-sky" />
      {/* Warm haze */}
      <div className="garden-haze" />
      {/* Ground with plants */}
      <div className="garden-ground" />
      {/* Plant decorations */}
      <div className="garden-plants" />
      {/* Stranger silhouette */}
      <div
        className={`silhouette stranger-silhouette ${strangerGone ? 'walking-off' : ''}`}
      />
      {/* Cloaked figure in garden */}
      {!cloakGone && (
        <div className={`silhouette garden-cloak ${activeTriggers.includes('CLOAKED_DISSOLVE') ? 'dissolving' : ''} ${hugging ? 'hugging' : ''}`} />
      )}
      {/* Player */}
      <div className={`silhouette garden-boy ${hugging ? 'hugging-player' : ''}`} />
      {/* Girl */}
      <div className={`silhouette garden-girl ${hugging ? 'hugging-girl' : ''}`} />
      {/* Dropped mask */}
      {maskVisible && (
        <div className={`mask-object ${maskDropped ? 'landed' : 'falling'}`} />
      )}
    </div>
  );
}
