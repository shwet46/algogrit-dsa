import React from 'react';
import { ArrowLeft, ArrowRight, MoreHorizontal } from 'lucide-react';

interface CnArg {
  toString(): string;
}

const cn = (
  ...classes: (string | undefined | false | null | 0 | CnArg)[]
): string => classes.filter(Boolean).join(' ');

type ProblemsPaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (n: number) => void;
};

const ProblemsPagination: React.FC<ProblemsPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
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
          'group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 border-2',
          'transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
          currentPage === 1
            ? 'text-neutral-500 border-[#7c8bd2]/20 cursor-not-allowed bg-neutral-800/30'
            : 'text-zinc-100 border-[#7c8bd2]/25 hover:text-[#c6cbf5] hover:border-[#7c8bd2]/40 hover:bg-zinc-900/40 hover:shadow-lg hover:shadow-[#7c8bd2]/20'
        )}
      >
        <ArrowLeft
          size={18}
          className={cn(
            'transition-transform duration-300',
            currentPage !== 1 && 'group-hover:-translate-x-1'
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
                'w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden',
                'transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                isActive
                  ? 'bg-zinc-900/60 text-[#c6cbf5] border-2 border-[#7c8bd2]/40 hover:border-[#7c8bd2]/60'
                  : 'bg-zinc-950/40 text-neutral-300 border-2 border-[#7c8bd2]/25 hover:text-white hover:bg-zinc-900/40 hover:border-[#7c8bd2]/40 hover:shadow-md hover:shadow-[#7c8bd2]/20'
              )}
            >
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
          'group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 border-2',
          'transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
          currentPage === totalPages
            ? 'text-neutral-500 border-[#7c8bd2]/20 cursor-not-allowed bg-neutral-800/30'
            : 'text-zinc-100 border-[#7c8bd2]/25 hover:text-[#c6cbf5] hover:border-[#7c8bd2]/40 hover:bg-zinc-900/40 hover:shadow-lg hover:shadow-[#7c8bd2]/20'
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight
          size={18}
          className={cn(
            'transition-transform duration-300',
            currentPage !== totalPages && 'group-hover:translate-x-1'
          )}
        />
      </button>

      {/* Page Info - Mobile Friendly */}
      <div className="sm:hidden w-full text-center mt-2">
        <span className="text-sm text-neutral-400">
          Page <span className="font-bold text-[#7c8bd2]">{currentPage}</span>{' '}
          of <span className="font-bold text-[#7c8bd2]">{totalPages}</span>
        </span>
      </div>
    </div>
  );
};

export default ProblemsPagination;
