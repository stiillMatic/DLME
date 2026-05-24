import fs from "fs";
import path from "path";

export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  courses: string[];
}

export function getAllPaths(): LearningPath[] {
  const filePath = path.join(process.cwd(), "content", "learning-paths.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as LearningPath[];
}

export function getPath(slug: string): LearningPath | null {
  return getAllPaths().find((p) => p.slug === slug) ?? null;
}
