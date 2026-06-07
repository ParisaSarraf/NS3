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
          "dark-matter-tiles": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
              "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
              "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            ],
            tileSize: 256,
            attribution: "© CARTO"
          }
        },
        layers: [
          {
            id: "dark-base",
            type: "raster",
            source: "dark-matter-tiles",
            minzoom: 0,
            maxzoom: 20
          }
        ]
      },
      center: [23.5, 31.5],
      zoom: 6.2,
    });

    map.on("load", () => {
      map.addSource("fleet-mesh", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { status: "GOOD" },
              geometry: {
                type: "LineString",
                coordinates: [[21.3, 33.5], [24.6, 35.8], [26.1, 31.2], [22.8, 29.5], [21.3, 33.5]]
              }
            },
            {
              type: "Feature",
              properties: { status: "DEGRADED" },
              geometry: {
                type: "LineString",
                coordinates: [[24.6, 35.8], [22.8, 29.5]]
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
          "line-color": [
            "match",
            ["get", "status"],
            "GOOD", "#10B981",
            "DEGRADED", "#EF4444",
            "#F59E0B"
          ],
          "line-width": 1.5,
          "line-dasharray": [4, 3]
        }
      });

      const vessels = [
        { name: "Ship1", coords: [21.3, 33.5], details: "24.6 kn | HDG 132°" },
        { name: "Ship2", coords: [24.6, 35.8], details: "21.3 kn | HDG 245°" },
        { name: "Ship3", coords: [26.1, 31.2], details: "18.7 kn | HDG 359°" },
        { name: "Ship4", coords: [22.8, 29.5], details: "15.2 kn | HDG 115°" },
      ];

      vessels.forEach((ship) => {
        const markerEl = document.createElement("div");
        markerEl.style.display = "flex";
        markerEl.style.flexDirection = "column";
        markerEl.style.alignItems = "center";
        
        const dot = document.createElement("div");
        dot.style.width = "10px";
        dot.style.height = "10px";
        dot.style.backgroundColor = "#ffffff";
        dot.style.border = "2px solid #3b82f6";
        dot.style.borderRadius = "50%";
        dot.style.boxShadow = "0 0 12px #3b82f6";
        
        const label = document.createElement("div");
        label.style.background = "rgba(15, 23, 42, 0.85)";
        label.style.border = "1px solid rgba(255, 255, 255, 0.1)";
        label.style.borderRadius = "4px";
        label.style.padding = "4px 8px";
        label.style.color = "#fff";
        label.style.fontSize = "10px";
        label.style.whiteSpace = "nowrap";
        label.style.marginTop = "6px";
        label.innerHTML = `<strong style="color: #22d3ee">${ship.name}</strong><br/><span style="color: #94a3b8">${ship.details}</span>`;
        
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