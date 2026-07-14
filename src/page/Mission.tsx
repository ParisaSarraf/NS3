import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type ChangeEvent,
  useState,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Components
import PixiCanvas from "../components/Mission/Map/PixiCanvas";
import MapControls from "../components/Mission/Map/MapControls";
import StartupScreen from "../components/Mission/Startup/StartupScreen";
import RadarOverlay from "../components/Mission/Map/RadarOverlay";
import Header from "../components/Mission/Header/Header";
import SimpleContextMenu from "../components/Mission/SimpleContextMenu/SimpleContextMenu";

// Hooks, Utils & API
import { useScenarioActions } from "../hook/useScenarioActions";
import { useMapObjects } from "../hook/useMapObjects";
import { scenarioApi } from "../api/scenarioApi";
import { mapToWorld } from "../utils/coords";
import { useGetAllObjectTypes, useMissiles } from "../api/objectTypes";
import type {
  CanonicalObject,
  EnvironmentContact,
  EnvironmentGroup,
  WayPoint,
} from "../utils/types";
import MoveModal from "../components/Mission/Modals/MoveModal";
import GoToModal from "../components/Mission/Modals/GoToModal";
import Radar from "../components/Mission/Radar/Radar";

import "../index.css";

export default function Mission() {
  const queryClient = useQueryClient();
  const objectTypesQuery = useGetAllObjectTypes();

  // --- 1. States (Unconditional) ---
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedEnemy, setSelectedEnemy] = useState<string | null>(null);
  const missileTrailsRef = useRef<Record<string, { x: number; y: number }[]>>(
    {},
  );
  const [isWaypointMode, setIsWaypointMode] = useState(false);
  const [wayPoints, setWayPoints] = useState<WayPoint[]>([]);

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

  const [selectedRadius, setSelectedRadius] = useState<number>(
    import.meta.env.VITE_APP_RADAR_RANGE,
  );
  
  const [selectedCommunicationRadius, setSelectedCommunicationRadius] =
    useState<number>(import.meta.env.VITE_APP_COMMUNICATION_RANGE);

  const [activeTab, setActiveTab] = useState<
    "initialize" | "moveAttack" | "radar" | "wayPoint"
  >("initialize");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [contextMenu, setContextMenu] = useState({
    x: 0,
    y: 0,
    visible: false,
  });
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isGoToModalOpen, setIsGoToModalOpen] = useState(false);
  const mapCanvasRef = useRef<HTMLElement | null>(null);
  const [tempUnits, setTempUnits] = useState<any[]>([]);
  const [godView, setGodView] = useState(true);
  const [radarContactsBySource, setRadarContactsBySource] = useState<
    Record<string, EnvironmentContact[]>
  >({});
  const [communicationGroups, setCommunicationGroups] = useState<
    EnvironmentGroup[]
  >([]);
  const [selectedGroupType, setSelectedGroupType] = useState("friend");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // hover state
  const [hoveredObject, setHoveredObject] = useState<CanonicalObject | null>(
    null,
  );
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [selectedRadarObject, setSelectedRadarObject] = useState(null);

  // --- 2. Custom Hooks (Unconditional) ---
  const {
    started,
    starting,
    errors,
    actionStatus,
    handleScenarioStart,
    handleScenarioStop,
    attackObject,
    moveObject,
    gotoObject,
    stopObject,
    setActionStatus,
  } = useScenarioActions(
    selectedSource,
    selectedEnemy,
    selectedLocation,
    selectedRadius,
  );
  const { data: missiles = [] } = useMissiles(started);

  const { objects, environmentContacts } = useMapObjects(started);

  useEffect(() => {
    if (activeTab === "initialize") {
      setGodView(true);
    } else {
      setGodView(false);
    }
  }, [activeTab]);

  // --- 3. Effects & Callbacks (Unconditional) ---
  useEffect(() => {
    if (tempUnits.length > 0 && objects.length > 0) {
      const serverIds = new Set(objects.map((obj) => obj.id));
      setTempUnits((prev) => prev.filter((unit) => !serverIds.has(unit.id)));
    }
  }, [objects]);

  const deployMutation = useMutation({
    mutationFn: scenarioApi.deploy,
    onSuccess: (response, variables) => {
      const newUnit = {
        id: response.data.object,
        pixi: response.data.final_location.pixi,
        party: variables.party,
        type: variables.type,
        x: response.data.final_location.unreal.x,
        y: response.data.final_location.unreal.y,
      };
      setTempUnits((prev) => [...prev, newUnit]);
      queryClient.invalidateQueries({ queryKey: ["mapObjects"] });
      if (setActionStatus) {
        setActionStatus({
          status: "success",
          message: `${variables.type} deployed at location.`,
          geo: response.data.final_location.geo,
        });
      }
    },
  });

  const toCanonical = useCallback(
    (contact: EnvironmentContact): CanonicalObject => {
      return {
        id: String(contact.object_id),
        type: contact.type,
        party: contact.party,
        x: contact.location?.pixi?.x ?? 0,
        y: contact.location?.pixi?.y ?? 0,
        z: contact.location?.pixi?.z ?? 0,
        geo: {
          lat: contact.location?.geo?.lat ?? 0,
          lon: contact.location?.geo?.lon ?? 0,
        },
        phase: null,
        target: null,
        targets: [],
      };
    },
    [],
  );

  const normalizeTag = useCallback((value: unknown) => {
    if (typeof value !== "string") return "";
    return value.trim().toLowerCase();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchAllRadarRanges = async () => {
      try {
        const objectIds = Array.from(
          new Set(
            environmentContacts
              .map((entry) => String(entry.object_id).trim())
              .filter((entry) => entry.length > 0),
          ),
        );

        if (objectIds.length === 0) {
          if (!cancelled) setRadarContactsBySource({});
          return;
        }

        const entries = await Promise.all(
          objectIds.map(async (objectId) => {
            const response = await scenarioApi.radarRange(
              objectId,
              selectedRadius,
            );
            const contacts = Array.isArray(response?.data?.objects)
              ? response.data.objects
              : [];
            return [objectId, contacts] as const;
          }),
        );

        if (cancelled) return;

        const nextBySource: Record<string, EnvironmentContact[]> = {};
        for (const [objectId, contacts] of entries) {
          nextBySource[objectId] = contacts;
        }
        setRadarContactsBySource(nextBySource);
      } catch (error) {
        if (!cancelled) {
          console.error("Radar Update Failed:", error);
          setRadarContactsBySource({});
        }
      }
    };

    if (started && !godView) {
      fetchAllRadarRanges();
      const interval = window.setInterval(fetchAllRadarRanges, 100000);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }

    setRadarContactsBySource({});
    return () => {
      cancelled = true;
    };
  }, [started, godView, environmentContacts, selectedRadius]);

  useEffect(() => {
    let cancelled = false;

    const fetchGroups = async () => {
      try {
        const groups = await scenarioApi.groups({
          type: selectedGroupType,
          radius: selectedCommunicationRadius,
        });

        if (cancelled) return;

        const normalizedGroups = Array.isArray(groups) ? groups : [];
        setCommunicationGroups(normalizedGroups);
        setSelectedGroupId((prev) =>
          prev !== null &&
          normalizedGroups.some((group) => group.group === prev)
            ? prev
            : null,
        );
      } catch (error) {
        if (!cancelled) {
          console.error("Groups Update Failed:", error);
          setCommunicationGroups([]);
          setSelectedGroupId(null);
        }
      }
    };

    if (started && !godView && selectedGroupType) {
      fetchGroups();
      const interval = window.setInterval(fetchGroups, 2000);
      return () => {
        cancelled = true;
        clearInterval(interval);
      };
    }

    setCommunicationGroups([]);
    setSelectedGroupId(null);
    return () => {
      cancelled = true;
    };
  }, [started, godView, selectedGroupType, selectedCommunicationRadius]);

