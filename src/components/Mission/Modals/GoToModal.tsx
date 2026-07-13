import React, { useState } from "react";

interface GoToModalProps {
  isOpen: boolean;
  
  onClose: () => void;
  onSubmit: (data: { timeout: number; finalPointMode: number }) => void;
}

const GoToModal: React.FC<
  GoToModalProps & { location: { x: number; y: number; z: number } | null }
> = ({ isOpen, onClose, onSubmit, location }) => {
  const [formData, setFormData] = useState({
    timeout: 10,
    finalPointMode: 1,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="military-modal-overlay">
      <div className="military-modal-frame glass">
        <div className="modal-header-tactical">
          <span className="blink-dot"></span>
          <h3>NAVIGATION_GOTO_CFG</h3>
          <span className="serial-no">NAV-PROT-44</span>
        </div>
        <div>
          <p className="tactical-input">
            lat: {location?.x.toFixed(2) ?? "0.00"}
          </p>
          <p className="tactical-input">
            lon: {location?.y.toFixed(2) ?? "0.00"}
          </p>
          <p className="tactical-input">
            alt: {location?.z.toFixed(2) ?? "0.00"}
          </p>
        </div>

        <div className="modal-body-tactical">
          <div className="input-row">
            <label className="tactical-label">CMD_TIMEOUT (SEC)</label>
            <input
              type="number"
              className="tactical-input"
              value={formData.timeout}
              onChange={(e) =>
                setFormData({ ...formData, timeout: Number(e.target.value) })
              }
            />
          </div>

          <div className="input-row" style={{ marginTop: "15px" }}>
            <label className="tactical-label">FINAL_PT_MODE</label>
            <select
              className="tactical-input"
              style={{ background: "#050a05" }}
              value={formData.finalPointMode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  finalPointMode: Number(e.target.value),
                })
              }
            >
              <option value={1}>1: ARRIVE & HOLD</option>
              <option value={2}>2: IMPACT</option>
            </select>
          </div>
        </div>

        <div className="modal-footer-tactical">
          <button onClick={onClose} className="btn-tactical outline">
            CANCLE
          </button>
          <button onClick={handleSubmit} className="btn-tactical">
            GoTo
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoToModal;
