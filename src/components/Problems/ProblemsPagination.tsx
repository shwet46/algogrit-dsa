import React from "react";
import { ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react";

// Simple cn utility for className merging
interface CnArg {
  toString(): string;
}

const cn = (...classes: (string | undefined | false | null | 0 | CnArg)[]): string =>
  classes.filter(Boolean).join(' ');

type ProblemsPaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (n: number) => void;
};

const ProblemsPagination: React.FC<ProblemsPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  // Generate page numbers with ellipsis logic
  const generatePageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex ellipsis logic for better UX
      if (currentPage <= 4) {
        // Near beginning: 1 2 3 4 5 ... last
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near end: 1 ... last-4 last-3 last-2 last-1 last
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle: 1 ... current-1 current current+1 ... last
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-8 sm:mt-12 px-4">
      {/* Previous Button */}
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 border-2",
          "transform hover:scale-105 active:scale-95",
          currentPage === 1
            ? "text-neutral-500 border-neutral-700 cursor-not-allowed bg-neutral-800/30"
            : "text-[#7c8bd2] border-[#7c8bd2]/40 hover:border-[#7c8bd2] hover:bg-[#7c8bd2]/10 hover:shadow-lg hover:shadow-[#7c8bd2]/20"
        )}
      >
        <ArrowLeft 
          size={18} 
          className={cn(
            "transition-transform duration-300",
            currentPage !== 1 && "group-hover:-translate-x-1"
          )} 
        />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-2 bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-2 border border-[#7c8bd2]/20">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-neutral-500"
              >
                <MoreHorizontal size={16} />
              </div>
            );
          }

          const isActive = page === currentPage;
          
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page as number)}
              className={cn(
                "w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden",
                "transform hover:scale-110 active:scale-95",
                isActive
                  ? "bg-gradient-to-br from-[#7c8bd2] via-[#6a7bc8] to-[#5d6bb7] text-white shadow-lg shadow-[#7c8bd2]/30 border-2 border-[#7c8bd2]/50"
                  : "text-[#7c8bd2] hover:text-white hover:bg-[#7c8bd2]/20 border-2 border-transparent hover:border-[#7c8bd2]/30 hover:shadow-md hover:shadow-[#7c8bd2]/20"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl" />
              )}
              <span className="relative z-10">{page}</span>
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 border-2",
          "transform hover:scale-105 active:scale-95",
          currentPage === totalPages
            ? "text-neutral-500 border-neutral-700 cursor-not-allowed bg-neutral-800/30"
            : "text-[#7c8bd2] border-[#7c8bd2]/40 hover:border-[#7c8bd2] hover:bg-[#7c8bd2]/10 hover:shadow-lg hover:shadow-[#7c8bd2]/20"
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight 
          size={18} 
          className={cn(
            "transition-transform duration-300",
            currentPage !== totalPages && "group-hover:translate-x-1"
          )} 
        />
      </button>

      {/* Page Info - Mobile Friendly */}
      <div className="sm:hidden w-full text-center mt-2">
        <span className="text-sm text-neutral-400">
          Page <span className="font-bold text-[#7c8bd2]">{currentPage}</span> of{" "}
          <span className="font-bold text-[#7c8bd2]">{totalPages}</span>
        </span>
      </div>
    </div>
  );
};

export default ProblemsPagination;