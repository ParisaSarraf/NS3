import * as PIXI from "pixi.js";

type PixiRenderer = PIXI.Renderer | PIXI.IRenderer<PIXI.ICanvas>;

export function createTargetTexture(renderer: PixiRenderer): PIXI.Texture {
  const g = new PIXI.Graphics();
  const color = 0x79ff65; // Tactical Green

  // --- Outer Ring (Dashed appearance) ---
  g.lineStyle(2, color, 0.4);
  g.drawCircle(0, 0, 30);

  // --- The Crosshair Brackets ---
  g.lineStyle(3, color, 1);
  
  // Top-Left Corner
  g.moveTo(-20, -10); g.lineTo(-20, -20); g.lineTo(-10, -20);
  
  // Top-Right Corner
  g.moveTo(20, -10); g.lineTo(20, -20); g.lineTo(10, -20);
  
  // Bottom-Left Corner
  g.moveTo(-20, 10); g.lineTo(-20, 20); g.lineTo(-10, 20);
  
  // Bottom-Right Corner
  g.moveTo(20, 10); g.lineTo(20, 20); g.lineTo(10, 20);

  // --- Center Point ---
  g.beginFill(color, 1);
  g.drawCircle(0, 0, 3);
  g.endFill();

  // --- Subtle Glow ---
  g.beginFill(color, 0.15);
  g.drawCircle(0, 0, 15);
  g.endFill();

  // Generate the static texture
  const tex = renderer.generateTexture(g, {
    resolution: 2,
    scaleMode: PIXI.SCALE_MODES.LINEAR,
  });

  g.destroy(true);
  return tex;
}