export const RADAR_RANGE_UNREAL = 170000;

// World bounds must match gateway/mapCoordinates.ts calibration.
export const WORLD_CONFIG = {
  minX: -4963510,
  maxX: 5116400,
  minY: -4902040,
  maxY: 5177860,
  radarRangeUnreal: RADAR_RANGE_UNREAL,
};

export const MAP_IMAGE_CONFIG = {
  width: 4033,
  height: 4033,
};

// محدوده نقشه
export const worldMinX = WORLD_CONFIG.minX;
export const worldMaxX = WORLD_CONFIG.maxX;
export const worldMinY = WORLD_CONFIG.minY;
export const worldMaxY = WORLD_CONFIG.maxY;

// ابعاد جهان
export const worldSpanX = worldMaxX - worldMinX;
export const worldSpanY = worldMaxY - worldMinY;

// تبدیل مختصات دنیا به پیکسل‌های مانیتور (برای رسم در PIXI)
export function worldToMap(wx: number, wy: number, screenWidth: number, screenHeight: number) {
  const px = ((wx - WORLD_CONFIG.minX) / worldSpanX) * screenWidth;
  const py = ((wy - WORLD_CONFIG.minY) / worldSpanY) * screenHeight;
  return { x: px, y: py };
}

// تبدیل کلیک ماوس روی نقشه به مختصات واقعی دنیای Unreal
export function mapToWorld(px: number, py: number, screenWidth: number, screenHeight: number) {
  return {
    x: WORLD_CONFIG.minX + (px / screenWidth) * worldSpanX,
    y: WORLD_CONFIG.minY + (py / screenHeight) * worldSpanY,
    z: 0,
  };
}

// تبدیل رشته یا ورودی نامشخص به عدد معتبر
export function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

// پارس کردن لوکیشن
export function parseLocation(
  raw: unknown,
): { x: number; y: number; z: number } | null {
  if (!raw) return null;

  // اگر رشته باشد
  if (typeof raw === "string") {
    const match = raw.match(
      /X\s*=\s*([-0-9.]+)\s*Y\s*=\s*([-0-9.]+)\s*Z\s*=\s*([-0-9.]+)/i,
    );

    if (match) {
      const [x, y, z] = match.slice(1).map(Number);

      if ([x, y, z].every(Number.isFinite)) {
        return { x, y, z };
      }
    }

    try {
      return parseLocation(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  // اگر آبجکت باشد
  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;

    const x = toNumber(obj.x ?? obj.X);
    const y = toNumber(obj.y ?? obj.Y);
    const z = toNumber(obj.z ?? obj.Z);

    if (x !== null && y !== null && z !== null) {
      return { x, y, z };
    }
  }

  return null;
}
