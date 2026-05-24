import { getAllCourses } from "@/lib/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LEVEL_COLOR: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

const AREA_ORDER = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Core ME",
  "Deep Learning",
];

export default function CoursesPage() {
  const courses = getAllCourses();

  // Group by area
  const grouped: Record<string, typeof courses> = {};
  for (const c of courses) {
    const area = (c as typeof c & { area?: string }).area ?? "Other";
    if (!grouped[area]) grouped[area] = [];
    grouped[area].push(c);
  }

  const areas = AREA_ORDER.filter((a) => grouped[a]).concat(
    Object.keys(grouped).filter((a) => !AREA_ORDER.includes(a))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">Courses</h1>
        <p className="mt-2 text-muted-foreground">
          MIT-level ME curriculum — from mathematical foundations to deep learning applications.
        </p>
      </div>

      {areas.map((area) => (
        <section key={area} className="mb-12">
          <h2 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground">
            {area}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[area].map((c) => {
              const totalLessons = c.chapters.reduce(
                (sum, ch) => sum + ch.lessons.length,
                0
              );
              return (
                <Card key={c.slug} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${LEVEL_COLOR[c.level]}`}
                      >
                        {c.level}
                      </span>
                    </div>
                    <CardTitle className="text-base">{c.title}</CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {c.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex items-center justify-between pt-0">
                    <span className="text-xs text-muted-foreground">
                      {c.chapters.length} ch · {totalLessons} lessons
                    </span>
                    <Link href={`/courses/${c.slug}`}>
                      <Button size="sm">Start →</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
