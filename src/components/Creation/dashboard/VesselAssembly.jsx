import React from "react";

const VesselAssembly = () => {
  return (
    <div className="vessel-assembly">
      <div className="tabs">
        <button className="tab active">Vessel Assembly</button>
        <button className="tab">Task Force</button>
      </div>
      
      <div className="blueprint-area">
        <div className="blueprint-canvas">
            <div className="ship-wireframe"></div>
            
            <div className="module-list left-modules">
              <div className="module-card">Radar Suite</div>
              <div className="module-card">Sonar</div>
              <div className="module-card">Combat Management</div>
            </div>
            
            <div className="module-list right-modules">
              <div className="module-card">VLS</div>
              <div className="module-card">Main Gun</div>
              <div className="module-card">Engine Room</div>
            </div>
        </div>
      </div>
      
      <div className="compatibility-checker">
        <h4>Compatibility Checker</h4>
        <div className="stats">
            <div className="stat-circle">
                <span>92%</span>
            </div>
            <ul>
                <li>Power Budget: OK</li>
                <li>Cooling Capacity: OK</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default VesselAssembly;