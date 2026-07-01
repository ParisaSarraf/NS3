import React from "react";

const BottomPanel = () => {
  return (
    <div className="metrics-container">
      <div className="metric-card glass-panel">
        <h4>Fuel Consumption</h4>
        <h2>78.4 t</h2>
        <div className="chart-placeholder"></div>
      </div>
      <div className="metric-card glass-panel">
        <h4>Radar Health</h4>
        <h2>96%</h2>
        <div className="chart-placeholder"></div>
      </div>
      <div className="metric-card glass-panel">
        <h4>Link Latency</h4>
        <h2>28 ms</h2>
        <div className="chart-placeholder"></div>
      </div>
    </div>
  );
};

export default BottomPanel;