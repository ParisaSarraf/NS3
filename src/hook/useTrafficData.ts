import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { AISSTREAM_WS_URL, buildAisSubscription, fetchAirTraffic, fetchWeather } from "../services/trafficService";
import type { BBox, VesselTrack } from "../api/trafficTypes";


// =====================================================================
// ترافیک هوایی — polling با React Query هر ۱۵ ثانیه
// =====================================================================
export function useAirTraffic(bbox: BBox, enabled = true) {
  return useQuery({
    queryKey: ["air-traffic", bbox.lamin, bbox.lomin, bbox.lamax, bbox.lomax],
    queryFn: () => fetchAirTraffic(bbox),
    refetchInterval: 15_000,
    staleTime: 10_000,
    retry: 1,
    enabled,
  });
}

// =====================================================================
// هواشناسی — هر ۱۰ دقیقه کافی است
// =====================================================================
export function useWeather(lat: number, lon: number, enabled = true) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat, lon),
    refetchInterval: 10 * 60_000,
    staleTime: 5 * 60_000,
    retry: 2,
    enabled,
  });
}

// =====================================================================
// ترافیک دریایی — WebSocket زنده از aisstream.io
// هر کشتی با MMSI کلید می‌خورد و آخرین موقعیت نگه داشته می‌شود
// =====================================================================
export function useMarineTraffic(bbox: BBox, enabled = true) {
  const [vessels, setVessels] = useState<VesselTrack[]>([]);
  const [connected, setConnected] = useState(false);
  const vesselMapRef = useRef<Map<number, VesselTrack>>(new Map());
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!import.meta.env.VITE_AISSTREAM_KEY) {
      console.warn("VITE_AISSTREAM_KEY is not set — marine traffic disabled");
      return;
    }

    let isMounted = true;

    const connect = () => {
      const ws = new WebSocket(AISSTREAM_WS_URL);
      socketRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) return;
        setConnected(true);
        ws.send(JSON.stringify(buildAisSubscription(bbox)));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          const meta = msg.MetaData;
          if (!meta?.MMSI) return;

          const prev = vesselMapRef.current.get(meta.MMSI);
          const report = msg.Message?.PositionReport;

          vesselMapRef.current.set(meta.MMSI, {
            mmsi: meta.MMSI,
            name: (meta.ShipName ?? prev?.name ?? "UNKNOWN").trim(),
            latitude: meta.latitude,
            longitude: meta.longitude,
            sog: report?.Sog ?? prev?.sog ?? null,
            cog: report?.Cog ?? prev?.cog ?? null,
            heading: report?.TrueHeading ?? prev?.heading ?? null,
            lastUpdate: Date.now(),
          });
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setConnected(false);
        // تلاش مجدد بعد از ۵ ثانیه
        reconnectRef.current = setTimeout(connect, 5000);
      };

      ws.onerror = () => ws.close();
    };

    connect();

    // هر ۳ ثانیه state را از روی Map داخلی تازه کن + کشتی‌های قدیمی را حذف کن
    const flushInterval = setInterval(() => {
      const now = Date.now();
      for (const [mmsi, v] of vesselMapRef.current) {
        if (now - v.lastUpdate > 10 * 60_000) vesselMapRef.current.delete(mmsi);
      }
      setVessels(Array.from(vesselMapRef.current.values()));
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(flushInterval);
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      socketRef.current?.close();
    };
  }, [bbox.lamin, bbox.lomin, bbox.lamax, bbox.lomax, enabled]);

  return { vessels, connected };
}
