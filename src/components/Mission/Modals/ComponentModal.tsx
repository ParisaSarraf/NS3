import { useEffect, useState, type ReactNode } from "react";
import {
  X,
  Plus,
  Box,
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
  Check,
} from "lucide-react";
import apiClient from "../../../services/apiClient";

interface ComponentItem {
  component_name: string;
  component_type: string;
  default_config: Record<string, unknown>;
}

interface SelectedComponent {
  component_name: string;
  component_type: string;
  config: Record<string, unknown>;
}

interface TreeNodeData {
  id: string;
  name: string;
  icon: ReactNode;
  children: TreeNodeData[];
  rawItem?: ComponentItem;
}

const PARENT_CONFIG: Record<string, { icon: ReactNode; id: string }> = {
  engine: { id: "2", icon: <Cog size={15} /> },
  radar: { id: "4", icon: <Radar size={15} /> },
  hull: { id: "1", icon: <Anchor size={15} /> },
  power: { id: "3", icon: <Zap size={15} /> },
  weapon: { id: "5", icon: <Crosshair size={15} /> },
  weapons: { id: "5", icon: <Crosshair size={15} /> },
  coms: { id: "6", icon: <Radio size={15} /> },
  mission: { id: "7", icon: <Box size={15} /> },
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
      rawItem: item,
    });
  });

  return Array.from(parentMap.values());
};

interface ModalTreeNodeProps {
  node: TreeNodeData;
  selected: SelectedComponent[];
  onAdd: (item: ComponentItem) => void;
  onRemove: (name: string) => void;
}

const ModalTreeNode = ({
  node,
  selected,
  onAdd,
  onRemove,
}: ModalTreeNodeProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div className="tree-node">
      <div
        className="asset-item"
        onClick={() => hasChildren && setIsOpen((v) => !v)}
        style={{ cursor: hasChildren ? "pointer" : "default" }}
      >
        <div className="node-content">
          {hasChildren ? (
            <span className={`caret ${isOpen ? "open" : ""}`}>▶</span>
          ) : (
            <span className="spacer" />
          )}
          <span>{node.icon}</span>
          <span>{node.name}</span>
        </div>

        {node.rawItem &&
          (() => {
            const isSelected = selected.some(
              (s) => s.component_name === node.rawItem!.component_name,
            );
            return isSelected ? (
              <button
                className="add-btn"
                aria-label={`Remove ${node.name}`}
                style={{ color: "var(--accent-blue)" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(node.rawItem!.component_name);
                }}
              >
                <Check size={13} />
              </button>
            ) : (
              <button
                className="add-btn"
                aria-label={`Add ${node.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(node.rawItem!);
                }}
              >
                <Plus size={13} />
              </button>
            );
          })()}
      </div>

      {hasChildren && isOpen && (
        <div className="tree-children">
          {node.children.map((child) => (
            <ModalTreeNode
              key={child.id}
              node={child}
              selected={selected}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ComponentModalProps {
  onClose: () => void;
}

const ComponentModal = ({ onClose }: ComponentModalProps) => {
  const [assets, setAssets] = useState<TreeNodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedComponent[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get<ComponentItem[]>(
          "/components/list-components",
        );
        setAssets(buildTree(res.data));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleAdd = (item: ComponentItem) => {
    setSelected((prev) => [
      ...prev,
      {
        component_name: item.component_name,
        component_type: item.component_type,
        config: item.default_config,
      },
    ]);
  };

  const handleRemove = (name: string) => {
    setSelected((prev) => prev.filter((s) => s.component_name !== name));
  };

  const handleAccept = async () => {
    if (selected.length === 0) {
      setSubmitError("حداقل یک کامپوننت انتخاب کنید");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await apiClient.post("/ships/create-ship", {
        ship_name: "New Ship",
        ship_type: "default",
        components: selected,
      });

      onClose();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "خطا در ذخیره کشتی");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ship Components"
    >
      <div
        className="modal-box glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="panel-title" style={{ margin: 0 }}>
            Ship Components
          </h3>
          <button
            className="icon-btn"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body tree-container">
          {loading && <p style={{ color: "#888", fontSize: 13 }}>Loading...</p>}
          {error && (
            <p style={{ color: "#f55", fontSize: 13 }}>Error: {error}</p>
          )}
          {!loading &&
            !error &&
            assets.map((asset) => (
              <ModalTreeNode
                key={asset.id}
                node={asset}
                selected={selected}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            ))}
        </div>

        {selected.length > 0 && (
          <div
            style={{
              padding: "4px 12px",
              fontSize: 12,
              color: "var(--accent-blue)",
            }}
          >
            {selected.length} component{selected.length > 1 ? "s" : ""} selected
          </div>
        )}

        <div
          className="modal-footer"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
          }}
        >
          {submitError && (
            <span style={{ color: "#f55", fontSize: 12, marginRight: "auto" }}>
              {submitError}
            </span>
          )}
          <button
            className="btn-secondary-cancel"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="btn-primary-accept"
            onClick={handleAccept}
            disabled={submitting || selected.length === 0}
          >
            {submitting ? "Saving..." : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentModal;
