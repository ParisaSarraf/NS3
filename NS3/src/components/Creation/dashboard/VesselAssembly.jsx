import { useState } from "react";
import {
  MousePointer,
  Hand,
  Move,
  Maximize2,
  Minus,
  Plus,
  Radar,
  Waves,
  Cpu,
  Compass,
  Rocket,
  Crosshair,
  Activity,
  Ship,
  Trash2,
} from "lucide-react";
import ModuleCard from "../common/ModuleCard";
import CompatibilityChecker from "./CompatibilityChecker";

const leftModules = [
  {
    id: "radar",
    icon: <Radar size={16} />,
    name: "Radar Suite",
    sub: "X-Band AESA",
    status: "ok",
  },
  {
    id: "sonar",
    icon: <Waves size={16} />,
    name: "Sonar",
    sub: "Hull + Towed Array",
    status: "ok",
  },
  {
    id: "cms",
    icon: <Cpu size={16} />,
    name: "Combat Management System",
    sub: "CMS-330",
    status: "ok",
  },
  {
    id: "nav",
    icon: <Compass size={16} />,
    name: "Navigation",
    sub: "INS + GPS",
    status: "ok",
  },
];

const rightModules = [
  {
    id: "vls",
    icon: <Rocket size={16} />,
    name: "VLS",
    sub: "64 Cell",
    status: "ok",
  },
  {
    id: "gun",
    icon: <Crosshair size={16} />,
    name: "Main Gun",
    sub: "127mm / 64cal",
    status: "warn",
  },
  {
    id: "engine",
    icon: <Activity size={16} />,
    name: "Engine Room Sensors",
    sub: "Temp, Pressure, Vibration",
    status: "ok",
  },
];

const vessels = [
  { id: "ffg01", name: "FFG-01 Resolute", role: "Flagship" },
  { id: "ddg02", name: "DDG-02 Guardian", role: "Escort" },
  { id: "ffg03", name: "FFG-03 Sentinel", role: "Escort" },
  { id: "aoe01", name: "AOE-01 Endeavor", role: "Support" },
  { id: "tao02", name: "T-AO-02 Provider", role: "Support" },
];

const ShipBlueprint = () => (
  <svg
    className="ship-svg"
    viewBox="0 0 120 420"
    role="img"
    aria-label="Vessel top-down blueprint"
  >
    {/* hull */}
    <path
      d="M60 10 C 78 55, 88 100, 88 170 L 88 340 C 88 372, 74 396, 60 404 C 46 396, 32 372, 32 340 L 32 170 C 32 100, 42 55, 60 10 Z"
      fill="var(--sky-a20)"
      fillOpacity="0.25"
      stroke="var(--accent-blue)"
      strokeWidth="1.5"
      strokeDasharray="6 4"
    />
    {/* center line */}
    <line
      x1="60"
      y1="18"
      x2="60"
      y2="398"
      stroke="var(--white-a20)"
      strokeWidth="1"
      strokeDasharray="2 6"
    />
    {/* deck sections */}
    <rect x="46" y="70" width="28" height="34" rx="3" fill="none" stroke="var(--white-a20)" />
    <rect x="42" y="130" width="36" height="70" rx="4" fill="none" stroke="var(--white-a20)" />
    <rect x="44" y="224" width="32" height="58" rx="4" fill="none" stroke="var(--white-a20)" />
    <rect x="48" y="306" width="24" height="40" rx="10" fill="none" stroke="var(--white-a20)" />
    {/* mounts */}
    <circle cx="60" cy="46" r="9" fill="none" stroke="var(--accent-blue)" strokeWidth="1.2" />
    <circle cx="60" cy="46" r="3" fill="var(--accent-blue)" />
    <circle cx="60" cy="166" r="11" fill="none" stroke="var(--white-a20)" />
    <circle cx="60" cy="254" r="11" fill="none" stroke="var(--white-a20)" />
    <circle cx="60" cy="372" r="8" fill="none" stroke="var(--accent-blue)" strokeWidth="1.2" />
  </svg>
);

const markers = [
  { id: "m1", x: 130, y: 70, main: true },
  { id: "m2", x: 70, y: 130 },
  { id: "m3", x: 190, y: 130 },
  { id: "m4", x: 70, y: 210 },
  { id: "m5", x: 190, y: 210 },
  { id: "m6", x: 130, y: 260 },
];

