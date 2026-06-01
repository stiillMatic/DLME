"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-client";
import { useLessonId } from "./LessonContext";

type Props = {
  children: React.ReactNode;
  id?: string;
  answer?: number;
  tol?: number;
  unit?: string;
};

export default function ExQ({
  children,
  id,
  answer,
  tol = 0.001,
  unit,
}: Props) {
  const numericMode = typeof answer === "number" && !!id;
  const lessonId = useLessonId();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [attempts, setAttempts] = useState(0);
  const [needsSignIn, setNeedsSignIn] = useState(false);

  async function logAttempt(submitted: number, isCorrect: boolean) {
    if (!lessonId || !id) return;
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setNeedsSignIn(true);
        return;
      }
      await supabase.from("practice_attempts").insert({
        user_id: data.user.id,
        lesson_id: lessonId,
        question_id: id,
        submitted,
        is_correct: isCorrect,
      });
    } catch {
      // network or supabase not configured — silent
    }
  }

  function handleCheck() {
    if (!numericMode) return;
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) {
      setStatus("wrong");
      return;
    }
    const correct = Math.abs(parsed - (answer as number)) <= tol;
    setStatus(correct ? "correct" : "wrong");
    setAttempts((a) => a + 1);
    void logAttempt(parsed, correct);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleCheck();
  }

  return (
    <div className="relative my-6 rounded-lg border border-primary/30 bg-primary/5 px-5 py-4 pl-5">
      <span className="absolute right-3 top-3 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
        Exercise
      </span>
      <div className="prose pr-16">{children}</div>

      {numericMode && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Your answer"
              className="w-36 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
            <button
              onClick={handleCheck}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Check
            </button>
            {status === "correct" && (
              <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400">
                ✅ Correct
              </span>
            )}
            {status === "wrong" && (
              <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
                ❌ Not quite — try again
              </span>
            )}
            {attempts > 0 && (
              <span className="text-xs text-muted-foreground">
                Attempt {attempts}
              </span>
            )}
          </div>

          {(status === "correct" || attempts >= 3) && (
            <p className="text-xs text-muted-foreground">
              {status === "correct"
                ? "Nice. Expand the solution below to compare reasoning."
                : "Stuck? Expand the solution below for a walk-through."}
            </p>
          )}

          {needsSignIn && (
            <p className="text-xs text-muted-foreground">
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>{" "}
              to save your attempts.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
