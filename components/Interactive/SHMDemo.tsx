"use client";

import { useState } from "react";
import Slider from "./Slider";
import FunctionPlot from "./FunctionPlot";

export default function SHMDemo() {
  const [A, setA] = useState(1);
  const [omega, setOmega] = useState(1);
  const [phi, setPhi] = useState(0);

  return (
    <figure className="my-8 rounded-lg border border-border p-4 bg-card">
      <div className="flex justify-center">
        <FunctionPlot
          fns={[
            {
              f: (t) => A * Math.sin(omega * t + phi),
              color: "oklch(0.65 0.2 264)",
              label: `x(t) = ${A.toFixed(2)}·sin(${omega.toFixed(2)}t + ${(phi / Math.PI).toFixed(2)}π)`,
            },
          ]}
          xRange={[0, 4 * Math.PI]}
          yRange={[-3, 3]}
        />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Slider label="Amplitude A" min={0.1} max={2.5} step={0.1} value={A} onChange={setA} />
        <Slider
          label="Angular freq ω"
          min={0.5}
          max={3}
          step={0.1}
          value={omega}
          onChange={setOmega}
        />
        <Slider
          label="Phase φ"
          min={0}
          max={2 * Math.PI}
          step={0.1}
          value={phi}
          onChange={setPhi}
          displayValue={`${(phi / Math.PI).toFixed(2)}π`}
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground italic">
        Drag sliders: amplitude scales the wave, ω stretches/compresses it in time, φ shifts it.
      </figcaption>
    </figure>
  );
}
