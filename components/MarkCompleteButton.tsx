"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";

interface Props {
  lessonId: string;
  initialCompleted: boolean;
}

export default function MarkCompleteButton({ lessonId, initialCompleted }: Props) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function toggle() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/sign-in";
      return;
    }

    if (completed) {
      await supabase
        .from("user_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId);
    } else {
      await supabase
        .from("user_progress")
        .upsert({ user_id: user.id, lesson_id: lessonId });
    }
    setCompleted(!completed);
    setLoading(false);
  }

  return (
    <Button
      variant={completed ? "secondary" : "default"}
      onClick={toggle}
      disabled={loading}
    >
      {completed ? "✓ Completed" : "Mark as Complete"}
    </Button>
  );
}
