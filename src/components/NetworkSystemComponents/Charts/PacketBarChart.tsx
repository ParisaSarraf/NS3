import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { CYBER_THEME } from "../../../utils/constants";

export function PacketBarChart({ data }: { data: any[] }) {
  const colorsArray = Object.values(CYBER_THEME.vesselColors);

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: -25, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 11 }}
            stroke="rgba(255,255,255,0.1)"
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11 }}
            stroke="rgba(255,255,255,0.1)"
            domain={[0, 25]}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
          />
          <Bar
            dataKey="loss"
            radius={[6, 6, 0, 0]}
            label={{ position: "top", fill: "#cbd5e1", fontSize: 11 }}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorsArray[index % colorsArray.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
