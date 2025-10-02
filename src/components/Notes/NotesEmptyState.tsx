import React from 'react';
import { Search, Plus } from 'lucide-react';

export default function NotesEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto mb-4 bg-zinc-800 rounded-full flex items-center justify-center">
          <Search className="w-12 h-12 text-zinc-400" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No notes yet</h3>
        <p className="text-zinc-400 mb-6">
          Start building your knowledge base by creating your first note.
        </p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#7c8bd2] hover:bg-[#5d6bb7] rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Create Your First Note
        </button>
      </div>
    </div>
  );
}