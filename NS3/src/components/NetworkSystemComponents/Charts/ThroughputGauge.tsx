interface ThroughputGaugeProps {
  name: string;
  value: number;
  color?: string;
}

const CX = 75, CY = 88, R_OUTER = 68, R_INNER = 48, R_TRACK = 58;
const START_DEG = 210, RANGE = 300;

function degToRad(deg: number) {
  return (deg - 90) * (Math.PI / 180);
}

function ptOnCircle(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = degToRad(deg);
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const [sx, sy] = ptOnCircle(cx, cy, r, startDeg);
  const [ex, ey] = ptOnCircle(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${sx},${sy} A${r},${r},0,${large},1,${ex},${ey}`;
}

const TICK_LABELS: Record<number, string> = {
  0: "0", 25: "25", 50: "50", 75: "75", 100: "100",
};

function getColor(name: string, color?: string) {
  if (color) return color;
  if (name.includes("01")) return "#3B8BD4";
  if (name.includes("02")) return "#10B981";
  if (name.includes("03")) return "#A855F7";
  return "#F59E0B";
}

export function ThroughputGauge({ name, value, color }: ThroughputGaugeProps) {
  const shipColor = getColor(name, color);
  const norm = Math.min(Math.max(value, 0), 100);
  const fillEndDeg = START_DEG + (norm / 100) * RANGE;
  const needleDeg = START_DEG + (norm / 100) * RANGE;
  const gradId = `gauge-grad-${name}`;

  const [nx, ny] = ptOnCircle(CX, CY, R_INNER + 10, needleDeg);
  const [pax, pay] = ptOnCircle(CX, CY, 4, needleDeg + 90);
  const [pbx, pby] = ptOnCircle(CX, CY, 4, needleDeg - 90);

  const ticks = Array.from({ length: 21 }, (_, i) => {
    const pct = i / 20;
    const tickDeg = START_DEG + pct * RANGE;
    const isMajor = i % 5 === 0;
    const rOuter = R_OUTER - 2;
    const rInner = isMajor ? R_OUTER - 10 : R_OUTER - 6;
    const [x1, y1] = ptOnCircle(CX, CY, rOuter, tickDeg);
    const [x2, y2] = ptOnCircle(CX, CY, rInner, tickDeg);

    let label = null;
    if (isMajor) {
      const labelPct = Math.round(pct * 100);
      const [lx, ly] = ptOnCircle(CX, CY, R_OUTER - 20, tickDeg);
      label = (
        <text
          key={`lbl-${i}`}
          x={lx} y={ly}
          fill="#4a5a7a"
          fontSize="8"
          fontWeight="600"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="JetBrains Mono, monospace"
        >
          {TICK_LABELS[labelPct]}
        </text>
      );
    }

    return (
      <>
        <line
          key={`tick-${i}`}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={isMajor ? "#6a7a9a" : "#2e3d5a"}
          strokeWidth={isMajor ? 1.5 : 0.8}
          strokeLinecap="round"
        />
        {label}
      </>
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "12px",
          fontWeight: 700,
          color: shipColor,
          letterSpacing: "0.5px",
          marginBottom: "2px",
        }}
      >
        {name}
      </span>

      <svg
        width="150"
        height="110"
        viewBox="0 0 150 110"
        style={{ overflow: "visible" , paddingBottom: "20px" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={shipColor} stopOpacity={0.5} />
            <stop offset="100%" stopColor={shipColor} stopOpacity={1} />
          </linearGradient>
        </defs>

        <circle
          cx={CX} cy={CY} r={R_OUTER + 6}
          fill="#151c2e"
          stroke="#1e2a42"
          strokeWidth={1}
        />

        <path
          d={arcPath(CX, CY, R_TRACK, START_DEG, START_DEG + RANGE)}
          fill="none"
          stroke="#1a2340"
          strokeWidth={14}
          strokeLinecap="butt"
        />

        {norm > 0 && (
          <path
            d={arcPath(CX, CY, R_TRACK, START_DEG, fillEndDeg)}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={14}
            strokeLinecap="butt"
            style={{ transition: "d 0.5s cubic-bezier(0.4,0,0.2,1)" }}
          />
        )}
        {ticks}

        <circle
          cx={CX} cy={CY} r={R_INNER - 4}
          fill="#0d1220"
          stroke="#1e2a42"
          strokeWidth={1}
        />

        <path
          d={`M${pax},${pay} L${nx},${ny} L${pbx},${pby} Z`}
          fill="#ffffff"
          opacity={0.95}
          style={{ transition: "d 0.5s cubic-bezier(0.4,0,0.2,1)" }}
        />

        <circle cx={CX} cy={CY} r={5} fill="#ffffff" opacity={0.9} />
      </svg>

      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "20px",
          fontWeight: 700,
          color: "#f0f4ff",
          marginTop: "-6px",
          lineHeight: 1,
        }}
      >
        {value.toFixed(1)}
      </span>
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "12px",
          color: "#5a6a8a",
          fontWeight: 600,
        }}
      >
        Mbps
      </span>
    </div>
  );
}