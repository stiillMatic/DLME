# dl-for-me

An MIT-style STEM curriculum for mechanical engineering students — calculus, linear algebra, physics, chemistry, and deep learning — with interactive demos, click-to-reveal practice problems, and progress tracking.

**Stack**: Next.js 16 (App Router) · Tailwind v4 + shadcn/ui · MDX content · Supabase (auth + DB) · deployed on Vercel.

## Site Layout

- **18 courses** across 5 areas: Mathematics, Physics, Chemistry, Core ME, Deep Learning
- **~230 lessons** in MDX format with KaTeX math, syntax-highlighted code, and SVG diagrams
- **Interactive demos** (`<SHMDemo />`, `<TaylorDemo />`, `<RiemannDemo />`, etc.) — Brilliant.org-style parameter sliders
- **Click-to-reveal practice problems** (`<ExQ>/<ExA>`) graded by difficulty
- **User progress tracking** + bookmarks via Supabase

## Local Development

```bash
npm install
cp .env.local.example .env.local        # then fill in Supabase URL + anon key
npm run dev -- --port 3001
```

Visit http://localhost:3001.

## Adding Content

Create an MDX file under `content/courses/<course-slug>/<chapter-slug>/<lesson-slug>.mdx` and register it in the chapter's `meta.json`. See [CLAUDE.md](./CLAUDE.md) for the full lesson template and content conventions.

## Deployment

The site auto-deploys to Vercel on every push to `main`. To deploy your own instance:

1. Fork or push this repo to your GitHub account.
2. Import the repo at [vercel.com](https://vercel.com) → New Project.
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

## Project Documentation

See [CLAUDE.md](./CLAUDE.md) for full project conventions, content template, known pitfalls, and the long-term feature roadmap.
