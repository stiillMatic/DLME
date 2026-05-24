"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";

interface Props {
  contentId: string;
  contentType: "lesson" | "article";
  initialBookmarked: boolean;
}

export default function BookmarkButton({
  contentId,
  contentType,
  initialBookmarked,
}: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
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

    if (bookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("content_id", contentId);
    } else {
      await supabase
        .from("bookmarks")
        .insert({ user_id: user.id, content_id: contentId, content_type: contentType });
    }
    setBookmarked(!bookmarked);
    setLoading(false);
  }

  return (
    <Button
      variant={bookmarked ? "secondary" : "outline"}
      size="sm"
      onClick={toggle}
      disabled={loading}
    >
      {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
    </Button>
  );
}
