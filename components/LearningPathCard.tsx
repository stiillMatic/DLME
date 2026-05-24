import Link from "next/link";
import type { LearningPath } from "@/lib/learning-paths";
import { getAllCourses } from "@/lib/content";

const LEVEL_COLOR: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function LearningPathCard({ path }: { path: LearningPath }) {
  const allCourses = getAllCourses();
  const courseTitles = path.courses
    .map((slug) => allCourses.find((c) => c.slug === slug)?.title ?? slug)
    .filter(Boolean);

  // Link to the first course in the path as the entry point
  const firstSlug = path.courses[0];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-foreground">{path.title}</h3>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${LEVEL_COLOR[path.level]}`}
        >
          {path.level}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{path.description}</p>
      <ol className="flex flex-col gap-1 text-sm text-foreground">
        {courseTitles.map((title, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
              {i + 1}
            </span>
            <span>{title}</span>
          </li>
        ))}
      </ol>
      <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
        <span>{path.duration} · {path.courses.length} courses</span>
        <Link
          href={`/courses/${firstSlug}`}
          className="font-medium text-primary hover:underline"
        >
          Start path →
        </Link>
      </div>
    </div>
  );
}
