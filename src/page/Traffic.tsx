import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../style/traffic.css";
import type { AirTrack, BBox, VesselTrack } from "../api/trafficTypes";
import {
  useAirTraffic,
  useMarineTraffic,
  useWeather,
} from "../hook/useTrafficData";

// محدوده نمایش: ایران + خلیج فارس و دریای عمان
const BBOX: BBox = { lamin: 23, lomin: 43, lamax: 41, lomax: 65 };
const CENTER: [number, number] = [54, 30.5];

const AIR_COLOR = "#EAC26B";
const SEA_COLOR = "#4FB9C9";

const EMPTY_FC: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

// ---------------------------------------------------------------------
// استایل تیره نقشه — CARTO Dark Matter (رایگان)
// نکته: پراپرتی glyphs برای لیبل‌های متنی الزامی است — در نسخه قبلی
// نبود و لایه‌های متنی خطا می‌دادند.
// ---------------------------------------------------------------------
const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap © CARTO",
    },
  },
  layers: [{ id: "carto", type: "raster", source: "carto" }],
};

// ---------------------------------------------------------------------
// آیکون‌های SVG حرفه‌ای — رو به شمال، با icon-rotate به سمت heading می‌چرخند
// ---------------------------------------------------------------------
const PLANE_SVG = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="${color}" stroke="#0b0f1c" stroke-width="0.5" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`;

const SHIP_SVG = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="${color}" stroke="#0b0f1c" stroke-width="0.5" d="M12 2l5 9.5V20l-5-2.8L7 20v-8.5L12 2z"/></svg>`;

function loadSvgImage(
  map: maplibregl.Map,
  id: string,
  svg: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image(64, 64);
    img.onload = () => {
      try {
        if (!map.hasImage(id)) map.addImage(id, img);
        resolve();
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}

// ---------------------------------------------------------------------
// Trail (رد مسیر) — تاریخچه موقعیت هر هدف برای نمایش مسیر حرکت
// ---------------------------------------------------------------------
type Trail = { coords: [number, number][]; updated: number };

function pushTrail(
  trails: Map<string, Trail>,
  id: string,
  lng: number,
  lat: number,
  maxLen = 50,
) {
  const t = trails.get(id) ?? { coords: [], updated: 0 };
  const last = t.coords[t.coords.length - 1];
  if (!last || Math.abs(last[0] - lng) > 1e-4 || Math.abs(last[1] - lat) > 1e-4) {
    t.coords.push([lng, lat]);
    if (t.coords.length > maxLen) t.coords.shift();
  }
  t.updated = Date.now();
  trails.set(id, t);
}

function pruneTrails(trails: Map<string, Trail>, maxAgeMs = 10 * 60_000) {
  const now = Date.now();
  for (const [id, t] of trails) {
    if (now - t.updated > maxAgeMs) trails.delete(id);
  }
}

function trailsToGeoJSON(trails: Map<string, Trail>): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: Array.from(trails.entries())
      .filter(([, t]) => t.coords.length > 1)
      .map(([id, t]) => ({
        type: "Feature" as const,
        geometry: { type: "LineString" as const, coordinates: t.coords },
        properties: { id },
      })),
  };
}

// ---------------------------------------------------------------------
// GeoJSON builders
// ---------------------------------------------------------------------
function airToGeoJSON(tracks: AirTrack[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: tracks.map((t) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [t.longitude, t.latitude],
      },
      properties: {
        callsign: t.callsign,
        altitude: t.altitude ?? 0,
        rot: t.heading ?? 0,
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
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [v.longitude, v.latitude],
      },
      properties: {
        name: v.name,
        mmsi: v.mmsi,
        sog: v.sog ?? 0,
        cog: v.cog ?? 0,
        rot: v.heading ?? v.cog ?? 0,
      },
    })),
  };
}

// ---------------------------------------------------------------------
// ترجمه کد هواشناسی WMO به آیکون و متن
// ---------------------------------------------------------------------
function wmoInfo(code: number): { label: string; icon: string } {
  if (code === 0) return { label: "Clear Sky", icon: "\u2600\uFE0F" };
  if (code <= 2) return { label: "Partly Cloudy", icon: "\u26C5" };
  if (code === 3) return { label: "Overcast", icon: "\u2601\uFE0F" };
  if (code <= 48) return { label: "Fog / Haze", icon: "\uD83C\uDF2B\uFE0F" };
  if (code <= 57) return { label: "Drizzle", icon: "\uD83C\uDF26\uFE0F" };
  if (code <= 67) return { label: "Rain", icon: "\uD83C\uDF27\uFE0F" };
  if (code <= 77) return { label: "Snow", icon: "\uD83C\uDF28\uFE0F" };
  if (code <= 82) return { label: "Showers", icon: "\uD83C\uDF27\uFE0F" };
  if (code <= 86) return { label: "Snow Showers", icon: "\uD83C\uDF28\uFE0F" };
  return { label: "Thunderstorm", icon: "\u26C8\uFE0F" };
}

