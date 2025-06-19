
"use client";

import { NotesProvider } from "@/context/notesContext";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NotesProvider>{children}</NotesProvider>;
}