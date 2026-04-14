import { useState, useMemo, useEffect, useCallback, useRef } from "react";

// ─── Clean Off-White Palette ─────────────────────────────────────────────────
const C = {
  bg: "#f8f7f4",
  bgCard: "#ffffff",
  bgHover: "#fafaf8",
  bgSidebar: "#f1f0ed",
  accent: "#2563eb",
  accentLight: "#eff4ff",
  accentDark: "#1d4ed8",
  green: "#16a34a",
  greenLight: "#f0fdf4",
  red: "#dc2626",
  redLight: "#fef2f2",
  gold: "#ca8a04",
  goldLight: "#fefce8",
  orange: "#ea580c",
  text: "#1a1a1a",
  textSec: "#4b5563",
  textMuted: "#9ca3af",
  border: "#e5e5e3",
  borderFocus: "#2563eb",
};

// ─── SVG Diagrams ────────────────────────────────────────────────────────────

function CompassRose({ size = 240 }) {
  const pad = size * 0.18;
  const full = size + pad * 2;
  const cx = full / 2, cy = full / 2, r = size * 0.34;
  const dirs = ["N","NE","E","SE","S","SW","W","NW"];
  const degrees = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg width={full} height={full} viewBox={`0 0 ${full} ${full}`}>
      <circle cx={cx} cy={cy} r={r + 12} fill="none" stroke={C.border} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#94a3b8" strokeWidth="1" />
      {/* Degree ticks every 10° */}
      {Array.from({ length: 36 }, (_, i) => {
        const a = i * 10;
        const rad = (a - 90) * Math.PI / 180;
        const isMajor = a % 30 === 0;
        const inner = isMajor ? r * 0.86 : r * 0.93;
        return (
          <line key={a}
            x1={cx + Math.cos(rad) * inner} y1={cy + Math.sin(rad) * inner}
            x2={cx + Math.cos(rad) * r} y2={cy + Math.sin(rad) * r}
            stroke="#94a3b8" strokeWidth={isMajor ? 1.2 : 0.5} />
        );
      })}
      {/* Cardinal & intercardinal lines + labels */}
      {degrees.map((a, i) => {
        const rad = (a - 90) * Math.PI / 180;
        const isCardinal = i % 2 === 0;
        const len = isCardinal ? r * 0.86 : r * 0.55;
        const x2 = cx + Math.cos(rad) * len;
        const y2 = cy + Math.sin(rad) * len;
        const nameR = r + 22;
        const degR = r + 36;
        const nx = cx + Math.cos(rad) * nameR;
        const ny = cy + Math.sin(rad) * nameR;
        const dx = cx + Math.cos(rad) * degR;
        const dy = cy + Math.sin(rad) * degR;
        return (
          <g key={dirs[i]}>
            <line x1={cx} y1={cy} x2={x2} y2={y2}
              stroke={i === 0 ? C.red : isCardinal ? "#334155" : "#cbd5e1"}
              strokeWidth={isCardinal ? 2 : 1} />
            <text x={nx} y={ny} textAnchor="middle" dominantBaseline="middle"
              fill={i === 0 ? C.red : isCardinal ? C.text : C.textMuted}
              fontSize={isCardinal ? 13 : 10} fontWeight={isCardinal ? 700 : 400}
              fontFamily="system-ui, sans-serif">
              {dirs[i]}
            </text>
            <text x={dx} y={dy} textAnchor="middle" dominantBaseline="middle"
              fill={C.textMuted} fontSize={9} fontFamily="system-ui, sans-serif">
              {a}°
            </text>
          </g>
        );
      })}
      <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
        fill={C.textMuted} fontSize={8} fontFamily="system-ui">COMPASS</text>
    </svg>
  );
}

function CardinalMarkSVG({ direction, size = 80, showLabel = true }) {
  const w = size, h = size * 1.4;
  const cx = w / 2;
  const triH = 10, triW = 9, gap = 2;
  const baseY = 16;
  const bodyTop = 34, bodyH = 48, bodyW = 18;

  // Topmark patterns (no transforms — explicit geometry):
  // N = ▲▲  S = ▼▼  E = ▲▼ (egg/base-to-base)  W = ▼▲ (wine glass/point-to-point)
  const t1 = baseY;           // top of first cone zone
  const t2 = baseY + triH + gap; // top of second cone zone
  const topmarks = {
    N: (<g>{/* ▲▲ both pointing up */}
      <polygon points={`${cx},${t1 - triH} ${cx - triW / 2},${t1} ${cx + triW / 2},${t1}`} fill="#111" stroke="#111" strokeWidth="0.5" />
      <polygon points={`${cx},${t2 - triH} ${cx - triW / 2},${t2} ${cx + triW / 2},${t2}`} fill="#111" stroke="#111" strokeWidth="0.5" />
    </g>),
    S: (<g>{/* ▼▼ both pointing down */}
      <polygon points={`${cx},${t1 + triH} ${cx - triW / 2},${t1} ${cx + triW / 2},${t1}`} fill="#111" stroke="#111" strokeWidth="0.5" />
      <polygon points={`${cx},${t2 + triH} ${cx - triW / 2},${t2} ${cx + triW / 2},${t2}`} fill="#111" stroke="#111" strokeWidth="0.5" />
    </g>),
    E: (<g>{/* ▲▼ base-to-base (egg) */}
      <polygon points={`${cx},${t1 - triH} ${cx - triW / 2},${t1} ${cx + triW / 2},${t1}`} fill="#111" stroke="#111" strokeWidth="0.5" />
      <polygon points={`${cx},${t1 + gap + triH} ${cx - triW / 2},${t1 + gap} ${cx + triW / 2},${t1 + gap}`} fill="#111" stroke="#111" strokeWidth="0.5" />
    </g>),
    W: (<g>{/* ▼▲ point-to-point (wine glass) */}
      <polygon points={`${cx},${t1 + triH} ${cx - triW / 2},${t1} ${cx + triW / 2},${t1}`} fill="#111" stroke="#111" strokeWidth="0.5" />
      <polygon points={`${cx},${t1 + gap} ${cx - triW / 2},${t1 + gap + triH} ${cx + triW / 2},${t1 + gap + triH}`} fill="#111" stroke="#111" strokeWidth="0.5" />
    </g>),
  };

  // Body colours (top → bottom): black is where the cones point
  const bodyPatterns = {
    N: [["#111", 0], ["#f5c518", 0.5]],          // black top, yellow bottom
    S: [["#f5c518", 0], ["#111", 0.5]],           // yellow top, black bottom
    E: [["#111", 0], ["#f5c518", 0.33], ["#111", 0.66]], // black-yellow-black
    W: [["#f5c518", 0], ["#111", 0.33], ["#f5c518", 0.66]], // yellow-black-yellow
  };

  const lightInfo = { N: "Q / VQ", S: "Q(6)+LFl", E: "Q(3) / VQ(3)", W: "Q(9) / VQ(9)" };
  const mnemonics = { N: "Points up", S: "Points down", E: "Egg", W: "Wine glass" };

  return (
    <div style={{ textAlign: "center", minWidth: 72 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {bodyPatterns[direction].map(([color, start], i, arr) => {
          const nextStart = i < arr.length - 1 ? arr[i + 1][1] : 1;
          return (
            <rect key={i} x={cx - bodyW / 2} y={bodyTop + start * bodyH}
              width={bodyW} height={(nextStart - start) * bodyH}
              fill={color} stroke="#888" strokeWidth="0.5" />
          );
        })}
        {topmarks[direction]}
      </svg>
      {showLabel && <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{direction}</div>}
      {showLabel && <div style={{ fontSize: 10, color: C.textMuted }}>{mnemonics[direction]}</div>}
      {showLabel && <div style={{ fontSize: 10, color: C.accent }}>{lightInfo[direction]}</div>}
    </div>
  );
}

function NavLightsSVG({ vesselType, size = 130 }) {
  // Ahead view: ship's port (red) appears on viewer's RIGHT (x:90), starboard (green) on LEFT (x:30)
  const configs = {
    sailing: { label: "Sailing Vessel", lights: [
      { color: "#dc2626", x: 90, y: 48, r: 5 },
      { color: "#16a34a", x: 30, y: 48, r: 5 },
      { color: "#fff", x: 60, y: 78, r: 5, stroke: "#aaa" },
    ]},
    motor: { label: "Motor Vessel <50m", lights: [
      { color: "#fff", x: 60, y: 20, r: 5, stroke: "#aaa" },
      { color: "#dc2626", x: 90, y: 48, r: 5 },
      { color: "#16a34a", x: 30, y: 48, r: 5 },
      { color: "#fff", x: 60, y: 78, r: 5, stroke: "#aaa" },
    ]},
    trawler: { label: "Trawler", lights: [
      { color: "#16a34a", x: 60, y: 14, r: 5 },
      { color: "#fff", x: 60, y: 30, r: 5, stroke: "#aaa" },
      { color: "#dc2626", x: 90, y: 52, r: 5 },
      { color: "#16a34a", x: 30, y: 52, r: 5 },
      { color: "#fff", x: 60, y: 78, r: 5, stroke: "#aaa" },
    ]},
    nuc: { label: "Not Under Command", lights: [
      { color: "#dc2626", x: 60, y: 14, r: 5 },
      { color: "#dc2626", x: 60, y: 30, r: 5 },
      { color: "#dc2626", x: 90, y: 52, r: 5 },
      { color: "#16a34a", x: 30, y: 52, r: 5 },
    ]},
    ram: { label: "Restricted Manoeuvrability", lights: [
      { color: "#dc2626", x: 60, y: 10, r: 5 },
      { color: "#fff", x: 60, y: 26, r: 5, stroke: "#aaa" },
      { color: "#dc2626", x: 60, y: 42, r: 5 },
      { color: "#dc2626", x: 90, y: 62, r: 5 },
      { color: "#16a34a", x: 30, y: 62, r: 5 },
    ]},
  };
  const cfg = configs[vesselType];
  if (!cfg) return null;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size * 0.75} viewBox="0 0 120 95">
        <ellipse cx={60} cy={48} rx={38} ry={28} fill="none" stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />
        {cfg.lights.map((l, i) => (
          <g key={i}>
            <circle cx={l.x} cy={l.y} r={l.r + 4} fill={l.color} opacity={0.15} />
            <circle cx={l.x} cy={l.y} r={l.r} fill={l.color} stroke={l.stroke || l.color} strokeWidth="0.5" />
          </g>
        ))}
        <polygon points="60,82 55,90 65,90" fill={C.textMuted} opacity={0.4} />
      </svg>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{cfg.label}</div>
    </div>
  );
}

function LateralMarksSVG() {
  return (
    <svg width={240} height={110} viewBox="0 0 240 110">
      <rect x={35} y={25} width={28} height={50} rx={3} fill="#dc2626" />
      <text x={49} y={92} textAnchor="middle" fill={C.text} fontSize={11} fontWeight="600" fontFamily="system-ui">Port</text>
      <text x={49} y={104} textAnchor="middle" fill={C.textMuted} fontSize={9} fontFamily="system-ui">Red, can</text>
      <polygon points="170,25 184,75 156,75" fill="#16a34a" />
      <text x={170} y={92} textAnchor="middle" fill={C.text} fontSize={11} fontWeight="600" fontFamily="system-ui">Starboard</text>
      <text x={170} y={104} textAnchor="middle" fill={C.textMuted} fontSize={9} fontFamily="system-ui">Green, cone</text>
      <text x={120} y={14} textAnchor="middle" fill={C.textMuted} fontSize={9} fontFamily="system-ui">Direction from sea →</text>
      <line x1={108} y1={50} x2={132} y2={50} stroke={C.textMuted} strokeWidth="1" strokeDasharray="3,2" />
    </svg>
  );
}

