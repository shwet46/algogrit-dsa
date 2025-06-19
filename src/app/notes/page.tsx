"use client";
import React, { useState } from "react";
import { useNotes } from "@/context/notesContext";
import { AddNoteForm } from "@/components/AddNoteForm";
import { Search, Filter, X, ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import problems from "@/data/problems.json";
import { useAuth } from "@/context/authContext";

export default function NotesDashboard() {
  const { user } = useAuth();
  const { notes, loading } = useNotes();
  const allTags = Array.from(
    new Set(problems.problems.flatMap((p) => p.tags))
  ).sort();

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const filtered = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (n) =>
        selectedTags.length === 0 ||
        selectedTags.some((t) => n.tags.includes(t))
    );

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const visible = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl font-bold">
        Signup to grind DSA
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-black via-zinc-900 to-black text-zinc-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" 
              style={{ fontFamily: "'Fira Code', monospace" }}>
            My Notes
          </h1>
          <p className="text-zinc-400">Organize and search through your coding notes</p>
        </div>

        {/* Search and Add Note Section */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c8bd2] w-5 h-5" />
              <input
                type="text"
                placeholder="Search in title or content..."
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c8bd2] focus:border-transparent transition-all duration-200"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            {/* Add Note Button */}
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#7c8bd2] hover:bg-[#5d6bb7] rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Note
            </button>
          </div>

          {/* Tag Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Filter className="w-4 h-4" />
              <span>Filter by tags:</span>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => { setSelectedTags([]); setCurrentPage(1); }}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 20).map((tag) => {
                const sel = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => { toggleTag(tag); setCurrentPage(1); }}
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
              {allTags.length > 20 && (
                <span className="text-sm text-zinc-400 px-3 py-1.5">
                  + {allTags.length - 20} more tags available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c8bd2]"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && notes.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No notes yet</h3>
              <p className="text-zinc-400 mb-6">Start building your knowledge base by creating your first note.</p>
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#7c8bd2] hover:bg-[#5d6bb7] rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create Your First Note
              </button>
            </div>
          </div>
        )}

        {/* Filtered Results Info */}
        {!loading && notes.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-zinc-400">
              {filtered.length === notes.length 
                ? `Showing all ${notes.length} notes`
                : `Showing ${filtered.length} of ${notes.length} notes`
              }
            </div>
            {(search || selectedTags.length > 0) && (
              <button
                onClick={() => { setSearch(""); setSelectedTags([]); setCurrentPage(1); }}
                className="text-sm text-[#7c8bd2] hover:text-[#5d6bb7] flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Notes Grid */}
        {!loading && notes.length > 0 && (
          <>
            <div className="grid gap-6 mb-8">
              {visible.map((n) => (
                <div 
                  key={n.id} 
                  className="group p-6 bg-zinc-900 border border-zinc-700 rounded-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 hover:transform hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-[#7c8bd2] transition-colors duration-200">
                      {n.title}
                    </h3>
                    <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full">
                      {n.createdAt.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-zinc-300 mb-4 line-clamp-3 leading-relaxed">
                    {n.content}
                  </p>
                  
                  {n.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {n.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-md hover:bg-zinc-700 transition-colors duration-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                    currentPage === 1
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
                  )}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Page</span>
                  <span className="font-semibold text-zinc-100">{currentPage}</span>
                  <span className="text-zinc-400">of</span>
                  <span className="font-semibold text-zinc-100">{totalPages}</span>
                </div>
                
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                    currentPage === totalPages
                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
                  )}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Add Note Modal */}
        {showAdd && <AddNoteForm onClose={() => setShowAdd(false)} />}
      </div>
    </div>
  );
}