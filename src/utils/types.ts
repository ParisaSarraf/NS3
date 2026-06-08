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
