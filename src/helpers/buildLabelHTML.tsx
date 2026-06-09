export function buildLabelHTML(
  shipId: string,
  color: string,
  latency_ms: number,
  loss: number,
): string {
  const latencyColor =
    latency_ms > 150 ? "#ef4444" : latency_ms > 80 ? "#f59e0b" : "#22d3ee";
  return `
    <span style="color:${color};font-weight:700;font-size:10px;">${shipId}</span><br/>
    <span style="color:${latencyColor};font-size:9px;">${latency_ms.toFixed(0)}ms</span>
    <span style="color:#94a3b8;font-size:9px;"> · ${loss.toFixed(1)}%</span>
  `;
}