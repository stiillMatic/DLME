import { getAllArticles } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground">Articles</h1>
        <p className="mt-2 text-muted-foreground">
          Deep dives, intuition-building guides, and practical applications.
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">Articles coming soon.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="flex flex-col gap-2 py-5 transition-opacity hover:opacity-80"
            >
              <div className="flex flex-wrap gap-1.5">
                {a.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
              <h2 className="text-lg font-semibold text-foreground">{a.title}</h2>
              <p className="text-sm text-muted-foreground">{a.description}</p>
              <span className="text-xs text-muted-foreground">{a.date}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
