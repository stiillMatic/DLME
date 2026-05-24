import { getArticleSource, getAllArticles, stripFrontmatter } from "@/lib/content";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import MdxContent from "@/components/MdxContent";
import BookmarkButton from "@/components/BookmarkButton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const source = getArticleSource(slug);
  if (!source) notFound();

  const articles = getAllArticles();
  const meta = articles.find((a) => a.slug === slug);
  const contentSource = stripFrontmatter(source);

  let isBookmarked = false;
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("bookmarks")
        .select("content_id")
        .eq("user_id", user.id)
        .eq("content_id", slug)
        .maybeSingle();
      isBookmarked = !!data;
    }
  } catch {
    // Supabase not configured
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/articles" className="hover:text-foreground">
          Articles
        </Link>
        <span>/</span>
        <span className="text-foreground">{meta?.title}</span>
      </nav>

      {meta && (
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {meta.tags.map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{meta.title}</h1>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{meta.date}</span>
            <BookmarkButton contentId={slug} contentType="article" initialBookmarked={isBookmarked} />
          </div>
        </div>
      )}

      <MdxContent source={contentSource} />
    </div>
  );
}
