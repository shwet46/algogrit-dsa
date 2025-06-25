import React, { useState } from "react";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotesTagFilters({
  allTags,
  selectedTags,
  toggleTag,
  clearTags,
}: {
  allTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
}) {
  const [showAll, setShowAll] = useState(false);

  const tagsToShow = showAll ? allTags : allTags.slice(0, 20);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Filter className="w-4 h-4" />
        <span>Filter by topics:</span>
        {selectedTags.length > 0 && (
          <button
            onClick={clearTags}
            className="text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tagsToShow.map((tag) => {
          const sel = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
                sel
                  ? "bg-[#7c8bd2] text-white border-[#7c8bd2] shadow-md"
                  : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600"
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {allTags.length > 20 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-indigo-400 hover:underline"
        >
          {showAll ? "Show less" : `Show all (${allTags.length})`}
        </button>
      )}
    </div>
  );
}