"use client";

import { useState } from "react";
import Slider from "./Slider";

export default function DerivativeSecantDemo() {
  const [h, setH] = useState(1);

  const width = 480;
  const height = 280;
  const padding = 36;
  const innerW = width - 2 * padding;
  const innerH = height - 2 * padding;

  const [xmin, xmax] = [-0.5, 3];
  const [ymin, ymax] = [-0.5, 6];
  const xToSvg = (x: number) => padding + ((x - xmin) / (xmax - xmin)) * innerW;
  const yToSvg = (y: number) =>
    padding + (1 - (y - ymin) / (ymax - ymin)) * innerH;

  // Anchor at x=1, f(x)=x^2
  const a = 1;
  const fA = 1;
  const xQ = a + h;
  const fQ = xQ * xQ;
  const secantSlope = (fQ - fA) / h; // = 2a + h
  const tangentSlope = 2 * a; // = 2

  // Curve y=x^2 sampled
  const curvePts = Array.from({ length: 100 }, (_, i) => {
    const x = xmin + (i / 99) * (xmax - xmin);
    const y = x * x;
    if (y > ymax) return null;
    return `${xToSvg(x).toFixed(1)},${yToSvg(y).toFixed(1)}`;
  })
    .filter(Boolean)
    .join(" ");

  // Lines: clip to plot
  const lineEndpoints = (slope: number) => {
    const x1 = xmin;
    const x2 = xmax;
    return {
      x1: xToSvg(x1),
      y1: yToSvg(Math.max(ymin, Math.min(ymax, slope * (x1 - a) + fA))),
      x2: xToSvg(x2),
      y2: yToSvg(Math.max(ymin, Math.min(ymax, slope * (x2 - a) + fA))),
    };
  };
  const tan = lineEndpoints(tangentSlope);
  const sec = lineEndpoints(secantSlope);

  return (
    <figure className="my-8 rounded-lg border border-border p-4 bg-card">
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg">
          <rect
            x={padding}
            y={padding}
            width={innerW}
            height={innerH}
            fill="none"
            stroke="oklch(0.3 0 0)"
            strokeWidth="1"
          />
          <line
            x1={padding}
            y1={yToSvg(0)}
            x2={padding + innerW}
            y2={yToSvg(0)}
            stroke="oklch(0.5 0 0)"
            strokeWidth="1"
          />
          <line
            x1={xToSvg(0)}
            y1={padding}
            x2={xToSvg(0)}
            y2={padding + innerH}
            stroke="oklch(0.5 0 0)"
            strokeWidth="1"
          />
          <polyline
            points={curvePts}
            fill="none"
            stroke="oklch(0.65 0.2 264)"
            strokeWidth="2"
          />
          {/* Tangent (green) */}
          <line
            x1={tan.x1}
            y1={tan.y1}
            x2={tan.x2}
            y2={tan.y2}
            stroke="oklch(0.7 0.2 140)"
            strokeWidth="2"
          />
          {/* Secant (orange dashed) */}
          <line
            x1={sec.x1}
            y1={sec.y1}
            x2={sec.x2}
            y2={sec.y2}
            stroke="oklch(0.85 0.15 80)"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          {/* Anchor P */}
          <circle
            cx={xToSvg(a)}
            cy={yToSvg(fA)}
            r="4"
            fill="oklch(0.985 0 0)"
          />
          <text
            x={xToSvg(a) + 6}
            y={yToSvg(fA) + 18}
            fill="oklch(0.985 0 0)"
            fontSize="11"
          >
            P
          </text>
          {/* Moving Q */}
          {fQ <= ymax && xQ <= xmax && (
            <>
              <circle
                cx={xToSvg(xQ)}
                cy={yToSvg(fQ)}
                r="4"
                fill="oklch(0.85 0.15 80)"
              />
              <text
                x={xToSvg(xQ) + 6}
                y={yToSvg(fQ) - 6}
                fill="oklch(0.85 0.15 80)"
                fontSize="11"
              >
                Q
              </text>
            </>
          )}
          <g transform={`translate(${padding + 8}, ${padding + 14})`}>
            <line x1={0} y1={6} x2={20} y2={6} stroke="oklch(0.65 0.2 264)" strokeWidth="2" />
            <text x={26} y={10} fill="oklch(0.65 0.2 264)" fontSize="11">
              f(x) = x²
            </text>
            <line
              x1={0}
              y1={26}
              x2={20}
              y2={26}
              stroke="oklch(0.85 0.15 80)"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <text x={26} y={30} fill="oklch(0.85 0.15 80)" fontSize="11">
              secant slope = {secantSlope.toFixed(3)}
            </text>
            <line
              x1={0}
              y1={46}
              x2={20}
              y2={46}
              stroke="oklch(0.7 0.2 140)"
              strokeWidth="2"
            />
            <text x={26} y={50} fill="oklch(0.7 0.2 140)" fontSize="11">
              tangent slope = {tangentSlope.toFixed(3)}
            </text>
          </g>
        </svg>
      </div>
      <div className="mt-4">
        <Slider
          label="Step size h"
          min={0.05}
          max={2}
          step={0.01}
          value={h}
          onChange={setH}
          displayValue={h.toFixed(2)}
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground italic">
        Drag h toward 0: secant slope (f(a+h)−f(a))/h converges to the tangent slope f′(a) = 2.
      </figcaption>
    </figure>
  );
}
