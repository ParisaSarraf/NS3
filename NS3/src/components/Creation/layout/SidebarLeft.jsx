import {
  Anchor,
  Cog,
  Zap,
  Radar,
  Waves,
  Eye,
  Crosshair,
  Target,
  Rocket,
  Radio,
  Box,
  Plus,
} from "lucide-react";
import { useState } from "react";

const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="tree-node">
      <div className="asset-item" onClick={handleToggle}>
        <div className="node-content">
          {hasChildren ? (
            <span className={`caret ${isOpen ? "open" : ""}`}>▶</span>
          ) : (
            <span className="spacer"></span>
          )}
          <span>{node.icon}</span>
          <span>{node.name}</span>
        </div>
        {node.addable && (
          <button
            className="add-btn"
            aria-label={`Add ${node.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Plus size={13} />
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="tree-children">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarLeft = () => {
  const assets = [
    {
      id: "1",
      icon: <Anchor size={15} />,
      name: "Hull & Class",
      addable: true,
      children: [],
    },
    {
      id: "2",
      icon: <Cog size={15} />,
      name: "Propulsion",
      addable: true,
      children: [],
    },
    {
      id: "3",
      icon: <Zap size={15} />,
      name: "Power",
      addable: true,
      children: [],
    },
    {
      id: "4",
      icon: <Radar size={15} />,
      name: "Sensors",
      addable: true,
      children: [
        { id: "4-1", name: "Radar", icon: <Radar size={15} /> },
        { id: "4-2", name: "Sonar", icon: <Waves size={15} /> },
        { id: "4-3", name: "EO/IR", icon: <Eye size={15} /> },
      ],
    },
    {
      id: "5",
      icon: <Crosshair size={15} />,
      name: "Weapons",
      addable: true,
      children: [
        { id: "5-1", name: "Gun", icon: <Target size={15} /> },
        { id: "5-2", name: "SAM", icon: <Rocket size={15} /> },
        { id: "5-3", name: "ASM", icon: <Rocket size={15} /> },
      ],
    },
    {
      id: "6",
      icon: <Radio size={15} />,
      name: "Comms & EW",
      addable: true,
      children: [],
    },
    {
      id: "7",
      icon: <Box size={15} />,
      name: "Mission Modules",
      addable: true,
      children: [],
    },
  ];

  return (
    <div className="asset-library glass-panel">
      <h3 className="panel-title">Asset Library</h3>
      <div className="tree-container">
        {assets.map((asset) => (
          <TreeNode key={asset.id} node={asset} />
        ))}
      </div>
    </div>
  );
};

export default SidebarLeft;
