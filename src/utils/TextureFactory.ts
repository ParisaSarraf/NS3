import ms from "milsymbol";
import * as PIXI from "pixi.js";

type PixiRenderer = PIXI.Renderer | PIXI.IRenderer<PIXI.ICanvas>;

/**
 * MIL-STD-2525C SIDCs
 *
 * IMPORTANT:
 * These are COMPLETE SIDCs.
 * Do NOT attempt to concatenate function IDs manually.
 *
 * Structure:
 * [0] Coding Scheme
 * [1] Affiliation
 * [2] Battle Dimension
 * [3] Status
 * [4-9] Function ID
 * [10-14] Modifiers
 */
const UNIT_SIDC: Record<string, string> = {
  /**
   * AIR
   */
  // UAV
  Drone: "SFAPMFQ----K---",

  /**
   * SURFACE
   */
  // Generic surface combatant
  Kirov: "SFSPCL--------",
  // Generic cruiser
  Ticonderoga: "SFSPCL--------",
  // Generic frigate
  Oliver: "SFSPCL--------",
  // Aircraft carrier
  Kuznetsov: "SFSPClCV--------",

  /**
   * SUBSURFACE
   */

  // Submarine
  Akula: "SFUPSB-------",

  // missile
  Missile: "10030200001100000202",
};

// 10030200001100000202 missile  ??

/**
 * Affiliation Mapping
 *
 * F = Friendly
 * H = Hostile
 * N = Neutral
 * U = Unknown
 */
const IDENTITY_MAP: Record<string, string> = {
  friend: "F",
  enemy: "H",
  business: "N",
  neutral: "N",
  unknown: "U",
};

/**
 * Generic fallback symbol
 */
const DEFAULT_SIDC = "SFGPU----------";
/**
 * Creates a MIL-STD-2525C texture using MilSymbol + PIXI
 */
// export function createMilStdTexture(
//   renderer: PixiRenderer,
//   party: string,
//   unitType: string,
//   size: number = 35,
// ): PIXI.Texture {
//   /**
//    * Normalize input:
//    * "kirov" -> "Kirov"
//    */

//   const normalizedUnit =
//     unitType.charAt(0).toUpperCase() + unitType.slice(1).toLowerCase();

//   /**
//    * Get base SIDC
//    */
//   let sidc = UNIT_SIDC[normalizedUnit] || DEFAULT_SIDC;

//   /**
//    * Override affiliation dynamically
//    *
//    * SIDC position:
//    * index 1 = affiliation
//    */
//   const affiliation = IDENTITY_MAP[party.toLowerCase()] || "U";

//   sidc = sidc.substring(0, 1) + affiliation + sidc.substring(2);

//   /**
//    * Create symbol
//    */
//   const symbol = new ms.Symbol(sidc, {
//     size,
//     frame: true, // Draw unit frame
//     icon: true, // Draw internal icon
//     fill: true, // Fill affiliation color
//     strokeWidth: 2, // Better readability
//     standard: "2525C", // Use NATO APP-6 / 2525C
//   });

//   /**
//    * Convert symbol canvas -> PIXI texture
//    */
//   return PIXI.Texture.from(symbol.asCanvas());
// }

// src/utils/TextureFactory.ts

// src/utils/TextureFactory.ts
export function createMilStdTexture(
  renderer: PixiRenderer,
  party: string,
  unitType: string,
  size: number = 35,
) {
  const normalizedUnit =
    unitType.charAt(0).toUpperCase() + unitType.slice(1).toLowerCase();
  let sidc = UNIT_SIDC[normalizedUnit] || DEFAULT_SIDC;

  const affiliation = IDENTITY_MAP[party.toLowerCase()] || "U";

  // اگر کد با '1' شروع شود یعنی استاندارد جدید عددی است
  if (!sidc.startsWith("1")) {
    sidc = sidc.substring(0, 1) + affiliation + sidc.substring(2);
  }

  const symbol = new ms.Symbol(sidc, {
    size,
    frame: true,
    icon: true,
    fill: true,
    standard: sidc.startsWith("1") ? "2525D" : "2525C", // سوئیچ هوشمند بین استانداردها
  });

  return PIXI.Texture.from(symbol.asCanvas());
}
