import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CYBER_THEME } from "../../utils/constants";

export function DelayLineChart({ data }: { data: any[] }) {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
          />
          <XAxis
            dataKey="time"
            tick={{ fill: "#64748b", fontSize: 11 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11 }}
            stroke="rgba(255,255,255,0.1)"
            domain={[0, 50]}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: 10 }} />
          {Object.entries(CYBER_THEME.vesselColors).map(([key, color]) => (
            <Area
              key={key}
              type="monotoneY"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              fill={color}
              fillOpacity={0.2}
              connectNulls={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
