"use client";

type Props = {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  displayValue?: string;
};

export default function Slider({
  label,
  min,
  max,
  step = 0.1,
  value,
  onChange,
  displayValue,
}: Props) {
  return (
    <div className="flex flex-col gap-1 my-2">
      <div className="flex justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground font-mono">
          {displayValue ?? value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-primary cursor-pointer"
      />
    </div>
  );
}
