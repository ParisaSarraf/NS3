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

// import { useRef, useCallback } from "react";
// import maplibregl from "maplibre-gl";

// export function useMapEngine() {
//   const mapRef = useRef<maplibregl.Map | null>(null);

//   const initMap = useCallback((container: HTMLDivElement) => {
//     const map = new maplibregl.Map({
//       container,
//       // Using an open, high-quality satellite tile configuration directly
//       style: {
//         version: 8,
//         sources: {
//           "satellite-tiles": {
//             type: "raster",
//             tiles: [
//               "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
//             ],
//             tileSize: 256,
//             attribution: "Tiles © Esri",
//           },
//         },
//         layers: [
//           {
//             id: "satellite-base",
//             type: "raster",
//             source: "satellite-tiles",
//             minzoom: 0,
//             maxzoom: 20,
//             paint: {
//               // Slightly dim the bright satellite imagery to preserve the dark dashboard contrast
//               "raster-opacity": 0.65,
//             },
//           },
//         ],
//       },
//       center: [121.45, 24.3], // Centered exactly over the telemetry region in your image
//       zoom: 7.2,
//     });

//     map.on("load", () => {
//       // 1. Precise connection routes from your reference image
//       map.addSource("fleet-mesh", {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: [
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [121.45, 24.95], // SHIP-01
//                   [120.8, 24.5], // SHIP-02
//                   [121.6, 23.9], // SHIP-04
//                   [122.1, 24.35], // SHIP-03
//                   [121.45, 24.95], // Connect back to SHIP-01
//                 ],
//               },
//             },
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [120.8, 24.5], // Cross-link: SHIP-02
//                   [122.1, 24.35], // Cross-link: SHIP-03
//                 ],
//               },
//             },
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [121.45, 24.95], // Cross-link: SHIP-01
//                   [121.6, 23.9], // Cross-link: SHIP-04
//                 ],
//               },
//             },
//           ],
//         },
//       });

//       // 2. White dotted telemetry link line styling
//       map.addLayer({
//         id: "mesh-lines",
//         type: "line",
//         source: "fleet-mesh",
//         paint: {
//           "line-color": "#ffffff",
//           "line-width": 1.5,
//           "line-dasharray": [3, 3], // Sharp, tightly spaced dots matching your image
//         },
//       });

//       // 3. Render Grid Lines (Lat/Lng Graticule Overlay)
//       map.addSource("grid-lines", {
//         type: "geojson",
//         data: {
//           type: "FeatureCollection",
//           features: [
//             // Latitude lines (Horizontal grids)
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [119, 23.5],
//                   [124, 23.5],
//                 ],
//               },
//             },
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [119, 24.0],
//                   [124, 24.0],
//                 ],
//               },
//             },
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [119, 24.5],
//                   [124, 24.5],
//                 ],
//               },
//             },
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [119, 25.0],
//                   [124, 25.0],
//                 ],
//               },
//             },
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [119, 25.5],
//                   [124, 25.5],
//                 ],
//               },
//             },
//             // Longitude lines (Vertical grids)
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [120.5, 22],
//                   [120.5, 26],
//                 ],
//               },
//             },
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [121.0, 22],
//                   [121.0, 26],
//                 ],
//               },
//             },
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [121.5, 22],
//                   [121.5, 26],
//                 ],
//               },
//             },
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [122.0, 22],
//                   [122.0, 26],
//                 ],
//               },
//             },
//             {
//               type: "Feature",
//               geometry: {
//                 type: "LineString",
//                 coordinates: [
//                   [122.5, 22],
//                   [122.5, 26],
//                 ],
//               },
//             },
//           ],
//         },
//       });

//       map.addLayer({
//         id: "grid-lines-layer",
//         type: "line",
//         source: "grid-lines",
//         paint: {
//           "line-color": "rgba(255, 255, 255, 0.15)",
//           "line-width": 0.8,
//           "line-dasharray": [2, 4],
//         },
//       });

//       // 4. Custom stylized HTML markers matching colors from the panels
//       const vessels = [
//         {
//           name: "SHIP-01",
//           color: "#3B8BD4",
//           coords: [121.45, 24.95],
//           details: "24.95 N, 121.45 E",
//         },
//         {
//           name: "SHIP-02",
//           color: "#10B981",
//           coords: [120.8, 24.5],
//           details: "24.50 N, 120.80 E",
//         },
//         {
//           name: "SHIP-03",
//           color: "#A855F7",
//           coords: [122.1, 24.35],
//           details: "24.35 N, 122.10 E",
//         },
//         {
//           name: "SHIP-04",
//           color: "#F59E0B",
//           coords: [121.6, 23.9],
//           details: "23.90 N, 121.60 E",
//         },
//       ];

//       vessels.forEach((ship) => {
//         const markerEl = document.createElement("div");
//         markerEl.style.display = "flex";
//         markerEl.style.flexDirection = "column";
//         markerEl.style.alignItems = "center";

//         // Dynamic ship node color anchor rings
//         const dot = document.createElement("div");
//         dot.style.width = "10px";
//         dot.style.height = "10px";
//         dot.style.backgroundColor = "#ffffff";
//         dot.style.border = `2px solid ${ship.color}`;
//         dot.style.borderRadius = "50%";
//         dot.style.boxShadow = `0 0 12px ${ship.color}`;

