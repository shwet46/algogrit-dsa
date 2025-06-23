import React, { useState } from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt?: Date | string | { toDate: () => Date };
}

interface NoteEditFormProps {
  note: Note;
  onSave: (n: Note) => void;
  onCancel: () => void;
}

export default function NoteEditForm({ note, onSave, onCancel }: NoteEditFormProps) {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const [tags, setTags] = useState(note.tags?.join(", ") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...note, title, content, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-zinc-300 mb-1">Title</label>
        <input
          className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-zinc-300 mb-1">Content</label>
        <textarea
          className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2] min-h-[120px]"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-zinc-300 mb-1">Tags (comma separated)</label>
        <input
          className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
      </div>
      <div className="flex gap-4 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-[#7c8bd2] text-white hover:bg-[#5d6bb7]">Save</button>
      </div>
    </form>
  );
}
