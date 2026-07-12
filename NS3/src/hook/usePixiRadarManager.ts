import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

export const usePixiRadarManager = (containerRef, props) => {
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!props.started || !containerRef.current) return;
    const app = new PIXI.Application({
      backgroundAlpha: 0,
      resizeTo: containerRef.current,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });
    appRef.current = app;
    containerRef.current.appendChild(app.view);
    return () => app.destroy(true, { children: true });
  }, [props.started]);

  useEffect(() => {
    const app = appRef.current;
    if (!app || !props.objects.length) return;
    const { width, height } = app.screen;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxScreenRadius = Math.min(width, height) / 2 - 20;
    app.stage.removeChildren();
    const originX = props.povObject ? props.povObject.x : 0;
    const originY = props.povObject ? props.povObject.y : 0;
    const relativeObjects = props.objects.map((obj) => {
      const dx = obj.x - originX;
      const dy = obj.y - originY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return { ...obj, dx, dy, distance };
    });
    const furthest = Math.max(...relativeObjects.map((o) => o.distance), 1000);
    const scaleFactor = maxScreenRadius / furthest;
    const grid = new PIXI.Graphics();
    grid.lineStyle(1, 0x4cff6a, 0.2);
    [0.25, 0.5, 0.75, 1].forEach((p) => {
      grid.drawCircle(centerX, centerY, maxScreenRadius * p);
    });
    app.stage.addChild(grid);
    relativeObjects.forEach((obj) => {
      const screenX = centerX + obj.dx * scaleFactor;
      const screenY = centerY + obj.dy * scaleFactor;
      const blip = new PIXI.Graphics();
      const isPOV = props.povObject && obj.id === props.povObject.id;
      const color = isPOV
        ? 0xffffff
        : obj.party === "friend"
          ? 0x4cff6a
          : 0xff4c4c;
      blip.beginFill(color, 1);
      blip.drawCircle(screenX, screenY, isPOV ? 6 : 4);
      blip.endFill();
      if (isPOV) {
        blip.lineStyle(2, 0x4cff6a, 0.8);
        blip.drawCircle(screenX, screenY, 12);
      }
      app.stage.addChild(blip);
    });
  }, [props.objects, props.povObject]);
};
