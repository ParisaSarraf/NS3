import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { AirTrack, BBox, VesselTrack } from "../api/trafficTypes";
import { useAirTraffic, useMarineTraffic, useWeather } from "../hook/useTrafficData";

const BBOX: BBox = { lamin: 23, lomin: 43, lamax: 41, lomax: 65 };
const CENTER: [number, number] = [54, 31];

const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

function airToGeoJSON(tracks: AirTrack[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: tracks.map((t) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [t.longitude, t.latitude] },
      properties: {
        callsign: t.callsign,
        altitude: t.altitude ?? 0,
        heading: t.heading ?? 0,
        velocity: t.velocity ?? 0,
        country: t.originCountry,
      },
    })),
  };
}

function seaToGeoJSON(vessels: VesselTrack[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: vessels.map((v) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [v.longitude, v.latitude] },
      properties: {
        name: v.name,
        mmsi: v.mmsi,
        sog: v.sog ?? 0,
        cog: v.cog ?? 0,
      },
    })),
  };
}

const panelStyle: React.CSSProperties = {
  position: "absolute",
  background: "rgba(6, 9, 19, 0.88)",
  border: "1px solid #1e2a45",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 12,
  color: "#cfe3ff",
  zIndex: 10,
};

const Traffic = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const [showAir, setShowAir] = useState(true);
  const [showSea, setShowSea] = useState(true);

  const airQuery = useAirTraffic(BBOX, showAir);
  const { vessels, connected } = useMarineTraffic(BBOX, showSea);
  const weatherQuery = useWeather(CENTER[1], CENTER[0]);

  // ----- ساخت نقشه -----
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: CENTER,
      zoom: 5,
    });
    mapRef.current = map;

    map.on("load", () => {
      map.addSource("air", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.addSource("sea", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // لایه هواپیماها
      map.addLayer({
        id: "air-points",
        type: "circle",
        source: "air",
        paint: {
          "circle-radius": 4,
          "circle-color": "#ffb020",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#000",
        },
      });
      map.addLayer({
        id: "air-labels",
        type: "symbol",
        source: "air",
        layout: {
          "text-field": ["get", "callsign"],
          "text-size": 10,
          "text-offset": [0, 1.1],
          "text-optional": true,
        },
        paint: { "text-color": "#ffd88a" },
      });

      // لایه کشتی‌ها
      map.addLayer({
        id: "sea-points",
        type: "circle",
        source: "sea",
        paint: {
          "circle-radius": 4,
          "circle-color": "#2ee6a8",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#000",
        },
      });
      map.addLayer({
        id: "sea-labels",
        type: "symbol",
        source: "sea",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 10,
          "text-offset": [0, 1.1],
          "text-optional": true,
        },
        paint: { "text-color": "#9df5d6" },
      });

      // Popup با کلیک
      map.on("click", "air-points", (e) => {
        const p = e.features?.[0]?.properties;
        if (!p) return;
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `<b>✈ ${p.callsign}</b><br/>Alt: ${Math.round(p.altitude)} m<br/>Spd: ${Math.round(p.velocity)} m/s<br/>${p.country}`,
          )
          .addTo(map);
      });
      map.on("click", "sea-points", (e) => {
        const p = e.features?.[0]?.properties;
        if (!p) return;
        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(
            `<b>⛴ ${p.name}</b><br/>MMSI: ${p.mmsi}<br/>SOG: ${p.sog} kn / COG: ${p.cog}°`,
          )
          .addTo(map);
      });

      setMapReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ----- آپدیت دیتای لایه‌ها -----
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const src = mapRef.current.getSource("air") as maplibregl.GeoJSONSource;
    src?.setData(airToGeoJSON(showAir ? (airQuery.data ?? []) : []));
  }, [mapReady, airQuery.data, showAir]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const src = mapRef.current.getSource("sea") as maplibregl.GeoJSONSource;
    src?.setData(seaToGeoJSON(showSea ? vessels : []));
  }, [mapReady, vessels, showSea]);

  const weather = weatherQuery.data;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      {/* کنترل لایه‌ها */}
      <div style={{ ...panelStyle, top: 12, left: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>LAYERS</div>
        <label style={{ display: "block", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showAir}
            onChange={(e) => setShowAir(e.target.checked)}
          />{" "}
          Air Traffic ({airQuery.data?.length ?? 0})
          {airQuery.isFetching && " …"}
        </label>
        <label style={{ display: "block", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showSea}
            onChange={(e) => setShowSea(e.target.checked)}
          />{" "}
          Sea Traffic ({vessels.length}) {connected ? "🟢" : "🔴"}
        </label>
        {airQuery.isError && (
          <div style={{ color: "#ff7b7b", marginTop: 4 }}>
            Air API error / rate limit
          </div>
        )}
      </div>

      {/* پنل هواشناسی */}
      <div style={{ ...panelStyle, top: 12, right: 12, minWidth: 170 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>WEATHER</div>
        {weather ? (
          <>
            <div>🌡 Temp: {weather.temperature} °C</div>
            <div>💧 Humidity: {weather.humidity} %</div>
            <div>🌬 Wind: {weather.windSpeed} km/h @ {weather.windDirection}°</div>
            <div>⏱ Pressure: {weather.pressure} hPa</div>
          </>
        ) : weatherQuery.isError ? (
          <div style={{ color: "#ff7b7b" }}>Weather API error</div>
        ) : (
          <div>Loading…</div>
        )}
      </div>
    </div>
  );
};

export default Traffic;
