"use client";

type Fn = { f: (x: number) => number; color: string; label?: string };

type Props = {
  fns: Fn[];
  xRange: [number, number];
  yRange: [number, number];
  width?: number;
  height?: number;
  samples?: number;
};

export default function FunctionPlot({
  fns,
  xRange,
  yRange,
  width = 480,
  height = 280,
  samples = 200,
}: Props) {
  const padding = 36;
  const innerW = width - 2 * padding;
  const innerH = height - 2 * padding;
  const [xmin, xmax] = xRange;
  const [ymin, ymax] = yRange;

  const xToSvg = (x: number) => padding + ((x - xmin) / (xmax - xmin)) * innerW;
  const yToSvg = (y: number) =>
    padding + (1 - (y - ymin) / (ymax - ymin)) * innerH;

  const xAxisY = yToSvg(0);
  const yAxisX = xToSvg(0);

  // Build segmented polylines for each function (split on out-of-range or NaN)
  const polylines = fns.map((fn) => {
    const segments: string[][] = [[]];
    for (let i = 0; i <= samples; i++) {
      const x = xmin + (i / samples) * (xmax - xmin);
      let y: number;
      try {
        y = fn.f(x);
      } catch {
        if (segments[segments.length - 1].length) segments.push([]);
        continue;
      }
      if (!isFinite(y) || y < ymin - (ymax - ymin) || y > ymax + (ymax - ymin)) {
        if (segments[segments.length - 1].length) segments.push([]);
        continue;
      }
      // Clamp Y for display
      const yClamped = Math.max(ymin, Math.min(ymax, y));
      segments[segments.length - 1].push(
        `${xToSvg(x).toFixed(1)},${yToSvg(yClamped).toFixed(1)}`
      );
    }
    return { color: fn.color, label: fn.label, segments };
  });

  return (
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
      {/* X axis */}
      {ymin <= 0 && ymax >= 0 && (
        <line
          x1={padding}
          y1={xAxisY}
          x2={padding + innerW}
          y2={xAxisY}
          stroke="oklch(0.5 0 0)"
          strokeWidth="1"
        />
      )}
      {/* Y axis */}
      {xmin <= 0 && xmax >= 0 && (
        <line
          x1={yAxisX}
          y1={padding}
          x2={yAxisX}
          y2={padding + innerH}
          stroke="oklch(0.5 0 0)"
          strokeWidth="1"
        />
      )}
      {/* Function curves */}
      {polylines.map((pl, i) =>
        pl.segments.map((seg, j) =>
          seg.length > 1 ? (
            <polyline
              key={`${i}-${j}`}
              points={seg.join(" ")}
              fill="none"
              stroke={pl.color}
              strokeWidth="2"
            />
          ) : null
        )
      )}
      {/* Legend */}
      {fns.map(
        (fn, i) =>
          fn.label && (
            <g key={i} transform={`translate(${padding + 8}, ${padding + 14 + i * 18})`}>
              <line x1={0} y1={6} x2={20} y2={6} stroke={fn.color} strokeWidth="2" />
              <text x={26} y={10} fill={fn.color} fontSize="12">
                {fn.label}
              </text>
            </g>
          )
      )}
    </svg>
  );
}
