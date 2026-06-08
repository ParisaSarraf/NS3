import { useState, useEffect } from "react";

export function useTelemetryData() {
  const [delayData, setDelayData] = useState<any[]>([]);
  const [packetData, setPacketData] = useState<any[]>([]);
  const [throughputData, setThroughputData] = useState<any[]>([]);

  useEffect(() => {
    const baseTime = Array.from({ length: 10 }, (_, i) => {
      const timeStr = `12:${40 + i}:00`;
      return {
        time: timeStr,
        "SHIP-01": Math.floor(100 + Math.random() * 80),
        "SHIP-02": Math.floor(120 + Math.random() * 90),
        "SHIP-03": Math.floor(150 + Math.random() * 120),
        "SHIP-04": Math.floor(90 + Math.random() * 60),
      };
    });
    setDelayData(baseTime);

    setPacketData([
      { name: "SHIP-01", loss: 7.2 },
      { name: "SHIP-02", loss: 10.6 },
      { name: "SHIP-03", loss: 14.3 },
      { name: "SHIP-04", loss: 8.9 },
    ]);

    setThroughputData([
      { id: "SHIP-01", value: 68.7 },
      { id: "SHIP-02", value: 54.3 },
      { id: "SHIP-03", value: 72.1 },
      { id: "SHIP-04", value: 47.8 },
    ]);
  }, []);

  return { delayData, packetData, throughputData };
}
