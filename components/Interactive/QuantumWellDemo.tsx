"use client";

import { useState } from "react";
import Slider from "./Slider";
import FunctionPlot from "./FunctionPlot";

export default function QuantumWellDemo() {
  const [n, setN] = useState(1);

  // L=1 normalized well: ψ_n(x) = √2 sin(nπx) for x ∈ [0,1], else 0
  const psi = (x: number) =>
    x < 0 || x > 1 ? 0 : Math.sqrt(2) * Math.sin(n * Math.PI * x);
  const prob = (x: number) =>
    x < 0 || x > 1 ? 0 : 2 * Math.sin(n * Math.PI * x) ** 2;

  return (
    <figure className="my-8 rounded-lg border border-border p-4 bg-card">
      <div className="flex justify-center">
        <FunctionPlot
          fns={[
            { f: psi, color: "oklch(0.65 0.2 264)", label: `ψ_${n}(x)` },
            {
              f: prob,
              color: "oklch(0.85 0.15 80)",
              label: `|ψ_${n}|² (probability)`,
            },
          ]}
          xRange={[-0.1, 1.1]}
          yRange={[-2, 2.5]}
        />
      </div>
      <div className="mt-4">
        <Slider
          label="Quantum number n"
          min={1}
          max={8}
          step={1}
          value={n}
          onChange={setN}
          displayValue={n.toString()}
        />
      </div>
      <div className="mt-2 text-sm font-mono text-muted-foreground text-center">
        E_{n} = <span className="text-foreground">{n * n}</span> · (π²ℏ²)/(2mL²) &nbsp;|&nbsp; nodes inside well ={" "}
        <span className="text-foreground">{n - 1}</span>
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground italic">
        Each n is a stationary state. Energy grows as n² — discrete, not continuous. The number of zero-crossings increases with n.
      </figcaption>
    </figure>
  );
}
