import React from 'react';
import type { CanonicalObject } from '../../../utils/types';

interface RadarOverlayProps {
  selectedSourceObj: CanonicalObject | null;
  selectedEnemy: string | null;
  radarRange: number;
}

const RadarOverlay: React.FC<RadarOverlayProps & { radarRange: number }> = ({ 
  selectedSourceObj, 
  selectedEnemy,
  radarRange 
}) => {
  return (
    <div className="map-overlay map-overlay-summary glass">
      <div className="overlay-item">
        <span className="dim">System Phase:</span>
        <span className="value">
          {selectedSourceObj?.phase ?? 'Idle'}
        </span>
      </div>

      <div className="overlay-item">
        <span className="dim">Target Lock:</span>
        <span className={`value ${selectedEnemy ? 'warning' : ''}`}>
          {selectedEnemy ?? '--'}
        </span>
      </div>

      <div className="overlay-item">
        <span className="dim">Radar Range:</span>
        <span className="value">
          {(radarRange / 1000).toFixed(1)} km
        </span>
      </div>
    </div>
  );
};

export default RadarOverlay;