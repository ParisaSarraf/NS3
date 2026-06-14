import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const WS_URL = import.meta.env.VITE_WS_URL;
const RECONNECT_DELAY = 2000;

function parseAndNormalize(raw: string[]): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];

  for (const str of raw) {
    const m = str.match(/X=([\d\-.]+)\s+Y=([\d\-.]+)\s+Z=([\d\-.]+)/);

    if (!m) continue;

    points.push(
      new THREE.Vector3(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])),
    );
  }

  if (!points.length) return [];

  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;
  let minZ = Infinity,
    maxZ = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);

    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);

    minZ = Math.min(minZ, p.z);
    maxZ = Math.max(maxZ, p.z);
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;

  const range = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1;

  for (const p of points) {
    p.x = ((p.x - cx) / range) * 10;
    p.y = ((p.y - cy) / range) * 10;
    p.z = ((p.z - cz) / range) * 10;
  }

  return points;
}

export type WsStatus = "connecting" | "connected" | "disconnected" | "error";

export function useLidarSocket() {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [status, setStatus] = useState<WsStatus>("disconnected");

  useEffect(() => {
    console.log("points count =", points.length);
  }, [points]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shouldConnect = useRef(true);

  const connect = useCallback(() => {
    if (!shouldConnect.current) return;

    setStatus("connecting");

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!Array.isArray(data.data?.Point_Cloud)) return;
        const parsed = parseAndNormalize(data.data?.Point_Cloud);

        setPoints(parsed);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    ws.onerror = () => {
      setStatus("error");
    };

    ws.onclose = () => {
      setStatus("disconnected");

      if (shouldConnect.current) {
        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
      }
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      shouldConnect.current = false;

      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }

      wsRef.current?.close();
    };
  }, [connect]);

  return { points, status };
}
