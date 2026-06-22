import { LeftSidebar } from "../components/Layout/LeftSidebar";
import { Route, Routes } from "react-router-dom";
import NetworkSystemThree from "./NetworkSystemThree";
import Map from "./Map";
import Lidar from "./Lidar";
import Mission from "./Mission";
import Creation from "./Creation";

export default function Dashboard() {
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
        <Route path="/Lidar" element={<Lidar />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/creation" element={<Creation />} />
      </Routes>
    </div>
  );
}


