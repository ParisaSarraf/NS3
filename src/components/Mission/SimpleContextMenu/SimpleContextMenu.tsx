import React, { useState } from "react";
import {
  Target,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Ship,
  CheckCircle,
} from "lucide-react";

interface Props {
  x: number;
  y: number;
  visible: boolean;
  objectTypes: string[];
  onClose: () => void;
  onFinalAction: (party: string, type: string, id: string) => void;
}

const SimpleContextMenu: React.FC<Props> = ({
  x,
  y,
  visible,
  objectTypes,
  onClose,
  onFinalAction,
}) => {
  const [step, setStep] = useState<"party" | "type" | "idInput">("party");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [customId, setCustomId] = useState("");

  if (!visible) return null;

  const resetAndClose = () => {
    setStep("party");
    setSelectedType(null);
    setSelectedParty(null);
    setCustomId("");
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {/* لایه شفاف برای بستن منو با کلیک بیرون */}
      <div style={{ position: "absolute", inset: 0 }} onClick={resetAndClose} />

      <div
        className="glass context-menu-animated"
        style={{
          position: "absolute",
          left: x,
          top: y,
          minWidth: "220px",
          padding: "12px",
          pointerEvents: "auto",
        }}
      >
        {/* مرحله اول: انتخاب جناح */}
        {step === "party" && (
          <>
            <div className="menu-header">
              <span className="eyebrow">Select Affiliation</span>
            </div>
            {/* friendly force */}
            <button
              className="menu-item-v2"
              onClick={() => {
                setSelectedParty("Friend");
                setStep("type");
              }}
            >
              <Target size={18} color="#0f6efdff" />
              <span>friendly Force</span>
            </button>
            {/* enemy force */}
            <button
              className="menu-item-v2"
              onClick={() => {
                setSelectedParty("Enemy");
                setStep("type");
              }}
            >
              <Target size={18} color="#ff8b92" />
              <span>enemy Force</span>
              <ChevronRight
                size={14}
                className="dim"
                style={{ marginLeft: "auto" }}
              />
            </button>
            {/* bussiness force */}
            <button
              className="menu-item-v2"
              onClick={() => {
                setSelectedParty("Business");
                setStep("type");
              }}
            >
              <Target size={18} color="#ffe600ff" />
              <span>Business Force</span>
              <ChevronRight
                size={14}
                className="dim"
                style={{ marginLeft: "auto" }}
              />
            </button>
            {/* unknown force */}
            <button
              className="menu-item-v2"
              onClick={() => {
                setSelectedParty("Unknown");
                setStep("type");
              }}
            >
              <Target size={18} color="#797979ff" />
              <span>Unknown Force</span>
              <ChevronRight
                size={14}
                className="dim"
                style={{ marginLeft: "auto" }}
              />
            </button>
          </>
        )}

        {step === "type" && (
          <>
            <div
              className="menu-header"
              onClick={() => setStep("party")}
              style={{ cursor: "pointer" }}
            >
              <ChevronLeft size={16} className="dim" />
              <span
                className="eyebrow"
                style={{
                  color: selectedParty === "friend" ? "#7dd3ff" : "#ff8b92",
                }}
              >
                {selectedParty} Type
              </span>
            </div>
            <div className="context-menu-type-list">
              {objectTypes.map((type) => (
                <button
                  key={type}
                  className="menu-item-v2"
                  onClick={() => {
                    setSelectedType(type);
                    setStep("idInput");
                  }}
                >
                  <Ship size={16} className="dim" />
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "idInput" && (
          <div className="id-input-step">
            <div
              className="menu-header"
              onClick={() => setStep("type")}
              style={{ cursor: "pointer" }}
            >
              <ChevronLeft size={16} className="dim" />
              <span className="eyebrow">Enter Object ID</span>
            </div>

            <div style={{ margin: "12px 0" }}>
              <input
                type="text"
                className="glass-input"
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "white",
                  outline: "none",
                }}
                value={customId}
                placeholder="e.g. Unit_01"
                autoFocus
                onChange={(e) => setCustomId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customId.trim()) {
                    onFinalAction(
                      selectedParty!,
                      selectedType!,
                      customId.trim(),
                    );
                    resetAndClose();
                  }
                }}
              />
            </div>

            <button
              className="menu-item-v2 confirm"
              disabled={!customId.trim()}
              onClick={() => {
                onFinalAction(selectedParty!, selectedType!, customId.trim());
                resetAndClose();
              }}
              style={{
                width: "100%",
                justifyContent: "center",
                background: "rgba(125, 211, 255, 0.1)",
              }}
            >
              <CheckCircle size={18} color="#7dd3ff" />
              <span>Deploy Object</span>
            </button>
          </div>
        )}

        <div className="menu-divider" />
        <button className="menu-item-v2 cancel" onClick={resetAndClose}>
          <XCircle size={18} />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleContextMenu;
