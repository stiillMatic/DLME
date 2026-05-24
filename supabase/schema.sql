-- Run this in your Supabase project's SQL editor.
-- Supabase Auth is used for user management (auth.users table is managed automatically).

-- Track completed lessons per user
CREATE TABLE IF NOT EXISTS user_progress (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id    TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);

-- Bookmarks for lessons and articles
CREATE TABLE IF NOT EXISTS bookmarks (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id   TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('lesson', 'article')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, content_id)
);

-- Row-Level Security: users can only access their own rows
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_progress_own" ON user_progress
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookmarks_own" ON bookmarks
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
