# dl-for-me

Deep learning educational website for Mechanical Engineering students.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth + DB**: Supabase (free tier)
- **Content**: MDX files in `content/`
- **Styling**: Tailwind CSS v4 + shadcn/ui (dark theme default)
- **Hosting**: Vercel

## Dev Server

```bash
cd /Users/franco/dl-for-me
npm run dev -- --port 3001
```

Visit: http://localhost:3001

## Adding Content

**New lesson** — create a `.mdx` file:
```
content/courses/<course-slug>/<chapter-slug>/<lesson-slug>.mdx
```
Then add the lesson entry to `content/courses/<course-slug>/meta.json`.

**New article** — create a `.mdx` file with frontmatter:
```
content/articles/<slug>.mdx
```
Frontmatter fields: `title`, `description`, `date` (YYYY-MM-DD), `tags` (array).

## MDX Frontmatter Format

```mdx
---
title: "Lesson Title"
description: "One-line description"
---

# Content starts here
```

Math via KaTeX: `$inline$` and `$$block$$`
Code blocks: fenced with language tag

## Project Structure

- `app/(main)/` — public pages (landing, courses, articles)
- `app/(auth)/` — sign-in, sign-up
- `app/(main)/dashboard/` — user dashboard (requires login)
- `components/` — React components
- `content/` — MDX course and article files
- `lib/supabase-client.ts` — browser Supabase client
- `lib/supabase-server.ts` — server Supabase client
- `lib/content.ts` — MDX file loader
- `proxy.ts` — auth route protection (Next.js 16 middleware)
- `supabase/schema.sql` — database schema

## Supabase Tables

- `user_progress (user_id, lesson_id, completed_at)` — tracks completed lessons
- `bookmarks (user_id, content_id, content_type)` — lesson and article bookmarks

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## CSS Notes

- Tailwind v4: use `@import "package/dist/file.css"` (full path), not bare package names
- Dark theme is applied via `class="dark"` on `<html>` in `app/layout.tsx`
- Prose styles for MDX content are in `app/globals.css` under `.prose`

---

## Coding Guidelines

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## Content Writing Template (Lessons)

Every new `.mdx` lesson should follow this seven-part structure (established and applied across Calculus I/II/III, Linear Algebra, Physics I/II/III, Quantum, Organic Chem, Physical Chem, etc.):

1. **The Big Picture** — one paragraph stating *why* this concept exists and what problem it solves
2. **Intuition First** — visual/physical analogy before any formal math
3. **From Zero to the Definition / Derivation** — derive the definition, don't drop it from the sky
4. **Worked Examples** (2–4) — step-by-step, with reasoning narrated
5. **Common Misconceptions** (2–4) — student errors with explanations of why they're wrong
6. **Engineering Connection** — concrete ME or DL application
7. **Practice Problems** — `<ExQ>/<ExA>` pairs, organized into tiers:
   - Warm-up (computational, single concept)
   - Application (with units, real numbers)
   - Conceptual (true/false, sketch, find counterexample, identify-the-technique)
   - Engineering Synthesis (multi-step real scenarios)
   - Challenge (mastery-level, for key chapters)

Each chapter also has a `practice.mdx` with 20+ mixed problems including a Challenge Set.

## Known Pitfalls (Don't Repeat These)

- **`meta.json` references must have matching `.mdx` files** — orphan references cause silent 404s on lesson links. Always verify with the find-missing-lessons script after editing meta.
- **Inline SVG in MDX cannot use `.map()` or other JSX expressions** — they don't render. Write SVG elements out statically.
- **SVG attributes must be camelCase** in MDX: `viewBox`, `strokeWidth`, `strokeDasharray`, `textAnchor`, `fontSize` — not their HTML-cased versions.
- **Tailwind v4 cannot resolve bare package names** in `@import` — must use full path like `@import "shadcn/tailwind.css"` (with the `style` export condition). KaTeX CSS must be imported in `app/layout.tsx` (`import "katex/dist/katex.min.css"`), not in `globals.css`.
- **Next.js 16 renamed `middleware.ts` to `proxy.ts`** and the exported function from `middleware` to `proxy`.
- **Supabase clients must be split**: `lib/supabase-client.ts` for browser components, `lib/supabase-server.ts` for server components. Don't combine — `next/headers` breaks client builds.
- **Course overview links use 3 path segments**: `/courses/[course]/[chapter]/[lesson]` — not 2.
- **Auth-dependent pages need `export const dynamic = "force-dynamic"`** to avoid build-time crashes when Supabase isn't reachable.
- **`getCourse()` reads `meta.json` synchronously** — keep meta.json valid JSON or build crashes.
- **Client-component MDX widgets** (with `useState`, event handlers, etc.) must be marked `"use client"` AND registered in `components/MdxContent.tsx`'s components map. Otherwise React hooks fail silently and the widget renders as plain HTML. Interactive demos live under `components/Interactive/`.

