import React, { useRef } from "react";
import { usePixiManager } from "../../../hook/usePixiManager";
import type { PixiCanvasProps } from "../../../utils/types";

// const PixiCanvas: React.FC<PixiCanvasProps> = (props) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   usePixiManager(containerRef, props);

//   const handleMouseMove = (e: React.MouseEvent) => {
//     props.onMouseMove?.(e);
//   };

//   usePixiManager(containerRef, props);
//   return (
//     <div
//       className="canvas-mount "
//       ref={containerRef}
//       onMouseMove={handleMouseMove}
//       style={{ width: "100%", height: "100%", overflow: "hidden" }}
//     />
//   );
// };
<<<<<<< HEAD
// ✅ کد اصلاح‌شده
=======
// ✅ Fixed code
>>>>>>> c0e269895ca1682592bfcff28b61188ef48dbf1e
const PixiCanvas: React.FC<PixiCanvasProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  usePixiManager(containerRef, props);

  return (
    <div
      className="canvas-mount"
      ref={containerRef}
      onMouseMove={props.onMouseMove}
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    />
  );
};

export default PixiCanvas;
