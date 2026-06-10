import React, { useState } from "react";

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const MoveModal: React.FC<MoveModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    speed: 10,
    direction: { alpha: 1000, beta: 0, gamma: 550 },
    acceleration: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="military-modal-overlay">
      <div className="military-modal-frame glass">
        {/* Decorative Corner Brackets */}
        <div className="corner-tl"></div>
        <div className="corner-tr"></div>
        <div className="corner-bl"></div>
        <div className="corner-br"></div>

        <div className="modal-header-tactical">
          <span className="blink-dot"></span>
          <h3>MANUAL VECTOR INPUT</h3>
          <span className="serial-no">AX-0992</span>
        </div>

        <div className="modal-body-tactical">
          <div className="input-row">
            <label className="tactical-label">SPD_MPS</label>
            <input
              type="number"
              className="tactical-input"
              value={formData.speed}
              onChange={(e) =>
                setFormData({ ...formData, speed: Number(e.target.value) })
              }
            />
          </div>

          <div className="vector-section">
            <p className="tactical-label">DIRECTIONAL_VECTORS</p>
            <div className="vector-grid-inputs">
              <div className="v-input">
                <span>α</span>
                <input
                  type="number"
                  value={formData.direction.alpha}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      direction: {
                        ...formData.direction,
                        alpha: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="v-input">
                <span>β</span>
                <input
                  type="number"
                  value={formData.direction.beta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      direction: {
                        ...formData.direction,
                        beta: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div className="v-input">
                <span>γ</span>
                <input
                  type="number"
                  value={formData.direction.gamma}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      direction: {
                        ...formData.direction,
                        gamma: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="input-row">
            <label className="tactical-label">ACCEL_VAL</label>
            <input
              type="number"
              className="tactical-input"
              value={formData.acceleration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  acceleration: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="modal-footer-tactical">
          <button onClick={onClose} className="btn-tactical outline">
            CANCLE
          </button>
          <button onClick={handleSubmit} className="btn-tactical primary">
            MOVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveModal;
