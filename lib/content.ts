import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface LessonMeta {
  title: string;
  description?: string;
  order: number;
}

export interface ChapterMeta {
  title: string;
  slug?: string;
  order: number;
  lessons: (LessonMeta & { slug: string })[];
}

export interface CourseMeta {
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  chapters: ChapterMeta[];
}

export interface ArticleMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
}

export function getCourse(courseSlug: string): CourseMeta | null {
  const metaPath = path.join(CONTENT_DIR, "courses", courseSlug, "meta.json");
  if (!fs.existsSync(metaPath)) return null;
  return JSON.parse(fs.readFileSync(metaPath, "utf-8")) as CourseMeta;
}

export function getAllCourses(): (CourseMeta & { slug: string })[] {
  const dir = path.join(CONTENT_DIR, "courses");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((d) => fs.statSync(path.join(dir, d)).isDirectory())
    .map((slug) => {
      const meta = getCourse(slug);
      return meta ? { ...meta, slug } : null;
    })
    .filter(Boolean) as (CourseMeta & { slug: string })[];
}

export function getLessonSource(
  courseSlug: string,
  chapterSlug: string,
  lessonSlug: string
): string | null {
  const filePath = path.join(
    CONTENT_DIR,
    "courses",
    courseSlug,
    chapterSlug,
    `${lessonSlug}.mdx`
  );
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function getLessonId(
  courseSlug: string,
  chapterSlug: string,
  lessonSlug: string
) {
  return `${courseSlug}/${chapterSlug}/${lessonSlug}`;
}

export function getAllArticles(): ArticleMeta[] {
  const dir = path.join(CONTENT_DIR, "articles");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      const content = fs.readFileSync(path.join(dir, f), "utf-8");
      const frontmatter = parseFrontmatter(content);
      return { ...(frontmatter as Omit<ArticleMeta, "slug">), slug };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getArticleSource(slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, "articles", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

function parseFrontmatter(source: string): Record<string, unknown> {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, unknown> = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...vals] = line.split(":");
    if (!key) return;
    const raw = vals.join(":").trim();
    if (raw.startsWith("[")) {
      result[key.trim()] = raw
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""));
    } else {
      result[key.trim()] = raw.replace(/^["']|["']$/g, "");
    }
  });
  return result;
}

export function stripFrontmatter(source: string): string {
  return source.replace(/^---\n[\s\S]*?\n---\n/, "");
}
