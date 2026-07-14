<<<<<<< HEAD
import { GuitarIcon, HatGlasses, PresentationIcon } from "lucide-react";
=======
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
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
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
<<<<<<< HEAD
=======
        {node.addable && (
          <button
            className="add-btn"
            aria-label={`Add ${node.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Plus size={13} />
          </button>
        )}
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
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
<<<<<<< HEAD

  const assets = [
    {
      id: "1",
      icon: <PresentationIcon size={15} />,
      name: "Hull & Class",
      children: [
        { id: "1-1", name: "Destroyer", icon: <GuitarIcon size={15} /> },
        { id: "1-2", name: "Frigate", icon: <GuitarIcon size={15} /> },
      ],
    },
    {
      id: "2",
      icon: <GuitarIcon size={15} />,
      name: "Propulsion",
      children: [
        { id: "2-1", name: "Gas Turbine", icon: <GuitarIcon size={15} /> },
        { id: "2-2", name: "Diesel Engine", icon: <GuitarIcon size={15} /> },
        { id: "2-3", name: "Electric Motor", icon: <GuitarIcon size={15} /> },
      ],
    },
    {
      id: "3",
      icon: <GuitarIcon size={15} />,
      name: "Power",
=======
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
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
      children: [],
    },
    {
      id: "4",
<<<<<<< HEAD
      icon: <GuitarIcon size={15} />,
      name: "Sensors",
      children: [
        { id: "4-1", name: "Radar Suite", icon: <GuitarIcon size={15} /> },
        { id: "4-2", name: "Sonar Arrays", icon: <GuitarIcon size={15} /> },
        { id: "4-3", name: "EO/IR", icon: <GuitarIcon size={15} /> },
=======
      icon: <Radar size={15} />,
      name: "Sensors",
      addable: true,
      children: [
        { id: "4-1", name: "Radar", icon: <Radar size={15} /> },
        { id: "4-2", name: "Sonar", icon: <Waves size={15} /> },
        { id: "4-3", name: "EO/IR", icon: <Eye size={15} /> },
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
      ],
    },
    {
      id: "5",
<<<<<<< HEAD
      icon: <GuitarIcon size={15} />,
      name: "Weapons",
      children: [
        { id: "5-1", name: "Gun", icon: <GuitarIcon size={15} /> },
        { id: "5-2", name: "SAM", icon: <GuitarIcon size={15} /> },
        { id: "5-3", name: "ASM", icon: <GuitarIcon size={15} /> },
=======
      icon: <Crosshair size={15} />,
      name: "Weapons",
      addable: true,
      children: [
        { id: "5-1", name: "Gun", icon: <Target size={15} /> },
        { id: "5-2", name: "SAM", icon: <Rocket size={15} /> },
        { id: "5-3", name: "ASM", icon: <Rocket size={15} /> },
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
      ],
    },
    {
      id: "6",
<<<<<<< HEAD
      icon: <GuitarIcon size={15} />,
      name: "Comms & EW",
      children: [],
    },
    { id: "7", icon: <GuitarIcon size={15} />, name: "Mission Modules", children: [] },
=======
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
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
  ];

  return (
    <div className="asset-library glass-panel">
<<<<<<< HEAD
      <h3
        style={{
          marginTop: 0,
          paddingBottom: "8px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          fontSize: "1rem",
        }}
      >
        Asset Library
      </h3>
=======
      <h3 className="panel-title">Asset Library</h3>
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
      <div className="tree-container">
        {assets.map((asset) => (
          <TreeNode key={asset.id} node={asset} />
        ))}
      </div>
    </div>
  );
};

export default SidebarLeft;
