import { getCourse } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ course: string }>;
}

export default async function CourseOverviewPage({ params }: Props) {
  const { course: courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  const firstChapter = course.chapters[0];
  const firstLesson = firstChapter?.lessons[0];
  const chSlug = (ch: { slug?: string; title: string }) =>
    ch.slug ?? ch.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-2 flex flex-wrap gap-2">
        {course.tags.map((t) => (
          <Badge key={t} variant="secondary">
            {t}
          </Badge>
        ))}
      </div>
      <h1 className="mb-3 text-3xl font-bold text-foreground">{course.title}</h1>
      <p className="mb-8 text-lg text-muted-foreground">{course.description}</p>

      {firstLesson && firstChapter && (
        <Link href={`/courses/${courseSlug}/${chSlug(firstChapter)}/${firstLesson.slug}`}>
          <Button className="mb-10">Start Course →</Button>
        </Link>
      )}

      <div className="flex flex-col gap-6">
        {course.chapters.map((chapter) => (
          <div key={chapter.title}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {chapter.title}
            </h2>
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border overflow-hidden">
              {chapter.lessons.map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/courses/${courseSlug}/${chSlug(chapter)}/${lesson.slug}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm text-foreground">{lesson.title}</span>
                  <span className="text-xs text-muted-foreground">→</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
