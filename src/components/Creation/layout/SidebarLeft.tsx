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
import { useState, useEffect, type ReactNode } from "react";
import apiClient from "../../../services/apiClient";

interface ComponentItem {
  component_name: string;
  component_type: string;
  default_config: Record<string, unknown>;
}

interface TreeNodeData {
  id: string;
  name: string;
  icon: ReactNode;
  addable?: boolean;
  children: TreeNodeData[];
}

interface SidebarProps {
  onLogout: () => void;
}

const PARENT_CONFIG: Record<
  string,
  { icon: ReactNode; id: string; addable: boolean }
> = {
  engine: { id: "2", icon: <Cog size={15} />, addable: true },
  radar: { id: "4", icon: <Radar size={15} />, addable: true },
  hull: { id: "1", icon: <Anchor size={15} />, addable: true },
  power: { id: "3", icon: <Zap size={15} />, addable: true },
  weapon: { id: "5", icon: <Crosshair size={15} />, addable: true },
  weapons: { id: "5", icon: <Crosshair size={15} />, addable: true },
  coms: { id: "6", icon: <Radio size={15} />, addable: true },
  mission: { id: "7", icon: <Box size={15} />, addable: true },
};

const CHILD_ICON_MAP: Record<string, ReactNode> = {
  radar: <Radar size={15} />,
  sonar: <Waves size={15} />,
  "eo/ir": <Eye size={15} />,
  gun: <Target size={15} />,
  sam: <Rocket size={15} />,
  asm: <Rocket size={15} />,
  radar_communications: <Radar size={15} />,
  engine: <Cog size={15} />,
};

const buildTree = (items: ComponentItem[]): TreeNodeData[] => {
  const parentMap = new Map<string, TreeNodeData>();
  let fallbackId = 100;

  items.forEach((item) => {
    const typeKey = item.component_type.toLowerCase();
    const config = PARENT_CONFIG[typeKey];

    if (!parentMap.has(item.component_type)) {
      parentMap.set(item.component_type, {
        id: config?.id ?? String(++fallbackId),
        name: item.component_type,
        icon: config?.icon ?? <Box size={15} />,
        addable: config?.addable ?? true,
        children: [],
      });
    }

    const parent = parentMap.get(item.component_type)!;
    const nameKey = item.component_name.toLowerCase();

    parent.children.push({
      id: `${parent.id}-${parent.children.length + 1}`,
      name: item.component_name,
      icon: CHILD_ICON_MAP[nameKey] ?? <Box size={15} />,
      children: [],
    });
  });

  return Array.from(parentMap.values());
};

const TreeNode = ({ node }: { node: TreeNodeData }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
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

const SidebarLeft = ({ onLogout }: SidebarProps) => {
  const [assets, setAssets] = useState<TreeNodeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get<ComponentItem[]>(
          "/components/list-components",
        );
        setAssets(buildTree(res.data));
        setError(null);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "خطای ناشناخته";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="asset-library glass-panel">
      <h3 className="panel-title">Asset Library</h3>

      <div className="tree-container">
        {loading && <p style={{ color: "#888", fontSize: 13 }}>Loading...</p>}
        {error && <p style={{ color: "#f55", fontSize: 13 }}>Error: {error}</p>}
        {!loading &&
          !error &&
          assets.map((asset) => <TreeNode key={asset.id} node={asset} />)}
      </div>
    </div>
  );
};

export default SidebarLeft;
