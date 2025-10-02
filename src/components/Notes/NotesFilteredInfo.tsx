import React from 'react';
import { X } from 'lucide-react';

export default function NotesFilteredInfo({
  filteredCount,
  totalCount,
  search,
  selectedTags,
  clearFilters,
}: {
  filteredCount: number;
  totalCount: number;
  search: string;
  selectedTags: string[];
  clearFilters: () => void;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="text-zinc-400">
        {filteredCount === totalCount
          ? `Showing all ${totalCount} notes`
          : `Showing ${filteredCount} of ${totalCount} notes`}
      </div>
      {(search || selectedTags.length > 0) && (
        <button
          onClick={clearFilters}
          className="text-sm text-[#7c8bd2] hover:text-[#5d6bb7] flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          Clear filters
        </button>
      )}
    </div>
  );
}