"use client";

import { useState } from "react";
import Slider from "./Slider";
import FunctionPlot from "./FunctionPlot";

// Taylor polynomial of sin(x) at 0, keeping terms up through x^maxDegree (odd)
function taylorSin(x: number, maxDegree: number): number {
  let sum = 0;
  let term = x; // x^1 / 1!
  let n = 1;
  while (n <= maxDegree) {
    sum += term;
    // next term: multiply by -x^2 / ((n+1)(n+2))
    term = (-term * x * x) / ((n + 1) * (n + 2));
    n += 2;
  }
  return sum;
}

export default function TaylorDemo() {
  const [N, setN] = useState(3);

  return (
    <figure className="my-8 rounded-lg border border-border p-4 bg-card">
      <div className="flex justify-center">
        <FunctionPlot
          fns={[
            { f: Math.sin, color: "oklch(0.85 0.15 80)", label: "sin(x) — exact" },
            {
              f: (x) => taylorSin(x, N),
              color: "oklch(0.65 0.2 264)",
              label: `Taylor T_${N}(x)`,
            },
          ]}
          xRange={[-2 * Math.PI, 2 * Math.PI]}
          yRange={[-2.5, 2.5]}
        />
      </div>
      <div className="mt-4">
        <Slider
          label="Polynomial degree N"
          min={1}
          max={15}
          step={2}
          value={N}
          onChange={setN}
          displayValue={N.toString()}
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground italic">
        Higher degree extends the region where the polynomial matches sin(x). Beyond it, the
        Taylor polynomial diverges fast.
      </figcaption>
    </figure>
  );
}
