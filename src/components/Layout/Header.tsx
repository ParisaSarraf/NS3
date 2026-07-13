export function Header() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 4px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          MARITIME FLEET CO-SIMULATION MONITORING SYSTEM
        </h1>
        <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>
          NETWORK & COMMUNICATIONS REAL-TIME TELEMETRY
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "24px",
          fontSize: "12px",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#94a3b8" }}>
          UTC 2026-06-07 06:28:10
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(34,197,94,0.1)",
            padding: "4px 12px",
            borderRadius: "20px",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <span style={{ color: "#22c55e", fontSize: "10px" }}>●</span>
          <span
            style={{ color: "#4ade80", fontWeight: "600", fontSize: "11px" }}
          >
            SYSTEM HEALTH: GOOD
          </span>
        </div>
      </div>
    </div>
  );
}
