import Link from "next/link";

interface Props {
  area: string;
  icon: string;
  description: string;
  courseCount: number;
}

export default function SubjectAreaCard({ area, icon, description, courseCount }: Props) {
  const anchor = `#${area.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <Link
      href={`/courses${anchor}`}
      className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-base font-semibold text-foreground">{area}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <span className="mt-auto pt-2 text-xs text-muted-foreground">
        {courseCount} course{courseCount === 1 ? "" : "s"}
        <span className="ml-2 text-primary opacity-0 transition-opacity group-hover:opacity-100">→</span>
      </span>
    </Link>
  );
}
