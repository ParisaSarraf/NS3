import React from "react";
import type { MapControlsProps } from "../../../utils/types";

const MapControls: React.FC<MapControlsProps> = ({
  allObjects,
  activeTab,
  selectedSource,
  selectedEnemy,
  selectedRadius,
  setSelectedRadius,
  selectedCommunicationRadius,
  setSelectedCommunicationRadius,
  actionStatus,
  godView,
  setGodView,
  onAttack,
  onGoto,
  onWayPoint,
  onMove,
  onStop,
  setFilters,
  communicationGroups,
  selectedGroupId,
  setSelectedGroupId,
  selectedGroupType,
  wayPoints,
  isWaypointMode,
  onEndWayPoint,
  onSendWayPoints,
  setSelectedGroupType,
  setSelectedRadarObject,
  selectedRadarObject,
}) => {
  const radarMin = Number(import.meta.env.VITE_APP_RADAR_RANGE_MINIMUM ?? 10000);
  const radarMax = Number(import.meta.env.VITE_APP_RADAR_RANGE_MAXIMUM ?? 400000);

  const commMin = Number(
    import.meta.env.VITE_APP_COMMUNICATION_RANGE_MINIMUM ?? 10000,
  );
  const commMax = Number(
    import.meta.env.VITE_APP_COMMUNICATION_RANGE_MAXIMUM ?? 400000,
  );

  return (
    <div className="panel-content">
      <div className="panel-section-header">
        <p className="eyebrow">
          {activeTab === "initialize" ? "Environment" : "Tactical Operations"}
        </p>
        <h2 className="section-title">
          {activeTab === "initialize"
            ? "Initialization"
            : activeTab === "moveAttack"
              ? "Move & Attack"
              : "Command & Control"}
        </h2>
      </div>

      {activeTab === "initialize" ? (
        <div className="tab-container fade-in">
          <div className="info-box">
            <p className="dim">
              Right-click on the map to deploy assets. Select a faction and unit
              type to begin.
            </p>
          </div>

          {actionStatus && (
            <div className={`military-status ${actionStatus.status}`}>
              <div className="status-top">
                <span className="blink-dot"></span>
                <span className="status-label">SYSTEM MESSAGE</span>
              </div>
              <div className="status-body">
                <h4>{actionStatus.message}</h4>
                {actionStatus.geo && (
                  <div className="coord-grid">
                    <div className="coord-item">
                      <span>LAT</span>
                      <strong>{actionStatus.geo.lat}</strong>
                    </div>
                    <div className="coord-item">
                      <span>LON</span>
                      <strong>{actionStatus.geo.lon}</strong>
                    </div>
                    <div className="coord-item">
                      <span>ALT</span>
                      <strong>{actionStatus.geo.alt ?? "N/A"}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "wayPoint" ? (
        <>
          <div className="tab-container fade-in">
            <div className="action-grid">
              <button
                className="btn-tactical primary"
                onClick={onWayPoint}
                disabled={isWaypointMode}
              >
                START WAYPOINT
              </button>

              <button
                className="btn-tactical secondary"
                onClick={onEndWayPoint}
                disabled={!isWaypointMode}
              >
                END WAYPOINT
              </button>

              <button
                className="btn-tactical secondary"
                onClick={onSendWayPoints}
              >
                SEND WAYPOINTS
              </button>
            </div>

            <div className="selection-overview">
              <div className="data-row">
                <span className="label">SELECTED OBJECT :</span>
                <span className={`value ${selectedSource ? "active" : ""}`}>
                  {selectedSource ?? "NONE"}
                </span>
              </div>
              <div className="data-row">
                <span className="label">WAYPOINT MODE :</span>
                <span className={`value ${isWaypointMode ? "active" : ""}`}>
                  {isWaypointMode ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <div className="data-row">
                <span className="label">TOTAL POINTS :</span>
                <span className="value">{wayPoints.length}</span>
              </div>
            </div>

            <div
              style={{
                marginTop: "12px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {wayPoints.map((point, index) => (
                <div
                  key={point.id}
                  className="military-status success"
                  style={{
                    marginBottom: "8px",
                    padding: "10px",
                  }}
                >
                  <div className="status-top">
                    <span className="status-label">WAYPOINT #{index + 1}</span>
                  </div>

                  <div className="coord-grid">
                    <div className="coord-item">
                      <span>X</span>
                      <strong>{point.x.toFixed(2)}</strong>
                    </div>

                    <div className="coord-item">
                      <span>Y</span>
                      <strong>{point.y.toFixed(2)}</strong>
                    </div>

                    <div className="coord-item">
                      <span>Z</span>
                      <strong>{point.z.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="tab-container fade-in">
          <div className="selection-overview">
            <div className="data-row">
              <span className="label">Source Asset :</span>
              <span
                className={`value ${selectedSource ? "active" : ""}`}
                style={{ paddingLeft: "6px" }}
              >
                {selectedSource ?? "NO SELECTION"}
              </span>
            </div>
            <div className="data-row">
              <span className="label">Target Objective :</span>
              <span
                className={`value ${selectedEnemy ? "danger" : ""}`}
                style={{ paddingLeft: "6px" }}
              >
                {selectedEnemy ?? "NO TARGET"}
              </span>
            </div>
          </div>
          {activeTab !== "radar" && (
            <div className="action-grid">
              <button
                className="btn-tactical primary"
                onClick={onGoto}
                disabled={!selectedSource}
              >
                GOTO
              </button>
              <button
                className="btn-tactical secondary"
                onClick={onStop}
                disabled={!selectedSource}
              >
                STOP
              </button>
              <button
                className="btn-tactical"
                onClick={onAttack}
                disabled={!selectedSource || !selectedEnemy}
              >
                ATTACK
              </button>
              <button
                className="btn-tactical outline"
                onClick={onMove}
                disabled={!selectedSource}
              >
                MOVE
              </button>
            </div>
          )}
          {/* Radar Range */}
          <div className="control-group">
            <div className="control-header">
              <span className="label">Radar Range</span>
              <br />
              <span className="value-highlight">
                {(selectedRadius / 2000).toFixed(1)} km
              </span>
            </div>
            <input
              className="modern-range"
              type="range"
              min={radarMin}
              max={radarMax}
              step={10000}
              value={selectedRadius}
              disabled={godView}
              onChange={(e) => setSelectedRadius(Number(e.target.value))}
            />
          </div>

          {/* communication range */}
          <div className="control-group">
            <div className="control-header">
              <span className="label">Communication Range</span>
              <br />
              <span className="value-highlight">
                {(selectedCommunicationRadius / 2000).toFixed(1)} km
              </span>
            </div>
            <input
              className="modern-range"
              type="range"
              min={commMin}
              max={commMax}
              step={10000}
              value={selectedCommunicationRadius}
              disabled={godView}
              onChange={(e) =>
                setSelectedCommunicationRadius(Number(e.target.value))
              }
            />
          </div>

          <div className="filter-section">
            <p className="label">Visual Overlay Filters</p>
            <div className="checkbox-grid">
              <div className="tactical-select-container">
                <select
                  className="tactical-input"
                  onChange={(e) => {
                    const selected = e.target.value;
                    setSelectedGroupId(null);
                    if (selected !== "None") {
                      setSelectedGroupType(selected.toLowerCase());
                    }
                    setFilters({
                      enemy: selected === "Enemy",
                      friend: selected === "Friend",
                      business: selected === "Business",
                      unknown: selected === "Unknown",
                      none: selected === "None",
                    });
                  }}
                >
                  <option value="None">Show All (None)</option>
                  <option value="Friend">Friend</option>
                  <option value="Enemy">Enemy</option>
                  <option value="Business">Business</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <p className="label">Groups</p>
              <div className="tactical-select-container">
                <select
                  className="tactical-input"
                  value={selectedGroupId ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setSelectedGroupId(raw ? Number(raw) : null);
                  }}
                >
                  <option value="">All Groups ({selectedGroupType})</option>
                  {communicationGroups?.map((group) => (
                    <option key={group.group} value={group.group}>
                      Group {group.group} ({group.objects?.length ?? 0} objects)
                    </option>
                  ))}
                </select>
              </div>

              {activeTab === "radar" && selectedGroupId && (
                <>
                  <p className="label">Focus Object</p>
                  <div className="tactical-select-container">
                    <select
                      className="tactical-input"
                      value={selectedRadarObject?.id ?? ""}
                      onChange={(e) => {
                        const objId = e.target.value;
                        const found = allObjects.find((o) => o.id === objId);
                        setSelectedRadarObject(found || null);
                      }}
                    >
                      <option value="">Select Object to Center</option>
                      {communicationGroups
                        .find((g) => g.group === selectedGroupId)
                        ?.objects.map((obj) => (
                          <option key={obj.object_id} value={obj.object_id}>
                            {obj.type} - {obj.object_id}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              )}
              {/* God View */}
              <label className="checkbox-container god-view-toggle">
                <input
                  type="checkbox"
                  checked={godView}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setGodView(isChecked);
                    if (isChecked) {
                    }
                  }}
                />
                <span className="checkbox-label">God View</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapControls;
