import "../style/creation.css";
import CreationHeader from "../components/FleetTwin/layout/CreationHeader";
import SidebarLeft from "../components/FleetTwin/layout/SidebarLeft";
import VesselAssembly from "../components/FleetTwin/dashboard/VesselAssembly";
import SidebarRight from "../components/FleetTwin/layout/SidebarRight";
import BottomPanel from "../components/FleetTwin/layout/BottomPanel";

const FleetTwin = () => {
  return (
    <div className="dashboard-container dark-theme">
      <CreationHeader />
      <div className="dashboard-grid">
        <aside className="sidebar-left">
          <SidebarLeft />
        </aside>

        <main className="main-content">
          <div className="workspace glass-panel">
            <VesselAssembly />
          </div>
        </main>

        <aside className="sidebar-right glass-panel">
          <SidebarRight />
        </aside>

        <footer className="bottom-panel">
          <BottomPanel />
        </footer>
      </div>
    </div>
  );
};

export default FleetTwin;
