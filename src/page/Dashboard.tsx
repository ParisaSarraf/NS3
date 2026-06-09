import { LeftSidebar } from "../components/Layout/LeftSidebar";
import { Route, Routes } from "react-router-dom";
import NetworkSystemThree from "./NetworkSystemThree";

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
        <Route path="/Map" />
        <Route path="/lidar" />
      </Routes>
    </div>
  );
}
