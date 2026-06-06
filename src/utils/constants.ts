import type { CSSProperties } from "react";

export const CYBER_THEME = {
  vesselColors: {
    "SHIP-01": "#3B8BD4", // Blue
    "SHIP-02": "#10B981", // Emerald Green
    "SHIP-03": "#A855F7", // Purple
    "SHIP-04": "#F59E0B", // Amber
  },
  severityColors: {
    CRITICAL: "rgba(239, 68, 68, 0.25)",
    WARNING: "rgba(245, 158, 11, 0.2)",
    INFO: "rgba(59, 130, 246, 0.2)",
  }
};

export const darkGlassCardStyle: CSSProperties = {
  background: "rgba(15, 23, 42, 0.55)",
  backdropFilter: "blur(25px) saturate(180%)",
  WebkitBackdropFilter: "blur(25px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
};