import { darkGlassStyle } from "../../style/styles";

interface LabelDialogProps {
  labelInput: string;
  setLabelInput: (val: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LabelDialog({ labelInput, setLabelInput, onCancel, onConfirm }: LabelDialogProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          ...darkGlassStyle,
          padding: "24px",
          borderRadius: "20px",
          width: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h3 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>
          نام‌گذاری عارضه جدید
        </h3>
        <input
          type="text"
          placeholder="نام یا عنوان را وارد کنید..."
          value={labelInput}
          onChange={(e) => setLabelInput(e.target.value)}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            padding: "8px 12px",
            color: "#fff",
            fontSize: "14px",
            fontFamily: "inherit",
            outline: "none",
          }}
          autoFocus
        />
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "inherit",
            }}
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: "#3b82f6",
              border: "none",
              color: "#fff",
              borderRadius: "10px",
              padding: "6px 16px",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "inherit",
              fontWeight: "600",
                }}
              >
            تایید
          </button>
        </div>
      </div>
    </div>
  );
}