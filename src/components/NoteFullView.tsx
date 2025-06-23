import React from "react";
import type { Note } from "./NoteEditForm";

interface NoteFullViewProps {
  note: Note;
  onClose: () => void;
  onEdit?: () => void;
}

export default function NoteFullView({ note, onClose, onEdit }: NoteFullViewProps) {
  if (!note) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative max-w-2xl w-full bg-zinc-900 rounded-2xl shadow-2xl p-8 border-2 border-[#7c8bd2] text-zinc-100">
        <button
          className="absolute top-4 right-4 text-[#7c8bd2] hover:text-white text-2xl font-bold z-10"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-3xl font-bold mb-4 text-[#7c8bd2]">{note.title}</h2>
        <div className="mb-2 text-xs text-zinc-400">
          {typeof note.createdAt === "object" && note.createdAt !== null && "toDate" in note.createdAt
            ? note.createdAt.toDate().toLocaleString()
            : note.createdAt instanceof Date
            ? note.createdAt.toLocaleString()
            : note.createdAt}
        </div>
        <div className="mb-6 whitespace-pre-line text-lg leading-relaxed">{note.content}</div>
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {note.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-zinc-800 text-[#7c8bd2] text-xs rounded-full border border-[#7c8bd2]/30">
                {tag}
              </span>
            ))}
          </div>
        )}
        {onEdit && (
          <button
            className="mt-8 px-6 py-2 rounded-lg bg-[#7c8bd2] text-white hover:bg-[#5d6bb7] font-semibold transition-all duration-200"
            onClick={onEdit}
          >
            Edit Note
          </button>
        )}
      </div>
    </div>
  );
}
