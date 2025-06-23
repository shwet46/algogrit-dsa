"use client";
import React, { useState } from "react";
import { useNotes } from "@/context/notesContext";
import { AddNoteForm } from "@/components/AddNoteForm";
import NotesHeader from "@/components/NotesHeader";
import NotesSearchAdd from "@/components/NotesSearchAdd";
import NotesTagFilters from "@/components/NotesTagFilters";
import NotesEmptyState from "@/components/NotesEmptyState";
import NotesFilteredInfo from "@/components/NotesFilteredInfo";
import NotesPagination from "@/components/NotesPagination";
import problems from "@/data/problems.json";
import { useAuth } from "@/context/authContext";
import NoteFullView from "@/components/NoteFullView";
import NoteEditForm, { Note } from "@/components/NoteEditForm";
import Footer from "@/components/Footer";

export default function NotesDashboard() {
  const { user } = useAuth();
  const { notes, loading, updateNote } = useNotes();
  const allTags = Array.from(
    new Set(problems.problems.flatMap((p) => p.tags))
  ).sort();

  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editNote, setEditNote] = useState<Note | null>(null);

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
    <div className="min-h-screen mt-20 bg-black text-zinc-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <NotesHeader />
        {/* Search and Add Note Section */}
        <div className="mb-8 space-y-4">
          <NotesSearchAdd
            search={search}
            setSearch={(v) => {
              setSearch(v);
              setCurrentPage(1);
            }}
            setShowAdd={setShowAdd}
          />
          <NotesTagFilters
            allTags={allTags}
            selectedTags={selectedTags}
            toggleTag={(tag) => {
              toggleTag(tag);
              setCurrentPage(1);
            }}
            clearTags={() => {
              setSelectedTags([]);
              setCurrentPage(1);
            }}
          />
        </div>
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c8bd2]"></div>
          </div>
        )}
        {/* Empty State */}
        {!loading && notes.length === 0 && (
          <NotesEmptyState onAdd={() => setShowAdd(true)} />
        )}
        {/* Filtered Results Info */}
        {!loading && notes.length > 0 && (
          <NotesFilteredInfo
            filteredCount={filtered.length}
            totalCount={notes.length}
            search={search}
            selectedTags={selectedTags}
            clearFilters={() => {
              setSearch("");
              setSelectedTags([]);
              setCurrentPage(1);
            }}
          />
        )}
        {/* Notes Grid */}
        {!loading && notes.length > 0 && (
          <>
            <div className="grid gap-6 mb-8">
              {visible.map((n) => (
                <div
                  key={n.id}
                  className="group p-6 bg-zinc-900 border border-zinc-700 rounded-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 hover:transform hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                  onClick={() => setSelectedNote(n)}
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
              <NotesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
            {/* Full Page Note View */}
            {selectedNote && !editNote && (
              <NoteFullView
                note={selectedNote}
                onClose={() => setSelectedNote(null)}
                onEdit={() => {
                  setEditNote(selectedNote);
                }}
              />
            )}
            {editNote && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="relative max-w-2xl w-full bg-zinc-900 rounded-2xl shadow-2xl p-8 border-2 border-[#7c8bd2] text-zinc-100">
                  <button
                    className="absolute top-4 right-4 text-[#7c8bd2] hover:text-white text-2xl font-bold z-10"
                    onClick={() => setEditNote(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <NoteEditForm
                    note={editNote}
                    onSave={async (n) => {
                      await updateNote(n.id, {
                        title: n.title,
                        content: n.content,
                        tags: n.tags,
                      });
                      setEditNote(null);
                      setSelectedNote(null);
                    }}
                    onCancel={() => setEditNote(null)}
                  />
                </div>
              </div>
            )}
          </>
        )}
        {/* Add Note Modal */}
        {showAdd && <AddNoteForm onClose={() => setShowAdd(false)} />}
      </div>
      <Footer />
    </div>
  );
}