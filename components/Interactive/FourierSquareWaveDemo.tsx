"use client";

import { useState } from "react";
import Slider from "./Slider";
import FunctionPlot from "./FunctionPlot";

export default function FourierSquareWaveDemo() {
  const [N, setN] = useState(3);

  // Square-wave Fourier series: (4/π) Σ_{k=1..N} sin((2k-1)x) / (2k-1)
  const partial = (x: number) => {
    let sum = 0;
    for (let k = 1; k <= N; k++) {
      const n = 2 * k - 1;
      sum += Math.sin(n * x) / n;
    }
    return (4 / Math.PI) * sum;
  };

  // Target square wave
  const square = (x: number) => {
    const period = 2 * Math.PI;
    let t = x % period;
    if (t < 0) t += period;
    return t < Math.PI ? 1 : -1;
  };

  return (
    <figure className="my-8 rounded-lg border border-border p-4 bg-card">
      <div className="flex justify-center">
        <FunctionPlot
          fns={[
            {
              f: square,
              color: "oklch(0.55 0.05 0)",
              label: "target square wave",
            },
            {
              f: partial,
              color: "oklch(0.65 0.2 264)",
              label: `Fourier partial sum, N=${N} harmonics`,
            },
          ]}
          xRange={[-Math.PI, 3 * Math.PI]}
          yRange={[-1.6, 1.6]}
          samples={400}
        />
      </div>
      <div className="mt-4">
        <Slider
          label="Number of harmonics N"
          min={1}
          max={40}
          step={1}
          value={N}
          onChange={setN}
          displayValue={N.toString()}
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground italic">
        More harmonics → tighter fit. But the overshoot near jumps (Gibbs phenomenon, ≈9%) never vanishes — it just narrows.
      </figcaption>
    </figure>
  );
}
