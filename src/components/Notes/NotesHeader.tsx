import React from "react";

export default function NotesHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "'Fira Code', monospace" }}>
        My Notes
      </h1>
      <p className="text-zinc-400">Organize and search through your coding notes</p>
    </div>
  );
}
