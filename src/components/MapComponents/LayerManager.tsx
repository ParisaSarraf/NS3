import { darkGlassStyle } from "../../style/styles";
import type { Feature } from "../../utils/types";

interface LayerManagerProps {
  features: Feature[];
  hiddenIds: string[];
  toggleVisibility: (id: string) => void;
  deleteFeature: (id: string) => void;
}

export function LayerManager({ features, hiddenIds, toggleVisibility, deleteFeature }: LayerManagerProps) {
  return (
    <div
      style={{
        ...darkGlassStyle,
        position: "absolute",
        top: 90,
        right: 20,
        bottom: 20,
        width: 330,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        borderRadius: "28px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "22px 24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "600", color: "#f8fafc" }}>
<<<<<<< HEAD
          مدیریت لایه‌ها
        </h3>
        <span style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", display: "block" }}>
          {features.length} عارضه روی نقشه
=======
          Layer Manager
        </h3>
        <span style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", display: "block" }}>
          {features.length} feature(s) on the map
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
        </span>
      </div>

      <div
        className="custom-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {features.length === 0 && (
          <div style={{ textAlign: "center", color: "#475569", marginTop: 40, fontSize: "14px"}}>
<<<<<<< HEAD
            لیست لایه‌ها خالی است.
=======
            The layer list is empty.
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
          </div>
        )}
        {features.map((f) => {
          const isHidden = hiddenIds.includes(f.id);
          return (
            <div
              key={f.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: isHidden ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.04)",
                borderRadius: "18px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                opacity: isHidden ? 0.4 : 1,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <span
                style={{
                  textDecoration: isHidden ? "line-through" : "none",
                  flex: 1,
                  color: "#e2e8f0",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                {f.type === "point" && "🔵 "}
                {f.type === "line" && "🟠 "}
                {f.type === "polygon" && "🟢 "}
                {f.label}
              </span>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => toggleVisibility(f.id)}
                  style={{
                    fontFamily: "Vazirmatn",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "14px",
                    padding: "6px 10px",
                    color: "#94a3b8",
                  }}
                >
                  {isHidden ? "👁‍🗨" : "👁"}
                </button>

                <button
                  onClick={() => deleteFeature(f.id)}
                  style={{
                    background: "rgba(239, 68, 68, 0.05)",
                    border: "1px solid rgba(239, 68, 68, 0.15)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    color: "#f87171",
                    fontSize: "14px",
                    padding: "6px 10px",
                  }}
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}