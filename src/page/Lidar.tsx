import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useLidarSocket } from "../hook/useLidarSocket";

const MAX_POINTS = 10000;

function Cloud({ points }: { points: THREE.Vector3[] }) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const positions = useMemo(() => new Float32Array(MAX_POINTS * 3), []);

  useEffect(() => {
    if (!geometryRef.current) return;

    positions.fill(0);

    const len = Math.min(points.length, MAX_POINTS);

    for (let i = 0; i < len; i++) {
      const p = points[i];

      // تبدیل محور LiDAR به Three.js
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.z;
      positions[i * 3 + 2] = -p.y;
    }

    const attribute = geometryRef.current.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    attribute.needsUpdate = true;

    geometryRef.current.setDrawRange(0, len);

    geometryRef.current.computeBoundingSphere();
  }, [points, positions]);

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={MAX_POINTS}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial color="#ffffff" size={0.08} sizeAttenuation={false} />
    </points>
  );
}

export default function Lidar() {
  const { points, status } = useLidarSocket();

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Canvas
        camera={{
          position: [0, 5, 15],
          fov: 60,
        }}
      >
        <ambientLight intensity={1} />
        {points.length < 0 && (
          <>
            <axesHelper args={[5]} />
            <gridHelper args={[20, 20]} />
          </>
        )}

        <Cloud points={points} />

        <OrbitControls />
      </Canvas>

      {/* Satus Bar */}
      <div
        style={{
          direction: "rtl",
          position: "absolute",
          top: 24,
          right: 24,
          minWidth: "180px",
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "16px 20px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background:
                status === "connected"
                  ? "#22c55e"
                  : status === "connecting"
                    ? "#f59e0b"
                    : "#ef4444",
              boxShadow:
                status === "connected"
                  ? "0 0 10px #22c55e, 0 0 20px #22c55e50"
                  : "none",
              animation:
                status === "connecting" ? "pulse 1.5s infinite" : "none",
            }}
          />
          <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: 500 }}>
            {status === "connected"
              ? "متصل"
              : status === "connecting"
                ? "در حال اتصال..."
                : "قطع اتصال"}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#94a3b8", fontSize: "13px" }}>تعداد نقاط</span>
          <span
            style={{
              color: "#38bdf8",
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "monospace",
            }}
          >
            {points.length.toLocaleString()}
          </span>
        </div>
        <style>
          {`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}
        </style>
      </div>
    </div>
  );
}
