import { useEffect, useState } from 'react';
import './scenes.css';

export default function GardenScene({ activeTriggers = [] }) {
  const [hugging, setHugging] = useState(false);
  const [strangerDeparting, setStrangerDeparting] = useState(false);
  const [cloakFading, setCloakFading] = useState(false);

  useEffect(() => {
    if (activeTriggers.includes('HUG_ANIMATION') && !hugging) {
      setHugging(true);
      setTimeout(() => setHugging(false), 3600);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('STRANGER_WALKS_OFFSCREEN') && !strangerDeparting) {
      setStrangerDeparting(true);
    }
  }, [activeTriggers]);

  useEffect(() => {
    if (activeTriggers.includes('CLOAKED_DISSOLVE') && !cloakFading) {
      setCloakFading(true);
    }
  }, [activeTriggers]);

  return (
    <div className="scene garden-scene">
      <img className="scene-bg" src="/images/tbosw-stranger.jpg" alt="" />
      <div className="scene-vignette" />
      {hugging && <div className="hug-warmth" />}
      <div className={`stranger-depart ${strangerDeparting ? 'active' : ''}`} />
      <div className={`cloak-fade ${cloakFading ? 'active' : ''}`} />
    </div>
  );
}
