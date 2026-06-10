import { useState, useRef } from "react";

export function useMapState() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedEnemy, setSelectedEnemy] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [filters, setFilters] = useState({
    none: true,
    enemy: true,
    friend: true,
    business: true,
    unknown: true,
  });
  const [selectedRadius, setSelectedRadius] = useState(200000);
  const [selectedCommRadius, setSelectedCommRadius] = useState(200000);
  const [activeTab, setActiveTab] = useState<
    "initialize" | "moveAttack" | "radar"
  >("initialize");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [godView, setGodView] = useState(true);
  const [contextMenu, setContextMenu] = useState({
    x: 0,
    y: 0,
    visible: false,
  });
  const [modals, setModals] = useState({ move: false, goTo: false });
  const [hoveredObject, setHoveredObject] = useState<any | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedRadarObject, setSelectedRadarObject] = useState(null);
  const [tempUnits, setTempUnits] = useState<any[]>([]);
  const [selectedGroupType, setSelectedGroupType] = useState("friend");

  const mapCanvasRef = useRef<HTMLElement | null>(null);

  return {
    state: {
      selectedSource,
      selectedEnemy,
      selectedLocation,
      filters,
      selectedRadius,
      selectedCommRadius,
      activeTab,
      isSidebarOpen,
      godView,
      contextMenu,
      modals,
      hoveredObject,
      mousePosition,
      selectedRadarObject,
      tempUnits,
      selectedGroupType,
    },
    setters: {
      setSelectedSource,
      setSelectedEnemy,
      setSelectedLocation,
      setFilters,
      setSelectedRadius,
      setSelectedCommRadius,
      setSelectedGroupType,
      setActiveTab,
      setIsSidebarOpen,
      setGodView,
      setContextMenu,
      setModals,
      setHoveredObject,
      setMousePosition,
      setSelectedRadarObject,
      setTempUnits,
    },
    refs: { mapCanvasRef },
  };
}
