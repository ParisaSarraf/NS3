import { Gamepad, LogOut, Map, Network, Radar, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../services/authService";
interface LeftSidebarProps 
{
  onLogout: () => void;
}

export function LeftSidebar({ onLogout }: LeftSidebarProps)
 {
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => 
      {
      onLogout(); 
      navigate("/login", { replace: true });
    },
    onError: () => 
      {
      onLogout();
      navigate("/login", { replace: true });
    },
  });

  const items = [
    { icon: Network, label: "NS3", to: "/NS3" },
    { icon: Map, label: "Map", to: "/Map" },
    { icon: Radar, label: "LiDar", to: "/lidar" },
    { icon: Target, label: "Mission", to: "/mission" },
    { icon: Gamepad, label: "FleetTwin", to: "/FleetTwin" },
  ];

  return (
    <div
      style={{
        width: "70px",
        backgroundColor: "#090d1f",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 0",
        gap: "20px",
        height: "100vh",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              opacity: item.to === window.location.pathname ? 1 : 0.4,
              color: item.to === window.location.pathname ? "#3b82f6" : "#fff",
            }}
            onClick={() => navigate(item.to)}
          >
            <span style={{ fontSize: "18px" }}>
              <item.icon style={{ fontSize: 20 }} />
            </span>
            <span style={{ fontSize: "9px" }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          cursor: logoutMutation.isPending ? "not-allowed" : "pointer",
          color: logoutMutation.isPending ? "#999" : "#ef4444",
          opacity: logoutMutation.isPending ? 0.5 : 1,
          paddingBottom: "10px",
        }}
        onClick={() => logoutMutation.mutate()}
        title="Log Out"
      >
        <LogOut style={{ fontSize: 20 }} />
        <span style={{ fontSize: "12px", fontWeight: "800" }}>
          {logoutMutation.isPending ? "..." : "Output"}
        </span>
      </div>
    </div>
  );
}
