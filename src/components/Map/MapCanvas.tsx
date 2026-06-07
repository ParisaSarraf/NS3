// import { useEffect, useRef } from "react";
// import { useMapEngine } from "../../hook/useMapEngine";
// import { MapToolbar } from "./MapToolbar";

// export function MapCanvas() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   const { initMap, mapRef } = useMapEngine();

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const mapInstance = initMap(containerRef.current);

//     const resizeTimeout = setTimeout(() => {
//       if (mapRef.current) {
//         mapInstance.resize();
//       }
//     }, 100);

//     return () => {
//       clearTimeout(resizeTimeout);
//       mapInstance.remove();
//       if (mapRef.current) {
//         mapRef.current = null;
//       }
//     };
//   }, [initMap, mapRef]);

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100%",
//         position: "relative",
//         borderRadius: "14px",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         ref={containerRef}
//         style={{ width: "100%", height: "100%", backgroundColor: "#060913" }}
//       />

//       <div
//         style={{
//           position: "absolute",
//           top: "16px",
//           left: "16px",
//           background: "rgba(16, 185, 129, 0.12)",
//           border: "1px solid rgba(16, 185, 129, 0.25)",
//           padding: "6px 14px",
//           borderRadius: "20px",
//           fontSize: "11px",
//           color: "#34d399",
//           fontWeight: "600",
//           zIndex: 10,
//           display: "flex",
//           alignItems: "center",
//           gap: "6px",
//           pointerEvents: "none"
//         }}
//       >
//         <span style={{ color: "#10b981" }}>●</span> LIVE TOPOLOGY MESH
//       </div>

//       <MapToolbar
//         onZoomIn={() => mapRef.current?.zoomIn()}
//         onZoomOut={() => mapRef.current?.zoomOut()}
//         onToggleTopology={() => {}}
//       />
//     </div>
//   );
// }

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

  // Labels structure matching your image
  const latLabels = [
    "25° 30' N",
    "25° 00' N",
    "24° 30' N",
    "24° 00' N",
    "23° 30' N",
  ];
  const lngLabels = [
    "120° 30' E",
    "121° 00' E",
    "121° 30' E",
    "122° 00' E",
    "122° 30' E",
  ];

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

      {/* Axis Latitude Labels (Left Sidebar Margin Overlay) */}
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
          fontFamily: "monospace",
        }}
      >
        {latLabels.map((lbl) => (
          <span key={lbl}>{lbl}</span>
        ))}
      </div>

      {/* Axis Longitude Labels (Bottom Margin Overlay) */}
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
          fontFamily: "monospace",
        }}
      >
        {lngLabels.map((lbl) => (
          <span key={lbl}>{lbl}</span>
        ))}
      </div>

      {/* Live Active Stream Indicator Tag badge */}
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
