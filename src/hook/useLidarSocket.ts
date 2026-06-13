import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

const WS_URL = import.meta.env.WS_URL;
const RECONNECT_DELAY = 2000;

function parseAndNormalize(raw: string[]): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];

  for (const str of raw) {
    const m = str.match(/X=([\d\-.]+)\s+Y=([\d\-.]+)\s+Z=([\d\-.]+)/);
    if (!m) continue;
    points.push(new THREE.Vector3(
      parseFloat(m[1]),
      parseFloat(m[2]),
      parseFloat(m[3])
    ));
  }

  if (!points.length) return [];

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (const p of points) {
    if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
    if (p.z < minZ) minZ = p.z; if (p.z > maxZ) maxZ = p.z;
  }

  const range = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;

  for (const p of points) {
    p.x = ((p.x - cx) / range) * 2;
    p.y = ((p.y - cy) / range) * 2;
    p.z = ((p.z - cz) / range) * 2;
  }

  return points;
}

export type WsStatus = "connecting" | "connected" | "disconnected" | "error";

export function useLidarSocket() {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [status, setStatus] = useState<WsStatus>("disconnected");
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
        if (!Array.isArray(data.Point_Cloud)) return;
        const parsed = parseAndNormalize(data.Point_Cloud);
        setPoints(parsed);
      } catch {
        console.error("Error parsing message:", event.data);
        setStatus("error");
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      setStatus("error");
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event);
      setStatus("disconnected");
      wsRef.current = null;
      if (shouldConnect.current) {
        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
      }
    };
  }, []);

  useEffect(() => {
    shouldConnect.current = true;
    connect();

    return () => {
      shouldConnect.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { points, status };
}