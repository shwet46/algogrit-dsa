import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Note } from './NoteEditForm';

interface NoteFullViewProps {
  note: Note;
  onClose: () => void;
  onEdit?: () => void;
}

export default function NoteFullView({
  note,
  onClose,
  onEdit,
}: NoteFullViewProps) {
  if (!note) return null;

  let createdAtStr = '';
  if (
    note.createdAt &&
    typeof note.createdAt === 'object' &&
    note.createdAt !== null &&
    typeof (note.createdAt as { toDate?: unknown }).toDate === 'function'
  ) {
    createdAtStr = (note.createdAt as unknown as { toDate: () => Date })
      .toDate()
      .toLocaleString();
  } else if (note.createdAt instanceof Date) {
    createdAtStr = note.createdAt.toLocaleString();
  } else if (
    typeof note.createdAt === 'string' ||
    typeof note.createdAt === 'number'
  ) {
    createdAtStr = String(note.createdAt);
  }

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
        <div className="mb-2 text-xs text-zinc-400">{createdAtStr}</div>
        <div className="prose prose-invert max-w-none mt-6 mb-4">
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {note.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-zinc-800 text-[#7c8bd2] text-xs rounded-full border border-[#7c8bd2]/30"
              >
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