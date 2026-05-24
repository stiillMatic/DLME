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

  try {
    const supabase = await createServerSupabaseClient();
    const { data: userData } = await supabase.auth.getUser();
    user = userData.user;
    if (!user) redirect("/sign-in?next=/dashboard");

    const [{ data: progress }, { data: bmarks }] = await Promise.all([
      supabase.from("user_progress").select("lesson_id").eq("user_id", user.id),
      supabase.from("bookmarks").select("content_id, content_type").eq("user_id", user.id),
    ]);
    completedLessons = (progress ?? []).map((r) => r.lesson_id);
    bookmarks = bmarks ?? [];
  } catch {
    redirect("/sign-in?next=/dashboard");
  }

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
