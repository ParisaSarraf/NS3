import type { CSSProperties } from "react";

export const CYBER_THEME = {
  vesselColors: {
    "SHIP-01": "#3B8BD4", // Vivid Telemagenta Blue
    "SHIP-02": "#10B981", // Emerald Green
    "SHIP-03": "#A855F7", // Purple Neon
    "SHIP-04": "#F59E0B", // Safety Amber
  },
  severityColors: {
    CRITICAL: "rgba(239, 68, 68, 0.15)",
    WARNING: "rgba(245, 158, 11, 0.12)",
    INFO: "rgba(59, 130, 246, 0.12)",
  }
};

export const darkGlassCardStyle: CSSProperties = {
  background: "rgba(11, 19, 43, 0.45)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: "14px",
  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.5)",
};