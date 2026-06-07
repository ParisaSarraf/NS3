interface MapToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleTopology: () => void;
}

export function MapToolbar({
  onZoomIn,
  onZoomOut,
  onToggleTopology,
}: MapToolbarProps) {
  const btnStyle = {
    background: "rgba(30, 41, 59, 0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f8fafc",
    padding: "8px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <button onClick={onZoomIn} style={btnStyle} title="Zoom In">
        ＋
      </button>
      <button onClick={onZoomOut} style={btnStyle} title="Zoom Out">
        －
      </button>
      <button
        onClick={onToggleTopology}
        style={{ ...btnStyle, width: "auto", padding: "10px" }}
        title="Toggle Network Mesh"
      >
        📡 Mesh Topology
      </button>
    </div>
  );
}
