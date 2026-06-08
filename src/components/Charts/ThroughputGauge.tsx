interface ThroughputGaugeProps {
  name: string;
  value: number;
  color?: string; 
}

export function ThroughputGauge({ name, value, color }: ThroughputGaugeProps) {
  const radius = 38;
  const strokeWidth = 5;
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const circumference = 2 * Math.PI * radius;

  const angleRange = 240; 
  const rotationAngle = 150; 

  const totalArcLength = (angleRange / 360) * circumference;
  const strokeDashoffset = totalArcLength - (normalizedValue / 100) * totalArcLength;

  const needleRotation = rotationAngle + (normalizedValue / 100) * angleRange;

  const getNameColor = (shipName: string) => {
    if (color) return color;
    if (shipName.includes("01")) return "#3B8BD4";
    if (shipName.includes("02")) return "#10B981";
    if (shipName.includes("03")) return "#A855F7";
    return "#F59E0B"; // Default fallback for SHIP-04
  };

  const nameColor = getNameColor(name);

  const ticks = [
    { label: "0", angle: rotationAngle },
    { label: "25", angle: rotationAngle + angleRange * 0.25 },
    { label: "50", angle: rotationAngle + angleRange * 0.5 },
    { label: "75", angle: rotationAngle + angleRange * 0.75 },
    { label: "100", angle: rotationAngle + angleRange },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "130px",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          color: nameColor,
          fontWeight: "700",
          marginBottom: "12px",
          letterSpacing: "0.5px",
        }}
      >
        {name}
      </span>

      <div style={{ position: "relative", width: "110px", height: "110px" }}>
        <svg width="110" height="110" viewBox="0 0 100 100">
          <defs>
            <linearGradient id={`gauge-grad-${name}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0072ff" />
              <stop offset="100%" stopColor="#00c6ff" />
            </linearGradient>
          </defs>

          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${totalArcLength} ${circumference}`}
            transform={`rotate(${rotationAngle} 50 50)`}
            strokeLinecap="round"
          />

          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={`url(#gauge-grad-${name})`}
            strokeWidth={strokeWidth}
            strokeDasharray={`${totalArcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(${rotationAngle} 50 50)`}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />

          {ticks.map((tick, idx) => {
            const rad = ((tick.angle - 90) * Math.PI) / 180;
            const textRadius = radius - 10; 
            const x = 50 + textRadius * Math.cos(rad);
            const y = 52 + textRadius * Math.sin(rad);

            return (
              <text
                key={idx}
                x={x}
                y={y}
                fill="#64748b"
                fontSize="8px"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {tick.label}
              </text>
            );
          })}

          <g transform={`rotate(${needleRotation} 50 50)`}>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="18" 
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
            <circle cx="50" cy="50" r="3" fill="#f8fafc" />
          </g>
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#f8fafc",
              display: "block",
              lineHeight: "1",
            }}
          >
            {value.toFixed(1)}
          </span>
          <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "600" }}>Mbps</span>
        </div>
      </div>
    </div>
  );
}