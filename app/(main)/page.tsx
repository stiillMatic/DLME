import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllCourses, getAllArticles } from "@/lib/content";

export default function HomePage() {
  const courses = getAllCourses().slice(0, 3);
  const articles = getAllArticles().slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border px-4 py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            For Mechanical Engineers
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Master Deep Learning.
            <br />
            Apply it to{" "}
            <span className="text-primary">Engineering.</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Structured courses and practical articles that bridge the gap between
            deep learning theory and mechanical engineering applications — from
            FEA surrogate models to CFD acceleration.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/courses">
              <Button size="lg">Browse Courses</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline">
                Create free account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: "📐",
                title: "ME-Focused Examples",
                desc: "Every concept is grounded in mechanics: stress prediction, flow fields, vibration analysis.",
              },
              {
                icon: "📈",
                title: "Track Your Progress",
                desc: "Mark lessons complete and bookmark resources. Your learning history is always saved.",
              },
              {
                icon: "🔄",
                title: "Always Growing",
                desc: "New courses and articles added regularly. Follow the full journey from basics to deployment.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-2 rounded-lg border border-border p-5">
                <span className="text-2xl">{icon}</span>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses preview */}
      {courses.length > 0 && (
        <section className="border-b border-border px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Courses</h2>
                <p className="mt-1 text-muted-foreground">Structured paths from fundamentals to applications</p>
              </div>
              <Link href="/courses" className="text-sm text-primary hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <Card key={c.slug} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2 flex flex-wrap gap-1">
                      {c.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-base">{c.title}</CardTitle>
                    <CardDescription className="text-sm">{c.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-0">
                    <Link href={`/courses/${c.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Start learning
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles preview */}
      {articles.length > 0 && (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Articles</h2>
                <p className="mt-1 text-muted-foreground">Deep dives and practical guides</p>
              </div>
              <Link href="/articles" className="text-sm text-primary hover:underline">
                View all →
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/articles/${a.slug}`}
                  className="flex flex-col gap-1 py-4 hover:opacity-80 transition-opacity sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">{a.title}</p>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{a.date}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
