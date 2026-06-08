// import { useState, useEffect } from "react";

// export function useTelemetryData() {
//   const [delayData, setDelayData] = useState<any[]>([]);
//   const [packetData, setPacketData] = useState<any[]>([]);
//   const [throughputData, setThroughputData] = useState<any[]>([]);

//   useEffect(() => {
//     const baseTime = Array.from({ length: 10 }, (_, i) => {
//       const timeStr = `12:${40 + i}:00`;
//       return {
//         time: timeStr,
//         "SHIP-01": Math.floor(100 + Math.random() * 80),
//         "SHIP-02": Math.floor(120 + Math.random() * 90),
//         "SHIP-03": Math.floor(150 + Math.random() * 120),
//         "SHIP-04": Math.floor(90 + Math.random() * 60),
//       };
//     });
//     setDelayData(baseTime);

//     setPacketData([
//       { name: "SHIP-01", loss: 7.2 },
//       { name: "SHIP-02", loss: 10.6 },
//       { name: "SHIP-03", loss: 14.3 },
//       { name: "SHIP-04", loss: 8.9 },
//     ]);

//     setThroughputData([
//       { id: "SHIP-01", value: 68.7 },
//       { id: "SHIP-02", value: 54.3 },
//       { id: "SHIP-03", value: 72.1 },
//       { id: "SHIP-04", value: 47.8 },
//     ]);
//   }, []);

//   return { delayData, packetData, throughputData };
// }

import { useState, useEffect, useCallback } from "react";
import { dataTransformer } from "../services/dataTransformer";
import type {
  MappedDelayPoint,
  MappedPacketLoss,
  MappedThroughput,
  RedisTelemetryPayload,
} from "../utils/types";

export function useTelemetryData() {
  const [delayData, setDelayData] = useState<MappedDelayPoint[]>([]);
  const [packetData, setPacketData] = useState<MappedPacketLoss[]>([]);
  const [throughputData, setThroughputData] = useState<MappedThroughput[]>([]);

  const handleIncomingTelemetry = useCallback(
    (payload: RedisTelemetryPayload) => {
      const timeStr = dataTransformer.formatTimestamp(payload.time);
      const shipKey = payload.source_ship.toUpperCase();

      setDelayData((prev) => {
        const lastPoint = prev[prev.length - 1];
        const newPoint = {
          time: timeStr,
          "SHIP-01": prev.length ? lastPoint["SHIP-01"] || 110 : 110,
          "SHIP-02": prev.length ? lastPoint["SHIP-02"] || 120 : 120,
          "SHIP-03": prev.length ? lastPoint["SHIP-03"] || 150 : 150,
          "SHIP-04": prev.length ? lastPoint["SHIP-04"] || 90 : 90,
          [shipKey]: parseFloat(payload.latency_ms.toFixed(2)),
        } as MappedDelayPoint;

        const updated = [...prev, newPoint];
        if (updated.length > 15) updated.shift();
        return updated;
      });

      setPacketData((prev) => {
        const matchIdx = prev.findIndex((p) => p.id === shipKey);
        const lossValue = parseFloat(
          (payload.shadow_loss_ratio * 100).toFixed(1),
        );

        if (matchIdx > -1) {
          const next = [...prev];
          next[matchIdx] = { id: shipKey, value: lossValue };
          return next;
        }
        return [...prev, { id: shipKey, value: lossValue }];
      });

      setThroughputData((prev) => {
        const computedSpeed = dataTransformer.computeMbps(
          payload.payload_bytes,
          payload.latency_ms,
        );
        const targetId = shipKey;

        const matchIdx = prev.findIndex((t) => t.id === targetId);
        const updatedItem: MappedThroughput = {
          id: targetId,
          value: computedSpeed,
        };

        if (matchIdx > -1) {
          const next = [...prev];
          next[matchIdx] = updatedItem;
          return next;
        }
        return [...prev, updatedItem];
      });
    },
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const mockRedisSample: RedisTelemetryPayload = {
        time: Date.now() / 1000,
        flow: "ship3->ship1:permission_request",
        direction: "permission_request",
        source_ship: `ship${Math.floor(1 + Math.random() * 4)}`,
        destination_ship: "ship1",
        distance_m: 32261.78,
        payload_bytes: Math.floor(250 + Math.random() * 200),
        latency_ms: parseFloat((2.5 + Math.random() * 5).toFixed(4)),
        jitter_ms: 0.0,
        tx_packets: 1,
        shadow_lost_packets: 0,
        shadow_loss_ratio: Math.random() * 0.15,
        shadow_packet_lost: false,
        ns3_enabled: false,
      };

      handleIncomingTelemetry(mockRedisSample);
    }, 1500);

    return () => clearInterval(interval);
  }, [handleIncomingTelemetry]);

  return { delayData, packetData, throughputData };
}
