import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotesPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center gap-4">
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
          currentPage === 1
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'
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
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
          currentPage === totalPages
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'
        )}
      >
        Next
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}