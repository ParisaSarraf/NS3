import { Menu, Ship, Search, Bell, Settings, HelpCircle } from "lucide-react";

const CreationHeader = () => {
  return (
    <header className="app-header">
      <button className="icon-btn" aria-label="Menu">
        <Menu size={17} />
      </button>
      <div className="brand">
        <span className="logo">
          <Ship size={19} />
        </span>
        <h1>
          Fleet Twin Builder <span>(On-Prem)</span>
        </h1>
      </div>

      <div className="header-search">
        <Search size={14} />
        <input type="text" placeholder="Search assets, systems, tags..." />
      </div>

      <div className="header-right">
        <div className="lan-chip">
          <span>LAN</span>
          <span>192.168.10.0/24</span>
          <span className="status-dot" />
        </div>
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={16} />
        </button>
        <button className="icon-btn" aria-label="Settings">
          <Settings size={16} />
        </button>
        <button className="icon-btn" aria-label="Help">
          <HelpCircle size={16} />
        </button>
        <div className="avatar">AD</div>
      </div>
    </header>
  );
};

export default CreationHeader;
