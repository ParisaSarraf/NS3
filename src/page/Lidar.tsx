import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useLidarSocket } from "../hook/useLidarSocket";

const MAX_POINTS = 5760;

const statusConfig: Record<string, { color: string; label: string }> = {
  connecting:   { color: "#f59e0b", label: "در حال اتصال..." },
  connected:    { color: "#22c55e", label: "متصل" },
  disconnected: { color: "#6b7280", label: "قطع — در حال reconnect" },
  error:        { color: "#ef4444", label: "خطا — در حال reconnect" },
};

function Cloud({ points }: { points: THREE.Vector3[] }) {
  const geoRef = useRef<THREE.BufferGeometry>(null);

  const positions = useMemo(
    () => new Float32Array(MAX_POINTS * 3),
    []
  );

  useEffect(() => {
    if (!geoRef.current) return;
    const len = Math.min(points.length, MAX_POINTS);
    for (let i = 0; i < len; i++) {
      positions[i * 3]     = points[i].x;
      positions[i * 3 + 1] = points[i].y;
      positions[i * 3 + 2] = points[i].z;
    }
    const attr = geoRef.current.getAttribute("position") as THREE.BufferAttribute;
    attr.needsUpdate = true;
    geoRef.current.setDrawRange(0, len);
  }, [points]);

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={MAX_POINTS}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="white"
        size={0.015}
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  );
}

export default function Lidar() {
  const { points, status } = useLidarSocket();
  const { color, label } = statusConfig[status];

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* نوار وضعیت */}
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 10,
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(6,9,19,0.75)", backdropFilter: "blur(6px)",
        border: "0.5px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "6px 14px",
        fontFamily: "JetBrains Mono, monospace", fontSize: 12,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: color,
          boxShadow: status === "connected" ? `0 0 6px ${color}` : "none",
        }} />
        <span style={{ color: "#94a3b8" }}>{label}</span>
        <span style={{ color: "#475569", marginLeft: 8 }}>
          {points.length} نقطه
        </span>
      </div>

      <Canvas
        style={{ background: "#030827" }}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false }}
      >
        <Cloud points={points} />
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
}