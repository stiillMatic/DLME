"use client";

import { useState } from "react";
import Slider from "./Slider";
import FunctionPlot from "./FunctionPlot";

export default function DampedOscillatorDemo() {
  const [zeta, setZeta] = useState(0.1);
  const omega0 = 2;
  const eps = 0.02;

  const x = (t: number): number => {
    if (zeta < 1 - eps) {
      const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
      return Math.exp(-zeta * omega0 * t) * Math.cos(omegaD * t);
    } else if (zeta > 1 + eps) {
      const s = Math.sqrt(zeta * zeta - 1);
      const r1 = -omega0 * (zeta - s);
      const r2 = -omega0 * (zeta + s);
      const A1 = -r2 / (r1 - r2);
      const A2 = r1 / (r1 - r2);
      return A1 * Math.exp(r1 * t) + A2 * Math.exp(r2 * t);
    } else {
      // critically damped
      return (1 + omega0 * t) * Math.exp(-omega0 * t);
    }
  };

  const envPlus = (t: number) => Math.exp(-zeta * omega0 * t);
  const envMinus = (t: number) => -Math.exp(-zeta * omega0 * t);

  const classification =
    zeta < 1 - eps
      ? "underdamped"
      : zeta > 1 + eps
      ? "overdamped"
      : "critically damped";

  const fns: Array<{ f: (t: number) => number; color: string; label?: string }> = [
    {
      f: x,
      color: "oklch(0.65 0.2 264)",
      label: `x(t), ζ=${zeta.toFixed(2)} (${classification})`,
    },
  ];
  if (zeta < 1 - eps) {
    fns.push({
      f: envPlus,
      color: "oklch(0.55 0.05 264)",
      label: "envelope ±e^(−ζω₀t)",
    });
    fns.push({ f: envMinus, color: "oklch(0.55 0.05 264)" });
  }

  return (
    <figure className="my-8 rounded-lg border border-border p-4 bg-card">
      <div className="flex justify-center">
        <FunctionPlot fns={fns} xRange={[0, 10]} yRange={[-1.2, 1.2]} />
      </div>
      <div className="mt-4">
        <Slider
          label="Damping ratio ζ"
          min={0}
          max={2}
          step={0.05}
          value={zeta}
          onChange={setZeta}
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground italic">
        ζ &lt; 1: oscillates inside decay envelope · ζ = 1: fastest settle without overshoot · ζ &gt; 1: slow exponential return
      </figcaption>
    </figure>
  );
}
