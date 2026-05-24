interface Stat {
  value: string | number;
  label: string;
}

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 border-y border-border bg-card/40 px-4 py-6">
      {stats.map((s, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-2xl font-bold text-foreground">{s.value}</span>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
