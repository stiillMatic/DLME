"use client";

import { createContext, useContext } from "react";

const LessonIdContext = createContext<string | null>(null);

export function LessonProvider({
  lessonId,
  children,
}: {
  lessonId: string;
  children: React.ReactNode;
}) {
  return (
    <LessonIdContext.Provider value={lessonId}>
      {children}
    </LessonIdContext.Provider>
  );
}

export function useLessonId(): string | null {
  return useContext(LessonIdContext);
}
