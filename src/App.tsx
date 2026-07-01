import { Route, Routes } from "react-router-dom";
import { LeftSidebar } from "./components/Layout/LeftSidebar";
import NetworkSystemThree from "./page/NetworkSystemThree";
import Map from "./page/Map";
import Lidar from "./page/Lidar";
import Mission from "./page/Mission";
import Creation from "./page/Creation";

function App() {
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

export default App;
