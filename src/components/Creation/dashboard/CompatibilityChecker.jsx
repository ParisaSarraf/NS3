const checks = [
  { id: "power", name: "Power Budget", status: "ok" },
  { id: "cooling", name: "Cooling Capacity", status: "ok" },
  { id: "weight", name: "Weight & Balance", status: "ok" },
  { id: "bus", name: "Data Bus Compatibility", status: "warn" },
  { id: "slots", name: "Slot Availability", status: "ok" },
];

const ScoreRing = ({ value }) => {
  const r = 34;
  const c = 2 * Math.PI * r;
  const filled = (value / 100) * c;

  return (
    <div className="score-ring">
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke="var(--white-a10)"
          strokeWidth="7"
        />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke="var(--accent-green)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c - filled}`}
        />
      </svg>
      <span className="score-value">{value}%</span>
    </div>
  );
};

const CompatibilityChecker = () => {
  return (
    <div className="compat-row">
      <div className="compat-checker">
        <h4>Compatibility Checker</h4>
        <ul className="compat-list">
          {checks.map((check) => (
            <li key={check.id} className={check.status}>
              <span
                className={`status-dot ${check.status === "warn" ? "warn" : ""}`}
              />
              {check.name}
              <span className="check-result">
                {check.status === "warn" ? "Warn" : "OK"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="compat-score">
        <ScoreRing value={92} />
        <div className="score-meta">
          <p className="score-title">Overall Compatibility: Good</p>
          <p className="score-sub">7 of 8 checks passed</p>
          <button className="btn-ghost">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityChecker;
