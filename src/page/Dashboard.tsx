import { LeftSidebar } from "../components/Layout/LeftSidebar";
import { Route, Routes } from "react-router-dom";
import NetworkSystemThree from "./NetworkSystemThree";
import Map from "./Map";
import Lidar from "./Lidar";
import * as THREE from "three";
import Mission from "./Mission";

export default function Dashboard() {
  const points = [];

  // Simulate points data
  for (let i = 0; i < 1000; i++) {
    points.push(
      new THREE.Vector3(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
      ),
    );
  }

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#060913",
        height: "100vh",
        width: "100vw",
        color: "#fff",
        overflow: "hidden",
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      <LeftSidebar />
      <Routes>
        <Route path="/NS3" element={<NetworkSystemThree />} />
        <Route path="/Map" element={<Map />} />
        <Route path="/Lidar" element={<Lidar points={points} />} />
        <Route path="/mission" element={<Mission />} />
      </Routes>
    </div>
  );
}
