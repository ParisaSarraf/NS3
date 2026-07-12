import { buildLabelHTML } from "./buildLabelHTML";
import maplibregl from "maplibre-gl";

export function createShipMarker(
  shipId: string,
  color: string,
  latency_ms: number,
  loss: number,
): maplibregl.Marker {
  const el = document.createElement("div");
  el.style.display = "flex";
  el.style.flexDirection = "column";
  el.style.alignItems = "center";
  el.style.cursor = "pointer";

  // Inject pulse + rotation keyframes once
  if (!document.getElementById("ship-pulse-style")) {
    const style = document.createElement("style");
    style.id = "ship-pulse-style";
    style.textContent = `
      @keyframes shipPulse {
        0%   { transform:scale(1);   opacity:0.6; }
        70%  { transform:scale(2.8); opacity:0;   }
        100% { transform:scale(1);   opacity:0;   }
      }
      @keyframes shipBob {
        0%, 100% { transform: translateY(0px);   }
        50%       { transform: translateY(-2px);  }
      }
      .ship-icon-wrap { animation: shipBob 3s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
  }

  // Pulse ring behind the ship
  const pulse = document.createElement("div");
  pulse.style.cssText = `
    position:absolute;
    width:28px; height:28px;
    border-radius:50%;
    border:1.5px solid ${color};
    animation:shipPulse 2.2s ease-out infinite;
    opacity:0.6;
    pointer-events:none;
    top:2px;
  `;

  // SVG ship icon wrapper
  const iconWrap = document.createElement("div");
  iconWrap.className = "ship-icon-wrap";
  iconWrap.style.cssText = `
    position:relative; z-index:1;
    width:32px; height:32px;
    display:flex; align-items:center; justify-content:center;
  `;

  // Ship SVG — top-down naval vessel silhouette
  iconWrap.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="ship-glow-${shipId}">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- Wake / water trail -->
      <ellipse cx="16" cy="27" rx="5" ry="2.5"
        fill="none" stroke="${color}" stroke-width="0.6" opacity="0.35"/>
      <ellipse cx="16" cy="29" rx="3" ry="1.5"
        fill="none" stroke="${color}" stroke-width="0.5" opacity="0.2"/>

      <!-- Hull (main body) -->
      <path d="M16,3 C13,3 10,5 9,8 L8,20 C8,22 11,25 16,25 C21,25 24,22 24,20 L23,8 C22,5 19,3 16,3 Z"
        fill="#0d1220" stroke="${color}" stroke-width="1.2"
        filter="url(#ship-glow-${shipId})"/>

      <!-- Deck center line -->
      <line x1="16" y1="5" x2="16" y2="23"
        stroke="${color}" stroke-width="0.5" opacity="0.4"/>

      <!-- Bridge / superstructure -->
      <rect x="12" y="10" width="8" height="7" rx="1.5"
        fill="${color}" opacity="0.85"/>

      <!-- Bridge windows -->
      <rect x="13" y="11.5" width="2" height="1.5" rx="0.4" fill="#0d1220" opacity="0.9"/>
      <rect x="17" y="11.5" width="2" height="1.5" rx="0.4" fill="#0d1220" opacity="0.9"/>
      <rect x="13" y="14" width="2" height="1.5" rx="0.4" fill="#0d1220" opacity="0.9"/>
      <rect x="17" y="14" width="2" height="1.5" rx="0.4" fill="#0d1220" opacity="0.9"/>

      <!-- Bow point -->
      <polygon points="16,2 14,6 18,6"
        fill="${color}" opacity="0.9"/>

      <!-- Mast / antenna -->
      <line x1="16" y1="4" x2="16" y2="1"
        stroke="${color}" stroke-width="1" stroke-linecap="round"/>
      <line x1="13" y1="2" x2="19" y2="2"
        stroke="${color}" stroke-width="0.7" stroke-linecap="round"/>

      <!-- Side details (port & starboard) -->
      <line x1="9" y1="14" x2="9" y2="19"
        stroke="${color}" stroke-width="0.6" opacity="0.5" stroke-linecap="round"/>
      <line x1="23" y1="14" x2="23" y2="19"
        stroke="${color}" stroke-width="0.6" opacity="0.5" stroke-linecap="round"/>

      <!-- Status dot (green=ok, amber=warn, red=critical) -->
      <circle cx="16" cy="8"
        r="1.5"
        fill="${latency_ms > 150 ? "#ef4444" : latency_ms > 80 ? "#f59e0b" : "#22d3ee"}"
        opacity="0.95"/>
    </svg>
  `;

  // Label below ship
  const label = document.createElement("div");
  label.className = "ship-label";
  label.style.cssText = `
    text-align:center;
    margin-top:3px;
    line-height:1.5;
    text-shadow:0 1px 4px rgba(0,0,0,0.95);
    font-family:'JetBrains Mono',monospace;
    white-space:nowrap;
  `;
  label.innerHTML = buildLabelHTML(shipId, color, latency_ms, loss);

  el.appendChild(pulse);
  el.appendChild(iconWrap);
  el.appendChild(label);

  return new maplibregl.Marker({ element: el, anchor: "top" });
}
