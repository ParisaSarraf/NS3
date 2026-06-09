import { useEffect, useRef } from "react";
import { useMapEngine } from "../../hook/useMapEngine";
import { MapToolbar } from "./MapToolbar";

export function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { initMap, mapRef } = useMapEngine();

  useEffect(() => {
    if (!containerRef.current) return;
    const mapInstance = initMap(containerRef.current);
    const resizeTimeout = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    }, 100);
    return () => {
      clearTimeout(resizeTimeout);
      mapInstance.remove();
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [initMap, mapRef]);

  const latLabels = ["40° 00' N", "35° 00' N", "30° 00' N", "25° 00' N"];
  const lngLabels = ["45° 00' E", "50° 00' E", "55° 00' E", "60° 00' E"];

  
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", backgroundColor: "#060913" }}
      />

      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "12px",
          bottom: "10%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontSize: "10px",
          color: "#64748b",
          pointerEvents: "none",
        }}
      >
        {latLabels.map((lbl) => (
          <span key={lbl}>{lbl}</span>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "14%",
          right: "4%",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "10px",
          color: "#64748b",
          pointerEvents: "none",
        }}
      >
        {lngLabels.map((lbl) => (
          <span key={lbl}>{lbl}</span>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "rgba(15, 23, 42, 0.75)",
          padding: "4px 10px",
          borderRadius: "4px",
          fontSize: "10px",
          color: "#22c55e",
          fontWeight: "bold",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span style={{ fontSize: "8px" }}>●</span> LIVE
      </div>

      <MapToolbar
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onToggleTopology={() => {}}
      />
    </div>
  );
}
