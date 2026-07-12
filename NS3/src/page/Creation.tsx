import "../style/creation.css";
import CreationHeader from "../components/Creation/layout/CreationHeader";
import SidebarLeft from "../components/Creation/layout/SidebarLeft";
import VesselAssembly from "../components/Creation/dashboard/VesselAssembly";
import SidebarRight from "../components/Creation/layout/SidebarRight";
import BottomPanel from "../components/Creation/layout/BottomPanel";

const Creation = () => {
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

export default Creation;
