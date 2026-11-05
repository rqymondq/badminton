"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, usePrefersReducedMotion, useIsCompact } from "@/lib/motion";

/** Scrubbed state the scroll timeline writes and the draw loop reads. */
interface SceneState { lurch: number; flash: number; reasons: number; steer: number; }

const N = 11;
const BASE = 185;
const VIEW_W = 900;
const VIEW_H = 620;

function blobPoints(t: number, s: SceneState) {
  const cx = 360 + s.lurch * 140 - s.steer * 50;
  const cy = 330;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const wobble =
      0.11 * Math.sin(t * 0.0007 * (1 + (i % 3) * 0.35) + i * 1.7) +
      0.06 * Math.sin(t * 0.0013 + i * 0.9);
    // A tension bulge on the leading edge when lurching.
    const bulge = s.lurch * 0.35 * Math.max(0, Math.cos(a)) ** 2;
    const r = BASE * (1 + wobble + bulge);
    pts.push([cx + Math.cos(a) * r * (1 + s.lurch * 0.18), cy + Math.sin(a) * r * (1 - s.lurch * 0.12)]);
  }
  return { pts, cx, cy };
}

/** Closed Catmull-Rom spline → cubic Bézier path. */
function toPath(pts: [number, number][]) {
  const n = pts.length;
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + " Z";
}

const beats = [
  {
    k: "The case",
    body: "A family’s dog is killed by a car in front of their house. They had heard that dog meat was delicious, so they cooked and ate it. Nobody saw them do it.",
    note: "Paraphrased from Haidt, Koller & Dias (1993).",
  },
  {
    k: "The reaction",
    body: "The verdict tends to arrive before any sentence about it. In the 1993 study, students at elite universities mostly called this a matter of taste. Most other participants, across social classes in Brazil and the United States, called it wrong, and their feeling predicted that judgment better than any harm they could name.",
    note: "The feeling arrives whole. The elephant has already leaned.",
  },
  {
    k: "The reasons",
    body: "Asked why, people reach for reasons: it is unhealthy, it is disrespectful, it would upset the children. When each reason is answered, the verdict usually stays. Haidt and his colleagues later gave that state a name: moral dumbfounding.",
    note: "The rider explains where the elephant went.",
  },
  {
    k: "The exception",
    body: "The rider is not powerless. In Haidt’s own model, reasons offered by other people, and sometimes private reflection, can change what the elephant feels. It happens less often, and more slowly, than we like to think.",
    note: "Whether it happens more than Haidt allows is itself debated.",
  },
];

