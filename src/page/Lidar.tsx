import { Canvas } from "@react-three/fiber";
import { OrbitControls, Points, PointMaterial } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

function Cloud({ data }: { data: THREE.Vector3[] }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(data.length * 3);
    data.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [data]);

  return (
    <Points positions={positions}>
      <PointMaterial color="white" size={0.001} sizeAttenuation  />
    </Points>
  );
}

export default function Lidar({ points }: { points: THREE.Vector3[] }) {
  return (
    <Canvas
      style={{ background: "#030827ff", height: "100vh" }}
      camera={{ position: [0, 0, 5] }}
    >
      <Cloud data={points} />
      <OrbitControls />
    </Canvas>
  );
}