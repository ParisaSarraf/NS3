import { darkGlassStyle } from "../../style/styles";
import type { Mode } from "../../utils/types";


interface ToolbarProps {
  mode: Mode;
  handleModeChange: (newMode: Mode) => void;
  saveGeometry: () => void;
}

export function Toolbar({ mode, handleModeChange, saveGeometry }: ToolbarProps) {
  const menuButtons: [Mode, string][] = [
    ["point", " نقطه"],
    ["line", " خط"],
    ["polygon", " محدوده"],
    ["delete", " حذف"],
  ];

  return (
    <div
      style={{
        ...darkGlassStyle,
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        zIndex: 10,
        padding: "12px 18px",
        borderRadius: "24px",
      }}
    >
      {menuButtons.map(([m, label]) => {
        const isActive = mode === m;
        let activeBg = "rgba(59, 130, 246, 0.4)";
        let activeBorder = "rgba(59, 130, 246, 0.6)";

        if (m === "delete") {
          activeBg = "rgba(239, 68, 68, 0.3)";
          activeBorder = "rgba(239, 68, 68, 0.5)";
        }

        return (
          <button
            key={m || "null"}
            onClick={() => handleModeChange(m)}
            style={{
              background: isActive ? activeBg : "rgba(255, 255, 255, 0.05)",
              color: isActive ? "#fff" : "#e2e8f0",
              border: isActive ? `1px solid ${activeBorder}` : "1px solid rgba(255, 255, 255, 0.03)",
              padding: "8px 18px",
              borderRadius: "14px",
              cursor: "pointer",
              fontWeight: isActive ? "600" : "400",
              fontSize: "14px",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </button>
        );
      })}

      {(mode === "line" || mode === "polygon") && (
        <button
          onClick={saveGeometry}
          style={{
            background: "rgba(16, 185, 129, 0.4)",
            color: "#fff",
            border: "1px solid rgba(16, 185, 129, 0.6)",
            padding: "8px 18px",
            borderRadius: "14px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            fontFamily: "inherit",
            boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
          }}
        >
          ✅ ثبت هندسه
        </button>
      )}
    </div>
  );
}