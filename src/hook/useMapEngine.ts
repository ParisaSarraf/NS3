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
              "raster-opacity": 0.7,
            },
          },
        ],
      },
      center: [53.688, 32.4279], 
      zoom: 4.8, 
    });

    map.on("load", () => {
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
                  [51.666, 32.6546], // Isfahan Hub
                  [48.5176, 34.7981], // Hamadan Hub
                  [51.4204, 35.6944], // Loop back
                ],
              },
            },
          ],
        },
      });

      map.addLayer({
        id: "mesh-lines",
        type: "line",
        source: "fleet-mesh",
        paint: {
          "line-color": "#22d3ee",
          "line-width": 1.5,
          "line-dasharray": [3, 3],
        },
      });

      map.addSource("grid-lines", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [40, 25.0],
                  [65, 25.0],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [40, 30.0],
                  [65, 30.0],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [40, 35.0],
                  [65, 35.0],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [40, 40.0],
                  [65, 40.0],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [45.0, 20],
                  [45.0, 45],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [50.0, 20],
                  [50.0, 45],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [55.0, 20],
                  [55.0, 45],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [
                  [60.0, 20],
                  [60.0, 45],
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
          "line-color": "rgba(255, 255, 255, 0.12)",
          "line-width": 0.8,
          "line-dasharray": [2, 4],
        },
      });

      const hubs = [
        {
          name: "TEHRAN-HQ",
          color: "#3B8BD4",
          coords: [51.4204, 35.6944],
          details: "35.69 N, 51.42 E",
          icon: "🏛️", 
        },
        {
          name: "MASHHAD-NODE",
          color: "#10B981",
          coords: [59.6159, 36.2972],
          details: "36.29 N, 59.61 E",
          icon: "📡",
        },
        {
          name: "ISFAHAN-RELAY",
          color: "#F59E0B",
          coords: [51.666, 32.6546],
          details: "32.65 N, 51.66 E",
          icon: "🔄",
        },
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
