import { Ship, Network, Timer, Map, CloudSun, Wind } from "lucide-react";

export function BottomNav() {
  const telemetryItems = [
    { icon: Ship, label: "TOTAL SHIPS", value: "4" },
    { icon: Network, label: "ACTIVE LINKS", value: "6" },
    { icon: Timer, label: "SIMULATION TIME", value: "02:45:32" },
    { icon: Map, label: "SCENARIO", value: "Open Sea Transit" },
    { icon: CloudSun, label: "WEATHER", value: "Moderate" },
    { icon: Wind, label: "WIND", value: "18 kn, NE" },
  ];

  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.4)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "10px",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "97%",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div style={{ display: "flex", gap: "40px" }}>
        {telemetryItems.map((item, idx) => (
          <div
            key={idx}
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            <span style={{ opacity: 0.8 }}><item.icon /></span>
            <div>
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#64748b",
                  fontWeight: "600",
                  letterSpacing: "0.8px",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "13px",
                  color: "#f1f5f9",
                  fontWeight: "700",
                }}
              >
                {item.value}
              </span>
            </div>
          </div>
        ))}
        
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: "12px",
          color: "#64748b",
        }}
      >
        <span>v0.0.1</span>
        <span style={{ color: "#22c55e", fontWeight: "600" }}>● CONNECTED</span>
      </div>
    </div>
  );
}
