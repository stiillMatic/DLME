import { getAllCourses } from "@/lib/content";
import { getAllPaths } from "@/lib/learning-paths";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LearningPathCard from "@/components/LearningPathCard";
import Link from "next/link";

const LEVEL_COLOR: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

const AREA_ORDER = ["Mathematics", "Physics", "Chemistry", "Core ME", "Deep Learning"];

const AREA_DESCRIPTIONS: Record<string, string> = {
  Mathematics: "Calculus through linear algebra and differential equations — the engineer's analytical toolkit.",
  Physics: "From Newton to Schrödinger — building physical intuition from classical to quantum.",
  Chemistry: "Atomic structure, bonding, thermodynamics, and kinetics — the molecular view.",
  "Core ME": "Solid mechanics, fluids, dynamics, thermo, heat transfer, and materials.",
  "Deep Learning": "Neural networks and ML applications, taught from the math up.",
};

// Foundational courses get a "Recommended start" badge
const RECOMMENDED_START = new Set([
  "single-variable-calculus",
  "classical-mechanics",
]);

export default function CoursesPage() {
  const courses = getAllCourses();
  const paths = getAllPaths();

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

      {/* Learning paths section at the top */}
      <section className="mb-16">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-semibold text-foreground">Learning paths</h2>
          <Link href="/#paths" className="text-xs text-primary hover:underline">
            About paths
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {paths.map((p) => (
            <LearningPathCard key={p.slug} path={p} />
          ))}
        </div>
      </section>

      {/* Areas */}
      {areas.map((area) => {
        const id = area.toLowerCase().replace(/\s+/g, "-");
        return (
          <section key={area} id={id} className="mb-12 scroll-mt-20">
            <div className="mb-4 border-b border-border pb-2">
              <h2 className="text-lg font-semibold text-foreground">{area}</h2>
              {AREA_DESCRIPTIONS[area] && (
                <p className="mt-1 text-sm text-muted-foreground">{AREA_DESCRIPTIONS[area]}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[area].map((c) => {
                const totalLessons = c.chapters.reduce(
                  (sum, ch) => sum + ch.lessons.length,
                  0
                );
                const firstChapter = c.chapters[0];
                const firstLesson = firstChapter?.lessons[0];
                const isRecommended = RECOMMENDED_START.has(c.slug);

                return (
                  <Card key={c.slug} className="flex flex-col">
                    <CardHeader>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${LEVEL_COLOR[c.level]}`}
                        >
                          {c.level}
                        </span>
                        {isRecommended && (
                          <Badge variant="secondary" className="text-xs">
                            ⭐ Recommended start
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base">{c.title}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {c.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto flex flex-col gap-3 pt-0">
                      {firstLesson && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          Start with: <span className="text-foreground">{firstLesson.title}</span>
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {c.chapters.length} ch · {totalLessons} lessons
                        </span>
                        <Link href={`/courses/${c.slug}`}>
                          <Button size="sm">Start →</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
