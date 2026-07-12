import * as PIXI from "pixi.js";
type PixiRenderer = PIXI.Renderer | PIXI.IRenderer<PIXI.ICanvas>;

export const PARTY_COLORS = {
  friend: { main: 0x1f5ed1, accent: 0xa7d6ff, glow: 0x6de0ff },
  enemy: { main: 0x8c1420, accent: 0xff565a, glow: 0xff565a },
  business: { main: 0xc9a000, accent: 0xffe600, glow: 0xffe600 },
  unknown: { main: 0x444444, accent: 0x999999, glow: 0x797979 },
};

export function createShipTexture(renderer: PixiRenderer, party: keyof typeof PARTY_COLORS): PIXI.Texture {
  const colors = PARTY_COLORS[party] || PARTY_COLORS.unknown;
  const g = new PIXI.Graphics();

  // --- Detailed Hull ---
  g.beginFill(colors.main);
  g.lineStyle(2, colors.accent, 1);
  // Sharp naval hull shape
  g.drawPolygon([
    0, -60,      // Bow
    22, -30,     // Starboard shoulder
    22, 40,      // Starboard stern
    -22, 40,     // Port stern
    -22, -30     // Port shoulder
  ]);
  g.endFill();

  // --- Deck Details ---
  g.beginFill(0x1a1a1a, 0.5); // Deck runway/walkway
  g.drawRect(-6, -20, 12, 50);
  g.endFill();

  // --- Bridge Superstructure ---
  g.beginFill(0xffffff);
  g.drawRoundedRect(-10, -15, 20, 15, 3);
  g.endFill();
  
  // Windows/Glass
  g.beginFill(colors.glow);
  g.drawRect(-7, -12, 14, 4);
  g.endFill();

  // --- Weaponry / Turrets ---
  const drawTurret = (y: number) => {
    g.beginFill(0x333333);
    g.drawCircle(0, y, 6);
    g.endFill();
    g.lineStyle(3, 0x555555);
    g.moveTo(0, y);
    g.lineTo(0, y - 12); // Barrel
  };
  drawTurret(-35); // Forward turret
  drawTurret(25);  // Aft turret

  // --- Radar Mast ---
  g.lineStyle(2, 0xffffff, 0.8);
  g.moveTo(0, -5);
  g.lineTo(0, -25);
  g.moveTo(-8, -20);
  g.lineTo(8, -20);

  const tex = renderer.generateTexture(g, {
    resolution: 2,
    scaleMode: PIXI.SCALE_MODES.LINEAR,
  });
  g.destroy(true);
  return tex;
}