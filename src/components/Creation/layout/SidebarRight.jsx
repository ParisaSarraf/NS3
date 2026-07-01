import React from "react";

const SidebarRight = () => {
  return (
    <div className="right-panel">
      <div className="task-force">
        <h3>Task Force Assets</h3>
        <div className="formation-map">
        </div>
        <ul className="vessel-list">
            <li>FFG-01 Resolute</li>
            <li>DDG-02 Guardian</li>
        </ul>
      </div>
      
      <div className="configuration">
        <h3>Configuration</h3>
        <div className="config-item">
            <strong>MQTT Broker</strong>
            <p>192.168.10.20:1883</p>
        </div>
        <div className="config-item">
            <strong>OPC UA Server</strong>
            <p>192.168.10.21:4840</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;