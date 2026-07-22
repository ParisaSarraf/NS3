import axios from "axios";
import type { AirTrack, BBox, WeatherData } from "../api/trafficTypes";

// =====================================================================
// ۱) ترافیک هوایی — OpenSky Network (رایگان، بدون کلید برای استفاده محدود)
//    https://opensky-network.org/apidoc/
// =====================================================================
// const OPENSKY_URL = "https://opensky-network.org/api/states/all";
const OPENSKY_URL = "/opensky/states/all";

export async function fetchAirTraffic(bbox: BBox): Promise<AirTrack[]> {
  const { data } = await axios.get(OPENSKY_URL, {
    params: bbox, // lamin, lomin, lamax, lomax
    timeout: 20000,
  });

  if (!data?.states) return [];

  // هر state یک آرایه است — ایندکس‌ها طبق مستندات OpenSky
  return (data.states as any[][])
    .map((s) => ({
      icao24: s[0],
      callsign: (s[1] ?? "").trim() || "N/A",
      originCountry: s[2],
      longitude: s[5],
      latitude: s[6],
      altitude: s[13] ?? s[7], // geo altitude یا baro altitude
      onGround: s[8],
      velocity: s[9],
      heading: s[10],
      verticalRate: s[11],
      lastContact: s[4],
    }))
    .filter((t) => t.longitude != null && t.latitude != null);
}

// =====================================================================
// ۲) داده هواشناسی — Open-Meteo (کاملاً رایگان و بدون API Key)
//    https://open-meteo.com/en/docs
// =====================================================================
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const { data } = await axios.get(OPEN_METEO_URL, {
    params: {
      latitude,
      longitude,
      current:
        "temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,weather_code",
      timezone: "auto",
    },
    timeout: 15000,
  });

  const c = data.current;
  return {
    time: c.time,
    temperature: c.temperature_2m,
    humidity: c.relative_humidity_2m,
    pressure: c.pressure_msl,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    weatherCode: c.weather_code,
  };
}

// =====================================================================
// ۳) ترافیک دریایی (AIS)
//    گزینه A: aisstream.io — رایگان با WebSocket (کلید در .env بگذارید)
//    اتصال WebSocket داخل hook (useMarineTraffic) انجام می‌شود.
//    گزینه B: اگر بک‌اند خودتان AIS دارد، این تابع را به endpoint خودتان وصل کنید.
// =====================================================================
export const AISSTREAM_WS_URL = "wss://stream.aisstream.io/v0/stream";

export function buildAisSubscription(bbox: BBox) {
  return {
    APIKey: import.meta.env.VITE_AISSTREAM_KEY,
    BoundingBoxes: [
      [
        [bbox.lamin, bbox.lomin],
        [bbox.lamax, bbox.lomax],
      ],
    ],
    FilterMessageTypes: ["PositionReport", "ShipStaticData"],
  };
}
