// import { useRef, useCallback } from "react";
// import maplibregl from "maplibre-gl";

// export function useMapEngine() {
//   const mapRef = useRef<maplibregl.Map | null>(null);

//   const initMap = useCallback((container: HTMLDivElement) => {
//     const map = new maplibregl.Map({
//       container,
//       style: {
//         version: 8,
//         sources: {
//           "dark-matter-tiles": {
//             type: "raster",
//             tiles: [
//               "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
//               "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
//               "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
//             ],
//             tileSize: 256,
//             attribution: "© CARTO"
//           }
//         },
//         layers: [
//           {
//             id: "dark-base",
//             type: "raster",
//             source: "dark-matter-tiles",
//             minzoom: 0,
//             maxzoom: 20
//           }
//         ]
//       },
//       center: [23.5, 31.5],
//       zoom: 6.2,
//     });

//     map.on("load", () => {
//       map.addSource("fleet-mesh", {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: [
//             {
//               type: "Feature",
//               properties: { status: "GOOD" },
//               geometry: {
//                 type: "LineString",
//                 coordinates: [[21.3, 33.5], [24.6, 35.8], [26.1, 31.2], [22.8, 29.5], [21.3, 33.5]]
//               }
//             },
//             {
//               type: "Feature",
//               properties: { status: "DEGRADED" },
//               geometry: {
//                 type: "LineString",
//                 coordinates: [[24.6, 35.8], [22.8, 29.5]]
//               }
//             }
//           ]
//         }
//       });

//       map.addLayer({
//         id: "mesh-lines",
//         type: "line",
//         source: "fleet-mesh",
//         paint: {
//           "line-color": [
//             "match",
//             ["get", "status"],
//             "GOOD", "#10B981",
//             "DEGRADED", "#EF4444",
//             "#F59E0B"
//           ],
//           "line-width": 1.5,
//           "line-dasharray": [4, 3]
//         }
//       });

//       const vessels = [
//         { name: "Ship1", coords: [21.3, 33.5], details: "24.6 kn | HDG 132°" },
//         { name: "Ship2", coords: [24.6, 35.8], details: "21.3 kn | HDG 245°" },
//         { name: "Ship3", coords: [26.1, 31.2], details: "18.7 kn | HDG 359°" },
//         { name: "Ship4", coords: [22.8, 29.5], details: "15.2 kn | HDG 115°" },
//       ];

//       vessels.forEach((ship) => {
//         const markerEl = document.createElement("div");
//         markerEl.style.display = "flex";
//         markerEl.style.flexDirection = "column";
//         markerEl.style.alignItems = "center";

//         const dot = document.createElement("div");
//         dot.style.width = "10px";
//         dot.style.height = "10px";
//         dot.style.backgroundColor = "#ffffff";
//         dot.style.border = "2px solid #3b82f6";
//         dot.style.borderRadius = "50%";
//         dot.style.boxShadow = "0 0 12px #3b82f6";

//         const label = document.createElement("div");
//         label.style.background = "rgba(15, 23, 42, 0.85)";
//         label.style.border = "1px solid rgba(255, 255, 255, 0.1)";
//         label.style.borderRadius = "4px";
//         label.style.padding = "4px 8px";
//         label.style.color = "#fff";
//         label.style.fontSize = "10px";
//         label.style.whiteSpace = "nowrap";
//         label.style.marginTop = "6px";
//         label.innerHTML = `<strong style="color: #22d3ee">${ship.name}</strong><br/><span style="color: #94a3b8">${ship.details}</span>`;

//         markerEl.appendChild(dot);
//         markerEl.appendChild(label);

//         new maplibregl.Marker({ element: markerEl })
//           .setLngLat(ship.coords as [number, number])
//           .addTo(map);
//       });
//     });

//     mapRef.current = map;
//     return map;
//   }, []);

//   return { initMap, mapRef };
// }

import { useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";

export function useMapEngine() {
  const mapRef = useRef<maplibregl.Map | null>(null);

  const initMap = useCallback((container: HTMLDivElement) => {
    const map = new maplibregl.Map({
      container,
      // Using an open, high-quality satellite tile configuration directly
      style: {
        version: 8,
        sources: {
          "satellite-tiles": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "Tiles © Esri",
          },
        },
        layers: [
          {
            id: "satellite-base",
            type: "raster",
            source: "satellite-tiles",
            minzoom: 0,
            maxzoom: 20,
            paint: {
              // Slightly dim the bright satellite imagery to preserve the dark dashboard contrast
              "raster-opacity": 0.65,
            },
          },
        ],
      },
      center: [121.45, 24.3], // Centered exactly over the telemetry region in your image
      zoom: 7.2,
    });

    map.on("load", () => {
      // 1. Precise connection routes from your reference image
      map.addSource("fleet-mesh", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [121.45, 24.95], // SHIP-01
                  [120.8, 24.5], // SHIP-02
                  [121.6, 23.9], // SHIP-04
                  [122.1, 24.35], // SHIP-03
                  [121.45, 24.95], // Connect back to SHIP-01
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [120.8, 24.5], // Cross-link: SHIP-02
                  [122.1, 24.35], // Cross-link: SHIP-03
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [121.45, 24.95], // Cross-link: SHIP-01
                  [121.6, 23.9], // Cross-link: SHIP-04
                ],
              },
            },
          ],
        },
      });

      // 2. White dotted telemetry link line styling
      map.addLayer({
        id: "mesh-lines",
        type: "line",
        source: "fleet-mesh",
        paint: {
          "line-color": "#ffffff",
          "line-width": 1.5,
          "line-dasharray": [3, 3], // Sharp, tightly spaced dots matching your image
        },
      });

      // 3. Render Grid Lines (Lat/Lng Graticule Overlay)
      map.addSource("grid-lines", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            // Latitude lines (Horizontal grids)
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [119, 23.5],
                  [124, 23.5],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [119, 24.0],
                  [124, 24.0],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [119, 24.5],
                  [124, 24.5],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [119, 25.0],
                  [124, 25.0],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [119, 25.5],
                  [124, 25.5],
                ],
              },
            },
            // Longitude lines (Vertical grids)
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [120.5, 22],
                  [120.5, 26],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [121.0, 22],
                  [121.0, 26],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [121.5, 22],
                  [121.5, 26],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [122.0, 22],
                  [122.0, 26],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [122.5, 22],
                  [122.5, 26],
                ],
              },
            },
          ],
        },
      });

      map.addLayer({
        id: "grid-lines-layer",
        type: "line",
        source: "grid-lines",
        paint: {
          "line-color": "rgba(255, 255, 255, 0.15)",
          "line-width": 0.8,
          "line-dasharray": [2, 4],
        },
      });

      // 4. Custom stylized HTML markers matching colors from the panels
      const vessels = [
        {
          name: "SHIP-01",
          color: "#3B8BD4",
          coords: [121.45, 24.95],
          details: "24.95 N, 121.45 E",
        },
        {
          name: "SHIP-02",
          color: "#10B981",
          coords: [120.8, 24.5],
          details: "24.50 N, 120.80 E",
        },
        {
          name: "SHIP-03",
          color: "#A855F7",
          coords: [122.1, 24.35],
          details: "24.35 N, 122.10 E",
        },
        {
          name: "SHIP-04",
          color: "#F59E0B",
          coords: [121.6, 23.9],
          details: "23.90 N, 121.60 E",
        },
      ];

      vessels.forEach((ship) => {
        const markerEl = document.createElement("div");
        markerEl.style.display = "flex";
        markerEl.style.flexDirection = "column";
        markerEl.style.alignItems = "center";

        // Dynamic ship node color anchor rings
        const dot = document.createElement("div");
        dot.style.width = "10px";
        dot.style.height = "10px";
        dot.style.backgroundColor = "#ffffff";
        dot.style.border = `2px solid ${ship.color}`;
        dot.style.borderRadius = "50%";
        dot.style.boxShadow = `0 0 12px ${ship.color}`;

        const label = document.createElement("div");
        label.style.textAlign = "center";
        label.style.color = "#fff";
        label.style.fontSize = "10px";
        label.style.fontFamily = "sans-serif";
        label.style.fontWeight = "600";
        label.style.textShadow =
          "0 1px 3px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.5)";
        label.style.marginTop = "4px";
        label.style.whiteSpace = "nowrap";
        label.innerHTML = `<span style="color: ${ship.color}">${ship.name}</span><br/><span style="color: #cbd5e1; font-weight: 400; font-size: 9px;">${ship.details}</span>`;

        markerEl.appendChild(dot);
        markerEl.appendChild(label);

        new maplibregl.Marker({ element: markerEl })
          .setLngLat(ship.coords as [number, number])
          .addTo(map);
      });
    });

    mapRef.current = map;
    return map;
  }, []);

  return { initMap, mapRef };
}
