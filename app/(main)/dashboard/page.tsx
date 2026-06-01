export const dynamic = "force-dynamic";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getAllCourses, getAllArticles } from "@/lib/content";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function DashboardPage() {
  let user = null;
  let completedLessons: string[] = [];
  let bookmarks: { content_id: string; content_type: string }[] = [];
  let attempts: { lesson_id: string; is_correct: boolean }[] = [];

  try {
    const supabase = await createServerSupabaseClient();
    const { data: userData } = await supabase.auth.getUser();
    user = userData.user;
    if (!user) redirect("/sign-in?next=/dashboard");

    const [{ data: progress }, { data: bmarks }, { data: atts }] = await Promise.all([
      supabase.from("user_progress").select("lesson_id").eq("user_id", user.id),
      supabase.from("bookmarks").select("content_id, content_type").eq("user_id", user.id),
      supabase.from("practice_attempts").select("lesson_id, is_correct").eq("user_id", user.id),
    ]);
    completedLessons = (progress ?? []).map((r) => r.lesson_id);
    bookmarks = bmarks ?? [];
    attempts = atts ?? [];
  } catch {
    redirect("/sign-in?next=/dashboard");
  }

  // Aggregate practice attempts per lesson
  const attemptStats = new Map<string, { right: number; total: number }>();
  for (const a of attempts) {
    const cur = attemptStats.get(a.lesson_id) ?? { right: 0, total: 0 };
    cur.total += 1;
    if (a.is_correct) cur.right += 1;
    attemptStats.set(a.lesson_id, cur);
  }
  const totalAttempts = attempts.length;
  const totalRight = attempts.filter((a) => a.is_correct).length;
  const overallAccuracy =
    totalAttempts > 0 ? Math.round((totalRight / totalAttempts) * 100) : 0;

  const courses = getAllCourses();
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Dashboard</h1>
      <p className="mb-10 text-muted-foreground">
        {user?.email} · Your learning progress
      </p>

      {/* Course progress */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Course Progress</h2>
        {courses.length === 0 ? (
          <p className="text-muted-foreground">No courses yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((c) => {
              const total = c.chapters.reduce((s, ch) => s + ch.lessons.length, 0);
              const done = c.chapters.reduce(
                (s, ch) =>
                  s +
                  ch.lessons.filter((l) => {
                    const cSlug = ch.slug ?? ch.title.toLowerCase().replace(/\s+/g, "-");
                    return completedLessons.includes(
                      `${c.slug}/${cSlug}/${l.slug}`
                    );
                  }).length,
                0
              );
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <Card key={c.slug}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <Progress value={pct} className="h-1.5" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {done} / {total} lessons
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <Link
                      href={`/courses/${c.slug}`}
                      className="mt-1 text-xs text-primary hover:underline"
                    >
                      Continue →
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Practice accuracy */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Practice</h2>
        {totalAttempts === 0 ? (
          <p className="text-muted-foreground">
            No practice attempts yet. Look for exercises with a Check button on
            any lesson.
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              Total attempted:{" "}
              <span className="text-foreground">{totalAttempts}</span> · Accuracy:{" "}
              <span className="text-foreground">{overallAccuracy}%</span>
            </p>
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border overflow-hidden">
              {[...attemptStats.entries()].map(([lid, s]) => {
                const pct = Math.round((s.right / s.total) * 100);
                const parts = lid.split("/");
                let title = lid;
                let href = "#";
                if (parts.length === 3) {
                  const [cs, chs, ls] = parts;
                  href = `/courses/${cs}/${chs}/${ls}`;
                  const c = courses.find((c) => c.slug === cs);
                  const ch = c?.chapters.find(
                    (ch) =>
                      (ch.slug ?? ch.title.toLowerCase().replace(/\s+/g, "-")) ===
                      chs
                  );
                  const l = ch?.lessons.find((l) => l.slug === ls);
                  title = l?.title ?? ls;
                }
                return (
                  <Link
                    key={lid}
                    href={href}
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm text-foreground">{title}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.right} / {s.total} · {pct}%
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Bookmarks */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Bookmarks</h2>
        {bookmarks.length === 0 ? (
          <p className="text-muted-foreground">
            No bookmarks yet. Hit the ☆ button on any lesson or article.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border overflow-hidden">
            {bookmarks.map((b) => {
              let title = b.content_id;
              let href = "#";

              if (b.content_type === "article") {
                const art = articles.find((a) => a.slug === b.content_id);
                title = art?.title ?? b.content_id;
                href = `/articles/${b.content_id}`;
              } else {
                // lesson: courseSlug/chapterSlug/lessonSlug
                const parts = b.content_id.split("/");
                if (parts.length === 3) {
                  const [courseSlug, chapterSlug, lessonSlug] = parts;
                  href = `/courses/${courseSlug}/${chapterSlug}/${lessonSlug}`;
                  const course = courses.find((c) => c.slug === courseSlug);
                  if (course) {
                    const chapter = course.chapters.find(
                      (ch) =>
                        (ch.slug ?? ch.title.toLowerCase().replace(/\s+/g, "-")) ===
                        chapterSlug
                    );
                    const lesson = chapter?.lessons.find((l) => l.slug === lessonSlug);
                    title = lesson?.title ?? lessonSlug;
                  }
                }
              }

              return (
                <Link
                  key={b.content_id}
                  href={href}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm text-foreground">{title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {b.content_type}
                  </Badge>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
