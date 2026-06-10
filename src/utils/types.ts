// ------------------------------- Network System Types -------------------------------

import type { ActionStatus } from "../hook/useScenarioActions";

export interface SimulationEventLog {
  time: number;
  flow: string;
  direction: string;
  source_ship: string;
  destination_ship: string;
  distance_m: number;
  payload_bytes: number;
  latency_ms: number;
  jitter_ms: number;
  tx_packets: number;
  shadow_lost_packets: number;
  shadow_loss_ratio: number;
  shadow_packet_lost: boolean;
  ns3_enabled: boolean;
}

export interface RedisTelemetryPayload {
  time: number;
  flow: string;
  direction: string;
  source_ship: string;
  destination_ship: string;
  distance_m: number;
  payload_bytes: number;
  latency_ms: number;
  jitter_ms: number;
  tx_packets: number;
  shadow_lost_packets: number;
  shadow_loss_ratio: number;
  shadow_packet_lost: boolean;
  ns3_enabled: boolean;
}

export interface MappedThroughput {
  id: string;
  value: number;
}

export interface MappedDelayPoint {
  time: string;
  [shipKey: string]: number | string;
}

export interface MappedPacketLoss {
  id: string;
  value: number;
}

export type Feature = {
  id: string;
  label: string;
  type: string;
  geom: string;
};

// ------------------------------------- Map Types -------------------------------------
export type Mode = "point" | "line" | "polygon" | "delete" | null;

export interface PointGeometry {
  type: "Point";
  coordinates: [number, number];
}

export interface LineStringGeometry {
  type: "LineString";
  coordinates: [number, number][];
}

export interface PolygonGeometry {
  type: "Polygon";
  coordinates: [number, number][][];
}

export type GeometryData = PointGeometry | LineStringGeometry | PolygonGeometry;

export interface PendingGeometry {
  type: "point" | "line" | "polygon" | "delete";
  geomData: GeometryData;
}

// ----------------------------------------------- Mission Types -----------------------------------------------

export type CanonicalTarget = {
  id: string | null;
  x: number | null;
  y: number | null;
  z: number | null;
  type?: string | null;
  side?: string | null;
};

export type CanonicalObject = {
  id: string;
  type: string;
  party: string;
  x: number;
  y: number;
  z: number;
  geo: { lat: number; lon: number };
  phase: string | null;
  target: CanonicalTarget | null;
  targets?: CanonicalTarget[];
  trail?: { x: number; y: number }[];
};

export type EnvironmentContact = {
  object_id: string;
  location: {
    unreal: { x: number; y: number; z: number };
    geo: { lat: number; lon: number };
    pixi: { x: number; y: number; z: number };
  };
  velocity: {
    direction: { alpha: number; beta: number; gamma: number };
    speed: number;
    acceleration: number;
  };

  type: string;
  party: string;
};

export type EnvironmentGroup = {
  group: number;
  objects: EnvironmentContact[];
};

export type UnitType =
  | "Drone"
  | "Kirov"
  | "Akula"
  | "Oliver"
  | "Ticondra"
  | "Kuznetsov";
export type Affiliation = "friend" | "enemy" | "business" | "unknown";
export type Domain = "Air" | "Sea" | "Subsurface";

export interface MapObject {
  id: string;
  type: UnitType;
  affiliation: Affiliation;
  heading: number;
  x: number;
  y: number;
}

export interface MapControlsProps {
  wayPoints: WayPoint[];
  isWaypointMode: boolean;
  onEndWayPoint: () => void;
  onSendWayPoints: () => void;
  onWayPoint: () => void;
  allObjects: CanonicalObject[];
  activeTab: "initialize" | "moveAttack" | "radar" | "wayPoint";
  selectedSource: string | null;
  selectedEnemy: string | null;
  selectedRadius: number;
  selectedRadarObject: CanonicalObject | null;
  setSelectedRadarObject: (value: CanonicalObject | null) => void;
  godView: boolean;
  setSelectedRadius: (value: number) => void;
  actionStatus: ActionStatus | null;
  onAttack: () => void;
  onMove: () => void;
  onGoto: () => void;
  selectedLocation: { x: number; y: number; z: number } | null;
  setSelectedLocation: (
    value: { x: number; y: number; z: number } | null,
  ) => void;
  onStop: () => void;
  setGodView: (val: boolean) => void;
  selectedCommunicationRadius: number;
  setSelectedCommunicationRadius: (value: number) => void;
  filters: {
    none: boolean;
    enemy: boolean;
    friend: boolean;
    business: boolean;
    unknown: boolean;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      none: boolean;
      enemy: boolean;
      friend: boolean;
      business: boolean;
      unknown: boolean;
    }>
  >;
  communicationGroups: EnvironmentGroup[];
  selectedGroupId: number | null;
  setSelectedGroupId: (value: number | null) => void;
  selectedGroupType: string;
  setSelectedGroupType: (value: string) => void;
}

export interface PixiCanvasProps {
  destroyedObjects?: CanonicalObject[];
  objects: CanonicalObject[];
  wayPoints: { x: number; y: number; z: number }[];
  contacts: EnvironmentContact[];
  started: boolean;
  onMouseMove: (e: React.MouseEvent) => void;
  activeTab: "initialize" | "moveAttack" | "radar" | "wayPoint";
  selectedSource: string | null;
  selectedEnemy: string | null;
  selectedLocation: { x: number; y: number; z: number } | null;
  selectedRadius: number;
  selectedCommunicationRadius: number;
  onSelectSource: (id: string) => void;
  onSelectEnemy: (id: string) => void;
  onMapClick: (worldCoord: { x: number; y: number; z: number }) => void;
  onHoverObject: (obj: CanonicalObject | null) => void;
}

export type WayPoint = {
  id: string;
  x: number;
  y: number;
  z: number;
};
