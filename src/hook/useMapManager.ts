import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import type {
  Feature,
  GeometryData,
  Mode,
  PendingGeometry,
} from "../utils/types";

export function useMapManager() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [labelInput, setLabelInput] = useState("");
  const [showLabelDialog, setShowLabelDialog] = useState(false);
  const [pendingGeom, setPendingGeom] = useState<PendingGeometry | null>(null);

  const modeRef = useRef<Mode>(null);
  const drawPoints = useRef<[number, number][]>([]);
  const drawMarkers = useRef<maplibregl.Marker[]>([]);
  const hiddenIdsRef = useRef<string[]>([]);

  const BaseURL = import.meta.env.VITE_API_URL_BACKEND;

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    hiddenIdsRef.current = hiddenIds;
  }, [hiddenIds]);

  const resetDrawState = useCallback(() => {
    drawMarkers.current.forEach((m) => m.remove());
    drawMarkers.current = [];
    drawPoints.current = [];
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch(`${BaseURL}/api/features`);
      
      const data: Feature[] = await res.json();
      setFeatures(data);

      if (mapRef.current && mapRef.current.getSource("features")) {
        const visibleFeatures = data.filter(
          (f) => !hiddenIdsRef.current.includes(f.id),
        );
        const geojson: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: visibleFeatures.map((f) => ({
            type: "Feature",
            properties: { id: f.id, label: f.label, type: f.type },
            geometry: JSON.parse(f.geom),
          })),
        };
        (
          mapRef.current.getSource("features") as maplibregl.GeoJSONSource
        ).setData(geojson);
      }
    } catch (err) {
      console.error("Failed to refresh data:", err);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && mapRef.current.getSource("features")) {
      const visibleFeatures = features.filter((f) => !hiddenIds.includes(f.id));
      const geojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: visibleFeatures.map((f) => ({
          type: "Feature",
          properties: { id: f.id, label: f.label, type: f.type },
          geometry: JSON.parse(f.geom),
        })),
      };
      (
        mapRef.current.getSource("features") as maplibregl.GeoJSONSource
      ).setData(geojson);
    }
  }, [hiddenIds, features]);

  const deleteFeature = useCallback(
    async (id: string) => {
      try {
        await fetch(`${BaseURL}/api/features`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setFeatures((prev) => prev.filter((f) => f.id !== id));
        setHiddenIds((prev) => prev.filter((hiddenId) => hiddenId !== id));
        await refreshData();
      } catch (err) {
        console.error(err);
      }
    },
    [refreshData],
  );

  const toggleVisibility = useCallback((id: string) => {
    setHiddenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const saveGeometry = (): void => {
    const currentMode = modeRef.current;
    if (currentMode !== "line" && currentMode !== "polygon") return;
    if (
      (currentMode === "line" && drawPoints.current.length < 2) ||
      (currentMode === "polygon" && drawPoints.current.length < 3)
    ) {
      return;
    }

    let geomData: GeometryData;

    if (currentMode === "line") {
      geomData = { type: "LineString", coordinates: drawPoints.current };
    } else {
      const closedCoordinates = [...drawPoints.current, drawPoints.current[0]];
      geomData = { type: "Polygon", coordinates: [closedCoordinates] };
    }

    setPendingGeom({ type: currentMode, geomData });
    setLabelInput("");
    setShowLabelDialog(true);
  };

  const handleFinalSave = useCallback(async () => {
    if (!pendingGeom) {
      console.log("pendingGeom is null");
      return;
    }

    const finalLabel =
      labelInput.trim() ||
      `${
        pendingGeom.type === "point"
          ? "Point"
          : pendingGeom.type === "line"
            ? "Line"
            : "Area"
      } (Unnamed)`;

    try {
      const response = await fetch(`${BaseURL}/api/features`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: pendingGeom.type,
          label: finalLabel,
          geom: JSON.stringify(pendingGeom.geomData),
        }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      setShowLabelDialog(false);
      setPendingGeom(null);
      setLabelInput("");
      resetDrawState();
      setMode(null);
      await refreshData();
    } catch (err: any) {
      console.error(err);
    }
  }, [pendingGeom, labelInput, resetDrawState, refreshData]);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (maplibregl.getRTLTextPluginStatus() === "unavailable") {
      maplibregl.setRTLTextPlugin(
        "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.js",
        (error: Error | null) => {
          if (error) console.error(error);
        },
      );
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
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
      center: [53.0, 32.0],
      zoom: 12,
    });
    mapRef.current = map;

    map.on("load", () => {
      map.addSource("features", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: "polygons-layer",
        type: "fill",
        source: "features",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "fill-color": "#10B981",
          "fill-opacity": 0.25,
          "fill-outline-color": "#10B981",
        },
      });

      map.addLayer({
        id: "lines-layer",
        type: "line",
        source: "features",
        filter: ["==", ["geometry-type"], "LineString"],
        paint: { "line-color": "#F59E0B", "line-width": 4 },
      });

      map.addLayer({
        id: "points-layer",
        type: "circle",
        source: "features",
        filter: ["==", ["geometry-type"], "Point"],
        paint: {
          "circle-radius": 7,
          "circle-color": "#3B8BD4",
          "circle-stroke-color": "#1e293b",
          "circle-stroke-width": 2,
        },
      });

      refreshData();

      const setupDeleteClick = (layerId: string) => {
        map.on("click", layerId, (e) => {
          if (modeRef.current !== "delete") return;
          const id = e.features?.[0]?.properties?.id;
          if (id) deleteFeature(id);
        });
      };
      setupDeleteClick("points-layer");
      setupDeleteClick("lines-layer");
      setupDeleteClick("polygons-layer");

      map.on("click", (e) => {
        const currentMode = modeRef.current;
        const { lng, lat } = e.lngLat;

        if (currentMode === "point") {
          setPendingGeom({
            type: "point",
            geomData: { type: "Point", coordinates: [lng, lat] },
          });
          setLabelInput("");
          setShowLabelDialog(true);
        }

        if (currentMode === "line" || currentMode === "polygon") {
          drawPoints.current.push([lng, lat]);
          const marker = new maplibregl.Marker({
            color: currentMode === "line" ? "#F59E0B" : "#10B981",
          })
            .setLngLat([lng, lat])
            .addTo(map);
          drawMarkers.current.push(marker);
        }
      });
    });

    return () => map.remove();
  }, [deleteFeature, refreshData]);

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      resetDrawState();
      setMode((prev: Mode) => (prev === newMode ? null : newMode));
    },
    [resetDrawState],
  );

  return {
    mapContainer,
    mode,
    features,
    hiddenIds,
    labelInput,
    showLabelDialog,
    setLabelInput,
    setShowLabelDialog,
    setPendingGeom,
    handleModeChange,
    saveGeometry,
    handleFinalSave,
    toggleVisibility,
    deleteFeature,
  };
}
