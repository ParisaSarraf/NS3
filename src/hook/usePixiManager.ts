import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import type { CanonicalObject, PixiCanvasProps } from "../utils/types";
import {
  worldToMap,
  WORLD_CONFIG,
  mapToWorld,
  MAP_IMAGE_CONFIG,
} from "../utils/coords";
import { PARTY_COLORS } from "../utils/textures";
import { createTargetTexture } from "../utils/TargetMarker";
import { createMilStdTexture } from "../utils/TextureFactory";

export const usePixiManager = (
  containerRef: React.RefObject<HTMLDivElement>,
  props: PixiCanvasProps,
) => {
  const appRef = useRef<PIXI.Application | null>(null);
  const texturesRef = useRef<Record<string, PIXI.Texture> | null>(null);
  const targetSpriteRef = useRef<PIXI.Sprite | null>(null);
  const textureCache = useRef<Record<string, PIXI.Texture>>({});

  /* ------------------------------------------
      CREATE PIXI APP & TEXTURES
  ------------------------------------------ */
  useEffect(() => {
    if (!props.started || !containerRef.current) return;

    const app = new PIXI.Application({
      backgroundColor: 0x0a0a0a,
      resizeTo: containerRef.current!,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    appRef.current = app;
    containerRef.current.appendChild(app.view as HTMLCanvasElement);

    // Generate static textures once
    texturesRef.current = {
      friend: createMilStdTexture(app.renderer, "friend", "Kirov"),
      enemy: createMilStdTexture(app.renderer, "enemy", "Kirov"),
      business: createMilStdTexture(app.renderer, "business", "Drone"),
      unknown: createMilStdTexture(app.renderer, "unknown", "Drone"),
      target: createTargetTexture(app.renderer),
    };

    return () => {
      app.destroy(true, { children: true });
      appRef.current = null;
      targetSpriteRef.current = null;
    };
  }, [props.started, containerRef]);

  /* ------------------------------------------
      TARGET MARKER (SPRITE VERSION)
  ------------------------------------------ */
  useEffect(() => {
    const app = appRef.current;
    if (!app || !props.started || !texturesRef.current?.target) return;

    if (!targetSpriteRef.current) {
      const sprite = new PIXI.Sprite(texturesRef.current.target);
      sprite.anchor.set(0.5);
      sprite.zIndex = 9999;
      targetSpriteRef.current = sprite;
      app.stage.addChild(sprite);
    }

    const sprite = targetSpriteRef.current;

    if (props.selectedLocation && props.activeTab === "moveAttack") {
      const pixiPos = worldToMap(
        props.selectedLocation.x,
        props.selectedLocation.y,
        app.screen.width,
        app.screen.height,
      );
      sprite.x = pixiPos.x;
      sprite.y = pixiPos.y;
      sprite.visible = true;
    } else {
      sprite.visible = false;
    }
  }, [props.selectedLocation, props.activeTab]);

  // // ✅ Fixed code
  // useEffect(() => {
  //   const app = appRef.current;
  //   if (!app || !props.started || !texturesRef.current?.target) return;

  //   let sprite = targetSpriteRef.current;
  //   if (!sprite) {
  //     sprite = new PIXI.Sprite(texturesRef.current.target);
  //     sprite.anchor.set(0.5);
  //     sprite.zIndex = 9999;
  //     targetSpriteRef.current = sprite;
  //     app.stage.addChild(sprite);
  //   }

  //   if (props.selectedLocation && props.activeTab === "moveAttack") {
  //     const pixiPos = worldToMap(
  //       props.selectedLocation.x,
  //       props.selectedLocation.y,
  //       app.screen.width,
  //       app.screen.height,
  //     );
  //     sprite.x = pixiPos.x;
  //     sprite.y = pixiPos.y;
  //     sprite.visible = true;
  //   } else {
  //     sprite.visible = false;
  //   }

  //   return () => {
  //     if (targetSpriteRef.current) {
  //       targetSpriteRef.current.visible = false;
  //     }
  //   };
  // }, [props.selectedLocation, props.activeTab, props.started]);

  /* ------------------------------------------
      DRAW MAP + OBJECTS + WAYPOINTS
  ------------------------------------------ */
  useEffect(() => {
    const app = appRef.current;
    if (!app || !props.started || !texturesRef.current) return;

    app.stage.removeChildren();
    app.stage.sortableChildren = true;

    const { width, height } = app.screen;
    const mapTexture = PIXI.Texture.from("/map.png");
    const sourceMapWidth = MAP_IMAGE_CONFIG.width;
    const sourceMapHeight = MAP_IMAGE_CONFIG.height;
    const scaleX = width / sourceMapWidth;

    const toScreenPoint = (x: number, y: number) => {
      if (x >= 0 && x <= sourceMapWidth && y >= 0 && y <= sourceMapHeight) {
        return {
          x: (x / sourceMapWidth) * width,
          y: (y / sourceMapHeight) * height,
        };
      }
      return worldToMap(x, y, width, height);
    };

    // 1. MAP BACKGROUND
    const bg = new PIXI.Sprite(mapTexture);
    bg.width = width;
    bg.height = height;
    // bg.interactive = true;
    bg.eventMode = "static";
    bg.on("pointerdown", (e) => {
      const world = mapToWorld(e.data.global.x, e.data.global.y, width, height);
      props.onMapClick(world);
    });
    app.stage.addChild(bg);
    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;

    app.stage.on("pointermove", (e) => {
      if (e.target === app.stage) props.onHoverObject(null);
    });

    // 2. DRAW OBJECTS & TRAILS
    props.objects.forEach((obj: CanonicalObject) => {
      const { x: px, y: py } = toScreenPoint(obj.x, obj.y);
      const isSelected = props.selectedSource === obj.id;
      const partyName = (obj.party || "unknown").toLowerCase();
      const unitType = obj.type || "Kirov";
      const colors =
        PARTY_COLORS[partyName as keyof typeof PARTY_COLORS] ||
        PARTY_COLORS.unknown;

      // --- DRAW TRAIL (For Missiles or objects with trail history) ---
      if (obj.trail && obj.trail.length > 1) {
        const trailGraphic = new PIXI.Graphics();
        trailGraphic.lineStyle(2, 0x1f5ed1, 0.8);

        for (let i = 0; i < obj.trail.length - 1; i++) {
          const start = toScreenPoint(obj.trail[i].x, obj.trail[i].y);
          const end = toScreenPoint(obj.trail[i + 1].x, obj.trail[i + 1].y);

          // Manual dashed line drawing
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const segments = Math.max(2, Math.floor(distance / 2));

          for (let j = 0; j < segments; j++) {
            if (j % 2 === 0) {
              const x1 = start.x + (dx * j) / segments;
              const y1 = start.y + (dy * j) / segments;
              const x2 = start.x + (dx * (j + 1)) / segments;
              const y2 = start.y + (dy * (j + 1)) / segments;
              trailGraphic.moveTo(x1, y1);
              trailGraphic.lineTo(x2, y2);
            }
          }
        }
        app.stage.addChild(trailGraphic);
      }

      // --- RADAR RANGES ---
      const radar = new PIXI.Graphics();
      // radar.interactive = false;
      radar.eventMode = "none";
      radar.zIndex = 0;
      radar.lineStyle(2, colors.glow, isSelected ? 0.6 : 0.25);
      radar.beginFill(colors.glow, isSelected ? 0.05 : 0.02);
      const radarRange =
        props.activeTab === "moveAttack"
          ? props.selectedRadius
          : WORLD_CONFIG.radarRangeUnreal;
      const rPx =
        (radarRange / (WORLD_CONFIG.maxX - WORLD_CONFIG.minX)) * width;
      radar.drawCircle(px, py, rPx);
      radar.endFill();
      app.stage.addChild(radar);

      // --- COMMUNICATION RANGES ---
      if (props.activeTab === "moveAttack") {
        const comm = new PIXI.Graphics();
        // comm.interactive = false;
        comm.eventMode = "none";
        comm.zIndex = 1;
        comm.lineStyle(2, 0x4cff6a, isSelected ? 0.75 : 0.45);
        comm.beginFill(0x4cff6a, isSelected ? 0.04 : 0.015);
        const commPx =
          (props.selectedCommunicationRadius /
            (WORLD_CONFIG.maxX - WORLD_CONFIG.minX)) *
          width;
        comm.drawCircle(px, py, commPx);
        comm.endFill();
        app.stage.addChild(comm);
      }

      // --- UNIT SYMBOL ---
      const cacheKey = `${partyName}_${unitType}`;
      if (!textureCache.current[cacheKey]) {
        textureCache.current[cacheKey] = createMilStdTexture(
          app.renderer,
          partyName,
          unitType,
        );
      }

      const ship = new PIXI.Sprite(textureCache.current[cacheKey]);
      ship.anchor.set(0.5);
      ship.scale.set(scaleX * 1.2);
      ship.position.set(px, py);
      ship.zIndex = 10;
      // ship.interactive = true;
      ship.eventMode = "static";
      ship.cursor = "pointer";
      ship.on("pointerover", () => props.onHoverObject(obj));
      ship.on("pointerout", () => props.onHoverObject(null));
      ship.on("pointerdown", (e) => {
        e.stopPropagation();
        props.onSelectSource(obj.id);
      });
      app.stage.addChild(ship);

      // --- TARGET MARKERS ---
      const targets = obj.targets || (obj.target ? [obj.target] : []);
      targets.forEach((t) => {
        if (t.x == null || t.y == null) return;
        const tPos = toScreenPoint(t.x, t.y);
        const enemyKey = `enemy_Kirov`;
        if (!textureCache.current[enemyKey]) {
          textureCache.current[enemyKey] = createMilStdTexture(
            app.renderer,
            "enemy",
            "Kirov",
          );
        }
        const enemyMarker = new PIXI.Sprite(textureCache.current[enemyKey]);
        enemyMarker.anchor.set(0.5);
        enemyMarker.scale.set(scaleX);
        enemyMarker.position.set(tPos.x, tPos.y);
        enemyMarker.zIndex = 10; // ← ADD  (always above all circles)
        // enemyMarker.interactive = true;
        enemyMarker.eventMode = "static";
        enemyMarker.on("pointerdown", (e) => {
          e.stopPropagation();
          if (t.id) props.onSelectEnemy(t.id);
        });
        app.stage.addChild(enemyMarker);
      });
    });
    props.wayPoints.forEach((point, index) => {
      const marker = new PIXI.Graphics();

      const pos = toScreenPoint(point.x, point.y);

      marker.beginFill(0xffff00);
      marker.drawCircle(pos.x, pos.y, 6);
      marker.endFill();

      app.stage.addChild(marker);

      // line to next point
      if (index < props.wayPoints.length - 1) {
        const next = props.wayPoints[index + 1];
        const nextPos = toScreenPoint(next.x, next.y);

        const line = new PIXI.Graphics();
        line.lineStyle(2, 0xffff00);

        line.moveTo(pos.x, pos.y);
        line.lineTo(nextPos.x, nextPos.y);

        app.stage.addChild(line);
      }
    });

    if (targetSpriteRef.current) app.stage.addChild(targetSpriteRef.current);
  }, [
    props.started,
    props.objects,
    props.activeTab,
    props.selectedSource,
    props.selectedEnemy,
    props.selectedRadius,
    props.selectedCommunicationRadius,
    props.selectedLocation,
    props.wayPoints,
  ]);

  return { appRef };
};
