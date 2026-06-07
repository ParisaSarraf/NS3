export function LeftSidebar() {
  const items = [
    { icon: "🎛️", label: "Overview", active: true },
    { icon: "🗺️", label: "Map" },
    { icon: "📡", label: "Network" },
    { icon: "🚢", label: "Ships" },
    { icon: "📊", label: "Metrics" },
  ];

  return (
    <div
      style={{
        width: "70px",
        backgroundColor: "#090d1f",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 0",
        gap: "20px",
      }}
    >
      <div style={{ fontSize: "20px", marginBottom: "20px" }}>⚓</div>
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            opacity: item.active ? 1 : 0.4,
            color: item.active ? "#3b82f6" : "#fff",
          }}
        >
          <span style={{ fontSize: "18px" }}>{item.icon}</span>
          <span style={{ fontSize: "9px" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
