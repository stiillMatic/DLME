"use client";

import { useState } from "react";
import Slider from "./Slider";
import FunctionPlot from "./FunctionPlot";

export default function GaussianUncertaintyDemo() {
  const [sigmaX, setSigmaX] = useState(1);
  const sigmaP = 1 / (2 * sigmaX); // minimum-uncertainty product, ℏ=1

  const probX = (x: number) =>
    (1 / (sigmaX * Math.sqrt(2 * Math.PI))) *
    Math.exp(-(x * x) / (2 * sigmaX * sigmaX));
  const probP = (p: number) =>
    (1 / (sigmaP * Math.sqrt(2 * Math.PI))) *
    Math.exp(-(p * p) / (2 * sigmaP * sigmaP));

  const sharedYMax =
    Math.max(
      1 / (sigmaX * Math.sqrt(2 * Math.PI)),
      1 / (sigmaP * Math.sqrt(2 * Math.PI))
    ) * 1.1;

  return (
    <figure className="my-8 rounded-lg border border-border p-4 bg-card">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-1">Position: |ψ(x)|²</p>
          <FunctionPlot
            fns={[
              {
                f: probX,
                color: "oklch(0.65 0.2 264)",
                label: `Δx = ${sigmaX.toFixed(2)}`,
              },
            ]}
            xRange={[-4, 4]}
            yRange={[0, sharedYMax]}
            width={280}
            height={200}
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-1">Momentum: |φ(p)|²</p>
          <FunctionPlot
            fns={[
              {
                f: probP,
                color: "oklch(0.85 0.15 80)",
                label: `Δp = ${sigmaP.toFixed(2)}`,
              },
            ]}
            xRange={[-4, 4]}
            yRange={[0, sharedYMax]}
            width={280}
            height={200}
          />
        </div>
      </div>
      <div className="mt-4">
        <Slider
          label="Position width Δx"
          min={0.3}
          max={3}
          step={0.05}
          value={sigmaX}
          onChange={setSigmaX}
        />
      </div>
      <div className="mt-2 text-sm font-mono text-muted-foreground text-center">
        Δx · Δp ={" "}
        <span className="text-foreground">{(sigmaX * sigmaP).toFixed(3)}</span>{" "}
        = ℏ/2 (minimum uncertainty, fixed)
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground italic">
        Narrowing position automatically widens momentum. The product cannot fall below ℏ/2 — Heisenberg&rsquo;s bound.
      </figcaption>
    </figure>
  );
}
