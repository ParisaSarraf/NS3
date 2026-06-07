import { CYBER_THEME } from "../../utils/constants";

interface AlertLog {
  id: string;
  type: string;
  target: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  timestamp: string;
}

export function AlertsTable() {
  const alerts: AlertLog[] = [
    {
      id: "1",
      type: "High latency detected",
      target: "Ship2-Ship3",
      severity: "CRITICAL",
      timestamp: "14:31:47",
    },
    {
      id: "2",
      type: "Link degraded (Loss > 10%)",
      target: "Ship2-Ship3",
      severity: "WARNING",
      timestamp: "14:31:32",
    },
    {
      id: "3",
      type: "High latency detected",
      target: "Ship4-Ship5",
      severity: "WARNING",
      timestamp: "14:30:58",
    },
    {
      id: "4",
      type: "Route update uploaded",
      target: "Ship1",
      severity: "INFO",
      timestamp: "14:30:12",
    },
    {
      id: "5",
      type: "Throughput below threshold",
      target: "Ship5-Ship6",
      severity: "WARNING",
      timestamp: "14:29:41",
    },
  ];

  const getSeverityStyle = (severity: AlertLog["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        case "CRITICAL":
          return {
            color: "#ef4444",
            background: CYBER_THEME.severityColors.CRITICAL,
            border: "1px solid rgba(239, 68, 68, 0.4)",
           };
      case "WARNING":
        return {
          color: "#f59e0b",
          background: CYBER_THEME.severityColors.WARNING,
          border: "1px solid rgba(245, 158, 11, 0.4)",
        };
      case "INFO":
        return {
          color: "#3b82f6",
          background: CYBER_THEME.severityColors.INFO,
          border: "1px solid rgba(59, 130, 246, 0.4)",
        };
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#94a3b8",
            fontWeight: "600",
          }}
        >
          ALERTS LOG SYSTEM
        </h3>
        <span style={{ fontSize: "11px", color: "#64748b", cursor: "pointer" }}>
          ALL SEVERITY ▾
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
        className="custom-scroll"
      >
        {alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.2fr 1fr 0.8fr",
              alignItems: "center",
              padding: "10px 14px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              borderRadius: "10px",
              fontSize: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  color:
                    alert.severity === "CRITICAL"
                      ? "#ef4444"
                      : alert.severity === "WARNING"
                        ? "#f59e0b"
                        : "#3b82f6",
                }}
              >
                {alert.severity === "CRITICAL"
                  ? "❌"
                  : alert.severity === "WARNING"
                    ? "⚠️"
                    : "ℹ️"}
              </span>
              <span style={{ color: "#e2e8f0", fontWeight: "500" }}>
                {alert.type}
              </span>
            </div>

            <span style={{ color: "#94a3b8", fontFamily: "monospace" }}>
              {alert.target}
            </span>

            <div style={{ display: "flex" }}>
              <span
                style={{
                  ...getSeverityStyle(alert.severity),
                  fontSize: "10px",
                  fontWeight: "700",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  letterSpacing: "0.5px",
                }}
              >
                {alert.severity}
              </span>
            </div>

            <span
              style={{
                color: "#64748b",
                textAlign: "right",
                fontFamily: "monospace",
              }}
            >
              {alert.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
