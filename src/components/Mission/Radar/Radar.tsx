import { useRef } from "react";
import { usePixiRadarManager } from "../../../hook/usePixiRadarManager";

const Radar = ({ objects, selectedRadius, started, povObject }) => {
  const containerRef = useRef(null);
  usePixiRadarManager(containerRef, {
    objects,
    selectedRadius,
    started,
    povObject,
  });

  return (
    <div
      className="radar-container"
      ref={containerRef}
      style={{ width: "600px", height: "600px", position: "relative" }}
    >
      <span className="marker n">0</span>
      <span className="marker e">90</span>
      <span className="marker s">180</span>
      <span className="marker w">270</span>
    </div>
  );
};

export default Radar;