<<<<<<< HEAD
  // محاسبه‌ی موشک‌های کانونیکال + پاکسازی trail های منقضی
  // (این بخش قبلاً به‌اشتباه به‌صورت یک useMemo داخل useMemo دیگر نوشته شده بود
  // که باعث نقض Rules of Hooks و خطاهای "hook order changed" می‌شد)
  const canonicalMissiles = useMemo<CanonicalObject[]>(() => {
    const currentIds = new Set(missiles.map((m: any) => String(m.id)));

    // پاکسازی trail های موشک‌های منقضی
=======
  // Compute canonical missiles + clean up expired trails
  // (This block was previously written incorrectly as a useMemo inside another useMemo,
  // which violated the Rules of Hooks and caused "hook order changed" errors)
  const canonicalMissiles = useMemo<CanonicalObject[]>(() => {
    const currentIds = new Set(missiles.map((m: any) => String(m.id)));

    // Clean up trails of expired missiles
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
    Object.keys(missileTrailsRef.current).forEach((id) => {
      if (!currentIds.has(id)) {
        delete missileTrailsRef.current[id];
      }
    });

    return missiles.map((m: any) => {
      const id = String(m.id);
      const newPos = {
        x: m.location?.pixi?.x ?? 0,
        y: m.location?.pixi?.y ?? 0,
      };

      if (!missileTrailsRef.current[id]) {
        missileTrailsRef.current[id] = [];
      }

      const currentTrail = missileTrailsRef.current[id];
      const last = currentTrail[currentTrail.length - 1];
      if (!last || last.x !== newPos.x || last.y !== newPos.y) {
        currentTrail.push(newPos);
      }

      return {
        id,
        type: "Missile",
        party: "friend",
        ...newPos,
        trail: [...currentTrail],
        geo: {
          lat: m.location?.geo?.lat ?? 0,
          lon: m.location?.geo?.lon ?? 0,
        },
        phase: null,
        target: null,
        targets: [],
      };
    });
  }, [missiles]);

  const allObjects = useMemo(() => {
<<<<<<< HEAD
    // ۲. منطق مشاهده کل (God View)
=======
    // 2. God View logic
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
    if (godView) {
      const envObjects = environmentContacts.map(toCanonical);
      const mergedGod = new Map<string, CanonicalObject>();

<<<<<<< HEAD
      // ادغام تمامی اشیاء محیطی و موشک‌ها بدون محدودیت
=======
      // Merge all environment objects and missiles without restrictions
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
      envObjects.forEach((obj) => mergedGod.set(obj.id, obj));
      canonicalMissiles.forEach((obj) => mergedGod.set(obj.id, obj));

      return Array.from(mergedGod.values());
    }

<<<<<<< HEAD
    // تابع کمکی برای بررسی فیلترهای بصری
=======
    // Helper to check visual filters
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
    const matchesSelectedFilter = (obj: CanonicalObject) => {
      if (filters.none) return true;
      const partyKey = obj.party?.toLowerCase();
      const typeKey = obj.type?.toLowerCase();

      if (filters.enemy) return partyKey === "enemy" || typeKey === "enemy";
      if (filters.friend) return partyKey === "friend" || typeKey === "friend";
      if (filters.business)
        return partyKey === "business" || typeKey === "business";
      if (filters.unknown)
        return partyKey === "unknown" || typeKey === "unknown";

      return true;
    };

<<<<<<< HEAD
    // ۳. فیلتر کردن اشیاء محیطی بر اساس تنظیمات کاربر
=======
    // 3. Filter environment objects based on user settings
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
    const envFiltered = environmentContacts
      .map(toCanonical)
      .filter(matchesSelectedFilter);

<<<<<<< HEAD
    // ۴. مدیریت منطق گروه‌های ارتباطی (Communication Groups)
=======
    // 4. Communication Groups logic
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
    if (selectedGroupId !== null) {
      const selectedGroup = communicationGroups.find(
        (g) => g.group === selectedGroupId,
      );
      if (!selectedGroup) return envFiltered;

      const memberContacts = Array.isArray(selectedGroup.objects)
        ? selectedGroup.objects
        : [];
      const memberIds = new Set(
        memberContacts.map((entry) => String(entry.object_id).trim()),
      );

<<<<<<< HEAD
      // شناسایی دشمنان رصد شده توسط رادارهای اعضای گروه
=======
      // Identify enemies detected by group members' radars
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
      const enemiesInRadar = memberContacts
        .flatMap(
          (entry) =>
            radarContactsBySource[String(entry.object_id).trim()] ?? [],
        )
        .filter((entry) => {
          const id = String(entry.object_id).trim();
          if (memberIds.has(id)) return false;

          const party = normalizeTag(entry.party);
          const type = normalizeTag(entry.type);
          const selectedType = normalizeTag(selectedGroupType);

          return party !== selectedType && type !== selectedType;
        });

      const merged = new Map<string, CanonicalObject>();

<<<<<<< HEAD
      // تجمیع اعضای گروه، دشمنان شناسایی شده و موشک‌ها
=======
      // Aggregate group members, detected enemies, and missiles
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
      memberContacts.map(toCanonical).forEach((obj) => merged.set(obj.id, obj));
      enemiesInRadar.map(toCanonical).forEach((obj) => merged.set(obj.id, obj));
      canonicalMissiles.forEach((obj) => merged.set(obj.id, obj));

      return Array.from(merged.values());
    }

<<<<<<< HEAD
    // ۵. حالت عادی (تجمیع رادارهای فعال و اشیاء فیلتر شده)
=======
    // 5. Normal mode (aggregate active radars and filtered objects)
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
    const radarUnion = Object.values(radarContactsBySource).flat();
    const mergedById = new Map<string, CanonicalObject>();

    envFiltered.forEach((obj) => mergedById.set(obj.id, obj));
    radarUnion.map(toCanonical).forEach((obj) => mergedById.set(obj.id, obj));
    canonicalMissiles.forEach((obj) => mergedById.set(obj.id, obj));

    return Array.from(mergedById.values());
  }, [
    environmentContacts,
    canonicalMissiles,
    godView,
    filters,
    selectedGroupId,
    communicationGroups,
    radarContactsBySource,
    selectedGroupType,
    normalizeTag,
    toCanonical,
  ]);

  const handleFinalAction = useCallback(
    async (party: string, type: string, id: string) => {
      const worldPos = mapToWorld(
        contextMenu.x,
        contextMenu.y,
        mapCanvasRef.current?.clientWidth ?? window.innerWidth,
        mapCanvasRef.current?.clientHeight ?? window.innerHeight,
      );
      deployMutation.mutate({ party, type, worldPos, customId: id });
      setContextMenu((prev) => ({ ...prev, visible: false }));
    },
    [contextMenu, deployMutation],
  );

  useEffect(() => {
    const handleRightClick = (e: MouseEvent) => {
      if (started && activeTab === "initialize") {
        e.preventDefault();
        const rect = mapCanvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        setContextMenu({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          visible: true,
        });
      }
    };
    window.addEventListener("contextmenu", handleRightClick);
    return () => window.removeEventListener("contextmenu", handleRightClick);
  }, [started, activeTab]);

  const handleObjectSelection = useCallback(
    (id: string) => {
      if (selectedSource === id) {
        setSelectedSource(null);
        setSelectedEnemy(null);
        setActionStatus({
          status: "success",
          message: "Source Asset deselected.",
          geo: null,
        });
        return;
      }
      if (selectedEnemy === id) {
        setSelectedEnemy(null);
        setActionStatus({
          status: "success",
          message: "Target Objective deselected. You can select a new target.",
          geo: null,
        });
        return;
      }
      if (!selectedSource) {
        setSelectedSource(id);
        setActionStatus({
          status: "success",
          message: "Attacker selected. Now select a target.",
          geo: null,
        });
      } else {
        setSelectedEnemy(id);
        setActionStatus({
          status: "success",
          message: "Target locked. Press ATTACK to engage.",
          geo: null,
        });
      }
    },
    [selectedSource, selectedEnemy, setActionStatus],
  );

  const handleAttackClick = useCallback(() => {
    if (selectedSource && selectedEnemy) {
      attackObject(selectedSource, selectedEnemy, () => {
        setSelectedSource(null);
        setSelectedEnemy(null);
        setActionStatus({
          status: "success",
          message: "Tactical strike executed. Selection reset.",
          geo: null,
        });
      });
    } else {
      setActionStatus({
        status: "error",
        message: "Selection incomplete: Identify both Attacker and Target.",
        geo: null,
      });
    }
  }, [selectedSource, selectedEnemy, attackObject, setActionStatus]);

  const handleMoveClick = () => {
    if (selectedSource) setIsMoveModalOpen(true);
  };

  const handleGoToClick = () => {
    if (selectedSource && selectedLocation) {
      setIsGoToModalOpen(true);
    } else {
      setActionStatus({
        status: "error",
        message: "Target coordinates or Source Asset missing.",
        geo: null,
      });
    }
  };

  const handleLoadScenario = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    scenarioApi.load(file).then((res) => {
      console.log("load scenario", res);
    });
  };

  const selectedSourceObj =
    allObjects.find((o) => o.id === selectedSource) || null;
  const objectTypes = objectTypesQuery.data || [];

  const handleWayPointClick = () => {
    if (!selectedSource) {
      setActionStatus({
        status: "error",
        message: "Select an object first before adding waypoints.",
        geo: null,
      });
      return;
    }
    setWayPoints([]);
    setIsWaypointMode(true);
    setActionStatus({
      status: "success",
      message: "Waypoint mode active. Click on map to add waypoints.",
      geo: null,
    });
  };

  const handleEndWayPoint = () => {
    setIsWaypointMode(false);
  };

  const handleSendWaypoints = async () => {
    if (!selectedSource) {
      setActionStatus({
        status: "error",
        message: "No object selected.",
        geo: null,
      });
      return;
    }

    if (wayPoints.length === 0) {
      setActionStatus({
        status: "error",
        message: "No waypoints added.",
        geo: null,
      });
      return;
    }

    try {
      await scenarioApi.sendWayPoints(selectedSource, wayPoints);

      setActionStatus({
        status: "success",
        message: "Waypoints sent successfully.",
        geo: null,
      });

      setIsWaypointMode(false);
      setWayPoints([]);
    } catch (error) {
      setActionStatus({
        status: "error",
        message: "Failed to send waypoints.",
        geo: null,
      });
    }
  };

  if (!started) {
    return (
      <StartupScreen
        onStart={handleScenarioStart}
        loading={starting}
        error={errors.start}
      />
    );
  }

  // --- 5. Main UI Render ---
  return (
    <>
      <div className="command-shell">
        <main className="map-shell">
          <Header
            handleLoadScenario={handleLoadScenario}
            handleScenarioStop={handleScenarioStop}
            setActiveTab={setActiveTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            activeTab={activeTab}
          />
          <section
            className="map-canvas"
            ref={(el) => {
              mapCanvasRef.current = el;
            }}
          >
            <RadarOverlay
              selectedSourceObj={selectedSourceObj}
              selectedEnemy={selectedEnemy}
              radarRange={selectedRadius}
            />
            {activeTab === "radar" ? (
              <div className="radar-tab-wrapper">
                <Radar
                  objects={allObjects}
                  selectedRadius={selectedRadius}
                  started={started}
                  povObject={selectedRadarObject}
                />
              </div>
            ) : (
              <PixiCanvas
                objects={allObjects}
                contacts={environmentContacts}
                started={started}
                activeTab={activeTab}
                selectedSource={selectedSource}
                selectedEnemy={selectedEnemy}
                selectedLocation={selectedLocation}
                selectedRadius={selectedRadius}
                selectedCommunicationRadius={selectedCommunicationRadius}
                onSelectSource={handleObjectSelection}
                wayPoints={wayPoints}
                onSelectEnemy={handleObjectSelection}
                onMapClick={(location) => {
                  setSelectedLocation(location);
                  if (isWaypointMode && selectedSource) {
                    setWayPoints((prev) => [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        x: location.x,
                        y: location.y,
                        z: location.z,
                      },
                    ]);
                    setActionStatus({
                      status: "success",
                      message: `Waypoint #${wayPoints.length + 1} added.`,
                      geo: {
                        lat: location.x,
                        lon: location.y,
                        alt: location.z,
                      },
                    });
                  }
                }}
                onHoverObject={setHoveredObject}
                onMouseMove={(e) =>
                  setMousePosition({ x: e.clientX, y: e.clientY })
                }
              />
            )}
            <div
              className={`map-sidebar-drawer glass ${isSidebarOpen ? "open" : ""}`}
            >
              <MapControls
                allObjects={allObjects}
                selectedRadarObject={selectedRadarObject}
                setSelectedRadarObject={setSelectedRadarObject}
                godView={godView}
                onWayPoint={handleWayPointClick}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                setGodView={setGodView}
                activeTab={activeTab}
                wayPoints={wayPoints}
                isWaypointMode={isWaypointMode}
                onEndWayPoint={handleEndWayPoint}
                onSendWayPoints={handleSendWaypoints}
                selectedSource={selectedSource}
                selectedEnemy={selectedEnemy}
                selectedRadius={selectedRadius}
                setSelectedRadius={setSelectedRadius}
                selectedCommunicationRadius={selectedCommunicationRadius}
                setSelectedCommunicationRadius={setSelectedCommunicationRadius}
                actionStatus={actionStatus}
                onAttack={handleAttackClick}
                onMove={handleMoveClick}
                onGoto={handleGoToClick}
                onStop={stopObject}
                filters={filters}
                setFilters={setFilters}
                communicationGroups={communicationGroups}
                selectedGroupId={selectedGroupId}
                setSelectedGroupId={setSelectedGroupId}
                selectedGroupType={selectedGroupType}
                setSelectedGroupType={setSelectedGroupType}
              />
            </div>
          </section>
        </main>
      </div>

      <SimpleContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        objectTypes={objectTypes}
        onClose={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
        onFinalAction={handleFinalAction}
      />

      <GoToModal
        isOpen={isGoToModalOpen}
        onClose={() => setIsGoToModalOpen(false)}
        location={selectedLocation}
        onSubmit={(modalData) => {
          gotoObject({
            ...modalData,
            x: selectedLocation!.x,
            y: selectedLocation!.y,
            z: selectedLocation!.z,
          });
        }}
      />

      <MoveModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        onSubmit={(data) => moveObject(data)}
      />

      {hoveredObject && (
        <div
          style={{
            position: "fixed",
            left: mousePosition.x + 15,
            top: mousePosition.y + 15,
            pointerEvents: "none",
            zIndex: 9999,
            backgroundColor: "rgba(10, 10, 10, 0.9)",
            border: "1px solid #4cff6a",
            padding: "8px 12px",
            borderRadius: "4px",
            color: "#fff",
            fontSize: "12px",
            fontFamily: "monospace",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              color: "#4cff6a",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            {hoveredObject.type.toUpperCase()}
          </div>
          <div>ID: {hoveredObject.id}</div>
          <div>PARTY: {hoveredObject.party}</div>
          <div style={{ opacity: 0.7, marginTop: "4px" }}>
            X: {hoveredObject.geo.lat} Y: {hoveredObject.geo.lon}
          </div>
        </div>
      )}
    </>
  );
}
