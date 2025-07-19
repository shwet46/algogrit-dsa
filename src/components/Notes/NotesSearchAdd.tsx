import React from "react";
import { Search, Plus } from "lucide-react";

export default function NotesSearchAdd({ search, setSearch, setShowAdd }: { search: string, setSearch: (v: string) => void, setShowAdd: (v: boolean) => void }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c8bd2] w-5 h-5" />
        <input
          type="text"
          placeholder="Search in title or content..."
          className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c8bd2] focus:border-transparent transition-all duration-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <button
        onClick={() => setShowAdd(true)}
        className="flex items-center gap-2 px-6 py-3 bg-[#7c8bd2] hover:bg-[#5d6bb7] rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
      >
        <Plus className="w-5 h-5" />
        Add Note
      </button>
    </div>
  );
}
