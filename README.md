# ⚓ Maritime Fleet Co-Simulation Monitoring System

A high-tech, real-time telemetric dashboard engineered to monitor maritime fleet positioning and network communication topology configurations. This workstation aggregates geographic asset positions and overlays dynamic mesh topologies while concurrently plotting time-series data streams without rendering bottlenecks.

![Dashboard Preview Layout](https://images.unsplash.com/photo-1518173946687-a4c8a3b1f98e?auto=format&fit=crop&w=1200&q=80) 
*(Replace with your actual screenshot once pushed to GitHub)*

## 🚀 Key Architectural Features

- **Isolated Geospatial Layer Engine (`MapLibre GL`):** Decoupled canvas state tracking built over a customized `useMapEngine` hook hook layer. Frees the core view from expensive coordinate canvas recalculation loops.
- **Dynamic Mesh Topologies:** Real-time GeoJSON rendering tracks live communication channels, dynamically altering link vectors (Emerald Green, Amber, Red) based on link quality metrics.
- **Unified Telemetry Stream Matrix:** Embedded data charts using `Recharts` to monitor multi-series network constraints including:
  - **Network Delay (ms):** Historical line tracking per vessel.
  - **Packet Loss (%):** Categorical bar monitors.
  - **Throughput (Mbps):** Vector SVG radial indicator dials.
- **Strict Layout Contraints:** Enforced bounding viewport bounds (`100vh` / `100vw` layout constraints) which limits scrolling entirely to specific internal log elements.
- **Robust Type Profiles:** Fully type-safe component parameters utilizing absolute algebraic interfaces for strict schema validation.

## 📁 Directory Architecture

Mapped precisely to our production-ready workspace parameters:

```text
src/
├── assets/                     # Geospatial textures, vessel vector elements
├── components/                 # Presentation layers isolated by domain
│   ├── Layout/                 # Header, Sidebar frame, and global navigation bars
│   ├── Map/                    # MapCanvas interface wrapper and overlay HUDs
│   ├── Charts/                 # Time-series, Bar charts, and SVG radial gauges
│   └── Table/                  # Severity-coded live alerts table grid
├── hook/                       # Decoupled state machines (useMapEngine, useTelemetryData)
├── page/                       # Dashboard entry layout grid controller view
├── services/                   # Safe Fetch HTTP Clients and Data Transformers
└── utils/                      # Color constants (#3B8BD4, #10B981) and types
