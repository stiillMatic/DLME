import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllCourses } from "@/lib/content";
import { getAllPaths } from "@/lib/learning-paths";
import LearningPathCard from "@/components/LearningPathCard";
import SubjectAreaCard from "@/components/SubjectAreaCard";
import StatsBar from "@/components/StatsBar";
import RiemannDemo from "@/components/Interactive/RiemannDemo";

const AREA_META: Record<string, { icon: string; description: string }> = {
  Mathematics: { icon: "📐", description: "Calculus, linear algebra, ODEs, and the math foundations." },
  Physics: { icon: "⚛️", description: "Classical mechanics, E&M, waves, and quantum physics." },
  Chemistry: { icon: "⚗️", description: "Atomic structure, bonding, thermodynamics, and kinetics." },
  "Core ME": { icon: "⚙️", description: "Solid & fluid mechanics, dynamics, thermo, heat transfer, materials." },
  "Deep Learning": { icon: "🧠", description: "Neural networks built up from the math, with ME applications." },
};

const AREA_ORDER = ["Mathematics", "Physics", "Chemistry", "Core ME", "Deep Learning"];

export default function HomePage() {
  const courses = getAllCourses();
  const paths = getAllPaths();

  const areaCounts: Record<string, number> = {};
  let totalLessons = 0;
  for (const c of courses) {
    const area = (c as typeof c & { area?: string }).area ?? "Other";
    areaCounts[area] = (areaCounts[area] ?? 0) + 1;
    for (const ch of c.chapters) totalLessons += ch.lessons.length;
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border px-4 py-20 text-center sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="relative mx-auto max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            MIT-level STEM curriculum
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            From integral calculus to{" "}
            <span className="text-primary">neural networks.</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            A complete, structured learning path for mechanical engineering students —
            with interactive demos, click-to-reveal practice problems, and progress
            tracking. Free.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/courses">
              <Button size="lg">Browse all courses</Button>
            </Link>
            <Link href="#paths">
              <Button size="lg" variant="outline">
                See learning paths
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsBar
        stats={[
          { value: courses.length, label: "Courses" },
          { value: totalLessons, label: "Lessons" },
          { value: "9", label: "Interactive demos" },
          { value: "500+", label: "Practice problems" },
        ]}
      />

      {/* Learning Paths */}
      <section id="paths" className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Learning paths</h2>
            <p className="mt-2 text-muted-foreground">
              Curated course sequences. Not sure where to start? Pick one.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {paths.map((p) => (
              <LearningPathCard key={p.slug} path={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Subject areas */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Browse by subject</h2>
            <p className="mt-2 text-muted-foreground">
              Pick the discipline you want to dive into.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AREA_ORDER.filter((a) => areaCounts[a]).map((area) => (
              <SubjectAreaCard
                key={area}
                area={area}
                icon={AREA_META[area].icon}
                description={AREA_META[area].description}
                courseCount={areaCounts[area]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Try it now — interactive demo on landing */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-foreground">Try it now</h2>
            <p className="mt-2 text-muted-foreground">
              Drag the slider — watch the Riemann sum converge to the integral.
              Lessons are full of widgets like this.
            </p>
          </div>
          <RiemannDemo />
        </div>
      </section>

      {/* Footer CTAs */}
      <section className="px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Ready to start?</h2>
        <p className="mb-6 text-muted-foreground">
          Create a free account to track progress and bookmark lessons.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/sign-up">
            <Button size="lg">Create free account</Button>
          </Link>
          <Link href="/articles">
            <Button size="lg" variant="ghost">
              Browse articles →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