//         const label = document.createElement("div");
//         label.style.textAlign = "center";
//         label.style.color = "#fff";
//         label.style.fontSize = "10px";
//         label.style.fontFamily = "sans-serif";
//         label.style.fontWeight = "600";
//         label.style.textShadow =
//           "0 1px 3px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.5)";
//         label.style.marginTop = "4px";
//         label.style.whiteSpace = "nowrap";
//         label.innerHTML = `<span style="color: ${ship.color}">${ship.name}</span><br/><span style="color: #cbd5e1; font-weight: 400; font-size: 9px;">${ship.details}</span>`;

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
      style: {
        version: 8,
        sources: {
          "satellite-tiles": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
            attribution: "Tiles © Esri"
          }
        },
        layers: [
          {
            id: "satellite-base",
            type: "raster",
            source: "satellite-tiles",
            minzoom: 0,
            maxzoom: 20,
            paint: {
              "raster-opacity": 0.7
            }
          }
        ]
      },
      center: [53.6880, 32.4279], // Centered exactly over the heart of Iran
      zoom: 4.8,                  // Wider view to fit Iran's borders comfortably
    });

    map.on("load", () => {
      // 1. Plotting mock nodes across main logistics/comms hubs in Iran
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
                  [51.4204, 35.6944], // Tehran Hub
                  [59.6159, 36.2972], // Mashhad Hub
                  [51.6660, 32.6546], // Isfahan Hub
                  [48.5176, 34.7981], // Hamadan Hub
                  [51.4204, 35.6944]  // Loop back
                ]
              }
            }
          ]
        }
      });

      map.addLayer({
        id: "mesh-lines",
        type: "line",
        source: "fleet-mesh",
        paint: {
          "line-color": "#22d3ee",
          "line-width": 1.5,
          "line-dasharray": [3, 3]
        }
      });

      // 2. Widen Lat/Lng Graticule lines over Middle East matrix coordinates
      map.addSource("grid-lines", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            // Latitude Lines
            { type: "Feature", geometry: { type: "LineString", coordinates: [[40, 25.0], [65, 25.0]] } },
            { type: "Feature", geometry: { type: "LineString", coordinates: [[40, 30.0], [65, 30.0]] } },
            { type: "Feature", geometry: { type: "LineString", coordinates: [[40, 35.0], [65, 35.0]] } },
            { type: "Feature", geometry: { type: "LineString", coordinates: [[40, 40.0], [65, 40.0]] } },
            // Longitude Lines
            { type: "Feature", geometry: { type: "LineString", coordinates: [[45.0, 20], [45.0, 45]] } },
            { type: "Feature", geometry: { type: "LineString", coordinates: [[50.0, 20], [50.0, 45]] } },
            { type: "Feature", geometry: { type: "LineString", coordinates: [[55.0, 20], [55.0, 45]] } },
            { type: "Feature", geometry: { type: "LineString", coordinates: [[60.0, 20], [60.0, 45]] } },
          ]
        }
      });

      map.addLayer({
        id: "grid-lines-layer",
        type: "line",
        source: "grid-lines",
        paint: {
          "line-color": "rgba(255, 255, 255, 0.12)",
          "line-width": 0.8,
          "line-dasharray": [2, 4]
        }
      });

      // 3. Anchor Hub Markers
      const hubs = [
        { name: "TEHRAN-HQ", color: "#3B8BD4", coords: [51.4204, 35.6944], details: "35.69 N, 51.42 E" },
        { name: "MASHHAD-NODE", color: "#10B981", coords: [59.6159, 36.2972], details: "36.29 N, 59.61 E" },
        { name: "ISFAHAN-RELAY", color: "#F59E0B", coords: [51.6660, 32.6546], details: "32.65 N, 51.66 E" }
      ];

      hubs.forEach((hub) => {
        const markerEl = document.createElement("div");
        markerEl.style.display = "flex";
        markerEl.style.flexDirection = "column";
        markerEl.style.alignItems = "center";
        
        const dot = document.createElement("div");
        dot.style.width = "10px";
        dot.style.height = "10px";
        dot.style.backgroundColor = "#ffffff";
        dot.style.border = `2px solid ${hub.color}`;
        dot.style.borderRadius = "50%";
        dot.style.boxShadow = `0 0 12px ${hub.color}`;
        
        const label = document.createElement("div");
        label.style.textAlign = "center";
        label.style.color = "#fff";
        label.style.fontSize = "10px";

        label.style.textShadow = "0 1px 3px rgba(0,0,0,0.9)";
        label.style.marginTop = "4px";
        label.innerHTML = `<span style="color: ${hub.color}">${hub.name}</span><br/><span style="color: #cbd5e1; font-weight: 400; font-size: 9px;">${hub.details}</span>`;
        
        markerEl.appendChild(dot);
        markerEl.appendChild(label);

        new maplibregl.Marker({ element: markerEl })
          .setLngLat(hub.coords as [number, number])
          .addTo(map);
      });
    });

    mapRef.current = map;
    return map;
  }, []);

  return { initMap, mapRef };
}