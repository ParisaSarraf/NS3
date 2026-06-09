import { useState, useEffect, useRef, useCallback } from "react";

interface WebSocketMessage {
  time: number;
  flow: string;
  direction: string;
  source_ship: string;
  destination_ship: string;
  distance_m: number;
  payload_bytes: number;
  latency_ms: number;
  jitter_ms: number;
  tx_packets: number;
  shadow_lost_packets: number;
  shadow_loss_ratio: number;
  shadow_packet_lost: boolean;
  ns3_enabled: boolean;
}

function generateInitialHistory(): any[] {
  return Array.from({ length: 15 }, (_, i) => ({
    time: `T-${15 - i}s`,
    "SHIP-01": null,
    "SHIP-02": null,
    "SHIP-03": null,
    "SHIP-04": null,
  }));
}

function normalizeShipId(raw: string): string {
  let key = raw.toUpperCase();
  if (!key.includes("-")) {
    const match = key.match(/\d+/);
    if (match) key = `SHIP-${match[0].padStart(2, "0")}`;
  }
  return key;
}

export function useTelemetryData(
  updateShip?: (
    shipId: string,
    latency_ms: number,
    loss: number,
    distance_m: number,
  ) => void,
) {
  const [delayData, setDelayData] = useState<any[]>(generateInitialHistory());
  const [packetData, setPacketData] = useState([
    { name: "SHIP-01", loss: 0 },
    { name: "SHIP-02", loss: 0 },
    { name: "SHIP-03", loss: 0 },
    { name: "SHIP-04", loss: 0 },
  ]);
  const [throughputData, setThroughputData] = useState([
    { id: "SHIP-01", value: 0 },
    { id: "SHIP-02", value: 0 },
    { id: "SHIP-03", value: 0 },
    { id: "SHIP-04", value: 0 },
  ]);
  const [alerts, setAlerts] = useState<any[]>([]);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        let rawText: string;
        if (event.data instanceof ArrayBuffer) {
          rawText = new TextDecoder("utf-8").decode(event.data);
        } else {
          rawText = event.data as string;
        }

        const msg: WebSocketMessage = JSON.parse(rawText);
        const sourceKey = normalizeShipId(msg.source_ship);
        const timeLabel = `T+${msg.time.toFixed(0)}s`;

        // 1. Update map marker
        updateShip?.(
          sourceKey,
          msg.latency_ms,
          msg.shadow_loss_ratio * 100,
          msg.distance_m,
        );

        // 2. Delay chart
        setDelayData((prev) => {
          const newPoint: Record<string, any> = {
            time: timeLabel,
            "SHIP-01": prev[prev.length - 1]?.["SHIP-01"] ?? null,
            "SHIP-02": prev[prev.length - 1]?.["SHIP-02"] ?? null,
            "SHIP-03": prev[prev.length - 1]?.["SHIP-03"] ?? null,
            "SHIP-04": prev[prev.length - 1]?.["SHIP-04"] ?? null,
            [sourceKey]: +msg.latency_ms.toFixed(2),
          };
          const idx = prev.findIndex((d) => d.time === timeLabel);
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              [sourceKey]: +msg.latency_ms.toFixed(2),
            };
            return updated;
          }
          const next = [...prev, newPoint];
          if (next.length > 15) next.shift();
          return next;
        });

        // 3. Packet loss
        setPacketData((prev) =>
          prev.map((item) =>
            item.name === sourceKey
              ? { ...item, loss: +(msg.shadow_loss_ratio * 100).toFixed(1) }
              : item,
          ),
        );

        // 4. Throughput
        setThroughputData((prev) =>
          prev.map((item) =>
            item.id === sourceKey
              ? { ...item, value: +Math.min(msg.latency_ms, 100).toFixed(1) }
              : item,
          ),
        );

        // 5. Alerts
        if (msg.shadow_packet_lost || msg.latency_ms > 100) {
          setAlerts((prev) => {
            const newAlert = {
              id: Date.now().toString(),
              type: msg.shadow_packet_lost ? "Packet Dropped" : "High Latency",
              target: `${msg.source_ship}->${msg.destination_ship}`,
              severity: msg.shadow_packet_lost ? "CRITICAL" : "WARNING",
              timestamp: new Date().toLocaleTimeString(),
            };
            const next = [newAlert, ...prev];
            if (next.length > 20) next.pop();
            return next;
          });
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    },
    [updateShip],
  );

  useEffect(() => {
    isMountedRef.current = true;

    function connect() {
      if (!isMountedRef.current) return;
      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING)
      )
        return;

      const ws = new WebSocket(import.meta.env.VITE_WS_URL as string);
      ws.binaryType = "arraybuffer";
      socketRef.current = ws;
      ws.onopen = () => console.log("WS: connected");
      ws.onmessage = handleMessage;
      ws.onerror = (e) => console.error("WS error:", e);
      ws.onclose = () => {
        if (isMountedRef.current) {
          reconnectTimerRef.current = setTimeout(connect, 2000);
        }
      };
    }

    connect();

    return () => {
      isMountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      const ws = socketRef.current;
      if (ws) {
        ws.onclose = null;
        ws.onerror = null;
        ws.onmessage = null;
        ws.close();
        socketRef.current = null;
      }
    };
  }, [handleMessage]);

  return { delayData, packetData, throughputData, alerts };
}
