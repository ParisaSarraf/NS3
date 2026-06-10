const Header = ({
  handleScenarioStop,
  setActiveTab,
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  handleLoadScenario,
}) => {
  return (
    <div className="map-topbar glass">
      <div className="tab-list">
        <button
          className={`tab-button ${activeTab === "initialize" ? "active" : ""}`}
          onClick={() => setActiveTab("initialize")}
        >
          Initialize
        </button>
        <button
          className={`tab-button ${activeTab === "moveAttack" ? "active" : ""}`}
          onClick={() => setActiveTab("moveAttack")}
        >
          Move & Attack
        </button>
        <button
          className={`tab-button ${activeTab === "wayPoint" ? "active" : ""}`}
          onClick={() => setActiveTab("wayPoint")}
        >
          Way Point
        </button>
        <button
          className={`tab-button ${activeTab === "radar" ? "active" : ""}`}
          onClick={() => setActiveTab("radar")}
        >
          Radar
        </button>
      </div>
      <div className="buttons-container">
        <input
          className="scenario-button compact"
          type="file"
          id="file"
          name="file"
          accept=".json"
          onChange={handleLoadScenario}
        />
        <button className="stop-button compact" onClick={handleScenarioStop}>
          LOGOUT
        </button>
        <button
          className={`drawer-toggle-btn ${isSidebarOpen ? "active" : ""}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "✕" : "☰ "}
        </button>
      </div>
    </div>
  );
};

export default Header;