---

## Long-Term Roadmap (Khan / 3B1B / Brilliant trajectory)

The site has deep static content but lacks the interactivity, personalization, and habit-loops that make those reference sites sticky. Work proceeds in four phases:

### Phase 1 — Quick wins (highest ROI, ~1 month)
- **A**. Interactive parameter sliders (Brilliant-style) — `<FunctionPlot/>` + `<Slider/>` primitives in `components/Interactive/`. ✅ STARTED (SHM, Taylor, Riemann demos shipped). EXPANDING this week.
- **B**. Auto-scored numeric fill-in-the-blank questions — upgrade `<ExA>` with input + immediate feedback, store attempts in Supabase.
- **C**. Streak + daily challenge — Dashboard "🔥 N-day streak", homepage random "today's question". Uses existing Supabase user_progress.

### Phase 2 — Visual leap (~1–2 months)
- **D**. 3B1B-style animated visualizations using Motion Canvas or Manim Web for 3–5 hero concepts (derivative limit, Riemann sum, Fourier decomposition, eigenvector action, quantum tunneling).
- **E**. Concept dependency graph — each lesson declares prereqs; auto-render knowledge map.

### Phase 3 — Intelligence / personalization (~2–4 months)
- **F**. Spaced repetition scheduler (Anki-style) using user_progress table.
- **G**. Adaptive difficulty — Bayesian Knowledge Tracing on quiz attempts.
- **H**. AI tutor — Claude API embedded with full lesson context per page.

### Phase 4 — Community + growth (~4–6 months)
- **I**. Discussion threads per lesson.
- **J**. Public user notes for SEO.
- **K**. Multi-language (Chinese/English split).

## Weekly Cadence

**One feature per week.** Before starting, report feasibility and current site state to user; wait for go-ahead.

The current week's specific plan lives at `.claude/plans/streamed-marinating-lake.md`. Update it each Monday.

**Week-by-week log (most recent first):**

| Week | Phase | Task | Status |
|---|---|---|---|
| W1 | 1A | Build slider primitives + SHM/Taylor/Riemann demos | ✅ Done |
| W2 | 1A (expand) | DerivativeSecant, DampedOscillator, GaussianUncertainty, FourierSquareWave, QuantumWell, RCCharging demos | ✅ Done |
| W2.5 | infra + design | git init + Learning Paths data + Landing/Courses redesign with paths, stats bar, area cards, embedded demo | ✅ Done (push pending) |
| W3 | 1B | Auto-scored numeric questions | ⏳ Next |
| W4 | 1C | Streak + daily challenge | ⏳ Planned |
| W5 | 2D | First 3B1B-style animation | ⏳ Planned |

**Resume protocol for any new Claude session**:
1. Read this file (auto-loaded).
2. Read `.claude/plans/streamed-marinating-lake.md` for current task details.
3. Run `npm run build` to confirm site is healthy.
4. Run the missing-lessons script: `for course in content/courses/*/; do ... done` (see "Known Pitfalls").
5. Continue at the in-progress task per the table above.

## Deployment

Project is its own git repo (separate from parent `/Users/franco`).

- **Branch**: `main`
- **Hosting**: Vercel — auto-deploys on every push to `main`
- **Env vars** (set in Vercel dashboard, NOT committed):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Local secrets** live in `.env.local` (gitignored). Template at `.env.local.example` is committed.

### Standard deploy workflow
```bash
git add -A
git commit -m "..."
git push                  # Vercel detects, builds, deploys (~2 min)
```

### Adding new env vars
1. Add to `.env.local` locally.
2. Add to Vercel project → Settings → Environment Variables.
3. Redeploy if needed.

### Branch / preview deploys
Push to any non-`main` branch → Vercel builds a preview URL. Useful for reviewing big content changes before they go live.
