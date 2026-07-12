import { useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { createShipMarker } from "../helpers/creatShip";
import { buildLabelHTML } from "../helpers/buildLabelHTML";

export interface ShipPosition {
  id: string;
  lng: number;
  lat: number;
  color: string;
  latency_ms: number;
  loss: number;
}

const SHIP_COLORS: Record<string, string> = {
  "SHIP-01": "#3B8BD4",
  "SHIP-02": "#10B981",
  "SHIP-03": "#A855F7",
  "SHIP-04": "#F59E0B",
};

const SHIP_INITIAL_POSITIONS: Record<string, [number, number]> = {
  "SHIP-01": [50.8503, 28.9784],
  "SHIP-02": [55.2708, 25.2048],
  "SHIP-03": [56.3261, 24.4539],
  "SHIP-04": [52.5136, 29.3117],
};

export function useMapEngine() {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});
  const shipPositionsRef = useRef<Record<string, [number, number]>>({
    ...SHIP_INITIAL_POSITIONS,
  });

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
            paint: { "raster-opacity": 0.7 },
          },
        ],
      },
      center: [53.688, 27.5],
      zoom: 5.2,
    });

    map.on("load", () => {
      map.addSource("grid-lines", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            ...[25, 30, 35, 40].map((lat) => ({
              type: "Feature" as const,
              geometry: {
                type: "LineString" as const,
                coordinates: [
                  [40, lat],
                  [65, lat],
                ],
              },
              properties: {},
            })),
            ...[45, 50, 55, 60].map((lng) => ({
              type: "Feature" as const,
              geometry: {
                type: "LineString" as const,
                coordinates: [
                  [lng, 20],
                  [lng, 45],
                ],
              },
              properties: {},
            })),
          ],
        },
      });

      map.addLayer({
        id: "grid-lines-layer",
        type: "line",
        source: "grid-lines",
        paint: {
          "line-color": "rgba(255,255,255,0.10)",
          "line-width": 0.8,
          "line-dasharray": [2, 4],
        },
      });

      map.addSource("ship-mesh", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: "ship-mesh-layer",
        type: "line",
        source: "ship-mesh",
        paint: {
          "line-color": "#22d3ee",
          "line-width": 1,
          "line-dasharray": [3, 3],
          "line-opacity": 0.5,
        },
      });

      map.addSource("ship-pulses", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      Object.entries(SHIP_INITIAL_POSITIONS).forEach(([shipId, coords]) => {
        const color = SHIP_COLORS[shipId] ?? "#ffffff";
        const marker = createShipMarker(shipId, color, 0, 0);
        marker.setLngLat(coords).addTo(map);
        markersRef.current[shipId] = marker;
      });

      updateMesh(map, shipPositionsRef.current);
    });

    mapRef.current = map;
    return map;
  }, []);

  const updateShip = useCallback(
    (shipId: string, latency_ms: number, loss: number, distance_m: number) => {
      const map = mapRef.current;
      if (!map || !map.isStyleLoaded()) return;

      const color = SHIP_COLORS[shipId] ?? "#ffffff";
      const fixedPos = SHIP_INITIAL_POSITIONS[shipId] ?? [53.688, 27.5];
      shipPositionsRef.current[shipId] = fixedPos;

      const existing = markersRef.current[shipId];
      if (existing) {
        existing.setLngLat(fixedPos);

        const el = existing.getElement();

        const labelEl = el.querySelector(".ship-label") as HTMLElement | null;
        if (labelEl) {
          labelEl.innerHTML = buildLabelHTML(shipId, color, latency_ms, loss);
        }

        const statusDot = el.querySelector(
          "circle:last-of-type",
        ) as SVGCircleElement | null;
        if (statusDot) {
          statusDot.setAttribute(
            "fill",
            latency_ms > 150
              ? "#ef4444"
              : latency_ms > 80
                ? "#f59e0b"
                : "#22d3ee",
          );
        }
      } else {
        const marker = createShipMarker(shipId, color, latency_ms, loss);
        marker.setLngLat(fixedPos).addTo(map);
        markersRef.current[shipId] = marker;
      }

      updateMesh(map, shipPositionsRef.current);
    },
    [],
  );

  return { initMap, mapRef, updateShip };
}

function updateMesh(
  map: maplibregl.Map,
  positions: Record<string, [number, number]>,
) {
  const source = map.getSource("ship-mesh") as
    | maplibregl.GeoJSONSource
    | undefined;
  if (!source) return;

  const ships = Object.values(positions);
  const features: GeoJSON.Feature[] = [];
  for (let i = 0; i < ships.length; i++) {
    for (let j = i + 1; j < ships.length; j++) {
      features.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [ships[i], ships[j]],
        },
        properties: {},
      });
    }
  }

  source.setData({ type: "FeatureCollection", features });
}