import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LeftSidebar } from "./components/Layout/LeftSidebar";
import NetworkSystemThree from "./page/NetworkSystemThree";
import Map from "./page/Map";
import Lidar from "./page/Lidar";
import Mission from "./page/Mission";
import Creation from "./page/FleetTwin";
import Login from "./components/Layout/Login/Login";

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(
    () => !!localStorage.getItem("access_token"),
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLogin(false);
  };

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
      {isLogin && <LeftSidebar onLogout={handleLogout} />}

      <div style={{ flex: 1, overflow: "hidden" }}>
        <Routes>
          {!isLogin ? (
            <>
              <Route
                path="/login"
                element={<Login onLoginSuccess={() => setIsLogin(true)} />}
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/NS3" element={<NetworkSystemThree />} />
              <Route path="/Map" element={<Map />} />
              <Route path="/Lidar" element={<Lidar />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="/creation" element={<Creation />} />
              <Route path="*" element={<Navigate to="/NS3" replace />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
