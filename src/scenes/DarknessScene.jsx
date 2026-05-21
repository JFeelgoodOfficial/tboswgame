import { useEffect, useState } from 'react';
import './scenes.css';

export default function DarknessScene({ activeTriggers = [] }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (activeTriggers.includes('DARKNESS_EVENT') && !collapsed) {
      setCollapsed(true);
    }
  }, [activeTriggers]);

  return (
    <div className={`scene darkness-scene ${collapsed ? 'collapsed' : ''}`}>
      {/* Stars */}
      <div className="dark-stars" />
      {/* Pulsing vignette */}
      <div className="dark-vignette" />
      {/* Cloaked figure outline only */}
      <div className="silhouette dark-cloak" />
      {/* collapse overlay */}
      {collapsed && <div className="darkness-collapse" />}
    </div>
  );
}
