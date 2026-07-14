<<<<<<< HEAD
import React from "react";
=======
import { Fuel, Radar, Wifi } from "lucide-react";
import MetricChart from "../dashboard/MetricChart";

const metrics = [
  {
    id: "fuel",
    icon: <Fuel size={14} />,
    title: "Fuel Consumption",
    sub: "Total Fleet (24h)",
    value: "78.4 t",
    delta: "\u25bc 6.2%",
    deltaNote: "vs prev 24h",
    deltaDown: false,
    color: "var(--accent-blue)",
    data: [
      3.4, 3.1, 3.3, 2.9, 3.0, 3.4, 3.6, 3.2, 3.1, 3.5, 3.3, 3.0, 2.8, 3.1, 3.2,
      3.4, 3.1, 2.9, 3.0, 3.2, 3.3, 3.1, 3.0, 2.9,
    ],
  },
  {
    id: "radar",
    icon: <Radar size={14} />,
    title: "Radar Health",
    sub: "Average Health",
    value: "96%",
    delta: "\u25b2 2%",
    deltaNote: "vs prev 24h",
    deltaDown: false,
    color: "var(--accent-green)",
    data: [
      93, 94, 94, 95, 94, 95, 96, 95, 96, 96, 95, 96, 97, 96, 96, 95, 96, 96,
      97, 96, 96, 95, 96, 96,
    ],
  },
  {
    id: "latency",
    icon: <Wifi size={14} />,
    title: "Link Latency",
    sub: "Average (All Links)",
    value: "28 ms",
    delta: "\u25bc 12 ms",
    deltaNote: "vs prev 24h",
    deltaDown: false,
    color: "var(--accent-blue)",
    data: [
      38, 34, 36, 31, 29, 33, 30, 28, 32, 27, 29, 31, 28, 26, 30, 28, 27, 29,
      28, 26, 28, 27, 29, 28,
    ],
  },
];
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e

const BottomPanel = () => {
  return (
    <div className="metrics-container">
<<<<<<< HEAD
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
=======
      {metrics.map((m) => (
        <div className="metric-card glass-panel" key={m.id}>
          <div className="metric-head">
            {m.icon}
            <span>{m.title}</span>
          </div>
          <div className="metric-sub">{m.sub}</div>
          <div className="metric-value-row">
            <span className="metric-value">{m.value}</span>
            <span className={`metric-delta ${m.deltaDown ? "down" : ""}`}>
              {m.delta}
              <span className="delta-note">{m.deltaNote}</span>
            </span>
          </div>
          <MetricChart data={m.data} color={m.color} id={`grad-${m.id}`} />
        </div>
      ))}
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
    </div>
  );
};

<<<<<<< HEAD
export default BottomPanel;
=======
export default BottomPanel;
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
