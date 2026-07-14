const ModuleCard = ({ icon, name, sub, status = "ok" }) => {
  return (
    <div className="module-card">
      <span className="module-icon">{icon}</span>
      <div className="module-info">
        <div className="module-name">{name}</div>
        <div className="module-sub">{sub}</div>
      </div>
      <span className={`module-status ${status === "warn" ? "warn" : ""}`}>
        <span className="status-dot" />
        {status === "warn" ? "Warn" : "OK"}
      </span>
    </div>
  );
};

export default ModuleCard;
