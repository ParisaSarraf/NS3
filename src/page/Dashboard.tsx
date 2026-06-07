import { Header } from "../components/Layout/Header";
import { LeftSidebar } from "../components/Layout/LeftSidebar";
import { MapCanvas } from "../components/Map/MapCanvas";
import { DelayLineChart } from "../components/Charts/DelayLineChart";
import { PacketBarChart } from "../components/Charts/PacketBarChart";
import { ThroughputGauge } from "../components/Charts/ThroughputGauge";
import { AlertsTable } from "../components/Table/AlertsTable";
import { BottomNav } from "../components/Layout/BottomNav";
import { useTelemetryData } from "../hook/useTelemetryData";
import { darkGlassCardStyle } from "../utils/constants";

export default function Dashboard() {
  const { delayData, packetData, throughputData } = useTelemetryData();

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#060913",
        height: "100vh", 
        width: "100vw", 
        color: "#fff",
        overflow: "hidden", 
        fontFamily: "JetBrains Mono, monospace",
      }}
    >
      <LeftSidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          gap: "16px",
          height: "100vh", 
          boxSizing: "border-box",
          overflow: "hidden", 
        }}
      >
        <Header />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gridTemplateRows: "1fr", 
            gap: "16px",
            flex: 1,
            minHeight: 0, 
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              minHeight: 0, 
            }}
          >
            <div
              style={{
                ...darkGlassCardStyle,
                flex: 1,
                position: "relative",
                minHeight: 0,
              }}
            >
              <MapCanvas />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              height: "100%",
              overflowY: "auto", 
            }}
            className="custom-scroll"
          >
            <div style={{ ...darkGlassCardStyle, padding: "16px", flex: 0 }}>
              <h3
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: "700",
                }}
              >
                NETWORK DELAY (ms)
              </h3>
              <DelayLineChart data={delayData} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.1fr",
                gap: "16px",
                flex: 0,
              }}
            >
              <div style={{ ...darkGlassCardStyle, padding: "16px" }}>
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: "700",
                  }}
                >
                  PACKET LOSS (%)
                </h3>
                <PacketBarChart data={packetData} />
              </div>

              <div style={{ ...darkGlassCardStyle, padding: "16px" }}>
                <h3
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: "700",
                  }}
                >
                  THROUGHPUT (Mbps)
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "4px",
                    height: "85%",
                  }}
                >
                  {throughputData.map((ship) => (
                    <ThroughputGauge
                      key={ship.id}
                      name={ship.id}
                      value={ship.value}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                ...darkGlassCardStyle,
                padding: "16px",
                flex: 1,
                minHeight: "200px",
              }}
            >
              <AlertsTable />
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}
