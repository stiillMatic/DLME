import type { MetadataRoute } from "next";
import { getAllCourses, getAllArticles } from "@/lib/content";
import { getAllPaths } from "@/lib/learning-paths";

const SITE_URL = "https://dlme-nu.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const courses = getAllCourses();
  const articles = getAllArticles();
  const paths = getAllPaths();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/sign-up`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/sign-in`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Course overview + chapter/lesson pages
  const courseRoutes: MetadataRoute.Sitemap = [];
  for (const c of courses) {
    courseRoutes.push({
      url: `${SITE_URL}/courses/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    for (const ch of c.chapters) {
      const chSlug = ch.slug ?? ch.title.toLowerCase().replace(/\s+/g, "-");
      for (const l of ch.lessons) {
        courseRoutes.push({
          url: `${SITE_URL}/courses/${c.slug}/${chSlug}/${l.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  // Article pages
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Note: learning paths don't have their own page yet, but referenced for future
  void paths;

  return [...staticRoutes, ...courseRoutes, ...articleRoutes];
}
