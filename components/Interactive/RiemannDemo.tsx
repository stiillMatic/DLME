"use client";

import { useState } from "react";
import Slider from "./Slider";

export default function RiemannDemo() {
  const [N, setN] = useState(10);

  const width = 480;
  const height = 280;
  const padding = 36;
  const innerW = width - 2 * padding;
  const innerH = height - 2 * padding;

  // f(x) = 4x(1-x) on [0, 1], peak f(0.5) = 1, exact integral = 2/3
  const f = (x: number) => 4 * x * (1 - x);
  const xToSvg = (x: number) => padding + x * innerW;
  const yToSvg = (y: number) => padding + (1 - y / 1.2) * innerH;

  // Smooth curve
  const curvePts = Array.from({ length: 200 }, (_, i) => {
    const x = i / 199;
    return `${xToSvg(x).toFixed(1)},${yToSvg(f(x)).toFixed(1)}`;
  }).join(" ");

  // Left-endpoint rectangles
  const dx = 1 / N;
  const rects = Array.from({ length: N }, (_, i) => {
    const xL = i * dx;
    const y = f(xL);
    return {
      x: xToSvg(xL),
      y: yToSvg(y),
      w: xToSvg(xL + dx) - xToSvg(xL),
      h: yToSvg(0) - yToSvg(y),
    };
  });

  const sum = Array.from({ length: N }, (_, i) => f(i * dx) * dx).reduce(
    (a, b) => a + b,
    0
  );
  const exact = 2 / 3;
  const error = Math.abs(sum - exact);

  return (
    <figure className="my-8 rounded-lg border border-border p-4 bg-card">
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg">
          {/* Frame */}
          <rect
            x={padding}
            y={padding}
            width={innerW}
            height={innerH}
            fill="none"
            stroke="oklch(0.3 0 0)"
            strokeWidth="1"
          />
          {/* Baseline */}
          <line
            x1={padding}
            y1={yToSvg(0)}
            x2={padding + innerW}
            y2={yToSvg(0)}
            stroke="oklch(0.5 0 0)"
            strokeWidth="1"
          />
          {/* Rectangles */}
          {rects.map((r, i) => (
            <rect
              key={i}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              fill="oklch(0.65 0.2 264 / 0.25)"
              stroke="oklch(0.65 0.2 264)"
              strokeWidth="0.5"
            />
          ))}
          {/* Curve overlay */}
          <polyline
            points={curvePts}
            fill="none"
            stroke="oklch(0.85 0.15 80)"
            strokeWidth="2.5"
          />
        </svg>
      </div>
      <div className="mt-4">
        <Slider
          label="N rectangles"
          min={2}
          max={100}
          step={1}
          value={N}
          onChange={setN}
          displayValue={N.toString()}
        />
      </div>
      <div className="mt-2 text-sm font-mono text-muted-foreground text-center">
        Riemann sum ≈{" "}
        <span className="text-foreground">{sum.toFixed(4)}</span> &nbsp;|&nbsp; exact ∫₀¹4x(1−x)dx
        = <span className="text-foreground">{exact.toFixed(4)}</span> &nbsp;|&nbsp; error ={" "}
        <span className="text-foreground">{error.toFixed(4)}</span>
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground italic">
        Drag the slider: as N → ∞, the rectangles fill the region and the sum converges to the
        integral.
      </figcaption>
    </figure>
  );
}
