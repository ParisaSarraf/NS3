interface ThroughputGaugeProps {
  name: string;
  value: number;
}

export function ThroughputGauge({ name, value }: ThroughputGaugeProps) {
  const radius = 40;
  const strokeWidth = 6;
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const circumference = 2 * Math.PI * radius;

  const angleRange = 270;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference -
    (normalizedValue / 100) * (angleRange / 360) * circumference;
  const rotationAngle = 135;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "110px",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          color: "#94a3b8",
          fontWeight: "600",
          marginBottom: "8px",
        }}
      >
        {name}
      </span>
      <div style={{ position: "relative", width: "90px", height: "90px" }}>
        <svg width="90" height="90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * (angleRange / 360)} ${circumference}`}
            transform={`rotate(${rotationAngle} 50 50)`}
            strokeLinecap="round"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#06b6d4"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(${rotationAngle} 50 50)`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#f8fafc",
              display: "block",
            }}
          >
            {value}
          </span>
          <span style={{ fontSize: "10px", color: "#64748b" }}>Mbps</span>
        </div>
      </div>
    </div>
  );
}