// =====================================================================
// صفحه Traffic
// =====================================================================
const Traffic = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const [showAir, setShowAir] = useState(true);
  const [showSea, setShowSea] = useState(true);

  // هواشناسی مرکز نقشه را دنبال می‌کند (با گرد کردن برای cache شدن query)
  const [wxPos, setWxPos] = useState({ lat: CENTER[1], lon: CENTER[0] });

  const airQuery = useAirTraffic(BBOX, showAir);
  const { vessels, connected } = useMarineTraffic(BBOX, showSea);
  const weatherQuery = useWeather(wxPos.lat, wxPos.lon);

  const airTrailsRef = useRef<Map<string, Trail>>(new Map());
  const seaTrailsRef = useRef<Map<string, Trail>>(new Map());

  // ----- ساخت نقشه -----
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: CENTER,
      zoom: 5.2,
      minZoom: 3,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");

    map.on("moveend", () => {
      const c = map.getCenter();
      setWxPos({ lat: +c.lat.toFixed(1), lon: +c.lng.toFixed(1) });
    });

    map.on("load", async () => {
      try {
        await Promise.all([
          loadSvgImage(map, "plane-icon", PLANE_SVG(AIR_COLOR)),
          loadSvgImage(map, "ship-icon", SHIP_SVG(SEA_COLOR)),
        ]);
      } catch {
        // اگر لود آیکون شکست خورد، لایه‌ها بدون آیکون ساخته می‌شوند
      }
      if (!mapRef.current) return; // کامپوننت unmount شده

      map.addSource("air", { type: "geojson", data: EMPTY_FC });
      map.addSource("sea", { type: "geojson", data: EMPTY_FC });
      map.addSource("air-trails", { type: "geojson", data: EMPTY_FC });
      map.addSource("sea-trails", { type: "geojson", data: EMPTY_FC });

      // ----- رد مسیرها (زیر آیکون‌ها) -----
      map.addLayer({
        id: "air-trails",
        type: "line",
        source: "air-trails",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": AIR_COLOR,
          "line-width": 1.4,
          "line-opacity": 0.35,
        },
      });
      map.addLayer({
        id: "sea-trails",
        type: "line",
        source: "sea-trails",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": SEA_COLOR,
          "line-width": 1.4,
          "line-opacity": 0.35,
        },
      });

      // ----- آیکون هواپیماها -----
      map.addLayer({
        id: "air-icons",
        type: "symbol",
        source: "air",
        layout: {
          "icon-image": "plane-icon",
          "icon-size": 0.42,
          "icon-rotate": ["get", "rot"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "text-field": ["get", "callsign"],
          "text-font": ["Open Sans Regular"],
          "text-size": 10,
          "text-offset": [0, 1.6],
          "text-optional": true,
        },
        paint: {
          "text-color": "#f0dcae",
          "text-halo-color": "#0b0f1c",
          "text-halo-width": 1.2,
        },
      });

      // ----- آیکون کشتی‌ها -----
      map.addLayer({
        id: "sea-icons",
        type: "symbol",
        source: "sea",
        layout: {
          "icon-image": "ship-icon",
          "icon-size": 0.4,
          "icon-rotate": ["get", "rot"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Regular"],
          "text-size": 10,
          "text-offset": [0, 1.6],
          "text-optional": true,
        },
        paint: {
          "text-color": "#b8e6ee",
          "text-halo-color": "#0b0f1c",
          "text-halo-width": 1.2,
        },
      });

      // ----- Popup و cursor -----
      const popupOpts = {
        closeButton: false,
        offset: 16,
        className: "tp-popup-wrap",
      };

      map.on("click", "air-icons", (e) => {
        const p = e.features?.[0]?.properties;
        if (!p) return;
        new maplibregl.Popup(popupOpts)
          .setLngLat(e.lngLat)
          .setHTML(
            `<div class="tp-popup-title"><span class="tp-dot" style="background:${AIR_COLOR}"></span>${p.callsign}</div>` +
              `<div class="tp-popup-grid">` +
              `<span>ALT</span><b>${Math.round(p.altitude).toLocaleString()} m</b>` +
              `<span>SPD</span><b>${Math.round(p.velocity * 3.6)} km/h</b>` +
              `<span>FROM</span><b>${p.country}</b>` +
              `</div>`,
          )
          .addTo(map);
      });

      map.on("click", "sea-icons", (e) => {
        const p = e.features?.[0]?.properties;
        if (!p) return;
        new maplibregl.Popup(popupOpts)
          .setLngLat(e.lngLat)
          .setHTML(
            `<div class="tp-popup-title"><span class="tp-dot" style="background:${SEA_COLOR}"></span>${p.name}</div>` +
              `<div class="tp-popup-grid">` +
              `<span>MMSI</span><b>${p.mmsi}</b>` +
              `<span>SOG</span><b>${Number(p.sog).toFixed(1)} kn</b>` +
              `<span>COG</span><b>${Math.round(p.cog)}°</b>` +
              `</div>`,
          )
          .addTo(map);
      });

      for (const layer of ["air-icons", "sea-icons"]) {
        map.on("mouseenter", layer, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layer, () => {
          map.getCanvas().style.cursor = "";
        });
      }

      setMapReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ----- آپدیت لایه هوایی + رد مسیر -----
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const data = showAir ? (airQuery.data ?? []) : [];

    for (const t of data) {
      pushTrail(airTrailsRef.current, t.icao24, t.longitude, t.latitude);
    }
    pruneTrails(airTrailsRef.current);

    (map.getSource("air") as maplibregl.GeoJSONSource)?.setData(
      airToGeoJSON(data),
    );
    (map.getSource("air-trails") as maplibregl.GeoJSONSource)?.setData(
      showAir ? trailsToGeoJSON(airTrailsRef.current) : EMPTY_FC,
    );
  }, [mapReady, airQuery.data, showAir]);

  // ----- آپدیت لایه دریایی + رد مسیر -----
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const data = showSea ? vessels : [];

    for (const v of data) {
      pushTrail(seaTrailsRef.current, String(v.mmsi), v.longitude, v.latitude);
    }
    pruneTrails(seaTrailsRef.current);

    (map.getSource("sea") as maplibregl.GeoJSONSource)?.setData(
      seaToGeoJSON(data),
    );
    (map.getSource("sea-trails") as maplibregl.GeoJSONSource)?.setData(
      showSea ? trailsToGeoJSON(seaTrailsRef.current) : EMPTY_FC,
    );
  }, [mapReady, vessels, showSea]);

  const weather = weatherQuery.data;
  const wx = weather ? wmoInfo(weather.weatherCode) : null;

  return (
    <div className="tp-root">
      <div ref={mapContainerRef} className="tp-map" />

      {/* ----- پنل لایه‌ها ----- */}
      <div className="tp-panel tp-layers">
        <div className="tp-title">TRAFFIC CONSOLE</div>

        <div className="tp-row">
          <span className="tp-row-icon" style={{ color: AIR_COLOR }}>
            {"\u2708"}
          </span>
          <span className="tp-row-label">Air Traffic</span>
          <span className="tp-badge">{airQuery.data?.length ?? 0}</span>
          <label className="tp-switch">
            <input
              type="checkbox"
              checked={showAir}
              onChange={(e) => setShowAir(e.target.checked)}
            />
            <i />
          </label>
        </div>

        <div className="tp-row">
          <span className="tp-row-icon" style={{ color: SEA_COLOR }}>
            {"\u2693"}
          </span>
          <span className="tp-row-label">Sea Traffic</span>
          <span className="tp-badge">{vessels.length}</span>
          <label className="tp-switch">
            <input
              type="checkbox"
              checked={showSea}
              onChange={(e) => setShowSea(e.target.checked)}
            />
            <i />
          </label>
        </div>

        <div className="tp-status">
          <span className={connected ? "tp-pill live" : "tp-pill off"}>
            <span className="tp-pulse" />
            {connected ? "AIS LIVE" : "AIS OFFLINE"}
          </span>
          {airQuery.isFetching && <span>SYNC…</span>}
        </div>

        {airQuery.isError && (
          <div className="tp-error">Air API error — rate limit / proxy</div>
        )}
      </div>

      {/* ----- کارت هواشناسی ----- */}
      <div className="tp-panel tp-weather">
        <div className="tp-title">
          WEATHER <span className="tp-sub">MAP CENTER</span>
        </div>

        {weather && wx ? (
          <>
            <div className="tp-wx-main">
              <span className="tp-wx-icon">{wx.icon}</span>
              <div>
                <div className="tp-wx-temp">
                  {Math.round(weather.temperature)}°<span>C</span>
                </div>
                <div className="tp-wx-cond">{wx.label}</div>
              </div>
            </div>

            <div className="tp-wx-grid">
              <div>
                <span>HUMIDITY</span>
                <b>{weather.humidity}%</b>
              </div>
              <div>
                <span>WIND</span>
                <b>
                  {Math.round(weather.windSpeed)}{" "}
                  <i
                    className="tp-wind-arrow"
                    style={{
                      transform: `rotate(${weather.windDirection + 180}deg)`,
                    }}
                  >
                    {"\u2191"}
                  </i>
                </b>
                <small>km/h</small>
              </div>
              <div>
                <span>PRESSURE</span>
                <b>{Math.round(weather.pressure)}</b>
                <small>hPa</small>
              </div>
            </div>

            <div className="tp-wx-time">
              {wxPos.lat.toFixed(1)}°N {wxPos.lon.toFixed(1)}°E · UPDATED{" "}
              {weather.time.slice(11, 16)}
            </div>
          </>
        ) : weatherQuery.isError ? (
          <div className="tp-error">Weather API unavailable</div>
        ) : (
          <div className="tp-wx-loading">Loading…</div>
        )}
      </div>
    </div>
  );
};

export default Traffic;
