"use client";
import React, { useState } from "react";
import { useNotes } from "@/context/notesContext";
import problems from "@/data/problems.json";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AddNoteFormProps = {
  onClose: () => void;
};

export const AddNoteForm: React.FC<AddNoteFormProps> = ({ onClose }) => {
  const { addNote } = useNotes();
  const allTags = Array.from(
    new Set(problems.problems.flatMap((p) => p.tags))
  ).sort();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const toggleTag = (tag: string) =>
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await addNote({ title, content, tags });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-lg max-w-lg w-full space-y-4"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Add Note</h3>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 bg-zinc-800 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content..."
          className="w-full p-2 bg-zinc-800 rounded resize-none h-24"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {allTags.map((tag) => {
            const sel = tags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm border transition",
                  sel
                    ? "bg-[#7c8bd2] text-white border-[#7c8bd2]"
                    : "bg-zinc-800 border-zinc-600 text-zinc-300"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[#7c8bd2] rounded hover:bg-[#5d6bb7]"
        >
          Save
        </button>
      </form>
    </div>
  );
};