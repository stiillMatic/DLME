"use client";

import { useState } from "react";
import Slider from "./Slider";
import FunctionPlot from "./FunctionPlot";

export default function RCChargingDemo() {
  const [tau, setTau] = useState(1);

  const v = (t: number) => 1 - Math.exp(-t / tau);
  const oneTau = v(tau); // 0.632
  const fiveTau = v(5 * tau); // 0.993

  return (
    <figure className="my-8 rounded-lg border border-border p-4 bg-card">
      <div className="flex justify-center">
        <FunctionPlot
          fns={[
            {
              f: v,
              color: "oklch(0.65 0.2 264)",
              label: `V(t)/V₀ = 1 − e^(−t/${tau.toFixed(2)})`,
            },
            {
              f: () => 1,
              color: "oklch(0.55 0.05 0)",
              label: "asymptote V₀",
            },
          ]}
          xRange={[0, 10]}
          yRange={[0, 1.25]}
        />
      </div>
      <div className="mt-4">
        <Slider
          label="Time constant τ = RC"
          min={0.2}
          max={3}
          step={0.05}
          value={tau}
          onChange={setTau}
        />
      </div>
      <div className="mt-2 text-sm font-mono text-muted-foreground text-center">
        V(τ)/V₀ = <span className="text-foreground">{oneTau.toFixed(3)}</span> (≈63.2%) &nbsp;|&nbsp; V(5τ)/V₀ ={" "}
        <span className="text-foreground">{fiveTau.toFixed(3)}</span> (≈99.3%)
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground italic">
        Smaller τ → faster charging. Standard rule of thumb: capacitor &ldquo;settled&rdquo; after about 5τ.
      </figcaption>
    </figure>
  );
}
