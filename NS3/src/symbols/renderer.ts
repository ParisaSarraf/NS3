import * as PIXI from "pixi.js";
import type{ UnitType, Affiliation } from "../utils/types";
import { PARTY_COLORS } from "./constants";
import { resolveDomain } from "./generator";

type PixiRenderer = PIXI.Renderer | PIXI.IRenderer<PIXI.ICanvas>;

export class SymbolCache {
    private cache = new Map<string, PIXI.Texture>();

    getTexture(renderer: PixiRenderer, type: UnitType, affiliation: Affiliation): PIXI.Texture {
        const key = `${type}_${affiliation}`;
        if (!this.cache.has(key)) {
            this.cache.set(key, this.generate(renderer, type, affiliation));
        }
        return this.cache.get(key)!;
    }

    private generate(renderer: PixiRenderer, type: UnitType, affiliation: Affiliation): PIXI.Texture {
        const g = new PIXI.Graphics();
        const colors = PARTY_COLORS[affiliation];
        const domain = resolveDomain(type);

        // 1. Draw Frame (MIL-STD Shapes)
        g.lineStyle(2, colors.main);
        g.beginFill(colors.main, 0.2);
        
        if (affiliation === "enemy") {
            g.drawPolygon([0, -25, 25, 0, 0, 25, -25, 0]); // Diamond
        } else if (affiliation === "friend") {
            if (domain === "Air") g.drawEllipse(0, 0, 30, 20); // Arc top/bottom
            else g.drawRect(-25, -20, 50, 40); // Rectangle
        } else {
            g.drawRect(-22, -22, 44, 44); // Square (Neutral/Unknown)
        }
        g.endFill();

        // 2. Draw Internal Symbol
        g.lineStyle(2, 0xffffff);
        this.drawIcon(g, type);

        const tex = renderer.generateTexture(g, { resolution: 2 });
        g.destroy(true);
        return tex;
    }

    private drawIcon(g: PIXI.Graphics, type: UnitType) {
        switch (type) {
            case "Kuznetsov": // Carrier (Flat top with V)
                g.moveTo(-15, -5).lineTo(15, -5).moveTo(-5, -5).lineTo(0, 5).lineTo(5, -5);
                break;
            case "Akula": // Subsurface (Horizontal line)
                g.moveTo(-18, 0).lineTo(18, 0);
                break;
            case "Drone": // UAV (M-Shape)
                g.moveTo(-12, 5).lineTo(0, -5).lineTo(12, 5);
                break;
            default: // General Surface (Slash)
                g.moveTo(-10, 10).lineTo(10, -10);
        }
    }
}