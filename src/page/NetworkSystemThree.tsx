import { Header } from "../components/Layout/Header";
import { MapCanvas } from "../components/NetworkSystemComponents/Map/MapCanvas";
import { BottomNav } from "../components/Layout/BottomNav";
import { darkGlassCardStyle } from "../utils/constants";
import { useTelemetryData } from "../hook/useTelemetryData";
import { useMapEngine } from "../hook/useMapEngine";
import { DelayLineChart } from "../components/NetworkSystemComponents/Charts/DelayLineChart";
import { ThroughputGauge } from "../components/NetworkSystemComponents/Charts/ThroughputGauge";
import { PacketBarChart } from "../components/NetworkSystemComponents/Charts/PacketBarChart";
import { AlertsTable } from "../components/NetworkSystemComponents/Table/AlertsTable";

const NetworkSystemThree = () => {
  const { updateShip } = useMapEngine();
  const { delayData, packetData, throughputData, alerts } =
    useTelemetryData(updateShip);

  return (
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
            <div
              style={{
                height: "1px",
                backgroundColor: "#1e293b",
                margin: "12px 0",
              }}
            ></div>
            <DelayLineChart data={delayData} />
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
                height: "1px",
                backgroundColor: "#1e293b",
                margin: "12px 0",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "4px",
                height: "70%",
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
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#1e293b",
                  margin: "12px 0",
                }}
              ></div>
              <PacketBarChart data={packetData} />
            </div>
            <div
              style={{
                ...darkGlassCardStyle,
                padding: "16px",
                flex: 1,
                minHeight: "200px",
              }}
            >
              <AlertsTable alerts={alerts} />
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default NetworkSystemThree;
