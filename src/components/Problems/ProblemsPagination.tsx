import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ProblemsPaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (n: number) => void;
};

const ProblemsPagination: React.FC<ProblemsPaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 md:gap-8 mt-8 sm:mt-12">
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-[#7c8bd2]/30",
          currentPage === 1 
            ? "text-neutral-600 cursor-not-allowed" 
            : "text-[#7c8bd2] hover:text-white hover:bg-[#7c8bd2]/10"
        )}
      >
        <ArrowLeft size={20} />
        Previous
      </button>
      <div className="flex items-center gap-6">
        <span className="text-lg text-neutral-300">
          Page <span className="font-bold text-[#7c8bd2]">{currentPage}</span> of{" "}
          <span className="font-bold text-[#7c8bd2]">{totalPages}</span>
        </span>
        <div className="flex gap-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
            if (pageNum > totalPages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={cn(
                  "w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 border border-[#7c8bd2]/30",
                  pageNum === currentPage
                    ? "bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] text-white shadow-lg"
                    : "text-[#7c8bd2] hover:text-white hover:bg-[#7c8bd2]/10"
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-[#7c8bd2]/30",
          currentPage === totalPages 
            ? "text-neutral-600 cursor-not-allowed" 
            : "text-[#7c8bd2] hover:text-white hover:bg-[#7c8bd2]/10"
        )}
      >
        Next
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default ProblemsPagination;
