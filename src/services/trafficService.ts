import axios from "axios";
import type {
  AircraftMeta,
  AirTrack,
  BBox,
  FlightRoute,
  WeatherData,
} from "../api/trafficTypes";

// =====================================================================
// ۱) OpenSky — احراز هویت OAuth2 (API Client حساب خودتان)
//
// در .env:
//   VITE_OPENSKY_CLIENT_ID=...
//   VITE_OPENSKY_CLIENT_SECRET=...
// (از صفحه Account → API Client در سایت OpenSky)
//
// در vite.config.ts این پروکسی را هم اضافه کنید:
//   "/opensky-auth": {
//     target: "https://auth.opensky-network.org",
//     changeOrigin: true,
//     rewrite: (p) => p.replace(/^\/opensky-auth/, ""),
//   },
// =====================================================================
const OPENSKY_TOKEN_URL =
  "/opensky-auth/auth/realms/opensky-network/protocol/openid-connect/token";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getOpenSkyToken(): Promise<string | null> {
  const clientId = import.meta.env.VITE_OPENSKY_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_OPENSKY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null; // بدون حساب هم کار می‌کند (سهمیه کمتر)

  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const { data } = await axios.post(OPENSKY_TOKEN_URL, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    timeout: 15000,
  });

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 1800) * 1000,
  };
  return cachedToken.value;
}

async function openskyGet(path: string, params?: Record<string, unknown>) {
  let headers: Record<string, string> = {};
  try {
    const token = await getOpenSkyToken();
    if (token) headers = { Authorization: `Bearer ${token}` };
  } catch (e) {
    console.warn("[OpenSky] token failed, falling back to anonymous", e);
  }
  return axios.get(`/opensky${path}`, { params, headers, timeout: 20000 });
}

// ---------------------------------------------------------------------
// مدیریت سهمیه (429 Too Many Requests)
//
// OpenSky با هدر x-rate-limit-retry-after-seconds می‌گوید چقدر باید صبر
// کرد. تا پایان cooldown دیگر درخواست نمی‌زنیم که سهمیه بیشتر نسوزد.
// ---------------------------------------------------------------------
let airCooldownUntil = 0;

export function getAirCooldownMs(): number {
  return Math.max(0, airCooldownUntil - Date.now());
}

// ---------------------------------------------------------------------
// وضعیت زنده — extended=1 فیلد category (نوع هواپیما) را هم برمی‌گرداند
// ---------------------------------------------------------------------
export async function fetchAirTraffic(bbox: BBox): Promise<AirTrack[]> {
  if (getAirCooldownMs() > 0) {
    throw Object.assign(new Error("OpenSky cooldown active"), {
      isCooldown: true,
    });
  }

  try {
    const { data, headers } = await openskyGet("/states/all", {
      ...bbox,
      extended: 1,
    });

    const remaining = headers?.["x-rate-limit-remaining"];
    if (remaining != null) {
      console.info("[OpenSky] credits remaining today:", remaining);
    }

    if (!data?.states) return [];

    return (data.states as any[][])
      .map((s) => ({
        icao24: s[0],
        callsign: (s[1] ?? "").trim() || "N/A",
        originCountry: s[2],
        longitude: s[5],
        latitude: s[6],
        altitude: s[13] ?? s[7],
        onGround: s[8],
        velocity: s[9],
        heading: s[10],
        verticalRate: s[11],
        lastContact: s[4],
        category: s[17] ?? 0,
      }))
      .filter((t) => t.longitude != null && t.latitude != null);
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 429) {
      const retryAfter =
        Number(e.response.headers?.["x-rate-limit-retry-after-seconds"]) ||
        15 * 60; // اگر هدر نبود، ۱۵ دقیقه صبر کن
      airCooldownUntil = Date.now() + retryAfter * 1000;
      console.warn(
        `[OpenSky] 429 rate limit — pausing air traffic for ${Math.round(retryAfter / 60)} min`,
      );
    }
    throw e;
  }
}

// ---------------------------------------------------------------------
// مشخصات هواپیما (مدل، اپراتور، رجیستری) از دیتابیس متادیتای OpenSky
// ---------------------------------------------------------------------
export async function fetchAircraftMeta(
  icao24: string,
): Promise<AircraftMeta> {
  const { data } = await openskyGet(`/metadata/aircraft/icao/${icao24}`);
  return {
    model: data?.model || null,
    typecode: data?.typecode || null,
    operator: data?.operator || data?.owner || null,
    registration: data?.registration || null,
  };
}

// ---------------------------------------------------------------------
// مسیر واقعی طی‌شده پرواز (waypoint ها) — برای رسم مسیر با رنگ متمایز
// time=0 یعنی پرواز در جریان
// ---------------------------------------------------------------------
export async function fetchFlightTrack(
  icao24: string,
): Promise<[number, number][]> {
  const { data } = await openskyGet("/tracks/all", { icao24, time: 0 });
  // هر آیتم path: [time, latitude, longitude, baro_altitude, true_track, on_ground]
  return ((data?.path ?? []) as any[][])
    .filter((p) => p[1] != null && p[2] != null)
    .map((p) => [p[2], p[1]] as [number, number]);
}

// ---------------------------------------------------------------------
// مبدأ/مقصد پرواز — OpenSky مقصد لحظه‌ای نمی‌دهد؛ از دیتابیس رایگان
// adsbdb.com بر اساس callsign می‌خوانیم (CORS باز است)
// ---------------------------------------------------------------------
const ADSBDB_BASE = "https://api.adsbdb.com/v0/callsign/";

export async function fetchFlightRoute(
  callsign: string,
): Promise<FlightRoute | null> {
  const cs = callsign.trim();
  if (!cs || cs === "N/A") return null;
  try {
    const { data } = await axios.get(ADSBDB_BASE + encodeURIComponent(cs), {
      timeout: 10000,
    });
    const fr = data?.response?.flightroute;
    if (!fr) return null;
    const fmt = (a: any) =>
      a ? `${a.iata_code ?? a.icao_code ?? "?"} · ${a.municipality ?? a.name ?? ""}`.trim() : null;
    return { origin: fmt(fr.origin), destination: fmt(fr.destination) };
  } catch {
    return null; // برای خیلی از پروازهای چارتر/نظامی route ثبت نشده
  }
}

// =====================================================================
// ۲) هواشناسی — Open-Meteo
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
// دو endpoint: اول پروکسی Vite، بعد اتصال مستقیم — hook به صورت خودکار
// بینشان سوئیچ می‌کند تا هر کدام کار کرد وصل بماند.
// =====================================================================
const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";

export const AIS_WS_URLS = [
  `${wsProtocol}://${window.location.host}/ais-stream`, // پروکسی Vite
  "wss://stream.aisstream.io/v0/stream", // اتصال مستقیم (fallback)
];

export function buildAisSubscription(bbox: BBox) {
  return {
    APIKey: import.meta.env.VITE_AISSTREAM_KEY,
    // فرمت aisstream: [[[lat1, lon1], [lat2, lon2]]]
    BoundingBoxes: [
      [
        [bbox.lamin, bbox.lomin],
        [bbox.lamax, bbox.lomax],
      ],
    ],
    FilterMessageTypes: ["PositionReport", "ShipStaticData"],
  };
}
