import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  AIS_WS_URLS,
  buildAisSubscription,
  fetchAirTraffic,
  fetchWeather,
  getAirCooldownMs,
} from "../services/trafficService";
import type { BBox, VesselTrack } from "../api/trafficTypes";

// =====================================================================
// ترافیک هوایی — polling با React Query
//
// فاصله polling با VITE_AIR_POLL_SECONDS در .env قابل تنظیم است (پیش‌فرض ۶۰ ثانیه).
// هر فراخوانی states/all برای این bbox حدود ۳ اعتبار (credit) مصرف می‌کند؛
// سهمیه روزانه: ناشناس ≈۴۰۰ اعتبار، با حساب ≈۴۰۰۰ اعتبار.
// polling سریع (مثلاً ۱۵ ثانیه) سهمیه را سریع می‌سوزاند و 429 می‌گیرید.
// =====================================================================
const AIR_POLL_MS = Number(import.meta.env.VITE_AIR_POLL_SECONDS ?? 60) * 1000;

export function useAirTraffic(bbox: BBox, enabled = true) {
  return useQuery({
    queryKey: ["air-traffic", bbox.lamin, bbox.lomin, bbox.lamax, bbox.lomax],
    queryFn: () => fetchAirTraffic(bbox),
    // اگر در cooldown سهمیه هستیم (429)، تا پایان آن refetch نکن
    refetchInterval: () => {
      const cd = getAirCooldownMs();
      return cd > 0 ? cd + 5_000 : AIR_POLL_MS;
    },
    staleTime: 45_000,
    retry: false, // روی 429 تکرار نکن — سهمیه بیشتر می‌سوزد
    enabled,
  });
}

// =====================================================================
// هواشناسی — هر ۱۰ دقیقه
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
// ترافیک دریایی — WebSocket زنده + تشخیص خطا
//
// برای دیباگ: همه رویدادهای اتصال در Console با پیشوند [AIS] لاگ می‌شوند
// و آخرین خطا در UI هم نمایش داده می‌شود (lastError).
// اگر یک endpoint وصل نشد، دفعه بعد endpoint بعدی امتحان می‌شود
// (پروکسی Vite ⇄ اتصال مستقیم).
// =====================================================================
export function useMarineTraffic(bbox: BBox, enabled = true) {
  const [vessels, setVessels] = useState<VesselTrack[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const vesselMapRef = useRef<Map<number, VesselTrack>>(new Map());
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urlIndexRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    if (!import.meta.env.VITE_AISSTREAM_KEY) {
      setLastError("VITE_AISSTREAM_KEY is not set");
      console.warn("[AIS] VITE_AISSTREAM_KEY is not set — marine traffic disabled");
      return;
    }

    let isMounted = true;

    const connect = () => {
      const url = AIS_WS_URLS[urlIndexRef.current % AIS_WS_URLS.length];
      console.info("[AIS] connecting:", url);
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) return;
        console.info("[AIS] connected:", url);
        setConnected(true);
        setLastError(null);
        ws.send(JSON.stringify(buildAisSubscription(bbox)));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);

          // aisstream در صورت مشکل (مثلاً کلید نامعتبر) پیام error می‌فرستد و قطع می‌کند
          if (msg.error) {
            console.error("[AIS] server error:", msg.error);
            setLastError(String(msg.error));
            return;
          }

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

      ws.onclose = (e) => {
        if (!isMounted) return;
        setConnected(false);
        console.warn("[AIS] closed. code:", e.code, "reason:", e.reason || "(none)");
        if (e.reason) setLastError(e.reason);
        // دفعه بعد endpoint بعدی (پروکسی ⇄ مستقیم)
        urlIndexRef.current += 1;
        reconnectRef.current = setTimeout(connect, 5000);
      };

      ws.onerror = () => {
        console.warn("[AIS] socket error on:", url);
        ws.close();
      };
    };

    connect();

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

  return { vessels, connected, lastError };
}
