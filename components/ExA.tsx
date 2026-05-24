"use client";

import { useState } from "react";

export default function ExA({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-2 mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
      >
        <span>{open ? "▲" : "▼"}</span>
        <span>{open ? "Hide Solution" : "Show Solution"}</span>
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-green-500/20 bg-green-500/5 px-5 py-4">
          <div className="prose">{children}</div>
        </div>
      )}
    </div>
  );
}