export function ElephantScene() {
  const scene = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const state = useRef<SceneState>({ lurch: 0, flash: 0, reasons: 0, steer: 0 });
  const rider = useRef({ x: 300, y: 150 });
  const reduced = usePrefersReducedMotion();
  const compact = useIsCompact(768);

  // Draw loop. Runs continuously (cheap: one path + a handful of attributes).
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const blob = el.querySelector<SVGPathElement>(".blob")!;
    const shadow = el.querySelector<SVGPathElement>(".blob-shadow")!;
    const word = el.querySelector<SVGTextElement>(".flash-word")!;
    const riderG = el.querySelector<SVGGElement>(".rider")!;
    const lines = Array.from(el.querySelectorAll<SVGLineElement>(".reason"));
    const steerLine = el.querySelector<SVGLineElement>(".steer")!;
    const labelI = el.querySelector<SVGTextElement>(".label-intuition")!;
    const labelR = el.querySelector<SVGTextElement>(".label-reasoning")!;
    let raf = 0;
    const frozenT = 4000;
    const draw = (time: number) => {
      const s = state.current;
      const t = reduced ? frozenT : time;
      const { pts, cx, cy } = blobPoints(t, s);
      const d = toPath(pts);
      blob.setAttribute("d", d);
      shadow.setAttribute("d", d);
      // rider follows with lag
      const tx = cx - 40 - s.lurch * 60 + s.steer * 30;
      const ty = cy - 245 - s.lurch * 10;
      const k = reduced ? 1 : 0.07;
      rider.current.x += (tx - rider.current.x) * k;
      rider.current.y += (ty - rider.current.y) * k;
      const rx = rider.current.x, ry = rider.current.y;
      riderG.setAttribute("transform", `translate(${rx.toFixed(1)} ${ry.toFixed(1)}) rotate(${(s.lurch * 22 - s.steer * 10).toFixed(1)})`);
      // labels travel with their forms
      labelI.setAttribute("x", cx.toFixed(1));
      labelI.setAttribute("y", (cy + BASE * 1.32).toFixed(1));
      labelR.setAttribute("x", (rx + 48).toFixed(1));
      labelR.setAttribute("y", (ry - 34).toFixed(1));
      // flash word
      word.setAttribute("x", cx.toFixed(1));
      word.setAttribute("y", (cy + 14).toFixed(1));
      word.style.opacity = String(Math.max(s.flash, s.steer * 0.9));
      word.textContent = s.steer > 0.5 ? "wrong?" : "wrong";
      // reason lines: rider → three points on the blob
      lines.forEach((ln, i) => {
        const a = -Math.PI / 2 + (i - 1) * 0.45;
        const p = pts[(Math.round(((a + Math.PI / 2) / (Math.PI * 2)) * N) + N) % N] ?? pts[0];
        const ex = cx + (p[0] - cx) * 0.9, ey = cy + (p[1] - cy) * 0.9;
        const vis = Math.max(0, Math.min(1, s.reasons - i));
        const len = Math.hypot(ex - rx, ey - ry);
        ln.setAttribute("x1", rx.toFixed(1)); ln.setAttribute("y1", ry.toFixed(1));
        ln.setAttribute("x2", ex.toFixed(1)); ln.setAttribute("y2", ey.toFixed(1));
        ln.style.strokeDasharray = `${len}`;
        ln.style.strokeDashoffset = `${len * (1 - vis)}`;
        ln.style.opacity = vis > 0 ? "1" : "0";
      });
      // steer line: drawn with an arrowhead, rider → blob’s heart
      const sl = Math.hypot(cx - rx, cy - 40 - ry);
      steerLine.setAttribute("x1", rx.toFixed(1)); steerLine.setAttribute("y1", ry.toFixed(1));
      steerLine.setAttribute("x2", cx.toFixed(1)); steerLine.setAttribute("y2", (cy - 40).toFixed(1));
      steerLine.style.strokeDasharray = `${sl}`;
      steerLine.style.strokeDashoffset = `${sl * (1 - s.steer)}`;
      steerLine.style.opacity = s.steer > 0 ? "1" : "0";
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    if (reduced) {
      state.current = { lurch: 0.8, flash: 0.7, reasons: 3, steer: 0 };
      draw(frozenT);
    } else {
      raf = requestAnimationFrame(draw);
    }
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced) return;
      const s = state.current;
      const caps = gsap.utils.toArray<HTMLElement>(".beat", scene.current!);
      gsap.set(caps, { opacity: 0, y: 24 });
      gsap.set(caps[0], { opacity: 1, y: 0 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: scene.current, start: "top top", end: "bottom bottom", scrub: 0.7 },
      });
      const swap = (from: number, to: number, at: number) =>
        tl.to(caps[from], { opacity: 0, y: -24, duration: 0.05 }, at).to(caps[to], { opacity: 1, y: 0, duration: 0.06 }, at + 0.03);

      tl.to(s, { lurch: 1, duration: 0.07, ease: "power4.in" }, 0.22)
        .to(s, { flash: 1, duration: 0.03 }, 0.26)
        .to(s, { flash: 0.55, duration: 0.1 }, 0.34)
        .to(s, { reasons: 3, duration: 0.22, ease: "power1.inOut" }, 0.5)
        .to(s, { steer: 1, duration: 0.12, ease: "power2.inOut" }, 0.8)
        .to(s, { lurch: 0.55, duration: 0.12 }, 0.8)
        .to({}, { duration: 0.08 });
      swap(0, 1, 0.24);
      swap(1, 2, 0.5);
      swap(2, 3, 0.79);
    },
    { scope: scene, dependencies: [reduced] },
  );

  const figure = (
    <svg
      ref={svg}
      viewBox={compact ? "130 30 640 600" : `0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-auto w-full max-h-[70svh]"
      role="img"
      aria-label="A large fluid vermilion form, the intuition, and a small lapis instrument above it, the reasoning. Lines connect them."
    >
      <defs>
        <radialGradient id="elephant-grad" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#D9502F" />
          <stop offset="70%" stopColor="#B8321E" />
          <stop offset="100%" stopColor="#7A2217" />
        </radialGradient>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#4A6FB5" />
        </marker>
      </defs>
      <path className="blob-shadow" fill="#000" opacity="0.35" transform="translate(14 18)" />
      <path className="blob" fill="url(#elephant-grad)" />
      <text
        className="flash-word font-display"
        textAnchor="middle"
        fontSize="56"
        fontStyle="italic"
        fill="#F2EADB"
        style={{ fontVariationSettings: '"opsz" 144, "SOFT" 80', opacity: 0 }}
      >
        wrong
      </text>
      <line className="reason" stroke="#4A6FB5" strokeWidth="1.2" />
      <line className="reason" stroke="#4A6FB5" strokeWidth="1.2" />
      <line className="reason" stroke="#4A6FB5" strokeWidth="1.2" />
      <line className="steer" stroke="#4A6FB5" strokeWidth="1.6" markerEnd="url(#arrow)" />
      <g className="rider" style={{ color: "#4A6FB5" }}>
        <circle r="26" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle r="3" fill="currentColor" />
        <line x1="-40" x2="-30" y1="0" y2="0" stroke="currentColor" />
        <line x1="30" x2="40" y1="0" y2="0" stroke="currentColor" />
        <line y1="-40" y2="-30" x1="0" x2="0" stroke="currentColor" />
        <line y1="30" y2="40" x1="0" x2="0" stroke="currentColor" />
      </g>
      <text className="label-intuition" textAnchor="middle" fill="#9A9087" fontFamily="var(--font-mono)" fontSize="12" letterSpacing="2">
        INTUITION
      </text>
      <text className="label-reasoning" fill="#4A6FB5" fontFamily="var(--font-mono)" fontSize="12" letterSpacing="2">
        REASONING
      </text>
    </svg>
  );

  if (reduced) {
    return (
      <div ref={scene} className="px-[var(--gutter)] py-12">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1.2fr_1fr]">
          {figure}
          <ol className="space-y-8">
            {beats.map((b, i) => (
              <li key={b.k}>
                <p className="mono text-fg-3">Beat {i + 1} · {b.k}</p>
                <p className="serif mt-2 text-[length:var(--step-1)]">{b.body}</p>
                <p className="mono-lc mt-2 text-fg-3">{b.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div ref={scene} className="pin-scene h-[340svh] md:h-[380svh]">
      <div className="pin-frame">
        <div className="mx-auto grid h-full max-w-[1300px] grid-rows-[1fr_auto] gap-4 px-[var(--gutter)] py-6 lg:grid-cols-[1.25fr_1fr] lg:grid-rows-1 lg:items-center lg:gap-12">
          <div className="flex min-h-0 items-center">{figure}</div>
          <div className="relative min-h-[11rem] lg:min-h-[18rem]">
            {beats.map((b, i) => (
              <div key={b.k} className="beat absolute inset-x-0 top-0">
                <p className="mono text-fg-3">
                  Beat {i + 1} <span aria-hidden className="mx-2">·</span> {b.k}
                </p>
                <p className="serif mt-3 max-w-[32ch] text-[length:var(--step-1)] text-fg">{b.body}</p>
                <p className="mono-lc mt-3 text-fg-3">{b.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