const FormationMap = () => (
  <div className="formation-map">
    <span className="map-title">TF-01 NORTHERN WATCH</span>
    <svg viewBox="0 0 260 300" preserveAspectRatio="xMidYMid meet">
      {/* formation links */}
      <polygon
        points="130,70 190,130 190,210 130,260 70,210 70,130"
        fill="var(--sky-a20)"
        fillOpacity="0.15"
        stroke="var(--accent-blue)"
        strokeWidth="1"
        strokeDasharray="5 4"
      />
      <line x1="130" y1="70" x2="130" y2="260" stroke="var(--accent-green)" strokeWidth="1" strokeDasharray="5 4" opacity="0.7" />
      <line x1="70" y1="130" x2="190" y2="210" stroke="var(--accent-warn)" strokeWidth="1" strokeDasharray="5 4" opacity="0.6" />
      <line x1="190" y1="130" x2="70" y2="210" stroke="var(--accent-danger)" strokeWidth="1" strokeDasharray="5 4" opacity="0.5" />
      {/* range ring around flagship */}
      <circle cx="130" cy="70" r="26" fill="none" stroke="var(--white-a20)" strokeDasharray="3 4" />
      {/* vessel markers */}
      {markers.map((m) => (
        <g key={m.id} transform={`translate(${m.x} ${m.y})`}>
          <path
            d="M0 -9 C 3 -4, 4 0, 4 4 L 4 7 C 4 9, -4 9, -4 7 L -4 4 C -4 0, -3 -4, 0 -9 Z"
            fill={m.main ? "var(--accent-blue)" : "var(--c-bg-navy-dark)"}
            stroke="var(--accent-blue)"
            strokeWidth="1.2"
          />
        </g>
      ))}
    </svg>
    <div className="map-legend">
      <span className="legend-item">
        <span className="legend-line" /> Data Link
      </span>
      <span className="legend-item">
        <span className="legend-line high" /> Link (High)
      </span>
      <span className="legend-item">
        <span className="legend-line med" /> Link (Med)
      </span>
      <span className="legend-item">
        <span className="legend-line low" /> Link (Low)
      </span>
    </div>
    <span className="map-scale">10 km</span>
  </div>
);

const TaskForcePanel = ({ expanded }) => (
  <div className={`taskforce-panel ${expanded ? "expanded" : ""}`}>
    <FormationMap />
    <div className="taskforce-assets">
      <div className="assets-header">
        <h4>Task Force Assets</h4>
        <button className="btn-add-vessel">
          <Plus size={13} />
          Add Vessel
        </button>
      </div>
      {vessels.map((v) => (
        <div className="vessel-item" key={v.id}>
          <span className="vessel-icon">
            <Ship size={15} />
          </span>
          <div>
            <div className="vessel-name">{v.name}</div>
            <div className="vessel-role">{v.role}</div>
          </div>
          <button className="icon-btn" aria-label={`Remove ${v.name}`}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const VesselAssembly = () => {
  const [activeTab, setActiveTab] = useState("assembly");

  return (
    <div className="vessel-assembly">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "assembly" ? "active" : ""}`}
          onClick={() => setActiveTab("assembly")}
        >
          <Move size={14} />
          Vessel Assembly
        </button>
        <button
          className={`tab ${activeTab === "taskforce" ? "active" : ""}`}
          onClick={() => setActiveTab("taskforce")}
        >
          <Ship size={14} />
          Task Force
        </button>
      </div>

      {activeTab === "assembly" ? (
        <>
          <div className="workspace-toolbar">
            <div className="toolbar-group">
              <button className="toolbar-btn active" aria-label="Select">
                <MousePointer size={14} />
              </button>
              <button className="toolbar-btn" aria-label="Pan">
                <Hand size={14} />
              </button>
              <button className="toolbar-btn" aria-label="Move">
                <Move size={14} />
              </button>
            </div>
            <div className="toolbar-group">
              <button className="toolbar-btn" aria-label="Zoom out">
                <Minus size={14} />
              </button>
              <span className="zoom-label">100%</span>
              <button className="toolbar-btn" aria-label="Zoom in">
                <Plus size={14} />
              </button>
            </div>
            <div className="toolbar-group">
              <button className="toolbar-btn" aria-label="Fullscreen">
                <Maximize2 size={14} />
              </button>
            </div>
          </div>

          <div className="assembly-layout">
            <div className="assembly-main">
              <div className="blueprint-area">
                <div className="module-list left-modules">
                  {leftModules.map((m) => (
                    <ModuleCard key={m.id} {...m} />
                  ))}
                </div>

                <ShipBlueprint />

                <div className="module-list right-modules">
                  {rightModules.map((m) => (
                    <ModuleCard key={m.id} {...m} />
                  ))}
                </div>
              </div>

              <CompatibilityChecker />
            </div>

            <TaskForcePanel expanded={false} />
          </div>
        </>
      ) : (
        <TaskForcePanel expanded />
      )}
    </div>
  );
};

export default VesselAssembly;