function InteractiveCurrentTriangle() {
  const W = 700, H = 420;
  const [ptA, setPtA] = useState({ x: 100, y: 350 });
  const [ptB, setPtB] = useState({ x: 560, y: 90 });
  const [driftSpd, setDriftSpd] = useState(1.5);
  const [setDir, setSetDir] = useState(160);
  const [lwAngle, setLwAngle] = useState(5);
  const [windFrom, setWindFrom] = useState("port");
  const [bSpd, setBSpd] = useState(5);
  const [mvVal, setMvVal] = useState(3.0);
  const [mvD, setMvD] = useState("W");
  const [dvVal, setDvVal] = useState(2.0);
  const [dvD, setDvD] = useState("W");
  const [dragging, setDragging] = useState(null);
  const svgRef = useRef(null);

  const sc = 38;

  // --- Calculations ---
  // COG: bearing A→B (nautical 0°=N clockwise)
  const cog = ((Math.atan2(ptB.x - ptA.x, ptA.y - ptB.y) * 180 / Math.PI) + 360) % 360;

  // Current vector in SVG coords (set = direction current flows TOWARD)
  const sRad = setDir * Math.PI / 180;
  const curV = { x: driftSpd * sc * Math.sin(sRad), y: -driftSpd * sc * Math.cos(sRad) };

  // Bcomp: aim point through water = B minus current vector
  // Triangle: A→Bcomp (water) + Bcomp→B (current) = A→B (ground)
  const ptBc = { x: ptB.x - curV.x, y: ptB.y - curV.y };
  // Bdrift: where you'd end up uncorrected = B plus current vector
  const ptBd = { x: ptB.x + curV.x, y: ptB.y + curV.y };

  // CTW: bearing A→Bcomp (course through water, corrected for current)
  const ctw = ((Math.atan2(ptBc.x - ptA.x, ptA.y - ptBc.y) * 180 / Math.PI) + 360) % 360;

  // CTS: CTW ± leeway (wind from port → drift starboard → steer more to port → subtract)
  const lwS = windFrom === "port" ? -1 : 1;
  const cts = ((ctw + lwS * lwAngle) + 360) % 360;

  // True → Compass (TVMDC): M = True − Var_signed, CC = M − Dev_signed
  // where signed: East = +, West = −. "Error West Compass Best" → CC > True for West.
  const mvSigned = mvD === "E" ? mvVal : -mvVal;
  const dvSigned = dvD === "E" ? dvVal : -dvVal;
  const cmVal = ((cts - mvSigned) + 360) % 360;
  const ccVal = ((cmVal - dvSigned) + 360) % 360;

  // SOG via vector addition
  const ctwR = ctw * Math.PI / 180;
  const sogVal = Math.sqrt(
    (bSpd * Math.sin(ctwR) + driftSpd * Math.sin(sRad)) ** 2 +
    (bSpd * Math.cos(ctwR) + driftSpd * Math.cos(sRad)) ** 2
  );

  // CTS direction indicator from A (proportional to triangle size)
  const ctsR = cts * Math.PI / 180;
  const distABc = Math.sqrt((ptBc.x - ptA.x) ** 2 + (ptBc.y - ptA.y) ** 2);
  const ctsLen = Math.max(120, distABc * 0.55);
  const ptCtsEnd = { x: ptA.x + ctsLen * Math.sin(ctsR), y: ptA.y - ctsLen * Math.cos(ctsR) };

  // Leeway arc (bigger for visibility)
  const arcR = 70;
  const ctwEnd = { x: ptA.x + arcR * Math.sin(ctwR), y: ptA.y - arcR * Math.cos(ctwR) };
  const ctsArc = { x: ptA.x + arcR * Math.sin(ctsR), y: ptA.y - arcR * Math.cos(ctsR) };

  // --- Drag handlers (mouse + touch) ---
  const getSvgPt = useCallback((e) => {
    if (!svgRef.current) return null;
    const r = svgRef.current.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.max(20, Math.min(W - 20, (cx - r.left) * W / r.width)),
      y: Math.max(20, Math.min(H - 20, (cy - r.top) * H / r.height)),
    };
  }, []);

  const onMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    const p = getSvgPt(e);
    if (!p) return;
    if (dragging === "A") setPtA(p);
    else if (dragging === "B") setPtB(p);
  }, [dragging, getSvgPt]);

  const onEnd = useCallback(() => setDragging(null), []);

  const arrowH = (fx, fy, tx, ty, s = 10) => {
    const a = Math.atan2(ty - fy, tx - fx);
    return `${tx},${ty} ${tx - s * Math.cos(a - 0.4)},${ty - s * Math.sin(a - 0.4)} ${tx - s * Math.cos(a + 0.4)},${ty - s * Math.sin(a + 0.4)}`;
  };

  // Literal colours (avoid shadowing global C)
  const blue = "#2563eb", red = "#dc2626", grn = "#16a34a", gold = "#ca8a04";
  const purp = "#7c3aed", muted = "#64748b", txt = "#1e293b", bdr = "#e2e8f0";

  const pill = (label, active, onClick, color) => (
    <button onClick={onClick} style={{
      padding: "3px 10px", borderRadius: 12, border: `1.5px solid ${active ? color : bdr}`,
      background: active ? color + "18" : "#fff", color: active ? color : muted,
      fontSize: 10, fontWeight: 700, cursor: "pointer", lineHeight: 1.4,
    }}>{label}</button>
  );

  const fmt = (v) => Math.round(v) + "°";
  const fmt3 = (v) => String(Math.round(v)).padStart(3, "0") + "°";

  // Current angle difference (handles 360° wrap)
  const curDiff = Math.round(Math.min(Math.abs(cog - ctw), 360 - Math.abs(cog - ctw)));

  // Correction chain data
  const chain = [
    { label: "COG", value: fmt3(cog), sub: "Ground track", color: blue },
    { op: driftSpd > 0 ? `${curDiff}° current` : "no current", color: red },
    { label: "CTW", value: fmt3(ctw), sub: "Through water", color: grn },
    { op: lwAngle > 0 ? `${lwAngle}° leeway` : "no leeway", color: gold },
    { label: "CTS", value: fmt3(cts), sub: "Course to steer", color: grn },
    { op: `${mvVal}°${mvD} var`, color: purp },
    { label: "CM", value: fmt3(cmVal), sub: "Magnetic", color: gold },
    { op: `${dvVal}°${dvD} dev`, color: purp },
    { label: "CC", value: fmt3(ccVal), sub: "Compass course", color: red },
  ];

  // Slider row helper
  const sliderRow = (label, value, min, max, step, onChange, color, suffix = "") => (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ color: muted, fontSize: 10 }}>{label}</span>
        <span style={{ color, fontSize: 11, fontWeight: 700 }}>{typeof value === "number" ? (Number.isInteger(step) ? value : value.toFixed(1)) : value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={onChange} style={{ width: "100%", accentColor: color, cursor: "pointer", height: 4 }} />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* --- SVG Diagram --- */}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", maxWidth: W, aspectRatio: `${W}/${H}`, background: "#e8f0fe",
          borderRadius: 10, border: `1px solid ${bdr}`, cursor: dragging ? "grabbing" : "default", userSelect: "none", touchAction: "none" }}
        onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
        onTouchMove={onMove} onTouchEnd={onEnd} onTouchCancel={onEnd}
      >
        {/* Grid dots */}
        {Array.from({ length: 17 }, (_, i) => Array.from({ length: 10 }, (_, j) => (
          <circle key={`${i}-${j}`} cx={i * 42 + 14} cy={j * 42 + 14} r={1} fill="#b0c4de" opacity={0.4} />
        )))}

        {/* North arrow */}
        <line x1={30} y1={38} x2={30} y2={14} stroke={txt} strokeWidth={1.5} />
        <polygon points="30,10 26,18 34,18" fill={txt} />
        <text x={30} y={48} textAnchor="middle" fill={txt} fontSize={10} fontWeight="700" fontFamily="system-ui">N</text>

        {/* Legend */}
        <rect x={W - 235} y={6} width={227} height={72} rx={6} fill="white" fillOpacity={0.9} stroke={bdr} strokeWidth={0.5} />
        <line x1={W - 225} y1={20} x2={W - 205} y2={20} stroke={blue} strokeWidth={2} />
        <text x={W - 200} y={24} fill={muted} fontSize={10} fontFamily="system-ui">Desired ground track (COG)</text>
        <line x1={W - 225} y1={36} x2={W - 205} y2={36} stroke={red} strokeWidth={2.5} strokeDasharray="5,3" />
        <text x={W - 200} y={40} fill={muted} fontSize={10} fontFamily="system-ui">Current (set & drift)</text>
        <line x1={W - 225} y1={52} x2={W - 205} y2={52} stroke={grn} strokeWidth={3} />
        <text x={W - 200} y={56} fill={muted} fontSize={10} fontFamily="system-ui">Course through water (CTW)</text>
        <line x1={W - 225} y1={68} x2={W - 205} y2={68} stroke={gold} strokeWidth={2.5} strokeDasharray="4,3" />
        <text x={W - 200} y={72} fill={muted} fontSize={10} fontFamily="system-ui">Course to steer (CTS)</text>

        {/* 1. Desired ground track A→B (blue, thinner to distinguish from CTW) */}
        <line x1={ptA.x} y1={ptA.y} x2={ptB.x} y2={ptB.y} stroke={blue} strokeWidth={2} opacity={0.55} />
        <polygon points={arrowH(ptA.x, ptA.y, ptB.x, ptB.y)} fill={blue} opacity={0.55} />

        {/* 2. Uncorrected drift: B→Bdrift (faded, "where you'd end up") */}
        {driftSpd > 0 && <>
          <line x1={ptB.x} y1={ptB.y} x2={ptBd.x} y2={ptBd.y} stroke={red} strokeWidth={1.5} strokeDasharray="4,4" opacity={0.3} />
          <polygon points={arrowH(ptB.x, ptB.y, ptBd.x, ptBd.y, 7)} fill={red} opacity={0.3} />
          <text x={ptBd.x + 6} y={ptBd.y + 4} fill={red} fontSize={9} fontFamily="system-ui" opacity={0.45}>
            uncorrected
          </text>
        </>}

        {/* 3. Current correction vector: Bcomp→B (red dashed) */}
        {driftSpd > 0 && <>
          <line x1={ptBc.x} y1={ptBc.y} x2={ptB.x} y2={ptB.y} stroke={red} strokeWidth={2.5} strokeDasharray="6,4" />
          <polygon points={arrowH(ptBc.x, ptBc.y, ptB.x, ptB.y)} fill={red} />
        </>}

        {/* 4. Water track A→Bcomp (green, CTW) — thicker, main line */}
        <line x1={ptA.x} y1={ptA.y} x2={ptBc.x} y2={ptBc.y} stroke={grn} strokeWidth={3} />
        <polygon points={arrowH(ptA.x, ptA.y, ptBc.x, ptBc.y, 11)} fill={grn} />

        {/* 5. CTS direction from A (gold dashed, longer and more visible) */}
        {lwAngle > 0 && (
          <>
            <line x1={ptA.x} y1={ptA.y} x2={ptCtsEnd.x} y2={ptCtsEnd.y} stroke={gold} strokeWidth={2.5} strokeDasharray="6,4" />
            <polygon points={arrowH(ptA.x, ptA.y, ptCtsEnd.x, ptCtsEnd.y, 9)} fill={gold} />
            {/* Leeway arc + label */}
            <path d={`M ${ctwEnd.x} ${ctwEnd.y} A ${arcR} ${arcR} 0 0 ${lwS < 0 ? 0 : 1} ${ctsArc.x} ${ctsArc.y}`}
              fill={gold + "15"} stroke={gold} strokeWidth={2} opacity={0.8} />
            <text x={(ctwEnd.x + ctsArc.x) / 2 + (lwS < 0 ? -22 : 12)}
              y={(ctwEnd.y + ctsArc.y) / 2 + 2}
              fill={gold} fontSize={11} fontWeight="700" fontFamily="system-ui">{lwAngle}° leeway</text>
          </>
        )}

        {/* Bearing readout panel (bottom-right of SVG) */}
        <rect x={W - 140} y={H - 86} width={130} height={74} rx={6} fill="white" fillOpacity={0.92} stroke={bdr} strokeWidth={0.5} />
        <text x={W - 130} y={H - 68} fill={blue} fontSize={12} fontWeight="700" fontFamily="system-ui">COG {fmt3(cog)}</text>
        <text x={W - 130} y={H - 52} fill={grn} fontSize={12} fontWeight="700" fontFamily="system-ui">CTW {fmt3(ctw)}</text>
        <text x={W - 130} y={H - 36} fill={gold} fontSize={12} fontWeight="700" fontFamily="system-ui">CTS  {fmt3(cts)}</text>
        <text x={W - 130} y={H - 20} fill={muted} fontSize={11} fontWeight="600" fontFamily="system-ui">SOG  {sogVal.toFixed(1)} kn</text>

        {/* Draggable A */}
        <circle cx={ptA.x} cy={ptA.y} r={10} fill={txt} stroke="white" strokeWidth={2}
          style={{ cursor: "grab" }}
          onMouseDown={() => setDragging("A")}
          onTouchStart={(e) => { e.preventDefault(); setDragging("A"); }} />
        <text x={ptA.x - 18} y={ptA.y + 24} fill={txt} fontSize={14} fontWeight="700" fontFamily="system-ui">A</text>

        {/* Draggable B */}
        <circle cx={ptB.x} cy={ptB.y} r={10} fill={blue} stroke="white" strokeWidth={2}
          style={{ cursor: "grab" }}
          onMouseDown={() => setDragging("B")}
          onTouchStart={(e) => { e.preventDefault(); setDragging("B"); }} />
        <text x={ptB.x + 14} y={ptB.y - 4} fill={blue} fontSize={14} fontWeight="700" fontFamily="system-ui">B</text>

        {/* Bcomp point */}
        {driftSpd > 0 && <circle cx={ptBc.x} cy={ptBc.y} r={5} fill={grn} stroke="white" strokeWidth={1.5} />}

        {/* Instruction */}
        <text x={W / 2} y={H - 8} textAnchor="middle" fill={muted} fontSize={10} fontFamily="system-ui" opacity={0.55}>
          Drag A and B to set your desired ground track
        </text>
      </svg>

      {/* --- Controls (3 columns, more spacious) --- */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, background: "#fff",
        padding: "16px 20px", borderRadius: 10, border: `1px solid ${bdr}` }}>

        {/* Current */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: red, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", width: 12, height: 3, background: red, borderRadius: 2 }} />
            Current (set & drift)
          </div>
          {sliderRow("Drift speed", driftSpd, 0, 3, 0.1, (e) => setDriftSpd(parseFloat(e.target.value)), red, " kn")}
          {sliderRow("Set direction", setDir, 0, 359, 1, (e) => setSetDir(parseInt(e.target.value)), red, "°")}
        </div>

        {/* Leeway & boat speed */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: gold, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", width: 12, height: 3, background: gold, borderRadius: 2 }} />
            Leeway & boat speed
          </div>
          {sliderRow("Leeway angle", lwAngle, 0, 15, 1, (e) => setLwAngle(parseInt(e.target.value)), gold, "°")}
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: muted }}>Wind from:</span>
            {pill("Port", windFrom === "port", () => setWindFrom("port"), gold)}
            {pill("Starboard", windFrom === "starboard", () => setWindFrom("starboard"), gold)}
          </div>
          {sliderRow("Boat speed (STW)", bSpd, 1, 10, 0.1, (e) => setBSpd(parseFloat(e.target.value)), grn, " kn")}
        </div>

        {/* Compass corrections */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: purp, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", width: 12, height: 3, background: purp, borderRadius: 2 }} />
            Compass corrections (TVMDC)
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: muted, minWidth: 60 }}>Variation</span>
              <input type="range" min="0" max="10" step="0.5" value={mvVal}
                onChange={(e) => setMvVal(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: purp, cursor: "pointer" }} />
              <span style={{ fontSize: 11, fontWeight: 700, width: 32, color: purp, textAlign: "right" }}>{mvVal}°</span>
              {pill("E", mvD === "E", () => setMvD("E"), purp)}
              {pill("W", mvD === "W", () => setMvD("W"), purp)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: muted, minWidth: 60 }}>Deviation</span>
              <input type="range" min="0" max="10" step="0.5" value={dvVal}
                onChange={(e) => setDvVal(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: purp, cursor: "pointer" }} />
              <span style={{ fontSize: 11, fontWeight: 700, width: 32, color: purp, textAlign: "right" }}>{dvVal}°</span>
              {pill("E", dvD === "E", () => setDvD("E"), purp)}
              {pill("W", dvD === "W", () => setDvD("W"), purp)}
            </div>
          </div>
        </div>
      </div>

      {/* --- Correction Chain: COG → CTW → CTS → CM → CC (prominent, full width) --- */}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, minWidth: "max-content",
          background: "#fff", padding: "14px 20px", borderRadius: 10, border: `1px solid ${bdr}` }}>
          {chain.map((item, i) => item.label ? (
            <div key={i} style={{ textAlign: "center", minWidth: 76, padding: "10px 14px",
              borderRadius: 10, border: `2px solid ${item.color}30`, background: item.color + "08" }}>
              <div style={{ fontSize: 10, color: muted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em", marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: item.color, fontFamily: "system-ui" }}>{item.value}</div>
              <div style={{ fontSize: 9, color: muted, marginTop: 2 }}>{item.sub}</div>
            </div>
          ) : (
            <div key={i} style={{ textAlign: "center", padding: "0 6px", color: item.color, lineHeight: 1.3 }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>→</div>
              <div style={{ fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{item.op}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CurrentTriangleDiagram() {
  /* Current drift shown at B (destination), matching the interactive calculator approach.
     Triangle: A→Bc (water track / CTW) + Bc→B (current) = A→B (ground track / COG) */
  const A = { x: 40, y: 260 };
  const B = { x: 340, y: 50 };
  /* Current pushes ~south-east: Bc is B shifted opposite to current */
  const Bc = { x: 280, y: 130 };
  /* Bdrift: where you'd end up uncorrected (B + current vector) */
  const Bd = { x: 400, y: -30 };
  const arrow = (fx, fy, tx, ty) => {
    const a = Math.atan2(ty - fy, tx - fx), s = 10;
    return `${tx},${ty} ${tx - s * Math.cos(a - 0.35)},${ty - s * Math.sin(a - 0.35)} ${tx - s * Math.cos(a + 0.35)},${ty - s * Math.sin(a + 0.35)}`;
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={420} height={300} viewBox="-10 -40 430 310">
        {/* Legend */}
        <rect x={-5} y={-35} width={260} height={58} rx={5} fill="white" fillOpacity={0.85} stroke="#e2e8f0" strokeWidth={0.5} />
        <line x1={6} y1={-18} x2={26} y2={-18} stroke={C.accent} strokeWidth="2.5" />
        <text x={32} y={-14} fill={C.textSec} fontSize={10} fontFamily="system-ui">Desired ground track (COG)</text>
        <line x1={6} y1={-2} x2={26} y2={-2} stroke={C.red} strokeWidth="2.5" strokeDasharray="5,3" />
        <text x={32} y={2} fill={C.textSec} fontSize={10} fontFamily="system-ui">Current (set & drift)</text>
        <line x1={6} y1={14} x2={26} y2={14} stroke="#16a34a" strokeWidth="2.5" />
        <text x={32} y={18} fill={C.textSec} fontSize={10} fontFamily="system-ui">Course through water (CTW)</text>

        {/* 1. Ground track A→B (blue) */}
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={C.accent} strokeWidth="2.5" />
        <polygon points={arrow(A.x, A.y, B.x, B.y)} fill={C.accent} />

        {/* 2. Drift indicator B→Bd (faded, "uncorrected") */}
        <line x1={B.x} y1={B.y} x2={Bd.x} y2={Bd.y} stroke={C.red} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.35" />
        <text x={Bd.x - 10} y={Bd.y + 16} fill={C.red} fontSize={9} opacity="0.5" fontFamily="system-ui">uncorrected</text>

        {/* 3. Current correction Bc→B (red dashed) */}
        <line x1={Bc.x} y1={Bc.y} x2={B.x} y2={B.y} stroke={C.red} strokeWidth="2.5" strokeDasharray="6,4" />
        <polygon points={arrow(Bc.x, Bc.y, B.x, B.y)} fill={C.red} />

        {/* 4. Water track A→Bc (green, CTW) */}
        <line x1={A.x} y1={A.y} x2={Bc.x} y2={Bc.y} stroke="#16a34a" strokeWidth="2.5" />
        <polygon points={arrow(A.x, A.y, Bc.x, Bc.y)} fill="#16a34a" />

        {/* Labels */}
        <text x={155} y={175} fill={C.accent} fontSize={11} fontWeight="600" fontFamily="system-ui"
          transform="rotate(-35,155,175)">Ground track (COG)</text>
        <text x={320} y={100} fill={C.red} fontSize={10} fontWeight="600" fontFamily="system-ui">Current</text>
        <text x={120} y={210} fill="#16a34a" fontSize={11} fontWeight="600" fontFamily="system-ui"
          transform="rotate(-28,120,210)">Water track (CTW)</text>

        {/* Points */}
        <circle cx={A.x} cy={A.y} r={5} fill={C.text} />
        <text x={22} y={280} fill={C.text} fontSize={13} fontWeight="700" fontFamily="system-ui">A</text>
        <circle cx={B.x} cy={B.y} r={5} fill={C.accent} />
        <text x={B.x + 10} y={B.y - 8} fill={C.accent} fontSize={13} fontWeight="700" fontFamily="system-ui">B</text>
        <circle cx={Bc.x} cy={Bc.y} r={4} fill="#16a34a" stroke="#fff" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// ─── Interactive Calculators & Tables ─────────────────────────────────────────

// Deviation table — typical exam-style card for a specific vessel/compass
const DEVIATION_TABLE = [
  { heading: 0,   dev: 2.0, dir: "E" },
  { heading: 15,  dev: 2.5, dir: "E" },
  { heading: 30,  dev: 3.0, dir: "E" },
  { heading: 45,  dev: 3.0, dir: "E" },
  { heading: 60,  dev: 2.5, dir: "E" },
  { heading: 75,  dev: 1.5, dir: "E" },
  { heading: 90,  dev: 0.5, dir: "E" },
  { heading: 105, dev: 0.5, dir: "W" },
  { heading: 120, dev: 2.0, dir: "W" },
  { heading: 135, dev: 3.0, dir: "W" },
  { heading: 150, dev: 4.0, dir: "W" },
  { heading: 165, dev: 4.5, dir: "W" },
  { heading: 180, dev: 5.0, dir: "W" },
  { heading: 195, dev: 4.5, dir: "W" },
  { heading: 210, dev: 4.0, dir: "W" },
  { heading: 225, dev: 3.0, dir: "W" },
  { heading: 240, dev: 2.0, dir: "W" },
  { heading: 255, dev: 1.0, dir: "W" },
  { heading: 270, dev: 0.0, dir: "E" },
  { heading: 285, dev: 1.0, dir: "E" },
  { heading: 300, dev: 1.5, dir: "E" },
  { heading: 315, dev: 2.0, dir: "E" },
  { heading: 330, dev: 2.0, dir: "E" },
  { heading: 345, dev: 2.0, dir: "E" },
];

function lookupDeviation(compassHeading) {
  const h = ((compassHeading % 360) + 360) % 360;
  // Find the two bracketing entries and interpolate
  let lower = DEVIATION_TABLE[DEVIATION_TABLE.length - 1];
  let upper = DEVIATION_TABLE[0];
  for (let i = 0; i < DEVIATION_TABLE.length; i++) {
    if (DEVIATION_TABLE[i].heading <= h) lower = DEVIATION_TABLE[i];
    if (DEVIATION_TABLE[i].heading >= h && upper.heading < h) upper = DEVIATION_TABLE[i];
  }
  for (let i = 0; i < DEVIATION_TABLE.length; i++) {
    if (DEVIATION_TABLE[i].heading >= h) { upper = DEVIATION_TABLE[i]; break; }
  }
  if (lower.heading === upper.heading) {
    const sign = lower.dir === "E" ? 1 : -1;
    return { value: lower.dev, dir: lower.dir, signed: sign * lower.dev };
  }
  const lSigned = (lower.dir === "E" ? 1 : -1) * lower.dev;
  const uSigned = (upper.dir === "E" ? 1 : -1) * upper.dev;
  const frac = (h - lower.heading) / (upper.heading - lower.heading);
  const interp = lSigned + frac * (uSigned - lSigned);
  const rounded = Math.round(interp * 10) / 10;
  return { value: Math.abs(rounded), dir: rounded >= 0 ? "E" : "W", signed: rounded };
}

// Variation data (as printed on chart compass rose)
const VARIATION_DATA = { baseValue: 3.0, baseDir: "E", baseYear: 2018, annualChange: -0.083 }; // 5'W per year = decreasing East

function calcVariation(year) {
  const years = year - VARIATION_DATA.baseYear;
  const current = VARIATION_DATA.baseValue + years * VARIATION_DATA.annualChange;
  return { value: Math.abs(Math.round(current * 10) / 10), dir: current >= 0 ? "E" : "W", signed: Math.round(current * 10) / 10 };
}

// ─── Compass Correction Calculator Component ─────────────────────────────────

function CDMVTPipeline() {
  const [compassCourse, setCompassCourse] = useState("");
  const [year, setYear] = useState("2025");
  const [activeStep, setActiveStep] = useState(-1);

  const valid = !isNaN(parseFloat(compassCourse)) && parseFloat(compassCourse) >= 0 && parseFloat(compassCourse) < 360 && !isNaN(parseInt(year));

  const result = valid ? (() => {
    const cc = parseFloat(compassCourse);
    const dev = lookupDeviation(cc);
    const vari = calcVariation(parseInt(year));
    const mag = cc + dev.signed;
    const tru = mag + vari.signed;
    return { cc, dev, mag, vari, tru };
  })() : null;

  // Animate through steps when input changes
  useEffect(() => {
    if (!valid) {
      setActiveStep(-1);
      return;
    }

    let step = 0;
    setActiveStep(0);

    const timer1 = setTimeout(() => { step = 1; setActiveStep(1); }, 500);
    const timer2 = setTimeout(() => { step = 2; setActiveStep(2); }, 1000);
    const timer3 = setTimeout(() => { step = 3; setActiveStep(3); }, 1500);
    const timer4 = setTimeout(() => { step = 4; setActiveStep(4); }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [compassCourse, year, valid]);

  return (
    <div style={{ padding: "16px", background: C.bgCard, borderRadius: 10, border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <span style={{ fontSize: 13 }}>🔄</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>CDMVT: Compass → True Conversion</span>
      </div>

      {/* Input section */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
        <div>
          <label style={{ display: "block", fontSize: 10, color: C.textMuted, fontWeight: 600, marginBottom: 3, textTransform: "uppercase" }}>Compass Course (°)</label>
          <input type="number" min="0" max="359" step="0.1" value={compassCourse}
            onChange={(e) => { setCompassCourse(e.target.value); setActiveStep(-1); }}
            placeholder="180"
            style={{
              width: 80, padding: "7px 10px", borderRadius: 6, border: `1.5px solid ${C.border}`,
              fontSize: 13, fontWeight: 600, textAlign: "center", background: C.bgCard, color: C.text, outline: "none",
            }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 10, color: C.textMuted, fontWeight: 600, marginBottom: 3, textTransform: "uppercase" }}>Year</label>
          <input type="number" min="2015" max="2035" value={year}
            onChange={(e) => { setYear(e.target.value); setActiveStep(-1); }}
            style={{
              width: 60, padding: "7px 10px", borderRadius: 6, border: `1.5px solid ${C.border}`,
              fontSize: 13, fontWeight: 600, textAlign: "center", background: C.bgCard, color: C.text, outline: "none",
            }} />
        </div>

        <button onClick={() => {
          if (valid && activeStep < 4) {
            setActiveStep(activeStep + 1);
          }
        }}
          style={{
            padding: "7px 16px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600,
            cursor: valid ? "pointer" : "not-allowed", background: valid ? C.accent : C.border, color: valid ? "#fff" : C.textMuted,
          }}>
          {activeStep < 0 ? "Start" : activeStep < 4 ? "Next" : "Done"}
        </button>
      </div>

      {/* Pipeline visualization */}
      {valid && result && (
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: "max-content", paddingBottom: 8 }}>
            {/* Compass */}
            <div style={{
              padding: "12px 16px", borderRadius: 8, border: `2px solid ${activeStep >= 0 ? C.accent : C.border}`,
              background: activeStep >= 0 ? C.accentLight : C.bgCard, minWidth: 100, textAlign: "center",
              transition: "all 0.3s",
            }}>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>Compass</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: activeStep >= 0 ? C.accent : C.text }}>{result.cc.toFixed(1)}°</div>
            </div>

            {/* Arrow 1 */}
            <div style={{ textAlign: "center", width: 40, fontSize: 12, color: activeStep >= 1 ? "#16a34a" : C.textMuted }}>→</div>

            {/* Deviation */}
            <div style={{
              padding: "12px 16px", borderRadius: 8, border: `2px solid ${activeStep >= 1 ? "#16a34a" : C.border}`,
              background: activeStep >= 1 ? C.greenLight : C.bgCard, minWidth: 100, textAlign: "center",
              transition: "all 0.3s",
            }}>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>Deviation</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: result.dev.dir === "E" ? "#16a34a" : C.red }}>
                {result.dev.dir === "E" ? "+" : "−"}{result.dev.value.toFixed(1)}°
              </div>
            </div>

            {/* Arrow 2 */}
            <div style={{ textAlign: "center", width: 40, fontSize: 12, color: activeStep >= 2 ? C.gold : C.textMuted }}>→</div>

            {/* Magnetic */}
            <div style={{
              padding: "12px 16px", borderRadius: 8, border: `2px solid ${activeStep >= 2 ? C.gold : C.border}`,
              background: activeStep >= 2 ? C.goldLight : C.bgCard, minWidth: 100, textAlign: "center",
              transition: "all 0.3s",
            }}>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>Magnetic</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: activeStep >= 2 ? C.gold : C.text }}>{result.mag.toFixed(1)}°</div>
            </div>

            {/* Arrow 3 */}
            <div style={{ textAlign: "center", width: 40, fontSize: 12, color: activeStep >= 3 ? "#7c3aed" : C.textMuted }}>→</div>

            {/* Variation */}
            <div style={{
              padding: "12px 16px", borderRadius: 8, border: `2px solid ${activeStep >= 3 ? "#7c3aed" : C.border}`,
              background: activeStep >= 3 ? "#f3e8ff" : C.bgCard, minWidth: 100, textAlign: "center",
              transition: "all 0.3s",
            }}>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>Variation</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: result.vari.dir === "E" ? "#16a34a" : C.red }}>
                {result.vari.dir === "E" ? "+" : "−"}{result.vari.value.toFixed(1)}°
              </div>
            </div>

            {/* Arrow 4 */}
            <div style={{ textAlign: "center", width: 40, fontSize: 12, color: activeStep >= 4 ? C.green : C.textMuted }}>→</div>

            {/* True */}
            <div style={{
              padding: "12px 16px", borderRadius: 8, border: `2px solid ${activeStep >= 4 ? C.green : C.border}`,
              background: activeStep >= 4 ? C.greenLight : C.bgCard, minWidth: 100, textAlign: "center",
              transition: "all 0.3s",
            }}>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", fontWeight: 600, marginBottom: 2 }}>True</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: activeStep >= 4 ? C.green : C.text }}>{result.tru.toFixed(1)}°</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompassCorrectionCalculator() {
  const [compassCourse, setCompassCourse] = useState("");
  const [year, setYear] = useState("2025");
  const [direction, setDirection] = useState("toTrue"); // toTrue or toCompass
  const [showResult, setShowResult] = useState(false);

  const inputStyle = {
    width: 80, padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`,
    fontSize: 15, fontWeight: 600, textAlign: "center", background: "#fafaf8",
    color: C.text, outline: "none", fontFamily: "system-ui",
  };
  const labelStyle = { fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 };
  const valueBoxStyle = (color) => ({
    padding: "8px 14px", borderRadius: 8, background: color + "0a", border: `1.5px solid ${color}22`,
    textAlign: "center", minWidth: 80,
  });

  const cc = parseFloat(compassCourse);
  const yr = parseInt(year);
  const valid = !isNaN(cc) && cc >= 0 && cc < 360 && !isNaN(yr);

  const dev = valid ? lookupDeviation(cc) : null;
  const vari = valid ? calcVariation(yr) : null;

  let magnetic = null, trueBearing = null;
  if (valid && dev && vari) {
    if (direction === "toTrue") {
      magnetic = cc + dev.signed;
      trueBearing = magnetic + vari.signed;
    } else {
      // Going from "true" input to compass
      const trueInput = cc;
      const mag = trueInput - vari.signed;
      // For true→compass we need deviation for the compass heading, which we don't know yet
      // Use iterative approach: guess compass ≈ true, look up dev, adjust
      let guess = trueInput;
      for (let i = 0; i < 5; i++) {
        const d = lookupDeviation(guess);
        guess = trueInput - vari.signed - d.signed;
      }
      const finalDev = lookupDeviation(guess);
      magnetic = trueInput - vari.signed;
      trueBearing = trueInput;
      // Override for display
    }
  }

  const chain = valid && dev && vari ? (direction === "toTrue" ? [
    { label: "Compass", value: cc.toFixed(1) + "°", color: C.accent },
    { label: "Deviation", value: (dev.signed >= 0 ? "+" : "") + dev.signed.toFixed(1) + "° " + dev.dir, color: "#7c3aed" },
    { label: "Magnetic", value: (cc + dev.signed).toFixed(1) + "°", color: "#ca8a04" },
    { label: "Variation", value: (vari.signed >= 0 ? "+" : "") + vari.signed.toFixed(1) + "° " + vari.dir + " (" + yr + ")", color: "#7c3aed" },
    { label: "True", value: (cc + dev.signed + vari.signed).toFixed(1) + "°", color: C.green },
  ] : [
    { label: "True", value: cc.toFixed(1) + "°", color: C.green },
    { label: "Variation", value: (vari.signed >= 0 ? "−" : "+") + Math.abs(vari.signed).toFixed(1) + "° " + vari.dir, color: "#7c3aed" },
    { label: "Magnetic", value: (cc - vari.signed).toFixed(1) + "°", color: "#ca8a04" },
  ]) : null;

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, marginBottom: 12 }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>Compass Correction Calculator</h3>
      <p style={{ margin: "0 0 16px", fontSize: 12, color: C.textMuted }}>
        Enter a bearing and year to convert through the CDMVT chain. Deviation is looked up from the table below.
      </p>

      {/* Direction toggle */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#f1f0ed", borderRadius: 8, padding: 3, width: "fit-content" }}>
        {[["toTrue", "Compass → True"], ["toCompass", "True → Compass"]].map(([val, label]) => (
          <button key={val} onClick={() => { setDirection(val); setShowResult(false); }} style={{
            padding: "6px 14px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: direction === val ? "#fff" : "transparent",
            color: direction === val ? C.accent : C.textMuted,
            boxShadow: direction === val ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 16 }}>
        <div>
          <div style={labelStyle}>{direction === "toTrue" ? "Compass Course" : "True Bearing"}</div>
          <input type="number" min="0" max="359.9" step="0.1" value={compassCourse}
            onChange={e => { setCompassCourse(e.target.value); setShowResult(false); }}
            placeholder="e.g. 135" style={inputStyle} />
        </div>
        <div>
          <div style={labelStyle}>Year</div>
          <input type="number" min="2015" max="2035" value={year}
            onChange={e => { setYear(e.target.value); setShowResult(false); }}
            style={{ ...inputStyle, width: 65 }} />
        </div>
        <button onClick={() => setShowResult(true)} disabled={!valid} style={{
          padding: "8px 20px", borderRadius: 8, border: "none",
          background: valid ? C.accent : C.border, color: valid ? "#fff" : C.textMuted,
          fontSize: 13, fontWeight: 600, cursor: valid ? "pointer" : "not-allowed",
          marginBottom: 1,
        }}>Calculate</button>
      </div>

      {/* Result chain */}
      {showResult && chain && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, padding: "16px", background: "#fafaf8", borderRadius: 10, border: `1px solid ${C.border}` }}>
          {chain.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span style={{ color: C.textMuted, fontSize: 16 }}>→</span>}
              <div style={valueBoxStyle(step.color)}>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>{step.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: step.color }}>{step.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deviation table */}
      <details style={{ marginTop: 16 }}>
        <summary style={{ fontSize: 12, fontWeight: 600, color: C.accent, cursor: "pointer", marginBottom: 8 }}>
          View Deviation Table (Deviationskort)
        </summary>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", fontSize: 11, width: "100%" }}>
            <thead>
              <tr style={{ background: "#f1f0ed" }}>
                <th style={{ padding: "6px 8px", textAlign: "left", borderBottom: `1px solid ${C.border}`, color: C.textSec }}>Compass Hdg</th>
                {DEVIATION_TABLE.map(d => (
                  <th key={d.heading} style={{ padding: "6px 6px", textAlign: "center", borderBottom: `1px solid ${C.border}`, color: C.textSec, minWidth: 36 }}>
                    {d.heading}°
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "6px 8px", fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>Deviation</td>
                {DEVIATION_TABLE.map(d => (
                  <td key={d.heading} style={{
                    padding: "6px 6px", textAlign: "center", borderBottom: `1px solid ${C.border}`,
                    color: d.dir === "E" ? C.accent : C.red, fontWeight: 600,
                  }}>
                    {d.dev.toFixed(1)}°{d.dir}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 8, padding: "10px 12px", background: "#fafaf8", borderRadius: 8, fontSize: 11, color: C.textSec }}>
          <strong>Variation (from chart compass rose):</strong> {VARIATION_DATA.baseValue.toFixed(1)}°{VARIATION_DATA.baseDir} ({VARIATION_DATA.baseYear}), annual decrease 5'W.
          <br/>Values between headings are interpolated linearly, just like in the exam.
        </div>
      </details>
    </div>
  );
}

// ─── Speed/Distance/Time Calculator ──────────────────────────────────────────

function SDTCalculator() {
  const [speed, setSpeed] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState(null);

  const inputStyle = {
    width: 90, padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`,
    fontSize: 15, fontWeight: 600, textAlign: "center", background: "#fafaf8",
    color: C.text, outline: "none", fontFamily: "system-ui",
  };
  const labelStyle = { fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 };

  function calculate() {
    const s = parseFloat(speed), d = parseFloat(distance), t = parseFloat(time);
    const filled = [!isNaN(s), !isNaN(d), !isNaN(t)];
    const count = filled.filter(Boolean).length;
    if (count < 2) { setResult({ error: "Fill in any two values to calculate the third." }); return; }
    if (count === 3) { setResult({ error: "Leave one field empty — I'll calculate it for you." }); return; }

    if (isNaN(s)) {
      // Speed = Distance / Time (time in minutes → hours)
      const hours = t / 60;
      setResult({ label: "Speed", value: (d / hours).toFixed(2), unit: "knots", formula: `${d} nm ÷ ${(hours).toFixed(3)} hrs = ${(d / hours).toFixed(2)} kn` });
    } else if (isNaN(d)) {
      const hours = t / 60;
      setResult({ label: "Distance", value: (s * hours).toFixed(2), unit: "nm", formula: `${s} kn × ${(hours).toFixed(3)} hrs = ${(s * hours).toFixed(2)} nm` });
    } else {
      const hours = d / s;
      const mins = hours * 60;
      setResult({ label: "Time", value: mins.toFixed(1), unit: "minutes", formula: `${d} nm ÷ ${s} kn = ${hours.toFixed(3)} hrs = ${mins.toFixed(1)} min` });
    }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, marginBottom: 12 }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>Speed / Distance / Time Calculator</h3>
      <p style={{ margin: "0 0 16px", fontSize: 12, color: C.textMuted }}>
        D = S × T. Fill in any two values and leave one blank to solve.
      </p>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 12 }}>
        <div>
          <div style={labelStyle}>Speed (knots)</div>
          <input type="number" min="0" step="0.1" value={speed} onChange={e => { setSpeed(e.target.value); setResult(null); }}
            placeholder="kn" style={inputStyle} />
        </div>
        <div>
          <div style={labelStyle}>Distance (nm)</div>
          <input type="number" min="0" step="0.1" value={distance} onChange={e => { setDistance(e.target.value); setResult(null); }}
            placeholder="nm" style={inputStyle} />
        </div>
        <div>
          <div style={labelStyle}>Time (minutes)</div>
          <input type="number" min="0" step="1" value={time} onChange={e => { setTime(e.target.value); setResult(null); }}
            placeholder="min" style={inputStyle} />
        </div>
        <button onClick={calculate} style={{
          padding: "8px 20px", borderRadius: 8, border: "none", background: C.accent, color: "#fff",
          fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 1,
        }}>Calculate</button>
      </div>
      {result && !result.error && (
        <div style={{ padding: "12px 16px", background: C.greenLight, borderRadius: 8, border: `1px solid ${C.green}22` }}>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>{result.label}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{result.value} {result.unit}</div>
          <div style={{ fontSize: 11, color: C.textSec, marginTop: 4, fontFamily: "monospace" }}>{result.formula}</div>
        </div>
      )}
      {result && result.error && (
        <div style={{ padding: "10px 14px", background: C.goldLight, borderRadius: 8, border: `1px solid ${C.gold}22`, fontSize: 12, color: C.gold }}>
          {result.error}
        </div>
      )}
    </div>
  );
}

// ─── Scenario-Based Practice Problems ────────────────────────────────────────

const SCENARIOS = [
  {
    id: 1,
    title: "Compass correction — outbound passage",
    description: "You are leaving Aarhus heading for Samsø. Your compass course reads 135°. The year is 2025. Using the deviation table and chart variation, find the true course.",
    hint: "Look up deviation for compass heading 135° in the table. Then apply variation for 2025.",
    fields: [
      { label: "Compass course", prefill: "135", unit: "°", locked: true },
      { label: "Deviation (from table)", prefill: "", unit: "°", key: "dev" },
      { label: "Magnetic course", prefill: "", unit: "°", key: "mag" },
      { label: "Variation (for 2025)", prefill: "", unit: "°", key: "var" },
      { label: "True course", prefill: "", unit: "°", key: "true" },
    ],
    check: (vals) => {
      const dev = lookupDeviation(135);
      const vari = calcVariation(2025);
      const mag = 135 + dev.signed;
      const truC = mag + vari.signed;
      return {
        dev: { correct: Math.abs(parseFloat(vals.dev || 0) - dev.signed) < 0.6, answer: dev.signed.toFixed(1) + "° (" + dev.value + "°" + dev.dir + ")" },
        mag: { correct: Math.abs(parseFloat(vals.mag || 0) - mag) < 0.6, answer: mag.toFixed(1) + "°" },
        var: { correct: Math.abs(parseFloat(vals.var || 0) - vari.signed) < 0.6, answer: vari.signed.toFixed(1) + "° (" + vari.value + "°" + vari.dir + ")" },
        true: { correct: Math.abs(parseFloat(vals.true || 0) - truC) < 0.6, answer: truC.toFixed(1) + "°" },
      };
    },
  },
  {
    id: 2,
    title: "Speed-distance-time — crossing Kattegat",
    description: "You are sailing from Grenaa to Halmstad, a distance of 52 nautical miles. Your average boat speed is 5.5 knots. At what time will you arrive if you depart at 06:00?",
    hint: "Use T = D ÷ S. Then add the result to 06:00.",
    fields: [
      { label: "Distance", prefill: "52", unit: "nm", locked: true },
      { label: "Speed", prefill: "5.5", unit: "kn", locked: true },
      { label: "Time underway", prefill: "", unit: "hours", key: "time" },
      { label: "Arrival time (24h)", prefill: "", unit: "", key: "arrival" },
    ],
    check: (vals) => {
      const t = 52 / 5.5; // 9.4545 hours
      const arrH = 6 + Math.floor(t);
      const arrM = Math.round((t % 1) * 60);
      const arrStr = `${arrH}:${arrM < 10 ? "0" : ""}${arrM}`;
      return {
        time: { correct: Math.abs(parseFloat(vals.time || 0) - t) < 0.15, answer: t.toFixed(1) + " hours (" + Math.floor(t) + "h " + Math.round((t % 1) * 60) + "m)" },
        arrival: { correct: (vals.arrival || "").replace(/\s/g, "") === arrStr || (vals.arrival || "").replace(/\s/g, "") === "15:27", answer: arrStr },
      };
    },
  },
  {
    id: 3,
    title: "Compass correction — returning to port",
    description: "You are heading home on a compass course of 315°. The year is 2026. Find deviation from the table, then calculate the true course.",
    hint: "Deviation for 315° from the table, then apply current variation.",
    fields: [
      { label: "Compass course", prefill: "315", unit: "°", locked: true },
      { label: "Deviation (from table)", prefill: "", unit: "°", key: "dev" },
      { label: "Magnetic course", prefill: "", unit: "°", key: "mag" },
      { label: "Variation (for 2026)", prefill: "", unit: "°", key: "var" },
      { label: "True course", prefill: "", unit: "°", key: "true" },
    ],
    check: (vals) => {
      const dev = lookupDeviation(315);
      const vari = calcVariation(2026);
      const mag = 315 + dev.signed;
      const truC = mag + vari.signed;
      return {
        dev: { correct: Math.abs(parseFloat(vals.dev || 0) - dev.signed) < 0.6, answer: dev.signed.toFixed(1) + "° (" + dev.value + "°" + dev.dir + ")" },
        mag: { correct: Math.abs(parseFloat(vals.mag || 0) - mag) < 0.6, answer: mag.toFixed(1) + "°" },
        var: { correct: Math.abs(parseFloat(vals.var || 0) - vari.signed) < 0.6, answer: vari.signed.toFixed(1) + "° (" + vari.value + "°" + vari.dir + ")" },
        true: { correct: Math.abs(parseFloat(vals.true || 0) - truC) < 0.6, answer: truC.toFixed(1) + "°" },
      };
    },
  },
  {
    id: 4,
    title: "Speed-distance-time — how fast must you go?",
    description: "The harbour gate closes at 18:00. You are 12.5 nm away and it is currently 15:30. What minimum average speed do you need to make it?",
    hint: "Time available = 2 hours 30 minutes = 2.5 hours. S = D ÷ T.",
    fields: [
      { label: "Distance", prefill: "12.5", unit: "nm", locked: true },
      { label: "Time available", prefill: "", unit: "hours", key: "time" },
      { label: "Minimum speed", prefill: "", unit: "knots", key: "speed" },
    ],
    check: (vals) => {
      return {
        time: { correct: Math.abs(parseFloat(vals.time || 0) - 2.5) < 0.1, answer: "2.5 hours (18:00 − 15:30)" },
        speed: { correct: Math.abs(parseFloat(vals.speed || 0) - 5.0) < 0.15, answer: "5.0 knots (12.5 ÷ 2.5)" },
      };
    },
  },
  {
    id: 5,
    title: "Compass correction — night approach",
    description: "Approaching harbour at night. Your true bearing to the lighthouse is 045° (from the chart). The year is 2025. What compass bearing should you see on your compass? Work backwards: True → Magnetic → Compass.",
    hint: "Subtract variation to get magnetic. Then you need deviation for the compass heading — try iterating or use the table intelligently.",
    fields: [
      { label: "True bearing", prefill: "045", unit: "°", locked: true },
      { label: "Variation (2025)", prefill: "", unit: "°", key: "var" },
      { label: "Magnetic bearing", prefill: "", unit: "°", key: "mag" },
      { label: "Est. deviation (from table)", prefill: "", unit: "°", key: "dev" },
      { label: "Compass bearing", prefill: "", unit: "°", key: "compass" },
    ],
    check: (vals) => {
      const vari = calcVariation(2025);
      const mag = 45 - vari.signed;
      // For true→compass, deviation depends on the compass heading (unknown)
      // Iterative: start with guess compass ≈ mag
      let guess = mag;
      for (let i = 0; i < 5; i++) {
        const d = lookupDeviation(guess);
        guess = mag - d.signed;
      }
      const finalDev = lookupDeviation(guess);
      const compass = mag - finalDev.signed;
      return {
        var: { correct: Math.abs(parseFloat(vals.var || 0) - vari.signed) < 0.6, answer: vari.signed.toFixed(1) + "° (" + vari.value + "°" + vari.dir + ")" },
        mag: { correct: Math.abs(parseFloat(vals.mag || 0) - mag) < 0.6, answer: mag.toFixed(1) + "°" },
        dev: { correct: Math.abs(parseFloat(vals.dev || 0) - (-finalDev.signed)) < 0.8 || Math.abs(parseFloat(vals.dev || 0) - finalDev.signed) < 0.8, answer: finalDev.signed.toFixed(1) + "° for ~" + Math.round(guess) + "° compass heading" },
        compass: { correct: Math.abs(parseFloat(vals.compass || 0) - compass) < 1.0, answer: compass.toFixed(1) + "°" },
      };
    },
  },
];

// ─── Vessel Lights Data ──────────────────────────────────────────────────────

const VESSEL_LIGHTS = [
  {
    id: "power-underway-gt50",
    name: "Power vessel underway (>50m)",
    rule: "Rule 23",
    category: "power",
    lights: [
      { color: "white", y: 12, label: "Masthead (aft, higher)" },
      { color: "white", y: 20, label: "Masthead (forward, lower)" },
      { color: "red", y: 60, label: "Port sidelight", side: "left" },
      { color: "green", y: 60, label: "Starboard sidelight", side: "right" },
    ],
    hint: "Two masthead lights in a vertical line, one aft and higher than the forward one.",
  },
  {
    id: "power-underway-lt50",
    name: "Power vessel underway (<50m)",
    rule: "Rule 23",
    category: "power",
    lights: [
      { color: "white", y: 20, label: "Masthead light" },
      { color: "red", y: 60, label: "Port sidelight", side: "left" },
      { color: "green", y: 60, label: "Starboard sidelight", side: "right" },
    ],
    hint: "Single masthead light with sidelights. Much smaller vessels may show combined sidelights.",
  },
  {
    id: "sail-underway",
    name: "Sailing vessel underway",
    rule: "Rule 25",
    category: "sail",
    lights: [
      { color: "red", y: 60, label: "Port sidelight", side: "left" },
      { color: "green", y: 60, label: "Starboard sidelight", side: "right" },
    ],
    hint: "Sidelights and sternlight only — no masthead light. This distinguishes it from power.",
  },
  {
    id: "sail-combined-lantern",
    name: "Sailing vessel (combined lantern)",
    rule: "Rule 25",
    category: "sail",
    lights: [
      { color: "red", y: 25, label: "Red light (port)", side: "left" },
      { color: "green", y: 25, label: "Green light (starboard)", side: "right" },
      { color: "white", y: 35, label: "White light (stern)", side: "center" },
    ],
    hint: "Smaller sailing vessels may combine red, green, and white in a single lantern at the masthead.",
  },
  {
    id: "motorsailing",
    name: "Motorsailing (cone day shape, power lights at night)",
    rule: "Rule 25",
    category: "power",
    lights: [
      { color: "white", y: 20, label: "Masthead light" },
      { color: "red", y: 60, label: "Port sidelight", side: "left" },
      { color: "green", y: 60, label: "Starboard sidelight", side: "right" },
    ],
    hint: "Shows power-driven lights at night (masthead + sidelights + stern). Day shape is a black cone pointing down.",
  },
  {
    id: "anchor-lt50",
    name: "Vessel at anchor (<50m)",
    rule: "Rule 30",
    category: "special",
    lights: [
      { color: "white", y: 50, label: "All-round white light" },
    ],
    hint: "Single white all-round light. The anchor ball is shown by day.",
  },
  {
    id: "anchor-gt50",
    name: "Vessel at anchor (>50m)",
    rule: "Rule 30",
    category: "special",
    lights: [
      { color: "white", y: 15, label: "All-round white (forward)" },
      { color: "white", y: 55, label: "All-round white (aft)" },
    ],
    hint: "Two white all-round lights vertically separated. Forward light higher than aft.",
  },
  {
    id: "aground",
    name: "Vessel aground",
    rule: "Rule 30",
    category: "special",
    lights: [
      { color: "white", y: 15, label: "All-round white (forward)" },
      { color: "white", y: 55, label: "All-round white (aft)" },
      { color: "red", y: 35, label: "Red all-round (upper)" },
      { color: "red", y: 45, label: "Red all-round (lower)" },
    ],
    hint: "Anchor lights plus two red all-round lights vertically. Shows she is aground (not just anchored).",
  },
  {
    id: "trawler-making-way",
    name: "Trawler making way",
    rule: "Rule 26",
    category: "fishing",
    lights: [
      { color: "green", y: 25, label: "Green all-round (trawl signal)" },
      { color: "white", y: 35, label: "White all-round" },
      { color: "red", y: 60, label: "Port sidelight", side: "left" },
      { color: "green", y: 60, label: "Starboard sidelight", side: "right" },
    ],
    hint: "Green over white vertical pair signals active trawling. Plus sidelights and stern when making way.",
  },
  {
    id: "fishing-not-trawling",
    name: "Fishing vessel (not trawling) making way",
    rule: "Rule 26",
    category: "fishing",
    lights: [
      { color: "red", y: 25, label: "Red all-round (fishing signal)" },
      { color: "white", y: 35, label: "White all-round" },
      { color: "red", y: 60, label: "Port sidelight", side: "left" },
      { color: "green", y: 60, label: "Starboard sidelight", side: "right" },
    ],
    hint: "Red over white signals active fishing (but not trawling). Plus sidelights and stern when making way.",
  },
  {
    id: "trawler-not-making-way",
    name: "Trawler NOT making way",
    rule: "Rule 26",
    category: "fishing",
    lights: [
      { color: "green", y: 25, label: "Green all-round (trawl signal)" },
      { color: "white", y: 35, label: "White all-round" },
    ],
    hint: "Green over white only — no sidelights or sternlight because the vessel is not moving through the water.",
  },
  {
    id: "nuc-not-making-way",
    name: "Not Under Command (NUC) — not making way",
    rule: "Rule 27",
    category: "special",
    lights: [
      { color: "red", y: 25, label: "Red all-round (upper)" },
      { color: "red", y: 45, label: "Red all-round (lower)" },
    ],
    hint: "Two red all-round lights vertically. Day shape: two black balls vertically.",
  },
  {
    id: "nuc-making-way",
    name: "Not Under Command (NUC) — making way",
    rule: "Rule 27",
    category: "special",
    lights: [
      { color: "red", y: 25, label: "Red all-round (upper)" },
      { color: "red", y: 45, label: "Red all-round (lower)" },
      { color: "red", y: 60, label: "Port sidelight", side: "left" },
      { color: "green", y: 60, label: "Starboard sidelight", side: "right" },
    ],
    hint: "Two red all-round lights plus sidelights and sternlight when making way.",
  },
  {
    id: "ram-not-making-way",
    name: "Restricted in Ability to Manoeuvre (RAM) — not making way",
    rule: "Rule 27",
    category: "restricted",
    lights: [
      { color: "red", y: 20, label: "Red all-round (upper)" },
      { color: "white", y: 35, label: "White all-round (middle)" },
      { color: "red", y: 50, label: "Red all-round (lower)" },
    ],
    hint: "Red-White-Red all-round lights vertically. Day shape: ball-diamond-ball vertically.",
  },
  {
    id: "ram-making-way",
    name: "Restricted in Ability to Manoeuvre (RAM) — making way",
    rule: "Rule 27",
    category: "restricted",
    lights: [
      { color: "white", y: 12, label: "Masthead light (aft)" },
      { color: "white", y: 20, label: "Masthead light (forward)" },
      { color: "red", y: 30, label: "Red all-round (upper)" },
      { color: "white", y: 40, label: "White all-round (middle)" },
      { color: "red", y: 50, label: "Red all-round (lower)" },
      { color: "red", y: 65, label: "Port sidelight", side: "left" },
      { color: "green", y: 65, label: "Starboard sidelight", side: "right" },
    ],
    hint: "Red-White-Red plus masthead lights and sidelights. Shows both restricted status and underway.",
  },
  {
    id: "constrained-by-draught",
    name: "Constrained by Draught",
    rule: "Rule 28",
    category: "restricted",
    lights: [
      { color: "red", y: 15, label: "Red all-round (upper)" },
      { color: "red", y: 30, label: "Red all-round (middle)" },
      { color: "red", y: 45, label: "Red all-round (lower)" },
      { color: "white", y: 60, label: "Masthead lights + sidelights + stern", side: "center" },
    ],
    hint: "Three red all-round lights vertically plus masthead, sidelights, and sternlight (power lights).",
  },
  {
    id: "towing-lt200",
    name: "Vessel towing (<200m tow length)",
    rule: "Rule 24",
    category: "special",
    lights: [
      { color: "white", y: 12, label: "Masthead (aft)" },
      { color: "white", y: 20, label: "Masthead (forward)" },
      { color: "red", y: 60, label: "Port sidelight", side: "left" },
      { color: "green", y: 60, label: "Starboard sidelight", side: "right" },
      { color: "yellow", y: 72, label: "Towing light (yellow stern)" },
      { color: "white", y: 80, label: "Sternlight (white)" },
    ],
    hint: "Two masthead lights, sidelights, plus a yellow towing light above a white sternlight.",
  },
  {
    id: "towing-gt200",
    name: "Vessel towing (>200m tow length)",
    rule: "Rule 24",
    category: "special",
    lights: [
      { color: "white", y: 10, label: "Masthead (aft, highest)" },
      { color: "white", y: 18, label: "Masthead (middle)" },
      { color: "white", y: 26, label: "Masthead (forward, lowest)" },
      { color: "red", y: 60, label: "Port sidelight", side: "left" },
      { color: "green", y: 60, label: "Starboard sidelight", side: "right" },
      { color: "yellow", y: 72, label: "Towing light (yellow stern)" },
      { color: "white", y: 80, label: "Sternlight (white)" },
    ],
    hint: "Three masthead lights vertically for long tow (>200m). Plus yellow towing light and white sternlight.",
  },
  {
    id: "pilot-vessel",
    name: "Pilot vessel",
    rule: "Rule 29",
    category: "special",
    lights: [
      { color: "white", y: 20, label: "White all-round (upper)" },
      { color: "red", y: 35, label: "Red all-round (lower)" },
      { color: "red", y: 60, label: "Port sidelight", side: "left" },
      { color: "green", y: 60, label: "Starboard sidelight", side: "right" },
    ],
    hint: "White over red all-round lights vertically. Plus sidelights and sternlight if underway.",
  },
  {
    id: "mine-clearance",
    name: "Mine clearance vessel",
    rule: "Rule 27",
    category: "special",
    lights: [
      { color: "green", y: 15, label: "Green all-round (upper)" },
      { color: "green", y: 30, label: "Green all-round (middle)" },
      { color: "green", y: 45, label: "Green all-round (lower)" },
      { color: "white", y: 60, label: "Masthead + sidelights + stern", side: "center" },
    ],
    hint: "Three green all-round lights vertically, plus power-driven vessel lights (masthead, sidelights, stern).",
  },
];

function ScenarioCard({ scenario }) {
  const [vals, setVals] = useState({});
  const [checked, setChecked] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const inputStyle = {
    width: 80, padding: "7px 8px", borderRadius: 6, border: `1.5px solid ${C.border}`,
    fontSize: 14, fontWeight: 600, textAlign: "center", background: "#fafaf8",
    color: C.text, outline: "none", fontFamily: "system-ui",
  };

  function handleCheck() {
    setChecked(scenario.check(vals));
  }

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text }}>Scenario {scenario.id}: {scenario.title}</h4>
        <button onClick={() => setShowHint(!showHint)} style={{
          background: "none", border: "none", fontSize: 11, color: C.accent, cursor: "pointer", padding: 0, fontWeight: 600,
        }}>{showHint ? "Hide hint" : "Show hint"}</button>
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{scenario.description}</p>
      {showHint && (
        <div style={{ padding: "8px 12px", background: C.goldLight, borderRadius: 8, marginBottom: 12, fontSize: 12, color: C.gold }}>
          {scenario.hint}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end", marginBottom: 12 }}>
        {scenario.fields.map((f, i) => (
          <div key={i}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3 }}>{f.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                type="number" step="0.1"
                value={f.locked ? f.prefill : (vals[f.key] || "")}
                disabled={f.locked}
                onChange={e => { setVals(p => ({ ...p, [f.key]: e.target.value })); setChecked(null); }}
                style={{
                  ...inputStyle,
                  background: f.locked ? "#f1f0ed" : checked && checked[f.key] ? (checked[f.key].correct ? C.greenLight : C.redLight) : "#fafaf8",
                  borderColor: checked && checked[f.key] ? (checked[f.key].correct ? C.green : C.red) : C.border,
                  color: f.locked ? C.textMuted : C.text,
                }}
              />
              {f.unit && <span style={{ fontSize: 11, color: C.textMuted }}>{f.unit}</span>}
            </div>
          </div>
        ))}
        <button onClick={handleCheck} style={{
          padding: "7px 16px", borderRadius: 8, border: "none", background: C.accent, color: "#fff",
          fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 1,
        }}>Check</button>
      </div>

      {checked && (
        <div style={{ padding: "10px 14px", background: "#fafaf8", borderRadius: 8, border: `1px solid ${C.border}` }}>
          {Object.entries(checked).map(([key, res]) => {
            const field = scenario.fields.find(f => f.key === key);
            return (
              <div key={key} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: res.correct ? C.green : C.red, fontWeight: 700 }}>{res.correct ? "✓" : "✗"}</span>
                <span style={{ color: C.textSec }}>{field?.label}:</span>
                <span style={{ color: C.text, fontWeight: 600 }}>{res.answer}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Vessel Lights SVG Component ─────────────────────────────────────────────

function VesselLightsSVG({ lights, showLabels = false, size = 200 }) {
  const padding = 20;
  const w = size, h = size;
  const cx = w / 2, cy = h / 2;

  // Color mapping
  const colorMap = {
    red: "#dc2626",
    green: "#16a34a",
    white: "#ffffff",
    yellow: "#eab308",
  };

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ border: `1px solid ${C.border}`, borderRadius: 8 }}>
      {/* Dark background */}
      <defs>
        <radialGradient id="vesselLightGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopOpacity="0.8" />
          <stop offset="100%" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill="#1a2847" rx="8" />

      {/* Mast line */}
      <line x1={cx} y1={padding + 10} x2={cx} y2={h - 60} stroke="#8b7355" strokeWidth="2" />

      {/* Hull silhouette */}
      <path d={`M ${cx - 50} ${h - 50} L ${cx - 60} ${h - 20} L ${cx + 60} ${h - 20} L ${cx + 50} ${h - 50}`}
            fill="#2c3e50" stroke="#4a5a6f" strokeWidth="1" />

      {/* Lights — ahead view: ship's port (left) appears on viewer's RIGHT, starboard on LEFT */}
      {lights.map((light, i) => {
        const lightY = padding + 10 + (light.y / 100) * (h - padding * 2 - 70);
        let lightX = cx;

        if (light.side === "left") {
          lightX = cx + 35;  // port side → viewer's right
        } else if (light.side === "right") {
          lightX = cx - 35;  // starboard side → viewer's left
        }

        const color = colorMap[light.color] || "#ffffff";
        const labelOnLeft = lightX > cx;

        return (
          <g key={i}>
            {/* Glow effect */}
            <circle cx={lightX} cy={lightY} r="8" fill={color} opacity="0.3" />
            {/* Light circle */}
            <circle cx={lightX} cy={lightY} r="5" fill={color} />
            {/* Label */}
            {showLabels && (
              <text x={labelOnLeft ? lightX + 12 : lightX - 12} y={lightY + 4}
                textAnchor={labelOnLeft ? "start" : "end"}
                fontSize="9" fill="#e5e7eb" fontFamily="system-ui">
                {light.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Vessel Lights Exercise Component ────────────────────────────────────────

function VesselLightsExercise() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [round, setRound] = useState(0);

  // Generate new question
  const generateQuestion = (idx) => {
    const current = VESSEL_LIGHTS[idx % VESSEL_LIGHTS.length];
    const others = VESSEL_LIGHTS.filter((_, i) => i !== idx);
    const wrong = [];
    for (let i = 0; i < 3 && others.length > 0; i++) {
      const randomIdx = Math.floor(Math.random() * others.length);
      wrong.push(others[randomIdx]);
      others.splice(randomIdx, 1);
    }
    const shuffled = [current, ...wrong].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
    setSelected(null);
    setShowAnswer(false);
  };

  // Initialize on mount
  useEffect(() => {
    generateQuestion(currentIndex);
  }, [round]);

  const handleSelect = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
    const isCorrect = options[idx].id === VESSEL_LIGHTS[currentIndex % VESSEL_LIGHTS.length].id;
    if (isCorrect) {
      setScore(score + 1);
    }
    setTotal(total + 1);
    setShowAnswer(true);
  };

  const handleNext = () => {
    setCurrentIndex(currentIndex + 1);
    generateQuestion(currentIndex + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setTotal(0);
    setRound(round + 1);
  };

  const vessel = VESSEL_LIGHTS[currentIndex % VESSEL_LIGHTS.length];
  const isCorrect = selected !== null && options[selected].id === vessel.id;

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: `1px solid ${C.border}`, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text }}>Identify the Vessel by Its Lights</h3>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>
          {score}/{total} Correct
        </div>
      </div>

      <div style={{ marginBottom: 20, padding: "16px", background: "#1a2847", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 12, color: "#e5e7eb", marginBottom: 4 }}>Vessel shown at night (ahead view):</div>
        <VesselLightsSVG lights={vessel.lights} showLabels={showAnswer} size={220} />
      </div>

      <div style={{ marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {options.map((opt, i) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(i)}
            disabled={showAnswer}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: `2px solid ${
                selected === i
                  ? isCorrect ? C.green : C.red
                  : showAnswer && opt.id === vessel.id ? C.green : C.border
              }`,
              background:
                selected === i
                  ? isCorrect ? C.greenLight : C.redLight
                  : showAnswer && opt.id === vessel.id ? C.greenLight : "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: showAnswer ? "default" : "pointer",
              textAlign: "left",
              color: C.text,
              transition: "all 0.15s",
            }}
          >
            {selected === i && (
              <span style={{ marginRight: 8 }}>
                {isCorrect ? "✓" : "✗"}
              </span>
            )}
            {opt.name}
          </button>
        ))}
      </div>

      {showAnswer && (
        <div style={{ marginBottom: 16, padding: "12px 16px", background: C.accentLight, borderRadius: 8, border: `1px solid ${C.accent}44` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.accent, marginBottom: 6 }}>
            {isCorrect ? "Correct!" : "Incorrect"}
          </div>
          <div style={{ fontSize: 13, color: C.textSec, marginBottom: 8 }}>
            <strong>{vessel.name}</strong> ({vessel.rule})
          </div>
          <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>
            {vessel.hint}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleNext}
          disabled={!showAnswer}
          style={{
            flex: 1,
            padding: "9px 16px",
            borderRadius: 8,
            border: "none",
            background: showAnswer ? C.accent : C.border,
            color: showAnswer ? "#fff" : C.textMuted,
            fontSize: 13,
            fontWeight: 600,
            cursor: showAnswer ? "pointer" : "not-allowed",
            transition: "all 0.15s",
          }}
        >
          Next Question
        </button>
        {total > 0 && (
          <button
            onClick={handleReset}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: "#fff",
              color: C.text,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Additional Buoy SVG Components ─────────────────────────────────────────

function IsolatedDangerSVG({ size = 80, showLabel = true }) {
  const w = size, h = size * 1.4, cx = w / 2;
  const bodyTop = 34, bodyH = 48, bodyW = 18;
  return (
    <div style={{ textAlign: "center", minWidth: 72 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Two black spheres topmark */}
        <circle cx={cx} cy={10} r={5} fill="#111" />
        <circle cx={cx} cy={24} r={5} fill="#111" />
        {/* Body: black with red band */}
        <rect x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH * 0.33} fill="#111" stroke="#888" strokeWidth="0.5" />
        <rect x={cx - bodyW / 2} y={bodyTop + bodyH * 0.33} width={bodyW} height={bodyH * 0.34} fill="#dc2626" stroke="#888" strokeWidth="0.5" />
        <rect x={cx - bodyW / 2} y={bodyTop + bodyH * 0.67} width={bodyW} height={bodyH * 0.33} fill="#111" stroke="#888" strokeWidth="0.5" />
      </svg>
      {showLabel && <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Isolated Danger</div>}
      {showLabel && <div style={{ fontSize: 10, color: C.textMuted }}>Two spheres</div>}
      {showLabel && <div style={{ fontSize: 10, color: C.accent }}>Fl(2)</div>}
    </div>
  );
}

function SafeWaterSVG({ size = 80, showLabel = true }) {
  const w = size, h = size * 1.4, cx = w / 2;
  const bodyTop = 34, bodyH = 48, bodyW = 18;
  return (
    <div style={{ textAlign: "center", minWidth: 72 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Single red sphere topmark */}
        <circle cx={cx} cy={18} r={5} fill="#dc2626" />
        {/* Body: red and white vertical stripes */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <rect key={i} x={cx - bodyW / 2 + i * (bodyW / 6)} y={bodyTop} width={bodyW / 6} height={bodyH}
            fill={i % 2 === 0 ? "#dc2626" : "#fff"} stroke="#888" strokeWidth="0.3" />
        ))}
        <rect x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill="none" stroke="#888" strokeWidth="0.5" />
      </svg>
      {showLabel && <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Safe Water</div>}
      {showLabel && <div style={{ fontSize: 10, color: C.textMuted }}>Red sphere</div>}
      {showLabel && <div style={{ fontSize: 10, color: C.accent }}>Iso / Oc / Morse A</div>}
    </div>
  );
}

function SpecialMarkSVG({ size = 80, showLabel = true }) {
  const w = size, h = size * 1.4, cx = w / 2;
  const bodyTop = 34, bodyH = 48, bodyW = 18;
  return (
    <div style={{ textAlign: "center", minWidth: 72 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Yellow X topmark */}
        <line x1={cx - 6} y1={10} x2={cx + 6} y2={24} stroke="#ca8a04" strokeWidth="2.5" />
        <line x1={cx + 6} y1={10} x2={cx - 6} y2={24} stroke="#ca8a04" strokeWidth="2.5" />
        {/* Body: solid yellow */}
        <rect x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill="#eab308" stroke="#888" strokeWidth="0.5" />
      </svg>
      {showLabel && <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Special Mark</div>}
      {showLabel && <div style={{ fontSize: 10, color: C.textMuted }}>Yellow X</div>}
      {showLabel && <div style={{ fontSize: 10, color: C.accent }}>Yellow, any rhythm</div>}
    </div>
  );
}

// ─── Buoy Data for Identification Exercise ──────────────────────────────────

const BUOY_DATA = [
  { id: "north", name: "North Cardinal Mark", type: "cardinal", direction: "N",
    description: "Pass to the NORTH of this mark. Black on top, yellow below.",
    light: "Q / VQ (continuous quick or very quick)", topmark: "Both cones pointing up ▲▲",
    mnemonic: "Points up = North" },
  { id: "south", name: "South Cardinal Mark", type: "cardinal", direction: "S",
    description: "Pass to the SOUTH of this mark. Yellow on top, black below.",
    light: "Q(6)+LFl / VQ(6)+LFl (six flashes + one long)", topmark: "Both cones pointing down ▼▼",
    mnemonic: "Points down = South" },
  { id: "east", name: "East Cardinal Mark", type: "cardinal", direction: "E",
    description: "Pass to the EAST of this mark. Black-yellow-black bands.",
    light: "Q(3) / VQ(3) (three flashes, 3 o'clock)", topmark: "Cones base-to-base ▲▼ (Egg)",
    mnemonic: "Egg shape = East" },
  { id: "west", name: "West Cardinal Mark", type: "cardinal", direction: "W",
    description: "Pass to the WEST of this mark. Yellow-black-yellow bands.",
    light: "Q(9) / VQ(9) (nine flashes, 9 o'clock)", topmark: "Cones point-to-point ▼▲ (Wine glass)",
    mnemonic: "Wine glass = West" },
  { id: "port", name: "Port Lateral Mark (IALA A)", type: "lateral", side: "port",
    description: "Keep this mark on your PORT (left) side when entering from sea.",
    light: "Red, any rhythm", topmark: "Red cylinder/can",
    mnemonic: "Port wine is red, can shape" },
  { id: "starboard", name: "Starboard Lateral Mark (IALA A)", type: "lateral", side: "starboard",
    description: "Keep this mark on your STARBOARD (right) side when entering from sea.",
    light: "Green, any rhythm", topmark: "Green cone pointing up",
    mnemonic: "Starboard = green cone" },
  { id: "isolated", name: "Isolated Danger Mark", type: "special",
    description: "Marks a small isolated danger with navigable water all around.",
    light: "White Fl(2) — group of two flashes", topmark: "Two black spheres vertically",
    mnemonic: "Two spheres = isolated danger" },
  { id: "safewater", name: "Safe Water Mark", type: "special",
    description: "Navigable water all around. Used as mid-channel or landfall mark.",
    light: "White — Isophase, Occulting, or Morse 'A'", topmark: "Single red sphere",
    mnemonic: "Red/white stripes, safe all around" },
  { id: "special", name: "Special Mark", type: "special",
    description: "Marks special areas: pipelines, cables, military zones, recreational areas.",
    light: "Yellow, any rhythm", topmark: "Yellow X",
    mnemonic: "Yellow everything = special area" },
];

function BuoyMarkSVG({ buoy, size = 90, showInfo = false }) {
  if (buoy.type === "cardinal") return <CardinalMarkSVG direction={buoy.direction} size={size} showLabel={showInfo} />;
  if (buoy.type === "lateral" && buoy.side === "port") {
    const w = size, h = size * 1.4, cx = w / 2;
    const bodyTop = 34, bodyH = 48, bodyW = 18;
    return (
      <div style={{ textAlign: "center", minWidth: 72 }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <rect x={cx - 6} y={14} width={12} height={10} rx={2} fill="#dc2626" />
          <rect x={cx - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} rx={3} fill="#dc2626" stroke="#888" strokeWidth="0.5" />
        </svg>
        {showInfo && <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Port</div>}
        {showInfo && <div style={{ fontSize: 10, color: C.textMuted }}>Red, can</div>}
      </div>
    );
  }
  if (buoy.type === "lateral" && buoy.side === "starboard") {
    const w = size, h = size * 1.4, cx = w / 2;
    const bodyTop = 34, bodyH = 48;
    return (
      <div style={{ textAlign: "center", minWidth: 72 }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <polygon points={`${cx},10 ${cx - 5},22 ${cx + 5},22`} fill="#16a34a" />
          <polygon points={`${cx - 9},${bodyTop + bodyH} ${cx + 9},${bodyTop + bodyH} ${cx},${bodyTop}`} fill="#16a34a" stroke="#888" strokeWidth="0.5" />
        </svg>
        {showInfo && <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Starboard</div>}
        {showInfo && <div style={{ fontSize: 10, color: C.textMuted }}>Green, cone</div>}
      </div>
    );
  }
  if (buoy.id === "isolated") return <IsolatedDangerSVG size={size} showLabel={showInfo} />;
  if (buoy.id === "safewater") return <SafeWaterSVG size={size} showLabel={showInfo} />;
  if (buoy.id === "special") return <SpecialMarkSVG size={size} showLabel={showInfo} />;
  return null;
}

// ─── Buoy Identification Exercise Component ─────────────────────────────────

function BuoyIdentificationExercise() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [mode, setMode] = useState("visual"); // visual = show buoy guess name, name = show name guess buoy

  function generateQuestion(idx) {
    const correct = BUOY_DATA[idx % BUOY_DATA.length];
    const others = BUOY_DATA.filter(b => b.id !== correct.id);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correct, ...shuffledOthers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelected(null);
    setShowAnswer(false);
  }

  // Initialize on mount
  useState(() => {
    generateQuestion(Math.floor(Math.random() * BUOY_DATA.length));
  });

  // Also regenerate when options are empty (initial render)
  if (options.length === 0) {
    const idx = Math.floor(Math.random() * BUOY_DATA.length);
    const correct = BUOY_DATA[idx];
    const others = BUOY_DATA.filter(b => b.id !== correct.id);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correct, ...shuffledOthers].sort(() => Math.random() - 0.5);
    return (
      <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: `1px solid ${C.border}` }}>
        <div style={{ textAlign: "center", color: C.textMuted }}>Loading...</div>
      </div>
    );
  }

  const buoy = BUOY_DATA[currentIndex % BUOY_DATA.length];

  function handleSelect(idx) {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    setTotal(t => t + 1);
    if (options[idx].id === buoy.id) setScore(s => s + 1);
  }

  function handleNext() {
    const nextIdx = Math.floor(Math.random() * BUOY_DATA.length);
    setCurrentIndex(nextIdx);
    generateQuestion(nextIdx);
  }

  function handleReset() {
    setScore(0);
    setTotal(0);
    handleNext();
  }

  const isCorrect = selected !== null && options[selected]?.id === buoy.id;

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: `1px solid ${C.border}` }}>
      {/* Header with score and mode toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>Identify the Mark</h3>
          <p style={{ margin: 0, fontSize: 12, color: C.textMuted }}>
            {mode === "visual" ? "Look at the buoy and identify it" : "Read the name and pick the correct buoy"}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          {total > 0 && (
            <div style={{ fontSize: 14, fontWeight: 700, color: score / total >= 0.7 ? C.green : C.gold }}>
              {score}/{total} ({Math.round((score / total) * 100)}%)
            </div>
          )}
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#f1f0ed", borderRadius: 8, padding: 3, width: "fit-content" }}>
        {[["visual", "See buoy → Name it"], ["name", "See name → Pick buoy"]].map(([val, label]) => (
          <button key={val} onClick={() => { setMode(val); handleReset(); }} style={{
            padding: "6px 14px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: mode === val ? "#fff" : "transparent",
            color: mode === val ? C.accent : C.textMuted,
            boxShadow: mode === val ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}>{label}</button>
        ))}
      </div>

      {mode === "visual" ? (
        /* Mode 1: Show buoy SVG, pick the name */
        <div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, padding: "16px", background: "#fafaf8", borderRadius: 10 }}>
            <BuoyMarkSVG buoy={buoy} size={100} showInfo={false} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {options.map((opt, i) => {
              const isSel = selected === i;
              const isAns = opt.id === buoy.id;
              let bd = C.border, bg = "#fff", fg = C.text;
              if (showAnswer) {
                if (isAns) { bd = C.green; bg = C.greenLight; fg = C.green; }
                else if (isSel) { bd = C.red; bg = C.redLight; fg = C.red; }
              }
              return (
                <button key={opt.id} onClick={() => handleSelect(i)} disabled={showAnswer} style={{
                  padding: "10px 16px", borderRadius: 8, border: `1.5px solid ${bd}`, background: bg,
                  color: fg, fontSize: 13, fontWeight: 600, cursor: showAnswer ? "default" : "pointer",
                  textAlign: "left", transition: "all 0.15s",
                }}>
                  {showAnswer && isAns && <span style={{ marginRight: 6 }}>✓</span>}
                  {showAnswer && isSel && !isAns && <span style={{ marginRight: 6 }}>✗</span>}
                  {opt.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Mode 2: Show the name, pick the correct buoy SVG */
        <div>
          <div style={{ textAlign: "center", marginBottom: 20, padding: "16px 20px", background: "#fafaf8", borderRadius: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{buoy.name}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Which mark is this?</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 16 }}>
            {options.map((opt, i) => {
              const isSel = selected === i;
              const isAns = opt.id === buoy.id;
              let bd = C.border, bg = "#fff";
              if (showAnswer) {
                if (isAns) { bd = C.green; bg = C.greenLight; }
                else if (isSel) { bd = C.red; bg = C.redLight; }
              }
              return (
                <button key={opt.id} onClick={() => handleSelect(i)} disabled={showAnswer} style={{
                  padding: "12px 8px", borderRadius: 10, border: `2px solid ${bd}`, background: bg,
                  cursor: showAnswer ? "default" : "pointer", transition: "all 0.15s",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                }}>
                  <BuoyMarkSVG buoy={opt} size={70} showInfo={false} />
                  {showAnswer && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: isAns ? C.green : isSel ? C.red : C.textMuted }}>
                      {isAns ? "✓ Correct" : isSel ? "✗" : ""}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Answer details */}
      {showAnswer && (
        <div style={{ padding: "14px 16px", background: isCorrect ? C.greenLight : C.redLight, borderRadius: 10, border: `1px solid ${isCorrect ? C.green + "33" : C.red + "33"}`, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: isCorrect ? C.green : C.red, marginBottom: 6 }}>
            {isCorrect ? "Correct!" : "Not quite."}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{buoy.name}</div>
          <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6, marginBottom: 6 }}>{buoy.description}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 11 }}>
            <div><span style={{ color: C.textMuted }}>Topmark:</span> <span style={{ fontWeight: 600 }}>{buoy.topmark}</span></div>
            <div><span style={{ color: C.textMuted }}>Light:</span> <span style={{ fontWeight: 600 }}>{buoy.light}</span></div>
          </div>
          <div style={{ fontSize: 11, color: C.accent, marginTop: 6, fontStyle: "italic" }}>{buoy.mnemonic}</div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={handleNext} disabled={!showAnswer} style={{
          flex: 1, padding: "9px 16px", borderRadius: 8, border: "none",
          background: showAnswer ? C.accent : C.border, color: showAnswer ? "#fff" : C.textMuted,
          fontSize: 13, fontWeight: 600, cursor: showAnswer ? "pointer" : "not-allowed", transition: "all 0.15s",
        }}>Next Question</button>
        {total > 0 && (
          <button onClick={handleReset} style={{
            padding: "9px 16px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff",
            color: C.text, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Reset</button>
        )}
      </div>
    </div>
  );
}

// ─── QUESTION BANK (100+ questions) ──────────────────────────────────────────

const QUESTIONS = [
  // ══════ NAVIGATION (topic 0) — 20 questions ══════
  { topic: 0, q: "What does the mnemonic 'Can Dead Men Vote Twice' represent?", options: ["The compass correction chain: Compass → Deviation → Magnetic → Variation → True", "The order of precedence in COLREGS: NUC → RAM → Fishing → Sailing → Power", "Steps in a man-overboard recovery: shout, throw, point, manoeuvre", "The VHF Mayday procedure: MAYDAY ×3, vessel name, position, nature of distress"], answer: 0, explanation: "CDMVT stands for Compass, Deviation, Magnetic, Variation, True — the chain for converting between compass and true bearings." },
  { topic: 0, q: "When converting from compass to true bearing, how do you apply East deviation?", options: ["Add it (+)", "Subtract it (−), which is the standard rule for West deviation", "Ignore it — deviation is only used for variation correction", "Double it and subtract one compass point"], answer: 0, explanation: "East is '+' when going from compass to true. The mnemonic: 'Compass to True — Add East' (CTAE)." },
  { topic: 0, q: "When converting from true bearing to compass bearing, how do you apply East variation?", options: ["Subtract it (−)", "Add it (+), which is the standard rule for compass to true conversion", "Ignore it during offshore navigation", "It depends on the hemisphere and magnetic declination"], answer: 0, explanation: "When going True → Compass, the signs reverse. East variation is subtracted. Think of it as unwinding the CDMVT chain." },
  { topic: 0, q: "One minute of latitude on a chart equals what distance?", options: ["1 nautical mile", "1 kilometre", "1 statute mile", "1 cable (0.1 nm)"], answer: 0, explanation: "1 minute of latitude = 1 nautical mile (1,852 metres). This is why you always use the latitude scale on the sides of the chart to measure distance." },
  { topic: 0, q: "Why must you never use the longitude scale to measure distance?", options: ["Because the distance of 1° longitude varies with latitude due to meridian convergence", "Because longitude is measured in hours, not miles, and the scale changes constantly", "Because the longitude scale is only accurate at the equator and useless near the poles", "Because it's printed smaller on the chart and causes navigation errors"], answer: 0, explanation: "Lines of longitude converge at the poles. One degree of longitude is ~60 nm at the equator but 0 nm at the poles. Only the latitude scale gives a consistent distance measure." },
  { topic: 0, q: "What is a krydspejling (cross bearing)?", options: ["Fixing your position from simultaneous bearings to 2–3 charted landmarks", "Steering a zigzag course in a crosswind to maintain control", "Measuring the speed of a tidal current using compass corrections", "A type of compass calibration using the CDMVT chain"], answer: 0, explanation: "A cross bearing fix uses two or three bearings to charted objects, converted to true and plotted on the chart. Where the lines intersect is your fix." },
  { topic: 0, q: "In a running fix (overført pejling), what do you transfer?", options: ["The first bearing line, advanced along the course and distance sailed", "The deviation table from one compass to another vessel", "The vessel's position and course data to the logbook", "The chart datum correction from old charts"], answer: 0, explanation: "You take a bearing to one object, sail a known course and distance, take a second bearing (same or different object), then transfer the first bearing line forward along the track." },
  { topic: 0, q: "What chart symbol represents a position fix?", options: ["A circle with a dot (⊙)", "A triangle (△) for estimated position or dead reckoning", "A square (□) for waypoint markers", "An X with a circle for running fixes"], answer: 0, explanation: "A fix = circle with dot (⊙). An estimated position = triangle (△). A dead reckoning position = a cross (+) or small circle." },
  { topic: 0, q: "What is the speed-distance-time formula?", options: ["Distance = Speed × Time", "Speed = Distance × Time", "Time = Speed × Distance", "Distance = Speed ÷ Time"], answer: 0, explanation: "D = S × T. Distance in nautical miles = speed in knots × time in hours. For minutes: D = S × (T/60)." },
  { topic: 0, q: "Your boat speed is 5 knots. How far do you travel in 36 minutes?", options: ["3.0 nautical miles", "2.5 nautical miles", "1.8 nautical miles", "5.0 nautical miles"], answer: 0, explanation: "D = S × T = 5 × (36/60) = 5 × 0.6 = 3.0 nm." },
  { topic: 0, q: "In the current triangle, where does the current vector start?", options: ["At the DR (dead reckoning) position", "At the GPS position from the last fix", "At the waypoint or next navigation mark", "At the starting position A of the voyage"], answer: 0, explanation: "The current vector starts at the DR position. The boat speed vector then connects from the end of the current vector to the intended track line." },
  { topic: 0, q: "What is 'misvisning' (magnetic variation)?", options: ["The angular difference between true north and magnetic north at a given location", "The compass error caused by metals aboard the vessel like electronics and iron", "The effect of wind on compass readings during storms", "A type of optical illusion in fog or poor visibility"], answer: 0, explanation: "Variation is caused by the Earth's magnetic field not aligning with true north. It varies by location and changes slowly over time. It's printed on the chart's compass rose." },
  { topic: 0, q: "What is deviation?", options: ["Compass error caused by magnetic fields aboard the vessel (iron, electronics)", "The difference between true north and magnetic north", "The effect of current on the vessel's course", "A charting error that is corrected annually"], answer: 0, explanation: "Deviation is specific to each vessel and each heading. It's caused by ferrous metals, speakers, electronics, etc. near the compass. A deviation card shows the error for each heading." },
  { topic: 0, q: "The variation on a chart reads '2°30'W 2018 (annual change 8'E)'. What is the variation in 2025?", options: ["1°34'W", "2°30'W", "3°26'W", "0°00'"], answer: 0, explanation: "7 years × 8'E = 56' East change. Original 2°30'W = 150'W. 150' - 56' = 94'W = 1°34'W." },
  { topic: 0, q: "What does 'leeway' (afdrift) mean?", options: ["The sideways drift of a vessel caused by wind pushing on the hull and rigging", "The distance between two buoys", "The time delay in a tidal current", "The stretch in an anchor line"], answer: 0, explanation: "Leeway is the angular difference between the heading and the actual track through the water, caused by wind. Applied as a correction to the course to steer." },
  { topic: 0, q: "When plotting a course on the chart, all bearings must be in which reference?", options: ["True bearings", "Magnetic bearings", "Compass bearings", "Relative bearings"], answer: 0, explanation: "Charts are drawn to true north. Every bearing must be converted to true (using the CDMVT chain) before it goes on the chart." },
  { topic: 0, q: "What is a 'course made good' (CMG)?", options: ["The actual track over the ground from start to end, accounting for all effects", "The course shown on the compass without current compensation", "The magnetic heading adjusted for variation only", "The planned route before departure from harbour"], answer: 0, explanation: "CMG is the net direction from your starting point to your current position over the ground. It includes the effects of current, leeway, and any steering errors." },
  { topic: 0, q: "You need to plot a position at 56°12.5'N, 011°34.0'E. Which chart scale do you read first?", options: ["The latitude on the side margin, then longitude on the top/bottom margin", "Longitude first, then latitude — the reverse of convention", "It doesn't matter — they're interchangeable on modern digital charts", "Use the depth scale marked in the corner legend"], answer: 0, explanation: "Convention is to read latitude (N/S) from the side margins and longitude (E/W) from the top/bottom margins. Plot the intersection on the chart." },
  { topic: 0, q: "What is the 'danger angle' technique?", options: ["Using a vertical or horizontal angle to a charted object to maintain a safe distance from a hazard", "The angle at which the keel hits the seabed during grounding", "The angle between two current vectors during tidal calculations", "The critical angle of heel before capsizing in rough seas"], answer: 0, explanation: "A danger angle is pre-calculated. As long as the measured angle to a charted object stays above (or below) the danger angle, you know you're clear of the hazard." },
  { topic: 0, q: "If the exam says 'compass course 135°, deviation 3°W, variation 2°E', what is the true course?", options: ["134°", "138° using the reverse CDMVT chain", "130° when rounding to the nearest 5°", "140° using magnetic north as reference"], answer: 0, explanation: "Start at compass 135°. Deviation 3°W → subtract → 132° Magnetic. Variation 2°E → add → 134° True." },

  // ══════ SØVEJSREGLER / COLREGS (topic 1) — 20 questions ══════
  { topic: 1, q: "Two sailing vessels are approaching. Vessel A is on starboard tack, vessel B on port tack. Who keeps clear?", options: ["Vessel B (port tack) keeps clear", "Vessel A (starboard tack) keeps clear", "Both alter course to starboard", "The downwind vessel keeps clear"], answer: 0, explanation: "Rule 12: When two sailing vessels meet, the one on port tack keeps clear of the one on starboard tack." },
  { topic: 1, q: "Two sailing vessels are on the same tack. Who keeps clear?", options: ["The windward vessel keeps clear of the leeward vessel", "The leeward vessel keeps clear", "The larger vessel keeps clear", "Neither — they maintain course"], answer: 0, explanation: "Rule 12: Same tack — the windward vessel keeps clear. The leeward vessel is the stand-on vessel." },
  { topic: 1, q: "What does one short blast on the horn mean?", options: ["I am altering my course to starboard", "I am altering my course to port", "I am going astern", "I am in doubt about your intentions"], answer: 0, explanation: "1 short blast = starboard turn. 2 short = port. 3 short = astern propulsion. 5+ short rapid = danger/doubt." },
  { topic: 1, q: "What does Rule 2 (Responsibility) mean in practice?", options: ["Even the stand-on vessel must act to avoid collision if the give-way vessel fails to act", "Only the give-way vessel has responsibility", "The rules only apply in good visibility", "Larger vessels always take precedence"], answer: 0, explanation: "Rule 2 overrides everything: nothing in the rules relieves any vessel from the consequences of neglect. If collision is imminent, both vessels must act." },
  { topic: 1, q: "In a head-on situation between two power vessels, what should both do?", options: ["Both alter course to starboard so they pass port-to-port", "Both alter course to port", "The smaller vessel gives way", "Both stop and wait"], answer: 0, explanation: "Rule 14: Head-on between two power vessels — both alter to starboard. They pass port-to-port." },
  { topic: 1, q: "An overtaking vessel is approaching from astern. Who keeps clear?", options: ["The overtaking vessel — always, regardless of type", "The vessel being overtaken", "Both share responsibility", "It depends on whether they are sail or power"], answer: 0, explanation: "Rule 13: The overtaking vessel ALWAYS keeps clear. This applies even if the overtaking vessel is under sail and the other under power." },
  { topic: 1, q: "What lights does a sailing vessel underway show at night?", options: ["Sidelights (red port, green starboard) and sternlight (white) — no masthead light", "Masthead light, sidelights, and sternlight", "Only a white all-round light", "Red and green all-round lights at the masthead"], answer: 0, explanation: "Rule 25: A sailing vessel shows sidelights and a sternlight. No masthead (steaming) light — that distinguishes it from a motor vessel at night." },
  { topic: 1, q: "What lights identify a vessel 'not under command' (NUC)?", options: ["Two red all-round lights in a vertical line", "Two green all-round lights in a vertical line", "Three red all-round lights", "A flashing red light"], answer: 0, explanation: "Rule 27: NUC = two red all-round lights vertically. Day shape: two balls vertically. She carries no sidelights or sternlight unless making way." },
  { topic: 1, q: "A power vessel and a sailing vessel are crossing. Who gives way?", options: ["The power vessel gives way (in most situations)", "The sailing vessel gives way", "The vessel on port tack gives way", "The faster vessel gives way"], answer: 0, explanation: "Rule 18: Power gives way to sail — with exceptions for vessels NUC, restricted in manoeuvrability, constrained by draught, and fishing vessels." },
  { topic: 1, q: "Two power-driven vessels are crossing. Vessel A has vessel B on her starboard side. Who gives way?", options: ["Vessel A (she has the other on her starboard side)", "Vessel B", "Both alter to starboard", "The slower vessel"], answer: 0, explanation: "Rule 15: In a crossing situation, the vessel that has the other on her starboard side gives way. Vessel A must keep out of the way of Vessel B." },
  { topic: 1, q: "How many short blasts signal doubt about another vessel's intentions?", options: ["5 or more rapid short blasts", "3 short blasts", "1 prolonged blast", "2 short blasts"], answer: 0, explanation: "Rule 34: Five or more short and rapid blasts is the danger/doubt signal. In inland waters, this is also accompanied by five short flashes." },
  { topic: 1, q: "What is the day shape for a vessel at anchor?", options: ["A black ball in the forepart", "A black cone point down", "A black diamond", "No shape required"], answer: 0, explanation: "Rule 30: Vessel at anchor = one black ball forward. Vessels <7m not in a narrow channel are exempt." },
  { topic: 1, q: "A sailing vessel is also using its engine. What day shape must it show?", options: ["A black cone, point downward", "A black ball", "A black diamond", "No shape required"], answer: 0, explanation: "Rule 25: A sailing vessel proceeding under engine (motorsailing) must show a cone, point down, in the forepart. At night, she shows the lights of a power-driven vessel." },
  { topic: 1, q: "What lights does a motor vessel under 50m show at night?", options: ["One masthead (steaming) light, sidelights, and a sternlight", "Only sidelights and sternlight", "Two masthead lights, sidelights, and sternlight", "An all-round white light only"], answer: 0, explanation: "Rule 23: A power vessel <50m shows one masthead light forward, sidelights, and a sternlight. Vessels ≥50m add a second (aft, higher) masthead light." },
  { topic: 1, q: "What does a vessel show when she is restricted in her ability to manoeuvre?", options: ["Red-white-red all-round lights vertically (by night) / ball-diamond-ball (by day)", "Two red all-round lights vertically", "Three green all-round lights vertically", "A flashing amber light"], answer: 0, explanation: "Rule 27: RAM = Red, White, Red all-round lights vertically at night. By day: ball, diamond, ball vertically." },
  { topic: 1, q: "What lights does a trawler show to identify itself?", options: ["Green over white all-round lights, plus sidelights and sternlight if making way", "Red over white all-round lights", "Two white all-round lights vertically", "A flashing yellow light"], answer: 0, explanation: "Rule 26: A trawler shows green over white all-round lights. A fishing vessel (not trawling) shows red over white. Both add sidelights and sternlight when making way." },
  { topic: 1, q: "Rule 7 says you should assume risk of collision exists if what condition is met?", options: ["The compass bearing to an approaching vessel does not appreciably change", "The other vessel is within 1 nautical mile", "You can see the other vessel's hull", "The other vessel is travelling faster than you"], answer: 0, explanation: "Rule 7: If the bearing to an approaching vessel doesn't change (constant bearing, decreasing range — CBDR), collision is likely. When in doubt, assume risk exists." },
  { topic: 1, q: "What does three short blasts on the horn mean?", options: ["My engines are going astern (I am operating astern propulsion)", "I am turning to starboard", "I am in distress", "I am at anchor"], answer: 0, explanation: "Rule 34: Three short blasts = 'I am operating astern propulsion.' Note: this doesn't necessarily mean the vessel is moving backwards — just that the engines are in reverse." },
  { topic: 1, q: "What is the hierarchy of 'give way' under Rule 18?", options: ["Power → Sailing → Fishing → CBD → RAM → NUC (each gives way to those further right)", "All vessels are equal in terms of navigation rights and obligations", "Larger vessels always have priority regardless of vessel type", "Only sail gives way to power-driven vessels"], answer: 0, explanation: "Rule 18 hierarchy (most privileged first): NUC → RAM → Constrained by Draught → Fishing → Sailing → Power-driven. Each gives way to those above it." },
  { topic: 1, q: "A vessel aground at night shows what lights?", options: ["The anchor lights PLUS two red all-round lights vertically", "Only two red lights vertically with no anchor light", "A flashing red light at the bow and stern", "Three red lights vertically arranged on the mast"], answer: 0, explanation: "Rule 30: A vessel aground shows anchor lights (ball forward, white all-round) plus two red all-round lights in a vertical line. By day: three balls vertically." },

  // ══════ FARVANDSAFMÆRKNING / BUOYAGE (topic 2) — 16 questions ══════
  { topic: 2, q: "In IALA Region A (used in Denmark), what colour is a port-hand lateral mark?", options: ["Red", "Green", "Yellow", "Black and yellow"], answer: 0, explanation: "IALA Region A: port marks are red (can shape). Starboard marks are green (cone shape). Remember: 'Port wine is red.'" },
  { topic: 2, q: "What is the shape of a starboard-hand lateral buoy?", options: ["Conical (cone/triangle pointing up)", "Cylindrical (can)", "Spherical", "Pillar with X topmark"], answer: 0, explanation: "Starboard = green cone. Port = red can. When entering from sea, starboard is on your right." },
  { topic: 2, q: "What is the top mark pattern for a North cardinal mark?", options: ["Both cones pointing up ▲▲", "Both cones pointing down ▼▼", "Cones base-to-base ▲▼", "Cones point-to-point ▼▲"], answer: 0, explanation: "North cardinal: both cones point UP. Pass to the north of the mark to find safe water." },
  { topic: 2, q: "What is the top mark for a South cardinal mark?", options: ["Both cones pointing down ▼▼", "Both cones pointing up ▲▲", "Cones base-to-base", "Cones point-to-point"], answer: 0, explanation: "South cardinal: both cones point DOWN. Pass to the south of the mark." },
  { topic: 2, q: "What mnemonic helps remember the East cardinal top mark?", options: ["Egg — cones base-to-base ▲▼", "Eagle — cones up", "Exit — cones apart", "Empty — no topmark"], answer: 0, explanation: "East = Egg shape. Cones are base-to-base, forming an egg-like profile." },
  { topic: 2, q: "What mnemonic helps remember the West cardinal top mark?", options: ["Wine glass — cones point-to-point ▼▲", "Wave — cones sideways", "Whistle — one cone up", "Wheel — circular"], answer: 0, explanation: "West = Wine glass shape. Cones are point-to-point, forming a wine glass profile." },
  { topic: 2, q: "What is the light character of a West cardinal mark?", options: ["Q(9) or VQ(9) — nine flashes", "Q(3) or VQ(3) — three flashes", "Q(6)+LFl — six flashes plus one long", "Continuous quick flashing"], answer: 0, explanation: "Use the clockface: N=12 o'clock (continuous Q), E=3 (three flashes), S=6 (six + long), W=9 (nine flashes)." },
  { topic: 2, q: "What is the light character of a South cardinal mark?", options: ["Q(6)+LFl or VQ(6)+LFl — six flashes plus one long flash", "Q(3) — three flashes", "Q(9) — nine flashes", "Continuous quick flashing"], answer: 0, explanation: "South = 6 o'clock on the clockface → 6 flashes + 1 long flash. The long flash helps distinguish it from East (3 flashes)." },
  { topic: 2, q: "What does a safe water mark look like?", options: ["Red and white vertical stripes, spherical buoy, red sphere topmark", "Black with red horizontal bands, two black sphere topmarks", "Yellow with yellow X topmark", "Green with green cone topmark"], answer: 0, explanation: "Safe water marks indicate navigable water all around. Used as mid-channel or landfall marks. Light: Isophase, occulting, or Morse 'A' (dot-dash)." },
  { topic: 2, q: "What does an isolated danger mark look like?", options: ["Black with one or more red horizontal bands, topmark: two black spheres vertically", "Red with one black band", "Yellow with black band", "Green and red horizontal stripes"], answer: 0, explanation: "Isolated danger marks sit on or near a small hazard with navigable water all around. Light: Fl(2) — group of two flashes." },
  { topic: 2, q: "What colour and shape is a special mark?", options: ["Yellow, with a yellow X topmark", "Red and white stripes", "Green with a triangle", "Black with yellow bands"], answer: 0, explanation: "Special marks are yellow with an X topmark. They mark areas like military exercise zones, cables, pipelines, or recreational areas." },
  { topic: 2, q: "A preferred channel buoy has red and green horizontal bands with red on top. What does this mean?", options: ["The preferred channel is to port — treat it as a port-hand mark", "The preferred channel is to starboard", "Danger on both sides", "Safe water all around"], answer: 0, explanation: "The top colour tells you how to treat it. Red on top = treat as port mark. The preferred (main) channel goes to port of the buoy." },
  { topic: 2, q: "You see a buoy with two black cones point-to-point (▼▲) and yellow-black-yellow horizontal bands. What is it?", options: ["A West cardinal mark — pass to the west", "An East cardinal mark", "A North cardinal mark", "An isolated danger mark"], answer: 0, explanation: "Point-to-point cones (wine glass) = West cardinal. The body is yellow-black-yellow (black band in the middle). Pass to the west." },
  { topic: 2, q: "At night you see a light flashing in groups of 3. What cardinal mark is this?", options: ["East cardinal — Q(3) or VQ(3)", "West cardinal", "South cardinal", "North cardinal"], answer: 0, explanation: "Clockface: 3 flashes = East (3 o'clock). North = continuous, East = 3, South = 6+1 long, West = 9." },
  { topic: 2, q: "What does a North cardinal mark's body colouring look like?", options: ["Black on top, yellow on bottom", "Yellow on top, black on bottom", "Black-yellow-black horizontal bands", "Yellow-black-yellow horizontal bands"], answer: 0, explanation: "North cardinal: black on top (like the cones pointing up), yellow below. The black section matches where the cone points go." },
  { topic: 2, q: "When entering a harbour from the sea, which side should port marks be on?", options: ["On your left (port) side", "On your right (starboard) side", "Directly ahead as mid-channel markers", "Either side"], answer: 0, explanation: "Coming from sea = conventional direction of buoyage. Port marks (red) go on your port (left) side." },

  // ══════ SØSIKKERHED / SAFETY (topic 3) — 14 questions ══════
  { topic: 3, q: "What is the correct opening for a VHF Mayday call?", options: ["MAYDAY × 3, THIS IS [vessel name] × 3", "PAN PAN × 3, THIS IS [vessel name] × 3, used for urgent situations", "SECURITÉ × 3, THIS IS [vessel name] × 3, for safety warnings", "SOS × 3 via Morse code on single sideband radio"], answer: 0, explanation: "Mayday is for grave and imminent danger. The call goes: MAYDAY ×3, THIS IS [name] ×3, MAYDAY [name], MY POSITION IS..., nature of distress, assistance required, POB, OVER." },
  { topic: 3, q: "On which VHF channel do you broadcast a Mayday?", options: ["Channel 16 (156.800 MHz)", "Channel 70 for DSC digital alerts", "Channel 12 for bridge-to-bridge", "Channel 6 for intership safety"], answer: 0, explanation: "Channel 16 is the international distress, safety, and calling frequency. Channel 70 is for DSC (Digital Selective Calling) distress alerts." },
  { topic: 3, q: "What is the difference between MAYDAY, PAN PAN, and SECURITÉ?", options: ["MAYDAY = grave danger to life/vessel; PAN PAN = urgent but no immediate danger; SECURITÉ = safety information", "They are interchangeable on VHF frequencies", "MAYDAY is for vessels, PAN PAN for people, SECURITÉ for aircraft", "MAYDAY = fire, PAN PAN = sinking, SECURITÉ = grounding"], answer: 0, explanation: "MAYDAY: life or vessel in grave and imminent danger. PAN PAN: urgent situation but no immediate danger to life. SECURITÉ: navigational or weather safety warning." },
  { topic: 3, q: "What is the first thing you should do when someone falls overboard?", options: ["Shout 'MAN OVERBOARD', throw floatation, assign a spotter, and note the position", "Jump in after them immediately to maintain contact", "Call the coast guard first and wait for instructions", "Turn the engine off to reduce prop hazard"], answer: 0, explanation: "Immediate actions: shout alarm, throw anything that floats, assign someone to point at the MOB continuously, press MOB on GPS. Then manoeuvre to recover." },
  { topic: 3, q: "What colour are distress flares?", options: ["Red (handheld and parachute)", "Green for signalling other vessels", "White for illumination and position marking", "Blue for underwater safety zones"], answer: 0, explanation: "Red flares = distress. Orange smoke = daytime distress signal. White flares are NOT distress signals — they indicate your position or warn of your presence." },
  { topic: 3, q: "What does EPIRB stand for?", options: ["Emergency Position Indicating Radio Beacon", "Electronic Position Information Relay Buoy transmits distress", "Emergency Portable Inflatable Rescue Boat for evacuation", "Environmental Protection and Incident Response Beacon"], answer: 0, explanation: "An EPIRB transmits a distress signal via satellite on 406 MHz, including GPS position, to alert rescue coordination centres worldwide." },
  { topic: 3, q: "What is a SART?", options: ["Search and Rescue Transponder — a radar transponder that helps rescue vessels locate you", "Safety And Radio Telephone — a VHF backup unit", "Standard Automatic Rescue Trigger — an automatic flare launcher", "Satellite Assisted Rescue Tracker for GPS location"], answer: 0, explanation: "A SART responds to radar signals from rescue vessels and aircraft, creating a distinctive pattern of dots on their radar screen, leading them to your position." },
  { topic: 3, q: "What are the symptoms of hypothermia?", options: ["Shivering → confusion → slurred speech → drowsiness → loss of consciousness", "Sunburn and dehydration from sun exposure", "Rapid breathing and high fever from infection", "Nausea and vomiting from seasickness only"], answer: 0, explanation: "Hypothermia progresses: shivering and clumsiness → confusion and slurred speech → drowsiness → unconsciousness → cardiac arrest. Handle victims gently and warm gradually." },
  { topic: 3, q: "In treating a hypothermia victim recovered from the water, what should you NOT do?", options: ["Rub their extremities vigorously or give them alcohol", "Remove wet clothing immediately and immerse in hot water", "Handle them rough and keep them upright for faster recovery", "Give ice-cold drinks to shock the system awake"], answer: 0, explanation: "Never rub extremities (cold blood rushes to the heart), give alcohol (dilates blood vessels, increases heat loss), or handle roughly (risk of cardiac arrest). Warm gradually and gently." },
  { topic: 3, q: "How long can a person survive in 10°C water without a survival suit?", options: ["Approximately 1–2 hours without thermal protection", "About 10 minutes in shock before hypothermia", "6–8 hours with proper insulation", "24 hours or more with exceptional fitness"], answer: 0, explanation: "In 10°C water, survival time without thermal protection is roughly 1-2 hours. A life jacket keeps the head above water when consciousness is lost, extending survival time." },
  { topic: 3, q: "What safety equipment must you carry for each person on board?", options: ["A life jacket (redningsvest)", "A survival suit for cold water protection", "A personal EPIRB with registration", "A personal flare attached to clothing"], answer: 0, explanation: "Danish regulations require a life jacket for every person on board. Additional equipment (life raft, flares, EPIRB, etc.) depends on vessel size, type, and area of operation." },
  { topic: 3, q: "What is the purpose of DSC (Digital Selective Calling) on VHF?", options: ["To send an automated digital distress alert with vessel ID and position on Channel 70", "To send text messages between vessels on DSC text mode", "To encrypt VHF communications with military-grade encoding", "To improve audio quality on Channel 16 with digital signal processing"], answer: 0, explanation: "DSC sends a digital alert on Ch70 that is received by all equipped vessels and coast stations. It includes your MMSI, position, and nature of distress, triggering automatic alarms." },
  { topic: 3, q: "A white flare at night means what?", options: ["It signals your presence — it is NOT a distress signal", "Distress and imminent danger", "All clear and safe passage ahead", "Man overboard in the water"], answer: 0, explanation: "White flares (or white lights) are used to signal your presence to other vessels or to illuminate an area. They are explicitly NOT distress signals." },
  { topic: 3, q: "What does 'PAN PAN' indicate?", options: ["An urgent situation concerning the safety of a vessel or person, but no immediate danger to life", "Grave and imminent danger to life or vessel", "A navigational warning", "An all-clear signal after a distress"], answer: 0, explanation: "PAN PAN (from French 'panne' = breakdown) indicates urgency without immediate danger to life. Examples: engine failure, medical emergency that is not life-threatening, dismasting." },

  // ══════ METEOROLOGY (topic 4) — 12 questions ══════
  { topic: 4, q: "At what Beaufort force does it typically become dangerous for small craft?", options: ["Force 6 — strong breeze (22–27 knots)", "Force 3 — gentle breeze, 7-10 knots", "Force 4 — moderate breeze, 11-16 knots", "Force 9 — severe gale, 40-47 knots"], answer: 0, explanation: "Force 6 (strong breeze, 22-27 kn) is the general threshold for small craft warnings. Larger waves form and spray is likely. Many recreational vessels should seek shelter." },
  { topic: 4, q: "What is Beaufort Force 0?", options: ["Calm — less than 1 knot of wind, sea like a mirror", "Light air — 1 to 3 knots, slight ripples", "Light breeze — 4 to 6 knots, small wavelets", "Moderate breeze — 11 to 16 knots, small waves"], answer: 0, explanation: "Beaufort 0 = Calm. Wind below 1 knot, sea surface is mirror-smooth." },
  { topic: 4, q: "What is Beaufort Force 8?", options: ["Gale — 34 to 40 knots, high waves, foam in streaks", "Strong breeze — 22 to 27 knots, moderate waves", "Violent storm — 56 to 63 knots, huge waves", "Fresh breeze — 17 to 21 knots, small waves form"], answer: 0, explanation: "Force 8 = Gale. Winds 34-40 kn, waves 5.5-7.5m, spray reduces visibility. Very dangerous for small vessels." },
  { topic: 4, q: "What typically happens to wind when a cold front passes?", options: ["Wind veers (shifts clockwise) sharply, often to NW, with gusts and temperature drop", "Wind backs to the south and gradually weakens", "Wind drops to calm before the front", "Wind direction doesn't change during passage"], answer: 0, explanation: "Cold front passage: sudden wind veer (clockwise shift, often to NW/W), gusty conditions, temperature drop, clearing showers. Pressure rises after passage." },
  { topic: 4, q: "What weather precedes a warm front?", options: ["High clouds gradually lowering, backing wind, steady rain or drizzle", "Sudden thunderstorms and very gusty winds", "Clear skies and calm conditions before arrival", "Fog only in coastal areas"], answer: 0, explanation: "Warm front approach: cirrus (high) clouds first, then lower clouds, wind backs (anti-clockwise), barometer falls steadily, rain becomes continuous. Temperature rises after passage." },
  { topic: 4, q: "What is a sea breeze?", options: ["Wind blowing from sea to land during the day, caused by land heating faster than the sea", "Wind blowing from land to sea at night (land breeze)", "A strong wind during a storm at sea or gale", "A permanent offshore wind pattern"], answer: 0, explanation: "Daytime: land heats faster → air rises → cooler air drawn in from sea = sea breeze (onshore). It develops late morning, peaks in the afternoon." },
  { topic: 4, q: "What is a land breeze?", options: ["Wind blowing from land to sea at night, caused by land cooling faster than the sea", "Wind blowing from sea to land during the day (sea breeze)", "A strong gale from the mountains toward sea", "A constant wind along the coast year-round"], answer: 0, explanation: "At night, land cools faster than the sea → air sinks over land → flows offshore = land breeze. Usually weaker than a sea breeze." },
  { topic: 4, q: "A rapidly falling barometer typically indicates what?", options: ["An approaching storm or deep low-pressure system with strong winds", "Settled fine weather ahead with light winds", "The instrument needs calibration or maintenance", "Fog is forming near the coast"], answer: 0, explanation: "A fall of more than 3 hPa in 3 hours is considered rapid. It strongly indicates approaching strong winds or a storm." },
  { topic: 4, q: "What does 'veering wind' mean?", options: ["The wind direction shifts clockwise (e.g., from S to W to N)", "The wind direction shifts anti-clockwise (backing)", "The wind speed increases gradually", "The wind speed decreases with distance"], answer: 0, explanation: "Veering = clockwise shift (e.g., SW → W → NW). Backing = anti-clockwise shift (NW → W → SW). In the Northern Hemisphere, veering typically follows a cold front." },
  { topic: 4, q: "Wind force 4 on the Beaufort scale is described as what?", options: ["Moderate breeze — 11 to 16 knots, small waves with frequent whitecaps", "Light breeze — 4 to 6 knots, barely noticeable", "Strong breeze — 22 to 27 knots, difficult sailing", "Near gale — 28 to 33 knots, dangerous conditions"], answer: 0, explanation: "Force 4 (moderate breeze): 11-16 kn, small waves 1-1.5m, frequent whitecaps. Good sailing conditions for experienced sailors." },
  { topic: 4, q: "What type of clouds are associated with an approaching warm front?", options: ["Cirrus (high, wispy) first, gradually lowering to stratus with steady rain", "Cumulonimbus (towering thunderheads) with hail", "Fog with no visible clouds at low altitudes", "Cumulus (puffy fair-weather clouds) with blue sky"], answer: 0, explanation: "Warm front cloud sequence: Cirrus → Cirrostratus → Altostratus → Nimbostratus. Each layer is lower, with rain starting at the Altostratus/Nimbostratus level." },
  { topic: 4, q: "What does DMI stand for in the context of Danish weather?", options: ["Danmarks Meteorologiske Institut — the national weather service", "Danish Maritime Intelligence agency", "Digital Maritime Information system", "Danish Marine Inspectorate authority"], answer: 0, explanation: "DMI (Danmarks Meteorologiske Institut) issues marine weather forecasts for all Danish waters. Sailors should check the DMI marine forecast before any passage." },

  // ══════ FIRE SAFETY (topic 5) — 10 questions ══════
  { topic: 5, q: "What are the three elements of the fire triangle?", options: ["Fuel, oxygen, and heat", "Water, wind, and spark — incorrect elements", "Fuel, pressure, and flame in combustion", "Wood, air, and electricity as sources"], answer: 0, explanation: "Remove any one of fuel, oxygen, or heat and the fire goes out. This is the principle behind all firefighting." },
  { topic: 5, q: "What type of extinguisher should you use on a liquid fuel fire (Class B)?", options: ["Foam or CO₂ (never water)", "Water (spreads burning liquids)", "Only a fire blanket for small fires", "Sand only for deck spills"], answer: 0, explanation: "Class B (flammable liquids): use foam, CO₂, or dry powder. Water spreads burning liquids and makes things worse." },
  { topic: 5, q: "When should you stop fighting a fire and evacuate?", options: ["When the fire is out of control, spreading, or producing dangerous fumes you cannot avoid", "Only when the captain gives direct order", "Never — always fight to the end", "As soon as any fire is detected on deck"], answer: 0, explanation: "Fight a fire only while it's safe. If it's beyond control, producing toxic fumes, or threatening structural integrity — abandon firefighting, close off the space, and evacuate." },
  { topic: 5, q: "What class of fire involves electrical equipment?", options: ["Class C (or E in some classifications) — use CO₂ or dry powder, never water", "Class A — use water for wood fires", "Class B — use foam for liquid fires", "Class D — use wet chemical for grease"], answer: 0, explanation: "Electrical fires: disconnect power if possible, then use CO₂ or dry powder. Water and foam conduct electricity and create electrocution risk." },
  { topic: 5, q: "What is a Class A fire?", options: ["A fire involving solid combustible materials like wood, paper, textiles", "A fire involving flammable liquids and fuels", "A fire involving gases under pressure", "A fire involving metals in cargo"], answer: 0, explanation: "Class A = solid materials (wood, paper, fabric, etc.). Best extinguished with water or foam." },
  { topic: 5, q: "Where should you aim when using a fire extinguisher?", options: ["At the base of the fire, not the flames", "At the top of the flames above", "At the smoke and flames", "At the fuel source above the fire area"], answer: 0, explanation: "Always aim at the base of the fire — that's where the fuel is burning. Spraying at the flames above is ineffective." },
  { topic: 5, q: "On a boat, which type of fire extinguisher is the most versatile?", options: ["Dry powder — effective on Class A, B, and electrical fires", "Water — effective on all classes of fire", "CO₂ only for electrical fires", "Wet chemical only for deep fat fryers"], answer: 0, explanation: "A dry powder extinguisher handles the widest range of fire types on a boat: solids (A), liquids (B), and electrical fires. The downside is cleanup and potential visibility loss in enclosed spaces." },
  { topic: 5, q: "What is the fire triangle strategy for fighting an engine room fire?", options: ["Starve it of oxygen by closing hatches, vents, and fuel lines", "Pour water into the engine room to cool", "Open all hatches to clear smoke quickly", "Wait for it to burn out naturally at sea"], answer: 0, explanation: "Close all openings (hatches, vents, doors) to remove oxygen. Shut off the fuel supply to remove fuel. Use fixed extinguishing systems if fitted. Never open a closed space that's on fire without being ready." },
  { topic: 5, q: "What should you always ensure before attempting to fight a fire on board?", options: ["That you have a clear escape route behind you", "That all passengers are watching and ready", "That you have removed your life jacket", "That you are standing directly over fire"], answer: 0, explanation: "Always position yourself between the fire and your escape route. If the fire grows, you need to retreat safely. Never let fire get between you and the exit." },
  { topic: 5, q: "A gas leak on board (e.g., propane/butane) creates what fire risk?", options: ["Explosive atmosphere — gas sinks and accumulates in the bilge, one spark can cause an explosion", "Minimal risk since gas disperses quickly offshore", "Only a risk if the stove is already lit", "No risk if the hatches are open wide"], answer: 0, explanation: "LPG (propane/butane) is heavier than air and sinks into the bilge where it can accumulate. A spark from a switch, engine, or lighter can cause a violent explosion. Ventilate thoroughly and use a gas detector." },

  // ══════ WATCHKEEPING & ENVIRONMENT (topic 6) — 10 questions ══════
  { topic: 6, q: "What is the primary requirement of Rule 5 (Lookout)?", options: ["A proper lookout at all times by sight, hearing, and all available means", "Checking the engine room hourly for leaks", "Monitoring the VHF radio continuously for traffic", "Having binoculars available on the bridge"], answer: 0, explanation: "Rule 5 of COLREGS: every vessel shall at all times maintain a proper lookout by sight and hearing as well as by all available means appropriate in the prevailing circumstances." },
  { topic: 6, q: "Why is fatigue a serious watchkeeping concern?", options: ["It impairs judgment, reaction time, and lookout effectiveness as much as alcohol", "It only affects the helmsman at the wheel", "It's only relevant on voyages longer than 48 hours at sea", "It's not a concern on recreational vessels"], answer: 0, explanation: "Fatigue reduces alertness, reaction time, and decision-making quality. Many maritime accidents involve fatigue. Even on short trips, plan rest and share the watch." },
  { topic: 6, q: "What is prohibited regarding waste disposal at sea under Danish law?", options: ["Discharge of oil, chemicals, sewage, and garbage", "Disposal of food waste beyond 12 nm from coast", "Pumping clean bilge water into the sea", "Using biodegradable soap to wash the deck area"], answer: 0, explanation: "MARPOL and Danish law prohibit discharge of oil, oily water, chemicals, sewage, and garbage in most circumstances. Penalties are severe — always bring waste ashore." },
  { topic: 6, q: "If you observe pollution at sea, what must you do?", options: ["Report it to the maritime authorities (SOK / Coast Guard)", "Ignore it — it's not your responsibility", "Try to clean it up yourself at sea", "Document it for social media sharing"], answer: 0, explanation: "You are legally obligated to report pollution observed at sea. In Denmark, contact SOK (Søværnets Operative Kommando) or call the coast guard." },
  { topic: 6, q: "What is the purpose of anti-fouling paint regulations?", options: ["To prevent the use of toxic paints (e.g., TBT) that harm marine ecosystems", "To ensure all boats are the same colour scheme", "To protect the hull from corrosion only", "To improve boat speed and efficiency"], answer: 0, explanation: "Certain anti-fouling paints (especially those containing TBT — tributyltin) are extremely toxic to marine life. International and Danish regulations ban harmful anti-fouling compounds." },
  { topic: 6, q: "What should a proper watch routine include?", options: ["Regular position checks, monitoring course/speed/depth, scanning for vessels and weather changes, and checking navigation lights", "Only checking the GPS every hour for position", "Only looking forward while steering carefully", "Listening to music while on the helm"], answer: 0, explanation: "A proper watch involves: position fixing, course monitoring, lookout in all directions, weather observation, checking instruments, monitoring VHF, and checking navigation lights." },
  { topic: 6, q: "You notice an uncharted obstruction in a navigational channel. What should you do?", options: ["Report it to the maritime authorities immediately — it's a danger to navigation", "Mark it with a personal buoy and lights", "Post about it in a sailing forum online", "Ignore it — someone else will find it"], answer: 0, explanation: "Dangers to navigation (uncharted rocks, missing buoys, floating containers, etc.) must be reported to maritime authorities so they can issue warnings and correct charts." },
  { topic: 6, q: "What is MARPOL?", options: ["The International Convention for the Prevention of Pollution from Ships", "A Danish maritime police force", "A marine weather warning system", "A type of marine diesel fuel"], answer: 0, explanation: "MARPOL (Marine Pollution) is the main international convention covering prevention of pollution of the marine environment by ships. It has six annexes covering oil, chemicals, sewage, garbage, etc." },
  { topic: 6, q: "Where should you pump out your sewage tank?", options: ["At a designated pump-out station in harbour", "Anywhere beyond 3 nm offshore", "Into the harbour basin if it's a large harbour", "Overboard when no one is watching"], answer: 0, explanation: "Use pump-out stations in harbour. Discharge of sewage is prohibited in most Danish coastal waters. Many harbours now have pump-out facilities." },
  { topic: 6, q: "When should your navigation lights be displayed?", options: ["From sunset to sunrise, and during the day in restricted visibility", "Only in fog conditions", "Only in shipping lanes", "Only when you see other vessels"], answer: 0, explanation: "Rule 20: Navigation lights must be displayed from sunset to sunrise and during the day in restricted visibility (fog, heavy rain, snow, etc.)." },

  // ══════ VISUAL IDENTIFICATION — COLREGS Vessel Lights (topic 1) ══════
  { topic: 1, q: "Identify this vessel from its navigation lights:", visual: { type: "vessel", id: "power-underway-lt50" }, options: ["Power vessel underway (<50m)", "Sailing vessel underway", "Vessel not under command (NUC)", "Vessel at anchor"], answer: 0, explanation: "One white masthead light + red/green sidelights = power vessel under 50m underway (Rule 23). A sailing vessel would not show a masthead light." },
  { topic: 1, q: "What type of vessel is showing these lights?", visual: { type: "vessel", id: "sail-underway" }, options: ["Sailing vessel underway", "Power vessel underway (<50m)", "Vessel restricted in ability to manoeuvre", "Fishing vessel (not trawling)"], answer: 0, explanation: "Red and green sidelights with a white sternlight but NO masthead light = sailing vessel (Rule 25). The absence of a masthead/steaming light is the key." },
  { topic: 1, q: "You see these lights at night. What vessel type is this?", visual: { type: "vessel", id: "nuc-not-making-way" }, options: ["Vessel not under command, not making way", "Vessel at anchor in deep water", "Vessel restricted in ability to manoeuvre", "Pilot vessel on duty"], answer: 0, explanation: "Two red all-round lights in a vertical line with no sidelights = NUC not making way (Rule 27). If making way, sidelights and sternlight would also be shown." },
  { topic: 1, q: "Identify this vessel from its navigation lights:", visual: { type: "vessel", id: "ram-making-way" }, options: ["Vessel restricted in ability to manoeuvre (RAM)", "Vessel not under command (NUC)", "Vessel constrained by draught", "Power vessel underway (>50m)"], answer: 0, explanation: "Red-white-red all-round lights vertically = RAM (Rule 27). NUC shows two red lights (no white between them). RAM adds sidelights and sternlight when making way." },
  { topic: 1, q: "What type of vessel displays these lights?", visual: { type: "vessel", id: "trawler-making-way" }, options: ["Trawler making way", "Sailing vessel with tricolour light", "Vessel at anchor showing riding lights", "Power vessel underway (<50m)"], answer: 0, explanation: "Green over white all-round lights + sidelights = trawler making way (Rule 26). Green over white is the distinctive trawler signal. Fishing (not trawling) shows red over white." },
  { topic: 1, q: "You see these lights ahead at night. What is this vessel?", visual: { type: "vessel", id: "power-underway-gt50" }, options: ["Power vessel underway (>50m)", "Power vessel underway (<50m)", "Trawler making way", "Vessel restricted in ability to manoeuvre"], answer: 0, explanation: "Two white masthead lights (aft higher than forward) + sidelights = power vessel ≥50m (Rule 23). Vessels <50m show only one masthead light." },
  { topic: 1, q: "Identify this vessel from its lights:", visual: { type: "vessel", id: "fishing-not-trawling" }, options: ["Fishing vessel (not trawling) making way", "Trawler making way", "Vessel not under command, making way", "Pilot vessel on station"], answer: 0, explanation: "Red over white all-round lights + sidelights = fishing vessel not trawling, making way (Rule 26). A trawler shows green over white instead." },
  { topic: 1, q: "What vessel is showing these navigation lights?", visual: { type: "vessel", id: "aground" }, options: ["Vessel aground", "Vessel at anchor", "Vessel not under command (NUC)", "Vessel restricted in ability to manoeuvre"], answer: 0, explanation: "Anchor light(s) plus two red all-round lights = vessel aground (Rule 30). NUC shows two reds but no anchor light. A vessel merely at anchor shows only white anchor light(s)." },

  // ══════ VISUAL IDENTIFICATION — Buoyage Marks (topic 2) ══════
  { topic: 2, q: "Identify this navigation mark:", visual: { type: "buoy", id: "north" }, options: ["North cardinal mark — pass to the north", "South cardinal mark — pass to the south", "East cardinal mark — pass to the east", "Isolated danger mark — navigate around"], answer: 0, explanation: "Both topmark cones pointing UP (▲▲) = North cardinal. Black on top, yellow below. Pass to the north. Light: continuous quick/very quick flashing." },
  { topic: 2, q: "What type of mark is this?", visual: { type: "buoy", id: "south" }, options: ["South cardinal mark — pass to the south", "North cardinal mark — pass to the north", "West cardinal mark — pass to the west", "Safe water mark — navigable water all around"], answer: 0, explanation: "Both topmark cones pointing DOWN (▼▼) = South cardinal. Yellow on top, black below. Pass to the south. Light: Q(6)+LFl (six flashes + one long)." },
  { topic: 2, q: "You see this mark ahead. What is it?", visual: { type: "buoy", id: "east" }, options: ["East cardinal mark — pass to the east", "West cardinal mark — pass to the west", "North cardinal mark — pass to the north", "Special mark — marks a restricted area"], answer: 0, explanation: "Topmark cones base-to-base (▲▼, egg shape) = East cardinal. Black-yellow-black body. Pass to the east. Light: Q(3) or VQ(3) — three flashes (3 o'clock)." },
  { topic: 2, q: "Identify this navigation mark:", visual: { type: "buoy", id: "west" }, options: ["West cardinal mark — pass to the west", "East cardinal mark — pass to the east", "South cardinal mark — pass to the south", "Isolated danger mark — navigate around"], answer: 0, explanation: "Topmark cones point-to-point (▼▲, wine glass shape) = West cardinal. Yellow-black-yellow body. Pass to the west. Light: Q(9) or VQ(9) — nine flashes (9 o'clock)." },
  { topic: 2, q: "What type of navigation mark is shown here?", visual: { type: "buoy", id: "port" }, options: ["Port lateral mark (IALA A) — keep to port when entering", "Starboard lateral mark (IALA A) — keep to starboard", "Special mark — yellow with X topmark", "Safe water mark — mid-channel marker"], answer: 0, explanation: "Red can/cylinder shape = port lateral mark in IALA Region A. Keep it on your left (port) side when entering harbour from the sea." },
  { topic: 2, q: "Identify this mark:", visual: { type: "buoy", id: "starboard" }, options: ["Starboard lateral mark (IALA A) — keep to starboard when entering", "Port lateral mark (IALA A) — keep to port", "North cardinal mark — pass to the north", "Special mark — marks a restricted area"], answer: 0, explanation: "Green conical shape = starboard lateral mark in IALA Region A. Keep it on your right (starboard) side when entering harbour from the sea." },
  { topic: 2, q: "What does this navigation mark indicate?", visual: { type: "buoy", id: "isolated" }, options: ["Isolated danger — small hazard with navigable water around it", "Safe water — navigable water all around", "Special mark — pipeline or cable crossing", "South cardinal — pass to the south"], answer: 0, explanation: "Black body with red band(s) and two black sphere topmarks = isolated danger mark. It sits on or near a small isolated danger. Light: Fl(2) — group of two flashes." },
  { topic: 2, q: "You see this mark. What is it?", visual: { type: "buoy", id: "safewater" }, options: ["Safe water mark — navigable water all around", "Isolated danger mark — hazard nearby", "Port lateral mark — keep to port side", "Special mark — restricted zone ahead"], answer: 0, explanation: "Red and white vertical stripes with a single red sphere topmark = safe water mark. Used as mid-channel or landfall marks. Light: Isophase, Occulting, or Morse 'A'." },
  { topic: 2, q: "Identify this navigation mark:", visual: { type: "buoy", id: "special" }, options: ["Special mark — marks cables, pipelines, or restricted areas", "Starboard lateral mark — green cone shape", "Safe water mark — navigable water around", "Isolated danger mark — small hazard here"], answer: 0, explanation: "All-yellow body with a yellow X topmark = special mark. Used for military exercise zones, cables, pipelines, recreational areas, etc. Light: yellow, any rhythm." },
];

// ─── Topic Definitions ───────────────────────────────────────────────────────

const TOPICS = [
  {
    id: 0,
    title: "Navigation",
    subtitle: "Charts, compass, bearings, course plotting",
    icon: "🧭",
    weight: 5,
    difficulty: "Hard",
    color: "#2563eb",
    studyContent: [
      { heading: "The Compass Correction Chain", body: "The most-tested concept in the exam. To convert between compass and true bearings:\n\nCompass → (± Deviation) → Magnetic → (± Variation) → True\n\nMnemonic: Can Dead Men Vote Twice (CDMVT)\n\nGoing Compass → True: East corrections are ADDED (+), West corrections are SUBTRACTED (−).\nGoing True → Compass: the signs are REVERSED.\n\nExample:\nCompass course 220°, Deviation 3°E, Variation 2°W\n→ 220° + 3° = 223° Magnetic\n→ 223° − 2° = 221° True\n\nThe most common exam mistake is getting the sign wrong. Drill this until it is automatic." },
      { heading: "Deviation vs Variation", body: "Deviation is caused by magnetic interference aboard YOUR vessel — iron fittings, engine, electronics, speakers near the compass. It changes with each heading and is recorded on a deviation card (or table) specific to that vessel and compass.\n\nVariation (misvisning) is the angle between true north and magnetic north at a given LOCATION. It is printed on the chart's compass rose, along with the year and annual rate of change. You must update it to the current year.\n\nExample: Variation 3°00'W (2019), annual change 7'E. In 2025: 6 years × 7' = 42' East change. 3°00'W − 42' = 2°18'W." },
      { heading: "Chart Reading Essentials", body: "Kort 1 is the chart symbol reference — learn the most common symbols:\n\n• Depth figures (in metres on Danish charts)\n• Depth contours (lines connecting equal depths)\n• Lights: star symbol with characteristics (e.g., Fl(3)10s = 3 flashes every 10 seconds)\n• Wrecks, rocks, obstructions\n• Cables, pipelines (don't anchor here!)\n• Restricted/prohibited areas\n\nThe latitude scale (side margins) is your distance ruler: 1' of latitude = 1 nautical mile. Always measure at the same latitude as your position." },
      { heading: "Position Fixing Methods", body: "Cross bearing (krydspejling): Take compass bearings to 2-3 charted objects. Convert each to true. Plot on the chart. The intersection is your fix (⊙). Best when bearings cross at 60°-120° angles.\n\nRunning fix (overført pejling): Take a bearing to one object. Sail a known course and distance. Take a second bearing (same or different object). Transfer the first bearing line forward along your course and distance sailed. Where it intersects the second bearing = fix.\n\nEstimated Position (EP, symbol △): Based on your last fix plus dead reckoning (course and speed) plus estimated effects of current and leeway. Less accurate than a fix.\n\nDead Reckoning (DR): Position based solely on course steered and distance logged from a known position. No current or leeway correction applied." },
      { heading: "Speed, Distance & Time", body: "The fundamental formula: D = S × T\n\nDistance (nm) = Speed (knots) × Time (hours)\n\nQuick conversions:\n• 6 knots for 30 min = 6 × 0.5 = 3 nm\n• 5 knots for 48 min = 5 × (48/60) = 4 nm\n• 4 knots, need to cover 10 nm: T = 10/4 = 2.5 hours = 2h 30m\n\n1 knot = 1 nautical mile per hour = 1.852 km/h" },
      { heading: "Current & Leeway", body: "The current triangle is a key exam skill:\n\n1. Draw your desired track (A to B) on the chart\n2. From point A, draw the current vector: direction (set) and length (drift × time)\n3. From the end of the current vector, swing an arc with radius = boat speed × time\n4. Where the arc intersects your desired track line = your Course to Steer (CTS)\n\nLeeway (afdrift from wind): The wind pushes the boat sideways. It's expressed as an angle. If the wind is from starboard, leeway pushes you to port — apply the correction toward the wind.\n\nKey exam trap: Drawing the current triangle the wrong way. The current vector starts at the DR position; the boat speed vector ends on the intended track." },
      { heading: "Voyage Planning (Sejladsplanlægning)", body: "A complete voyage plan includes:\n\n1. Route: Plot waypoints on the chart, identify hazards, calculate courses and distances\n2. Weather: Check the forecast (DMI), assess wind, sea state, visibility\n3. Tides and currents: Know the times and rates for your route\n4. Safety: Check all equipment, brief the crew, file a sailing plan with someone ashore\n5. Contingency: Identify bolt-holes (harbours of refuge) along the route\n6. ETA: Calculate arrival times for each leg\n7. Communications: Ensure VHF works, know the relevant port channels\n\nThe exam may include a full voyage planning exercise across Kattegat on Kort 102 U." },
    ]
  },
  {
    id: 1,
    title: "COLREGS (Rules of the Road)",
    subtitle: "Right of way, lights, shapes, sound signals",
    icon: "⚓",
    weight: 5,
    difficulty: "Medium-hard",
    color: "#ca8a04",
    studyContent: [
      { heading: "The Fundamental Rules (2, 5, 6, 7, 8)", body: "Rule 2 — Responsibility: Nothing in the rules relieves any vessel from the consequences of neglect. Even the 'right of way' vessel must act if collision is imminent. This overrides everything.\n\nRule 5 — Lookout: At all times, by sight, hearing, and all available means (radar, AIS, VHF).\n\nRule 6 — Safe speed: Consider visibility, traffic density, manoeuvrability of your vessel, sea state, and depth. There is no fixed speed limit — 'safe' depends on conditions.\n\nRule 7 — Risk of collision: If the compass bearing to an approaching vessel does not appreciably change, risk of collision exists (CBDR — Constant Bearing, Decreasing Range). If in doubt, assume risk exists.\n\nRule 8 — Action to avoid collision: Must be positive, made in ample time, large enough to be readily apparent to the other vessel, and result in passing at a safe distance. Avoid last-second, small alterations." },
      { heading: "Right of Way (Vigeregler)", body: "Rule 12 — Sail vs Sail:\n• Vessel on port tack gives way to starboard tack\n• Same tack: windward vessel gives way to leeward\n• If you can't tell the other's tack: keep clear\n\nRule 13 — Overtaking: The overtaking vessel ALWAYS keeps clear — regardless of sail vs power. A vessel coming from more than 22.5° abaft the beam is overtaking.\n\nRule 14 — Head-on (power vs power): Both alter to starboard, pass port-to-port.\n\nRule 15 — Crossing (power vs power): The vessel with the other on her starboard side gives way. She should avoid crossing ahead.\n\nRule 18 — Hierarchy (most privileged → least):\nNUC → Restricted in Manoeuvrability → Constrained by Draught → Fishing → Sailing → Power-driven\n\nEach vessel type gives way to all those above it on the list." },
      { heading: "Navigation Lights (Lygteføring)", body: "Sailing vessel underway:\n• Sidelights (red port, green starboard) + white sternlight\n• NO masthead (steaming) light\n\nPower vessel <50m underway:\n• White masthead light (forward, 225° arc) + sidelights + white sternlight\n\nPower vessel ≥50m:\n• Two masthead lights (forward lower, aft higher) + sidelights + sternlight\n\nNot Under Command (NUC):\n• Two red all-round lights vertically + sidelights/stern if making way\n\nRestricted Ability to Manoeuvre (RAM):\n• Red-White-Red all-round lights vertically + normal lights if making way\n\nTrawler:\n• Green over White all-round lights + normal lights if making way\n\nFishing (not trawling):\n• Red over White all-round lights + normal lights if making way\n\nVessel at anchor:\n• White all-round light forward (+ one aft if ≥50m)\n\nVessel aground:\n• Anchor lights + two red all-round vertically\n\nKey trap: Confusing trawler (green/white) with fishing (red/white) lights." },
      { heading: "Sound Signals", body: "Short blast ≈ 1 second. Prolonged blast ≈ 4–6 seconds.\n\n1 short: I am altering course to STARBOARD\n2 short: I am altering course to PORT\n3 short: I am operating astern propulsion\n5+ short rapid: Danger / doubt signal (I doubt you are taking sufficient avoiding action)\n\n1 prolonged: Warning signal approaching a blind bend in a channel\n1 prolonged + 2 short: I intend to overtake you on YOUR starboard side\n2 prolonged + 2 short: I intend to overtake you on YOUR port side\n1 prolonged every 2 min: Power vessel underway in restricted visibility\n2 prolonged every 2 min: Power vessel underway but stopped\n1 prolonged + 2 short every 2 min: Sailing, fishing, NUC, RAM (restricted visibility)" },
      { heading: "Day Shapes", body: "Black ball = at anchor\nBlack cone point down = motorsailing (sailing vessel using engine)\nBlack diamond = vessel towing/being towed (in certain circumstances)\nTwo black balls vertically = not under command\nBall-diamond-ball vertically = restricted ability to manoeuvre\nBlack cylinder = constrained by draught\nThree black balls vertically = aground\nTwo cones point-to-point (diamond shape) = fishing with gear extending >150m\n\nDay shapes are required during daylight hours. Vessels <12m may be exempt from some shapes in certain conditions." },
    ]
  },
  {
    id: 2,
    title: "Buoyage & Marks",
    subtitle: "IALA Region A: lateral, cardinal, special marks",
    icon: "🔴",
    weight: 4,
    difficulty: "Medium",
    color: "#16a34a",
    studyContent: [
      { heading: "IALA Region A Overview", body: "Denmark uses IALA Region A. The key rule:\n\nWhen entering from sea (conventional direction of buoyage):\n• RED marks are on your PORT (left) side\n• GREEN marks are on your STARBOARD (right) side\n\nMnemonics:\n• 'Port wine is red'\n• 'Port' and 'left' both have 4 letters\n• 'Is there any red port left?' (Red, Port, Left)\n\nThis is the opposite of IALA Region B (Americas), so be careful if you've learned the US system." },
      { heading: "Lateral Marks", body: "Port-hand marks (left when entering from sea):\n• Colour: Red\n• Shape: Can (cylindrical) or pillar/spar\n• Topmark (if any): Red cylinder/can\n• Light (if any): Red, any rhythm\n\nStarboard-hand marks (right when entering from sea):\n• Colour: Green\n• Shape: Conical (pointed top) or pillar/spar\n• Topmark (if any): Green cone pointing up\n• Light (if any): Green, any rhythm\n\nPreferred channel marks: Horizontal bands. The top-band colour tells you which system it belongs to. Red on top = preferred channel to port (treat as port mark)." },
      { heading: "Cardinal Marks — The Key System", body: "Cardinal marks show where safe water lies relative to the mark using compass directions.\n\nNorth cardinal: safe water is NORTH — pass north of the mark\nEast cardinal: safe water is EAST — pass east\nSouth cardinal: safe water is SOUTH — pass south\nWest cardinal: safe water is WEST — pass west\n\nBody colours (horizontal bands of black and yellow):\n• N: Black on top, yellow below\n• S: Yellow on top, black below\n• E: Black-yellow-black (black at top and bottom)\n• W: Yellow-black-yellow (yellow at top and bottom)\n\nTopmarks (two black cones):\n• N: Both pointing UP ▲▲ (points go 'north')\n• S: Both pointing DOWN ▼▼ (points go 'south')\n• E: Base-to-base ▲▼ (like an EGG)\n• W: Point-to-point ▼▲ (like a WINE GLASS)\n\nLight characters (clockface mnemonic — 12, 3, 6, 9):\n• N = 12 o'clock: Continuous Quick (Q) or Very Quick (VQ)\n• E = 3 o'clock: Q(3) or VQ(3) — three flashes\n• S = 6 o'clock: Q(6)+LFl or VQ(6)+LFl — six flashes + one long\n• W = 9 o'clock: Q(9) or VQ(9) — nine flashes\n\nAll cardinal lights are white." },
      { heading: "Other Marks", body: "Isolated danger mark:\n• Body: Black with red horizontal band(s)\n• Topmark: Two black spheres vertically\n• Light: White Fl(2) — group of two flashes\n• Meaning: Marks a small, isolated danger with navigable water all around\n\nSafe water mark:\n• Body: Red and white vertical stripes\n• Shape: Spherical, or pillar/spar\n• Topmark: Single red sphere\n• Light: White — Isophase, Occulting, LFl every 10s, or Morse 'A'\n• Meaning: Navigable water all around — used as mid-channel or landfall marks\n\nSpecial mark:\n• Body: Yellow\n• Topmark: Yellow X\n• Light: Yellow, any rhythm\n• Meaning: Marks special areas — pipelines, cables, military zones, recreational areas, etc.\n\nNew danger mark:\n• A newly discovered hazard not yet on charts\n• May be marked by a cardinal or lateral mark\n• Often has a Racon (radar beacon) coded 'D' and/or AIS transponder" },
    ]
  },
  {
    id: 3,
    title: "Safety at Sea",
    subtitle: "Distress signals, MOB, VHF, survival equipment",
    icon: "🛟",
    weight: 3,
    difficulty: "Easy-medium",
    color: "#ea580c",
    studyContent: [
      { heading: "VHF Distress Procedures", body: "MAYDAY — Grave and imminent danger to life or vessel:\n1. Ensure radio is on, high power, Channel 16\n2. Press and hold transmit:\n\n\"MAYDAY MAYDAY MAYDAY\nTHIS IS [vessel name × 3]\nMAYDAY [vessel name]\nMY POSITION IS [lat/long or bearing and distance from known point]\n[Nature of distress — e.g., sinking, fire, dismasted]\n[Assistance required — e.g., immediate assistance]\n[Number of persons on board]\n[Any other useful info — vessel description, etc.]\nOVER\"\n\n3. Release transmit, listen for response\n\nPAN PAN — Urgency (no immediate danger to life):\nSame format but open with 'PAN PAN' × 3. Examples: engine failure, non-life-threatening injury, dismasting.\n\nSECURITÉ — Safety information:\nNavigational hazards, weather warnings. Usually broadcast on Ch 16 then moved to a working channel.\n\nDSC (Digital Selective Calling): Press the distress button on your VHF (usually under a cover) to send an automated digital alert on Ch 70 with your MMSI and position." },
      { heading: "Man Overboard (MOB) Procedure", body: "Immediate actions — every second counts:\n1. SHOUT 'MAN OVERBOARD' + which side (port/starboard)\n2. Throw anything that floats — life ring, cushion, fender\n3. Assign a spotter to POINT at the person continuously and never look away\n4. Press MOB button on GPS/chartplotter\n5. Manoeuvre to recover:\n   • Quick-stop method: tack immediately, approach on a close reach\n   • Williamson turn: used when the MOB was not seen going over\n   • If under power: turn toward the side they fell from (to swing the stern away)\n\n6. Approach from downwind/downcurrent — slow, controlled final approach\n7. Recovery: use a boarding ladder, lifting sling, or halyard. This is often the hardest part.\n8. Treat for hypothermia immediately\n\nDo NOT jump in after them unless specifically trained and conditions allow." },
      { heading: "Distress Signals", body: "Red flares: Handheld (visible ~5-7 nm) and parachute (visible ~25 nm, burns at 300m altitude for 40s). The primary visual distress signals.\n\nOrange smoke: Daytime distress signal. Visible from air and sea in daylight but useless at night.\n\nEPIRB (Emergency Position Indicating Radio Beacon): Transmits on 406 MHz to COSPAS-SARSAT satellites with GPS position and vessel ID. Range: worldwide. Battery life: ~48 hours.\n\nSART (Search and Rescue Transponder): Responds to 9 GHz radar signals. Rescue vessels see a line of 12 dots on their radar screen leading to your position. Range: ~5-15 nm.\n\nDSC distress alert: Digital signal on Ch 70 with MMSI, position, and nature of distress.\n\nWhite flares: NOT a distress signal. Used to signal your position to other vessels.\n\nCheck flare expiry dates regularly — expired flares may not work and are not accepted by authorities." },
      { heading: "Safety Equipment Requirements", body: "Danish regulations require minimum equipment based on vessel size and area of operation. Key items:\n\nFor all vessels:\n• Life jacket for every person on board\n• Fire extinguisher(s)\n• Sound signalling device (horn, whistle)\n• Navigation lights\n• Anchor with sufficient rode\n\nFor vessels going further offshore:\n• Life raft (redningsflåde)\n• Flares (red handheld, parachute, orange smoke)\n• EPIRB (for longer passages)\n• VHF radio\n• First aid kit\n• Safety harnesses for crew\n• Radar reflector\n• Torch/flashlight\n\nAlways check that everything is in date and in working order before departure." },
      { heading: "Hypothermia", body: "Cold water is the biggest killer in Danish waters.\n\nSurvival times (approximate, without thermal protection):\n• 15°C water: 2-6 hours\n• 10°C water: 1-2 hours\n• 5°C water: 30-90 minutes\n• 0°C water: 15-45 minutes\n\nSymptom progression: Shivering → clumsiness → confusion → slurred speech → drowsiness → unconsciousness → cardiac arrest\n\nTreatment:\n• Handle GENTLY — rough handling can trigger cardiac arrest\n• Keep horizontal — don't let them walk or stand\n• Remove wet clothing, insulate with blankets, sleeping bags, body heat\n• Warm sweet drinks if conscious and able to swallow\n• NO alcohol (vasodilation increases heat loss)\n• NO rubbing extremities (drives cold blood to the core)\n• Seek medical help immediately\n\nPrevention: Wear a life jacket (keeps head above water when unconscious), wear appropriate clothing, avoid alcohol before or during sailing." },
    ]
  },
  {
    id: 4,
    title: "Meteorology",
    subtitle: "Weather forecasts, Beaufort scale, fronts, local winds",
    icon: "🌊",
    weight: 2,
    difficulty: "Easy-medium",
    color: "#7c3aed",
    studyContent: [
      { heading: "Beaufort Scale — Key Levels", body: "Force 0 — Calm: <1 kn, mirror-smooth sea\nForce 1 — Light air: 1-3 kn, ripples\nForce 2 — Light breeze: 4-6 kn, small wavelets\nForce 3 — Gentle breeze: 7-10 kn, large wavelets, some crests\nForce 4 — Moderate breeze: 11-16 kn, small waves 1-1.5m, frequent whitecaps. Good sailing.\nForce 5 — Fresh breeze: 17-21 kn, moderate waves 2-2.5m, many whitecaps. Sporty sailing.\nForce 6 — Strong breeze: 22-27 kn, large waves 3-4m, white foam crests, spray. SMALL CRAFT WARNING. Reef your sails.\nForce 7 — Near gale: 28-33 kn, breaking waves, foam blown in streaks. Head for port.\nForce 8 — Gale: 34-40 kn, high waves 5.5-7.5m. Very dangerous for small craft.\nForce 9 — Severe gale: 41-47 kn, very high waves. Survival conditions.\nForce 10 — Storm: 48-55 kn. Extreme conditions.\nForce 11 — Violent storm: 56-63 kn.\nForce 12 — Hurricane: 64+ kn.\n\nFor the exam: know the descriptions, wind speeds, and especially the thresholds for Force 4, 6, and 8." },
      { heading: "Weather Fronts", body: "Cold front:\n• Cold air pushes under warm air (steep front)\n• Before: warm, possibly humid, wind from S/SW\n• Passage: sharp wind veer (clockwise, often to NW/W), gusty squalls, heavy rain showers, pressure trough then rapid rise, temperature drop\n• After: clearing skies, good visibility, cumulus clouds\n\nWarm front:\n• Warm air rides up over cold air (gentle slope)\n• Before: high cirrus clouds first, then lowering cloud base (Ci → Cs → As → Ns), wind backs (anti-clockwise), steady rain begins, barometer falls steadily\n• Passage: rain eases, wind veers slightly, temperature rises, cloud base lifts\n• After: warm sector — often overcast, drizzle, poor visibility\n\nOccluded front:\n• Cold front catches warm front\n• Complex weather, often persistent rain, variable winds\n• Common in mature low-pressure systems passing over Denmark" },
      { heading: "Sea Breeze & Land Breeze", body: "Sea breeze (daytime, onshore):\n• Land heats faster than sea → air rises over land → cooler sea air drawn in\n• Develops late morning, strongest in early-mid afternoon\n• Typical strength: Force 2-4\n• Reaches 10-20 km inland\n• Very common in Danish coastal areas on sunny summer days\n\nLand breeze (nighttime, offshore):\n• Land cools faster than sea → air sinks over land → flows out to sea\n• Develops after sunset, strongest before dawn\n• Usually weaker than sea breeze (Force 1-2)\n\nImportant: Local thermal winds can reinforce or oppose the gradient (large-scale) wind. A sea breeze opposing the gradient wind can cause a calm zone; reinforcing it can produce surprisingly strong wind." },
      { heading: "Reading a Marine Forecast", body: "DMI (Danmarks Meteorologiske Institut) issues marine forecasts for Danish waters. Key elements:\n\n• Wind: Direction and Beaufort force (e.g., 'SW 5-6, increasing 7')\n• Sea state: Wave height in metres\n• Visibility: Good (>10 km), Moderate (4-10 km), Poor (1-4 km), Fog (<1 km)\n• Precipitation and weather\n• Warnings: Gale warnings, storm warnings\n\nBarometer rules of thumb:\n• Rising steadily → improving weather\n• Falling steadily → deteriorating weather\n• Falling rapidly (>3 hPa in 3 hours) → strong wind / storm approaching\n• Very low pressure (<990 hPa) → expect strong winds\n\nAlways check the forecast before departure and be prepared to change plans." },
    ]
  },
  {
    id: 5,
    title: "Fire Safety",
    subtitle: "Fire triangle, extinguisher types, procedures",
    icon: "🔥",
    weight: 2,
    difficulty: "Easy",
    color: "#dc2626",
    studyContent: [
      { heading: "The Fire Triangle", body: "Every fire needs three elements:\n\n1. FUEL — anything that burns (wood, diesel, gas, wiring insulation, cooking oil)\n2. OXYGEN — from the air supply\n3. HEAT — an ignition source (spark, hot surface, friction, electrical fault)\n\nRemove any ONE element and the fire goes out:\n• Remove fuel: shut off gas/fuel supply\n• Remove oxygen: smother with blanket, close hatches and vents\n• Remove heat: cool with water (for appropriate fire types)\n\nOn a boat, the most common fire causes are:\n• Fuel leaks near hot engine parts\n• Electrical faults (chafed wiring, overloaded circuits)\n• Gas (LPG) leaks in the galley\n• Unattended cooking" },
      { heading: "Fire Classes & Correct Extinguishers", body: "Class A — Solids (wood, paper, textiles, fibreglass):\n→ Water or foam\n\nClass B — Flammable liquids (diesel, petrol, cooking oil):\n→ Foam, CO₂, or dry powder. NEVER water (spreads the liquid).\n\nClass C — Flammable gases (propane, butane):\n→ Shut off the gas supply FIRST. Then dry powder. Don't extinguish the flame if you can't stop the gas flow (risk of explosion from unburned gas accumulation).\n\nElectrical fires:\n→ CO₂ or dry powder. NEVER water or foam (electrocution risk). Disconnect the power source if possible.\n\nOn a boat, a dry powder extinguisher is the most versatile single choice — effective on A, B, and electrical fires. CO₂ is excellent for enclosed spaces (engine room) but offers no cooling effect.\n\nFire blanket: Effective for small galley fires (especially cooking oil). Smother the fire by placing the blanket over it." },
      { heading: "Firefighting Procedure on Board", body: "1. RAISE THE ALARM — shout 'FIRE' and alert all crew\n2. ASSESS: What type of fire? What's burning? Can you fight it safely?\n3. POSITION yourself between the fire and your ESCAPE ROUTE\n4. FIGHT the fire:\n   • Use the correct extinguisher for the fire type\n   • Aim at the BASE of the fire, sweep side to side\n   • Approach from upwind if on deck\n   • Close hatches and vents to starve oxygen if you can't extinguish directly\n5. MONITOR after extinguishing — fires can reignite\n\nABANDON firefighting when:\n• Fire is spreading beyond control\n• Toxic fumes threaten your safety\n• Structural integrity of the vessel is compromised\n• Your escape route is threatened\n\nLife safety always comes first. A boat can be replaced." },
      { heading: "Gas Safety on Board", body: "LPG (propane/butane) is HEAVIER than air:\n• Leaked gas sinks into the bilge and collects there\n• One spark can cause a catastrophic explosion\n• Before starting the engine: ventilate, check for gas smell, run the bilge blower if fitted\n\nGas safety rules:\n• Turn off gas at the bottle when not in use (not just at the stove)\n• Check all hoses and connections regularly for leaks (soap-water test)\n• Install a gas detector in the bilge\n• Ensure the gas locker drains overboard (below waterline)\n• If you smell gas: turn off supply at bottle, ventilate thoroughly, NO switches or flames until clear" },
    ]
  },
  {
    id: 6,
    title: "Watchkeeping & Environment",
    subtitle: "Lookout duties, pollution prevention, MARPOL",
    icon: "🌍",
    weight: 1,
    difficulty: "Easy",
    color: "#059669",
    studyContent: [
      { heading: "Watchkeeping Duties", body: "Rule 5 (COLREGS): Every vessel shall at all times maintain a proper lookout by sight and hearing as well as by all available means appropriate in the prevailing circumstances.\n\nA proper watch routine includes:\n• Regular 360° visual scan of the horizon\n• Listening for sound signals, breaking waves, other vessels\n• Monitoring instruments: compass, depth sounder, GPS, log\n• Regular position fixes and log entries\n• Monitoring VHF Ch 16\n• Checking navigation lights are functioning (at night)\n• Observing weather changes: clouds, barometer, wind shifts\n• Checking vessel condition: bilge levels, rigging, sails/engine\n\nFatigue management:\n• Fatigue impairs judgment and reaction time as severely as alcohol\n• Set up a proper watch schedule for longer passages\n• The off-watch crew should rest even if they can't sleep\n• The helmsman should be relieved regularly (every 2-4 hours)\n• Brief each watch properly: course, weather, traffic, any concerns" },
      { heading: "Environmental Protection (Havmiljø)", body: "MARPOL (International Convention for the Prevention of Pollution from Ships) and Danish national law set strict rules:\n\nProhibited at sea:\n• Discharge of oil or oily water (Annex I)\n• Discharge of noxious liquid substances (Annex II)\n• Discharge of sewage in most coastal waters (Annex IV)\n• Dumping of all garbage, especially plastics (Annex V)\n• Use of banned anti-fouling paints (TBT — tributyltin)\n\nGood practice:\n• Use pump-out stations for sewage and waste oil\n• Bring ALL garbage ashore — never throw anything overboard\n• Use holding tanks for sewage\n• Minimise use of detergents and chemicals\n• Report any pollution you observe\n\nPenalties for pollution are severe in Denmark: heavy fines and potential imprisonment." },
      { heading: "Reporting Obligations", body: "You are legally required to report:\n\n1. Pollution: Any oil spill, garbage dumping, or chemical discharge you observe\n2. Collisions or groundings involving your vessel\n3. Dangers to navigation: Uncharted rocks, missing/damaged buoys, large floating objects, shifting sandbanks\n4. Emergencies: Any situation endangering life, vessel, or environment\n\nWho to report to:\n• SOK (Søværnets Operative Kommando) — the Danish joint military command that coordinates maritime safety\n• Coast Guard / MRCC (Maritime Rescue Coordination Centre)\n• Harbour master (for port-related issues)\n• VHF Ch 16 for urgent reports\n\nProvide: your position, what you observed, time, and any other relevant details." },
    ]
  },
];

// ─── Danish Terminology Reference ────────────────────────────────────────────

const DANISH_TERMS = {
  0: [ // Navigation
    { da: "misvisning", en: "variation", desc: "Angle between true north and magnetic north" },
    { da: "afvigelse", en: "deviation", desc: "Magnetic interference aboard your vessel" },
    { da: "krydspejling", en: "cross bearing", desc: "Position fix using bearings to multiple objects" },
    { da: "bestik", en: "dead reckoning", desc: "Position based on course and speed" },
    { da: "strømsætning", en: "current set", desc: "Direction the current pushes the vessel" },
    { da: "afdrift", en: "leeway", desc: "Sideways drift caused by wind" },
    { da: "retvisende", en: "true", desc: "Relative to true north" },
    { da: "sejladsplanlægning", en: "voyage planning", desc: "Complete plan for a passage including routes, weather, tides" },
  ],
  1: [ // COLREGS
    { da: "vigepligtig", en: "give-way vessel", desc: "Vessel required to manoeuvre to avoid collision" },
    { da: "kursholderen", en: "stand-on vessel", desc: "Vessel with right of way, must maintain course and speed" },
    { da: "styrbord", en: "starboard", desc: "Right side of vessel" },
    { da: "bagbord", en: "port", desc: "Left side of vessel" },
    { da: "agterude", en: "astern", desc: "Behind the vessel" },
    { da: "forude", en: "ahead", desc: "In front of the vessel" },
  ],
  2: [ // Buoyage
    { da: "afmærkning", en: "marks", desc: "Buoys and beacons that mark navigation features" },
    { da: "lateralmærke", en: "lateral mark", desc: "Buoy marking port or starboard side of channel" },
    { da: "kardinalmærke", en: "cardinal mark", desc: "Buoy indicating safe water direction relative to the mark" },
    { da: "anduvningsmærke", en: "safe water mark", desc: "Mark indicating navigable water all around" },
  ],
  3: [ // Safety
    { da: "redningsvest", en: "life jacket", desc: "Personal flotation device" },
    { da: "nødsignal", en: "distress signal", desc: "Visual or radio signal indicating grave and imminent danger" },
    { da: "mand over bord", en: "man overboard", desc: "Emergency situation when crew member falls into water" },
  ],
  4: [ // Meteorology
    { da: "kuling", en: "gale", desc: "Wind force 7-8 on the Beaufort scale" },
    { da: "vindstyrke", en: "wind force", desc: "Beaufort scale measurement of wind strength" },
    { da: "frontsystem", en: "frontal system", desc: "Weather system with cold and warm fronts" },
    { da: "barometer", en: "barometer", desc: "Instrument measuring atmospheric pressure" },
  ],
  5: [ // Fire Safety
    { da: "brandtrekant", en: "fire triangle", desc: "Three elements required for fire: fuel, oxygen, heat" },
    { da: "pulverslukker", en: "powder extinguisher", desc: "Dry powder fire extinguisher effective on multiple fire classes" },
  ],
  6: [ // Watchkeeping
    { da: "vagthold", en: "watchkeeping", desc: "Continuous observation and maintenance of safety at sea" },
    { da: "forurening", en: "pollution", desc: "Discharge of harmful substances into the marine environment" },
  ],
};

// ─── Main App ────────────────────────────────────────────────────────────────

function getInitialProgress() {
  return TOPICS.map(t => ({ topicId: t.id, correct: 0, total: 0 }));
}

export default function App() {
  const [view, setView] = useState("dashboard");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [progress, setProgress] = useState(getInitialProgress);
  const [quizState, setQuizState] = useState(null);
  const [questionHistory, setQuestionHistory] = useState({});

  const topicMastery = useMemo(() =>
    progress.map(p => p.total === 0 ? 0 : Math.round((p.correct / p.total) * 100)), [progress]);

  const overallMastery = useMemo(() => {
    const c = progress.reduce((s, p) => s + p.correct, 0);
    const t = progress.reduce((s, p) => s + p.total, 0);
    return t === 0 ? 0 : Math.round((c / t) * 100);
  }, [progress]);

  function startQuiz(topicId, withTimer = false) {
    const qs = QUESTIONS.filter(q => topicId === "all" ? true : q.topic === topicId);

    // Weighted selection based on question history
    const weighted = qs.map((q, idx) => {
      const qIdx = QUESTIONS.indexOf(q);
      const hist = questionHistory[qIdx] || { attempts: 0, correct: 0, lastSeen: 0 };

      // Never seen gets high priority (weight = 10)
      if (hist.attempts === 0) return { q, idx: qIdx, weight: 10 };

      // Low success rate gets high priority
      const accuracy = hist.correct / hist.attempts;
      const ageMs = Date.now() - hist.lastSeen;
      const ageDays = ageMs / (1000 * 60 * 60 * 24);

      // Base weight: inverse of accuracy (low accuracy = high weight)
      let weight = accuracy === 0 ? 8 : (1 - accuracy) * 6;

      // Recently seen correct questions get lower priority
      if (accuracy >= 0.8 && ageDays < 1) {
        weight = 0.5;
      }

      return { q, idx: qIdx, weight };
    });

    // Weighted random selection without replacement
    const selected = [];
    const count = topicId === "all" ? Math.min(25, weighted.length) : Math.min(12, weighted.length);
    const remaining = [...weighted];

    while (selected.length < count && remaining.length > 0) {
      const totalWeight = remaining.reduce((s, x) => s + x.weight, 0);
      let rand = Math.random() * totalWeight;
      let pickedIdx = 0;
      for (let i = 0; i < remaining.length; i++) {
        rand -= remaining[i].weight;
        if (rand <= 0) { pickedIdx = i; break; }
      }
      selected.push(remaining[pickedIdx].q);
      remaining.splice(pickedIdx, 1);
    }

    // Set time limit in seconds: 45 min for full exam, 15 min for topic quiz
    let timeLimit = null;
    if (withTimer) {
      timeLimit = topicId === "all" ? 45 * 60 : 15 * 60;
    }

    setQuizState({ topicId, questions: selected, currentIndex: 0, answers: [], selectedOption: null, showExplanation: false, timeLimit, timeRemaining: timeLimit, startTime: Date.now() });
    setView("quiz");
  }

  function handleQuizAnswer(idx) {
    if (quizState.showExplanation) return;
    setQuizState(p => ({ ...p, selectedOption: idx, showExplanation: true }));
  }

  function handleNext() {
    const { currentIndex, questions, answers, selectedOption, topicId } = quizState;
    const isCorrect = selectedOption === questions[currentIndex].answer;
    const newAnswers = [...answers, { selected: selectedOption, correct: isCorrect }];
    const q = questions[currentIndex];
    const qIdx = QUESTIONS.indexOf(q);

    // Update question history
    setQuestionHistory(prev => {
      const hist = prev[qIdx] || { attempts: 0, correct: 0, lastSeen: 0 };
      return {
        ...prev,
        [qIdx]: {
          attempts: hist.attempts + 1,
          correct: hist.correct + (isCorrect ? 1 : 0),
          lastSeen: Date.now(),
        },
      };
    });

    if (currentIndex + 1 >= questions.length) {
      setProgress(prev => {
        const next = [...prev];
        const tids = topicId === "all" ? [...new Set(questions.map(q => q.topic))] : [topicId];
        tids.forEach(tid => {
          const tAs = newAnswers.filter((_, i) => questions[i].topic === tid);
          next[tid] = { ...next[tid], total: next[tid].total + tAs.length, correct: next[tid].correct + tAs.filter(a => a.correct).length };
        });
        return next;
      });
      setQuizState(p => ({ ...p, answers: newAnswers, showExplanation: false }));
      setView("results");
    } else {
      setQuizState(p => ({ ...p, currentIndex: currentIndex + 1, answers: newAnswers, selectedOption: null, showExplanation: false }));
    }
  }

  // ─── Styles ────────────────────────────────────────────────────────────────
  const font = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: font }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "10px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setView("dashboard")}>
          <span style={{ fontSize: 24 }}>⛵</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>Duelighedsbevis Prep</div>
            <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: "0.04em", textTransform: "uppercase" }}>Theoretical Exam — All 7 Topics</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn label="Dashboard" onClick={() => setView("dashboard")} ghost active={view === "dashboard"} />
          <Btn label="Full Exam (25 Qs)" onClick={() => startQuiz("all", true)} />
        </div>
      </header>

      <main style={{ maxWidth: 1060, margin: "0 auto", padding: "28px 16px 60px" }}>
        {view === "dashboard" && <Dashboard topics={TOPICS} mastery={topicMastery} overall={overallMastery} progress={progress}
          onStudy={id => { setSelectedTopic(id); setView("study"); }} onQuiz={startQuiz} onReset={() => setProgress(getInitialProgress())} />}
        {view === "study" && selectedTopic !== null && <StudyView topic={TOPICS[selectedTopic]} mastery={topicMastery[selectedTopic]}
          onBack={() => setView("dashboard")} onQuiz={() => startQuiz(selectedTopic)} />}
        {view === "quiz" && quizState && <QuizView qs={quizState} onAnswer={handleQuizAnswer} onNext={handleNext} onQuit={() => setView("dashboard")} />}
        {view === "results" && quizState && <ResultsView qs={quizState} topics={TOPICS} onRetry={() => startQuiz(quizState.topicId)} onHome={() => setView("dashboard")} />}
      </main>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function Btn({ label, onClick, ghost, active, small, color }) {
  const bg = ghost ? (active ? C.accentLight : "transparent") : (color || C.accent);
  const fg = ghost ? (active ? C.accent : C.textSec) : "#fff";
  const bd = ghost ? `1px solid ${active ? C.accent + "44" : C.border}` : "none";
  return (
    <button onClick={onClick} style={{
      padding: small ? "6px 12px" : "7px 16px", borderRadius: 8, border: bd, background: bg,
      color: fg, fontSize: small ? 12 : 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
    }}>{label}</button>
  );
}

function Bar({ value, color, h = 6 }) {
  return (
    <div style={{ width: "100%", height: h, background: "#e5e7eb", borderRadius: h / 2, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: color || C.accent, borderRadius: h / 2, transition: "width 0.4s ease" }} />
    </div>
  );
}

function Stars({ n }) {
  return <span style={{ letterSpacing: 1, fontSize: 12 }}>{"★".repeat(n)}<span style={{ color: "#d1d5db" }}>{"★".repeat(5 - n)}</span></span>;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ topics, mastery, overall, progress, onStudy, onQuiz, onReset }) {
  const total = progress.reduce((s, p) => s + p.total, 0);
  const totalCorrect = progress.reduce((s, p) => s + p.correct, 0);
  return (
    <div>
      {/* Stats bar */}
      <div style={{
        background: "#fff", borderRadius: 14, padding: "24px 28px", marginBottom: 24,
        border: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center",
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Your Progress</h2>
          <p style={{ margin: 0, color: C.textSec, fontSize: 14 }}>
            {total === 0 ? "Pick a topic to start studying. Quiz yourself to track mastery." : `${totalCorrect} correct out of ${total} questions attempted.`}
          </p>
        </div>
        <div style={{ textAlign: "center", minWidth: 100 }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: overall >= 70 ? C.green : overall >= 40 ? C.gold : C.textMuted }}>{overall}%</div>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Overall</div>
          <Bar value={overall} color={overall >= 70 ? C.green : overall >= 40 ? C.gold : "#d1d5db"} h={5} />
        </div>
        {total > 0 && <Btn label="Reset" onClick={onReset} ghost small />}
      </div>

      {/* Topic grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 14 }}>
        {topics.map((t, i) => {
          const m = mastery[i];
          const att = progress[i].total;
          return (
            <div key={t.id} style={{
              background: "#fff", borderRadius: 12, padding: "20px 22px",
              border: `1px solid ${C.border}`, transition: "box-shadow 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 24 }}>{t.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>{t.subtitle}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Stars n={t.weight} />
                  <div style={{ fontSize: 10, color: C.textMuted }}>{t.difficulty}</div>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.textMuted, marginBottom: 3 }}>
                  <span>Mastery</span>
                  <span style={{ color: att === 0 ? C.textMuted : m >= 70 ? C.green : m >= 40 ? C.gold : C.red }}>
                    {att === 0 ? "Not started" : `${m}%  (${progress[i].correct}/${progress[i].total})`}
                  </span>
                </div>
                <Bar value={m} color={t.color} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => onStudy(t.id)} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${C.border}`,
                  background: "#fff", color: C.text, fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>Study</button>
                <button onClick={() => onQuiz(t.id)} style={{
                  flex: 1, padding: "8px 0", borderRadius: 8, border: "none",
                  background: t.color + "14", color: t.color, fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>Quiz</button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Question count */}
      <div style={{ textAlign: "center", marginTop: 24, color: C.textMuted, fontSize: 12 }}>
        {QUESTIONS.length} questions across {TOPICS.length} topics. Good luck, sailor.
      </div>
    </div>
  );
}

// ─── Study View ──────────────────────────────────────────────────────────────

function StudyView({ topic, mastery, onBack, onQuiz }) {
  const [open, setOpen] = useState(0);
  const [activeTab, setActiveTab] = useState("study"); // study | tools | practice | lights
  const hasDiagrams = topic.id <= 2;
  const hasTools = topic.id === 0; // Navigation gets the calculators
  const hasLightsExercise = topic.id === 1; // COLREGS gets the vessel lights exercise
  const hasBuoyExercise = topic.id === 2; // Buoyage gets the mark identification exercise

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: C.accent, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 16 }}>
        ← Back
      </button>

      {/* Header card */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", marginBottom: 20, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 32 }}>{topic.icon}</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{topic.title}</h1>
            <p style={{ margin: 0, color: C.textSec, fontSize: 13 }}>{topic.subtitle}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: topic.color }}>{mastery}%</div>
            <div style={{ fontSize: 10, color: C.textMuted }}>MASTERY</div>
          </div>
          <Btn label="Start Quiz" onClick={onQuiz} color={topic.color} />
        </div>
      </div>

      {/* Tab bar for Navigation topic */}
      {hasTools && (
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#f1f0ed", borderRadius: 10, padding: 4 }}>
          {[["study", "Study Material"], ["tools", "Calculators"], ["practice", "Practice Scenarios"]].map(([val, label]) => (
            <button key={val} onClick={() => setActiveTab(val)} style={{
              flex: 1, padding: "9px 12px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: activeTab === val ? "#fff" : "transparent",
              color: activeTab === val ? C.accent : C.textMuted,
              boxShadow: activeTab === val ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}>{label}</button>
          ))}
        </div>
      )}

      {/* Tab bar for COLREGS topic */}
      {hasLightsExercise && (
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#f1f0ed", borderRadius: 10, padding: 4 }}>
          {[["study", "Study Material"], ["lights", "Vessel Lights Exercise"]].map(([val, label]) => (
            <button key={val} onClick={() => setActiveTab(val)} style={{
              flex: 1, padding: "9px 12px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: activeTab === val ? "#fff" : "transparent",
              color: activeTab === val ? C.accent : C.textMuted,
              boxShadow: activeTab === val ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}>{label}</button>
          ))}
        </div>
      )}

      {/* Tab bar for Buoyage topic */}
      {hasBuoyExercise && (
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#f1f0ed", borderRadius: 10, padding: 4 }}>
          {[["study", "Study Material"], ["buoys", "Mark Identification"]].map(([val, label]) => (
            <button key={val} onClick={() => setActiveTab(val)} style={{
              flex: 1, padding: "9px 12px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: activeTab === val ? "#fff" : "transparent",
              color: activeTab === val ? C.accent : C.textMuted,
              boxShadow: activeTab === val ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}>{label}</button>
          ))}
        </div>
      )}

      {/* Calculator tools tab (Navigation only) */}
      {hasTools && activeTab === "tools" && (
        <div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", marginBottom: 16, border: `1px solid ${C.border}` }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: C.textSec }}>Current Triangle Calculator</h3>
            <InteractiveCurrentTriangle />
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", marginBottom: 16, border: `1px solid ${C.border}` }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: C.textSec }}>CDMVT Pipeline</h3>
            <CDMVTPipeline />
          </div>
          <CompassCorrectionCalculator />
          <SDTCalculator />
        </div>
      )}

      {/* Practice scenarios tab (Navigation only) */}
      {hasTools && activeTab === "practice" && (
        <div>
          <div style={{ marginBottom: 14, padding: "12px 16px", background: C.accentLight, borderRadius: 10, border: `1px solid ${C.accent}22` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, marginBottom: 4 }}>Exam-Style Practice Problems</div>
            <div style={{ fontSize: 12, color: C.textSec }}>
              Work through these scenarios using the deviation table and variation data, just like the real exam.
              Fill in each field, then click "Check" to see if you got it right.
            </div>
          </div>
          {SCENARIOS.map(s => <ScenarioCard key={s.id} scenario={s} />)}
        </div>
      )}

      {/* Vessel Lights Exercise tab (COLREGS only) */}
      {hasLightsExercise && activeTab === "lights" && (
        <div>
          <VesselLightsExercise />
        </div>
      )}

      {/* Buoy Identification Exercise tab (Buoyage only) */}
      {hasBuoyExercise && activeTab === "buoys" && (
        <div>
          <BuoyIdentificationExercise />
        </div>
      )}

      {/* Diagrams (only on study tab, or for non-navigation topics) */}
      {((hasTools || hasLightsExercise || hasBuoyExercise) ? activeTab === "study" : true) && hasDiagrams && (
        <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", marginBottom: 16, border: `1px solid ${C.border}` }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700, color: C.textSec }}>Visual Reference</h3>
          {topic.id === 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "center" }}>
              <CompassRose size={200} />
              <CurrentTriangleDiagram />
            </div>
          )}
          {topic.id === 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
              {["sailing", "motor", "trawler", "nuc", "ram"].map(v => <NavLightsSVG key={v} vesselType={v} size={130} />)}
            </div>
          )}
          {topic.id === 2 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textAlign: "center", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Cardinal Marks</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginBottom: 20 }}>
                {["N","S","E","W"].map(d => <CardinalMarkSVG key={d} direction={d} />)}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textAlign: "center", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Lateral Marks</div>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}><LateralMarksSVG /></div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textAlign: "center", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Other Marks</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
                <IsolatedDangerSVG />
                <SafeWaterSVG />
                <SpecialMarkSVG />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Study sections (only show on study tab for nav/colregs, always for other topics) */}
      {((hasTools || hasLightsExercise || hasBuoyExercise) ? activeTab === "study" : true) && topic.studyContent.map((s, i) => (
        <div key={i} style={{ background: "#fff", borderRadius: 10, marginBottom: 8, border: `1px solid ${open === i ? topic.color + "44" : C.border}`, overflow: "hidden", transition: "border-color 0.2s" }}>
          <button onClick={() => setOpen(open === i ? -1 : i)} style={{
            width: "100%", padding: "14px 20px", background: "none", border: "none",
            color: C.text, fontSize: 14, fontWeight: 600, cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left",
          }}>
            <span>{s.heading}</span>
            <span style={{ color: C.textMuted, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", fontSize: 16 }}>▾</span>
          </button>
          {open === i && (
            <div style={{ padding: "0 20px 18px", color: C.textSec, fontSize: 13.5, lineHeight: 1.75 }}>
              {s.body.split("\n").map((line, j) => (
                <p key={j} style={{ margin: line.trim() === "" ? "10px 0" : "3px 0", fontWeight: line.startsWith("•") || line.startsWith("→") ? 500 : 400, color: line.startsWith("•") || line.startsWith("→") || line.match(/^[A-Z]/) ? C.text : undefined }}>
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Danish Terminology Reference */}
      {((hasTools || hasLightsExercise || hasBuoyExercise) ? activeTab === "study" : true) && DANISH_TERMS[topic.id] && (
        <div style={{ background: "#fff", borderRadius: 10, marginBottom: 8, border: `1px solid ${open === topic.studyContent.length ? topic.color + "44" : C.border}`, overflow: "hidden", transition: "border-color 0.2s" }}>
          <button onClick={() => setOpen(open === topic.studyContent.length ? -1 : topic.studyContent.length)} style={{
            width: "100%", padding: "14px 20px", background: "none", border: "none",
            color: C.text, fontSize: 14, fontWeight: 600, cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left",
          }}>
            <span>Danish Terms (Danske Termer)</span>
            <span style={{ color: C.textMuted, transform: open === topic.studyContent.length ? "rotate(180deg)" : "none", transition: "transform 0.2s", fontSize: 16 }}>▾</span>
          </button>
          {open === topic.studyContent.length && (
            <div style={{ padding: "0 20px 18px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                {DANISH_TERMS[topic.id].map((term, j) => (
                  <div key={j} style={{ paddingBottom: 10, borderBottom: j < DANISH_TERMS[topic.id].length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ minWidth: 140 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{term.da}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>({term.en})</div>
                      </div>
                      <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>{term.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Quiz View ───────────────────────────────────────────────────────────────

// ─── Compact inline calculators for use inside the quiz ──────────────────────

function QuizCompassCalc() {
  const [cc, setCc] = useState("");
  const [yr, setYr] = useState("2025");
  const [result, setResult] = useState(null);
  const inp = { width: 64, padding: "6px 8px", borderRadius: 6, border: `1.5px solid ${C.border}`, fontSize: 13, fontWeight: 600, textAlign: "center", background: "#fafaf8", color: C.text, outline: "none", fontFamily: "system-ui" };
  const valid = !isNaN(parseFloat(cc)) && parseFloat(cc) >= 0 && parseFloat(cc) < 360 && !isNaN(parseInt(yr));

  function calc() {
    const c = parseFloat(cc);
    const dev = lookupDeviation(c);
    const vari = calcVariation(parseInt(yr));
    const mag = c + dev.signed;
    const tru = mag + vari.signed;
    setResult({ cc: c, dev, mag, vari, tru });
  }

  return (
    <div style={{ padding: "14px 16px", background: "#fafaf8", borderRadius: 10, border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 13 }}>🧭</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Compass → True Calculator</span>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2, textTransform: "uppercase" }}>Compass°</div>
          <input type="number" min="0" max="359" step="0.1" value={cc} onChange={e => { setCc(e.target.value); setResult(null); }} placeholder="135" style={inp} />
        </div>
        <div>
          <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2, textTransform: "uppercase" }}>Year</div>
          <input type="number" min="2015" max="2035" value={yr} onChange={e => { setYr(e.target.value); setResult(null); }} style={{ ...inp, width: 52 }} />
        </div>
        <button onClick={calc} disabled={!valid} style={{
          padding: "6px 14px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600, cursor: valid ? "pointer" : "not-allowed",
          background: valid ? C.accent : C.border, color: valid ? "#fff" : C.textMuted,
        }}>Go</button>
      </div>
      {result && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4, fontSize: 12 }}>
          <span style={{ fontWeight: 700, color: C.accent }}>{result.cc.toFixed(1)}°</span>
          <span style={{ color: C.textMuted }}>→</span>
          <span style={{ color: "#7c3aed", fontSize: 11 }}>{result.dev.signed >= 0 ? "+" : ""}{result.dev.signed.toFixed(1)}° dev</span>
          <span style={{ color: C.textMuted }}>→</span>
          <span style={{ fontWeight: 700, color: "#ca8a04" }}>{result.mag.toFixed(1)}° M</span>
          <span style={{ color: C.textMuted }}>→</span>
          <span style={{ color: "#7c3aed", fontSize: 11 }}>{result.vari.signed >= 0 ? "+" : ""}{result.vari.signed.toFixed(1)}° var</span>
          <span style={{ color: C.textMuted }}>→</span>
          <span style={{ fontWeight: 700, color: C.green }}>{result.tru.toFixed(1)}° T</span>
        </div>
      )}
      {/* Mini deviation table */}
      <details style={{ marginTop: 8 }}>
        <summary style={{ fontSize: 10, color: C.accent, cursor: "pointer" }}>Deviation table</summary>
        <div style={{ overflowX: "auto", marginTop: 4 }}>
          <div style={{ display: "flex", gap: 0, fontSize: 9 }}>
            {DEVIATION_TABLE.filter((_, i) => i % 2 === 0).map(d => (
              <div key={d.heading} style={{ textAlign: "center", minWidth: 32, padding: "3px 2px", borderRight: `1px solid ${C.border}` }}>
                <div style={{ color: C.textMuted }}>{d.heading}°</div>
                <div style={{ fontWeight: 700, color: d.dir === "E" ? C.accent : C.red }}>{d.dev}°{d.dir}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 9, color: C.textMuted, marginTop: 4 }}>
          Variation: {VARIATION_DATA.baseValue}°{VARIATION_DATA.baseDir} ({VARIATION_DATA.baseYear}), annual change 5'W
        </div>
      </details>
    </div>
  );
}

function QuizSDTCalc() {
  const [speed, setSpeed] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState(null);
  const inp = { width: 64, padding: "6px 8px", borderRadius: 6, border: `1.5px solid ${C.border}`, fontSize: 13, fontWeight: 600, textAlign: "center", background: "#fafaf8", color: C.text, outline: "none", fontFamily: "system-ui" };

  function calc() {
    const s = parseFloat(speed), d = parseFloat(distance), t = parseFloat(time);
    const filled = [!isNaN(s), !isNaN(d), !isNaN(t)].filter(Boolean).length;
    if (filled !== 2) { setResult({ error: "Fill exactly 2 fields." }); return; }
    if (isNaN(s)) { const h = t / 60; setResult({ text: `Speed = ${d} ÷ ${h.toFixed(2)} = ${(d / h).toFixed(2)} kn` }); }
    else if (isNaN(d)) { const h = t / 60; setResult({ text: `Distance = ${s} × ${h.toFixed(2)} = ${(s * h).toFixed(2)} nm` }); }
    else { const h = d / s; setResult({ text: `Time = ${d} ÷ ${s} = ${h.toFixed(2)} hrs = ${(h * 60).toFixed(0)} min` }); }
  }

  return (
    <div style={{ padding: "14px 16px", background: "#fafaf8", borderRadius: 10, border: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 13 }}>📐</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Speed / Distance / Time (D = S × T)</span>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2, textTransform: "uppercase" }}>Speed (kn)</div>
          <input type="number" min="0" step="0.1" value={speed} onChange={e => { setSpeed(e.target.value); setResult(null); }} placeholder="—" style={inp} />
        </div>
        <div>
          <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2, textTransform: "uppercase" }}>Dist (nm)</div>
          <input type="number" min="0" step="0.1" value={distance} onChange={e => { setDistance(e.target.value); setResult(null); }} placeholder="—" style={inp} />
        </div>
        <div>
          <div style={{ fontSize: 9, color: C.textMuted, marginBottom: 2, textTransform: "uppercase" }}>Time (min)</div>
          <input type="number" min="0" step="1" value={time} onChange={e => { setTime(e.target.value); setResult(null); }} placeholder="—" style={inp} />
        </div>
        <button onClick={calc} style={{
          padding: "6px 14px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
          background: C.accent, color: "#fff",
        }}>Go</button>
      </div>
      {result && !result.error && <div style={{ fontSize: 12, fontWeight: 600, color: C.green }}>{result.text}</div>}
      {result && result.error && <div style={{ fontSize: 11, color: C.gold }}>{result.error}</div>}
    </div>
  );
}

function QuizView({ qs, onAnswer, onNext, onQuit }) {
  const { currentIndex, questions, selectedOption, showExplanation, timeLimit, startTime } = qs;
  const q = questions[currentIndex];
  const topic = TOPICS[q.topic];
  const isCorrect = selectedOption === q.answer;
  const pct = (currentIndex / questions.length) * 100;
  const isNavQuestion = q.topic === 0;
  const [showCalc, setShowCalc] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Timer countdown effect
  useEffect(() => {
    if (!timeLimit || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, timeLimit - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        // Auto-submit remaining questions as unanswered (wrong)
        // This would be handled by calling onNext with unanswered questions
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timeLimit, startTime]);

  const timerDisplay = timeRemaining !== null ? (() => {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    const display = `${mins}:${secs.toString().padStart(2, '0')}`;
    let color = C.textMuted;
    if (timeRemaining < 120) color = C.red;
    else if (timeRemaining < 300) color = C.gold;
    return { display, color };
  })() : null;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={onQuit} style={{ background: "none", border: "none", color: C.accent, fontSize: 13, cursor: "pointer", padding: 0 }}>← Quit</button>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.textMuted }}>{topic.icon} {topic.title}</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{currentIndex + 1}/{questions.length}</span>
          {timerDisplay && (
            <div style={{ fontSize: 16, fontWeight: 700, color: timerDisplay.color, minWidth: 50, textAlign: "right" }}>
              {timerDisplay.display}
            </div>
          )}
        </div>
      </div>
      <Bar value={pct} color={C.accent} h={3} />

      <div style={{ background: "#fff", borderRadius: 14, padding: "28px", marginTop: 20, border: `1px solid ${C.border}` }}>
        <h2 style={{ margin: "0 0 24px", fontSize: 17, fontWeight: 600, lineHeight: 1.55 }}>{q.q}</h2>

        {/* Visual identification rendering */}
        {q.visual && (
          <div style={{
            display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 20,
            padding: q.visual.type === "vessel" ? "24px 16px" : "16px",
            borderRadius: 12,
            background: q.visual.type === "vessel" ? "#111827" : C.bg,
            border: `1px solid ${C.border}`,
          }}>
            {q.visual.type === "buoy" && (() => {
              const buoy = BUOY_DATA.find(b => b.id === q.visual.id);
              return buoy ? <BuoyMarkSVG buoy={buoy} size={100} /> : null;
            })()}
            {q.visual.type === "vessel" && (() => {
              const vessel = VESSEL_LIGHTS.find(v => v.id === q.visual.id);
              return vessel ? <VesselLightsSVG lights={vessel.lights} size={180} /> : null;
            })()}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {q.options.map((opt, idx) => {
            const isSel = selectedOption === idx;
            const isAns = idx === q.answer;
            let bd = C.border, bg = "#fff", fg = C.text;
            if (showExplanation) {
              if (isAns) { bd = C.green; bg = C.greenLight; fg = C.green; }
              else if (isSel) { bd = C.red; bg = C.redLight; fg = C.red; }
            } else if (isSel) { bd = C.accent; bg = C.accentLight; }
            return (
              <button key={idx} onClick={() => onAnswer(idx)} disabled={showExplanation} style={{
                padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${bd}`, background: bg,
                color: fg, fontSize: 14, textAlign: "left", cursor: showExplanation ? "default" : "pointer",
                transition: "all 0.15s", lineHeight: 1.5, display: "flex", alignItems: "flex-start", gap: 8,
              }}>
                {showExplanation && isAns && <span style={{ flexShrink: 0 }}>✓</span>}
                {showExplanation && isSel && !isAns && <span style={{ flexShrink: 0 }}>✗</span>}
                {opt}
              </button>
            );
          })}
        </div>

        {/* Inline calculators for Navigation questions */}
        {isNavQuestion && (
          <div style={{ marginTop: 20 }}>
            <button onClick={() => setShowCalc(!showCalc)} style={{
              background: "none", border: "none", fontSize: 12, fontWeight: 600, color: C.accent,
              cursor: "pointer", padding: 0, marginBottom: showCalc ? 10 : 0,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <span style={{ transition: "transform 0.2s", transform: showCalc ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>▸</span>
              {showCalc ? "Hide" : "Show"} calculation tools
            </button>
            {showCalc && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <QuizCompassCalc />
                <QuizSDTCalc />
              </div>
            )}
          </div>
        )}

        {showExplanation && (
          <div style={{
            marginTop: 20, padding: "14px 18px", borderRadius: 10,
            background: isCorrect ? C.greenLight : C.redLight,
            border: `1px solid ${isCorrect ? C.green + "33" : C.red + "33"}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: isCorrect ? C.green : C.red, marginBottom: 4 }}>
              {isCorrect ? "Correct!" : "Not quite."}
            </div>
            <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6 }}>{q.explanation}</div>
          </div>
        )}

        {showExplanation && (
          <div style={{ marginTop: 18, textAlign: "right" }}>
            <Btn label={currentIndex + 1 >= questions.length ? "See Results" : "Next Question →"} onClick={onNext} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Results View ────────────────────────────────────────────────────────────

function ResultsView({ qs, topics, onRetry, onHome }) {
  const { questions, answers, topicId } = qs;
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const correct = answers.filter(a => a.correct).length;
  const total = answers.length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 70;

  const mistakeIndices = useMemo(() => {
    return answers
      .map((a, i) => ({ idx: i, correct: a.correct }))
      .filter(x => !x.correct)
      .map(x => x.idx);
  }, [answers]);

  const breakdown = useMemo(() => {
    const b = {};
    answers.forEach((a, i) => {
      const tid = questions[i].topic;
      if (!b[tid]) b[tid] = { correct: 0, total: 0 };
      b[tid].total++;
      if (a.correct) b[tid].correct++;
    });
    return b;
  }, [answers, questions]);

  if (reviewMode && mistakeIndices.length > 0) {
    const qIdx = mistakeIndices[reviewIndex];
    const q = questions[qIdx];
    const a = answers[qIdx];
    return (
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <button onClick={() => setReviewMode(false)} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: C.accent, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 16 }}>
          ← Back to Results
        </button>

        <div style={{ background: "#fff", borderRadius: 14, padding: "24px 28px", marginBottom: 20, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Review Mistakes</h2>
            <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>{reviewIndex + 1} / {mistakeIndices.length}</span>
          </div>

          <h3 style={{ margin: "16px 0 12px", fontSize: 15, fontWeight: 600, color: C.text }}>{q.q}</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {q.options.map((opt, idx) => {
              const isSel = idx === a.selected;
              const isAns = idx === q.answer;
              const isWrong = isSel && !isAns;
              const bg = isWrong ? C.redLight : isAns ? C.greenLight : "#fff";
              const bd = isWrong ? C.red : isAns ? C.green : C.border;
              const fg = isWrong ? C.red : isAns ? C.green : C.text;
              return (
                <div key={idx} style={{
                  padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${bd}`, background: bg,
                  color: fg, fontSize: 13, display: "flex", alignItems: "center", gap: 8,
                }}>
                  {isAns && <span style={{ flexShrink: 0, fontWeight: 700 }}>✓</span>}
                  {isWrong && <span style={{ flexShrink: 0, fontWeight: 700 }}>✗</span>}
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>

          <div style={{
            padding: "12px", borderRadius: 8,
            background: C.greenLight, border: `1px solid ${C.green}33`,
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 4 }}>Explanation</div>
            <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.6 }}>{q.explanation}</div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            <Btn label={reviewIndex === 0 ? "First" : "← Previous"} onClick={() => setReviewIndex(Math.max(0, reviewIndex - 1))} ghost small disabled={reviewIndex === 0} />
            <Btn label={reviewIndex === mistakeIndices.length - 1 ? "Last" : "Next →"} onClick={() => setReviewIndex(Math.min(mistakeIndices.length - 1, reviewIndex + 1))} ghost small disabled={reviewIndex === mistakeIndices.length - 1} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <div style={{ background: "#fff", borderRadius: 14, padding: "36px 28px", textAlign: "center", border: `1px solid ${C.border}`, marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 6 }}>{passed ? "🎉" : "📖"}</div>
        <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: passed ? C.green : C.gold }}>
          {pct}% — {passed ? "Well done!" : "Keep practising!"}
        </h2>
        <p style={{ color: C.textSec, fontSize: 14, margin: "0 0 16px" }}>
          {correct} of {total} correct. {passed ? "You are on track." : "Aim for 70%+ to be exam-ready."}
        </p>
        <div style={{ width: "50%", margin: "0 auto" }}><Bar value={pct} color={passed ? C.green : C.gold} h={8} /></div>
      </div>

      {Object.keys(breakdown).length > 1 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: "18px 22px", marginBottom: 16, border: `1px solid ${C.border}` }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700 }}>By Topic</h3>
          {Object.entries(breakdown).map(([tid, d]) => {
            const t = topics[tid]; const p = Math.round((d.correct / d.total) * 100);
            return (
              <div key={tid} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span>{t.icon} {t.title}</span>
                  <span style={{ color: p >= 70 ? C.green : C.gold }}>{d.correct}/{d.total} ({p}%)</span>
                </div>
                <Bar value={p} color={t.color} h={5} />
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: 12, padding: "18px 22px", marginBottom: 20, border: `1px solid ${C.border}` }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700 }}>Review</h3>
        {answers.map((a, i) => (
          <div key={i} style={{ padding: "8px 0", borderBottom: i < answers.length - 1 ? `1px solid ${C.border}` : "none", display: "flex", gap: 8 }}>
            <span style={{ color: a.correct ? C.green : C.red, fontSize: 14, flexShrink: 0 }}>{a.correct ? "✓" : "✗"}</span>
            <div>
              <div style={{ fontSize: 13, color: a.correct ? C.text : C.red }}>{questions[i].q}</div>
              {!a.correct && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Answer: {questions[i].options[questions[i].answer]}</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        {mistakeIndices.length > 0 && <Btn label="Review Mistakes" onClick={() => { setReviewIndex(0); setReviewMode(true); }} />}
        <Btn label="Try Again" onClick={onRetry} ghost />
        <Btn label="Dashboard" onClick={onHome} />
      </div>
    </div>
  );
}
