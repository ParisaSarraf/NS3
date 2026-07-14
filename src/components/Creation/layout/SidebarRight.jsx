<<<<<<< HEAD
import React from "react";
=======
import {
  Settings,
  Radio,
  Server,
  Database,
  Shield,
  Key,
  Pencil,
  ArrowRight,
} from "lucide-react";

const endpoints = [
  {
    id: "mqtt",
    icon: <Radio size={15} />,
    name: "MQTT Broker",
    addr: "192.168.10.20:1883",
    proto: "MQTT v3.1.1",
  },
  {
    id: "opcua",
    icon: <Server size={15} />,
    name: "OPC UA Server",
    addr: "192.168.10.21:4840",
    proto: "OPC UA 1.04",
  },
  {
    id: "tsdb",
    icon: <Database size={15} />,
    name: "Time Series DB",
    addr: "192.168.10.22:8086",
    proto: "InfluxDB",
  },
  {
    id: "identity",
    icon: <Shield size={15} />,
    name: "Identity",
    addr: "192.168.10.30",
    proto: "Local AD",
  },
  {
    id: "certs",
    icon: <Key size={15} />,
    name: "Certificates",
    addr: "Valid until 2026-08-12",
    proto: "Local CA",
  },
];

const statuses = [
  { id: "links", name: "Data Links" },
  { id: "messaging", name: "Messaging" },
  { id: "storage", name: "Storage" },
  { id: "services", name: "Services" },
];
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e

const SidebarRight = () => {
  return (
    <div className="right-panel">
<<<<<<< HEAD
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
=======
      <h3 className="panel-title">
        <Settings size={15} />
        Configuration
      </h3>

      <div className="section-label">LAN Endpoints &amp; Protocols</div>

      {endpoints.map((ep) => (
        <div className="config-item" key={ep.id}>
          <span className="config-icon">{ep.icon}</span>
          <div className="config-body">
            <strong>{ep.name}</strong>
            <div className="config-addr">{ep.addr}</div>
            <div className="config-proto">
              <span className="status-dot" />
              {ep.proto}
            </div>
          </div>
          <button className="icon-btn" aria-label={`Edit ${ep.name}`}>
            <Pencil size={13} />
          </button>
        </div>
      ))}

      <div className="system-status">
        <div className="section-label">System Status</div>
        {statuses.map((s) => (
          <div className="status-row" key={s.id}>
            <span>{s.name}</span>
            <span className="status-value">
              <span className="status-dot" />
              Healthy
            </span>
          </div>
        ))}
        <button className="btn-link">
          View System Dashboard
          <ArrowRight size={14} />
        </button>
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default SidebarRight;
=======
export default SidebarRight;
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
