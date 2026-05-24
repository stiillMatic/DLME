export default function ExQ({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-6 rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 pl-5">
      <span className="absolute right-3 top-3 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
        Exercise
      </span>
      <div className="prose pr-16">{children}</div>
    </div>
  );
}
