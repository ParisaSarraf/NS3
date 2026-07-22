// ---------- Types مشترک برای ترافیک هوایی، دریایی و هواشناسی ----------

export interface BBox {
  lamin: number; // min latitude
  lomin: number; // min longitude
  lamax: number; // max latitude
  lomax: number; // max longitude
}

export interface AirTrack {
  icao24: string;
  callsign: string;
  originCountry: string;
  longitude: number;
  latitude: number;
  altitude: number | null; // متر
  velocity: number | null; // m/s
  heading: number | null; // درجه
  verticalRate: number | null;
  onGround: boolean;
  lastContact: number; // unix seconds
}

export interface VesselTrack {
  mmsi: number;
  name: string;
  longitude: number;
  latitude: number;
  sog: number | null; // سرعت (knots)
  cog: number | null; // مسیر حرکت (درجه)
  heading: number | null;
  shipType?: string;
  lastUpdate: number; // ms timestamp
}

export interface WeatherData {
  time: string;
  temperature: number; // °C
  humidity: number; // %
  pressure: number; // hPa
  windSpeed: number; // km/h
  windDirection: number; // درجه
  weatherCode: number; // WMO code
}
