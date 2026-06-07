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
        mapInstance.resize();
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
          top: "16px",
          left: "16px",
          background: "rgba(16, 185, 129, 0.12)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          padding: "6px 14px",
          borderRadius: "20px",
          fontSize: "11px",
          color: "#34d399",
          fontWeight: "600",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          pointerEvents: "none"
        }}
      >
        <span style={{ color: "#10b981" }}>●</span> LIVE TOPOLOGY MESH
      </div>

      <MapToolbar
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onToggleTopology={() => {}}
      />
    </div>
  );
}