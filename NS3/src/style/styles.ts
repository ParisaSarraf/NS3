import type { CSSProperties } from "react";

export const darkGlassStyle: CSSProperties = {
  background: "rgba(15, 23, 42, 0.55)",
  backdropFilter: "blur(25px) saturate(180%)",
  WebkitBackdropFilter: "blur(25px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  boxShadow:
    "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
};