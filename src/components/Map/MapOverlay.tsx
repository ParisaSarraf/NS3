import { darkGlassCardStyle } from "../../utils/constants";

interface MapOverlayProps {
  vessels: Array<{ id: string; lat: string; lng: string; speed: string }>;
}

export function MapOverlay({ vessels }: MapOverlayProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        pointerEvents: "none",
      }}
    >
      {vessels.map((ship) => (
        <div
          key={ship.id}
          style={{
            ...darkGlassCardStyle,
            background: "rgba(15, 23, 42, 0.8)",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "11px",
            display: "flex",
            gap: "16px",
          }}
        >
          <span style={{ color: "#3b82f6", fontWeight: "700" }}>{ship.id}</span>
          <span style={{ color: "#cbd5e1" }}>
            {ship.lat}, {ship.lng}
          </span>
          <span style={{ color: "#10b981", fontWeight: "600" }}>
            {ship.speed}
          </span>
        </div>
      ))}
    </div>
  );
}
