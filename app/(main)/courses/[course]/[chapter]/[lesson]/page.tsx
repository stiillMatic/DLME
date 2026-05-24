import { getCourse, getLessonSource, getLessonId, stripFrontmatter } from "@/lib/content";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import MdxContent from "@/components/MdxContent";
import MarkCompleteButton from "@/components/MarkCompleteButton";
import BookmarkButton from "@/components/BookmarkButton";
import Link from "next/link";

interface Props {
  params: Promise<{ course: string; chapter: string; lesson: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { course: courseSlug, chapter: chapterSlug, lesson: lessonSlug } = await params;

  const course = getCourse(courseSlug);
  if (!course) notFound();

  const source = getLessonSource(courseSlug, chapterSlug, lessonSlug);
  if (!source) notFound();

  const lessonId = getLessonId(courseSlug, chapterSlug, lessonSlug);
  const contentSource = stripFrontmatter(source);

  const allLessons: { chapterSlug: string; slug: string; title: string }[] = [];
  let currentChapterTitle = "";
  let currentLessonTitle = "";

  for (const ch of course.chapters) {
    const cSlug = ch.slug ?? ch.title.toLowerCase().replace(/\s+/g, "-");
    for (const l of ch.lessons) {
      allLessons.push({ chapterSlug: cSlug, slug: l.slug, title: l.title });
      if (cSlug === chapterSlug && l.slug === lessonSlug) {
        currentChapterTitle = ch.title;
        currentLessonTitle = l.title;
      }
    }
  }

  const currentIdx = allLessons.findIndex(
    (l) => l.chapterSlug === chapterSlug && l.slug === lessonSlug
  );
  const prev = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const next =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  let isCompleted = false;
  let isBookmarked = false;
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const [{ data: progressData }, { data: bookmarkData }] = await Promise.all([
        supabase
          .from("user_progress")
          .select("lesson_id")
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId)
          .maybeSingle(),
        supabase
          .from("bookmarks")
          .select("content_id")
          .eq("user_id", user.id)
          .eq("content_id", lessonId)
          .maybeSingle(),
      ]);
      isCompleted = !!progressData;
      isBookmarked = !!bookmarkData;
    }
  } catch {
    // Supabase not configured
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/courses" className="hover:text-foreground">
          Courses
        </Link>
        <span>/</span>
        <Link href={`/courses/${courseSlug}`} className="hover:text-foreground">
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-muted-foreground">{currentChapterTitle}</span>
        <span>/</span>
        <span className="text-foreground">{currentLessonTitle}</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <MarkCompleteButton lessonId={lessonId} initialCompleted={isCompleted} />
        <BookmarkButton
          contentId={lessonId}
          contentType="lesson"
          initialBookmarked={isBookmarked}
        />
      </div>

      <MdxContent source={contentSource} />

      <div className="mt-12 flex justify-between gap-4 border-t border-border pt-6">
        {prev ? (
          <Link
            href={`/courses/${courseSlug}/${prev.chapterSlug}/${prev.slug}`}
            className="flex max-w-xs flex-col gap-1 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/50"
          >
            <span className="text-xs text-muted-foreground">← Previous</span>
            <span className="text-sm font-medium text-foreground">{prev.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/courses/${courseSlug}/${next.chapterSlug}/${next.slug}`}
            className="ml-auto flex max-w-xs flex-col gap-1 rounded-lg border border-border px-4 py-3 text-right transition-colors hover:bg-muted/50"
          >
            <span className="text-xs text-muted-foreground">Next →</span>
            <span className="text-sm font-medium text-foreground">{next.title}</span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
