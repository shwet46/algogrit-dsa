"use client";
import React, { useState } from "react";
import { CheckCircle, Circle, ArrowLeft, ArrowRight, Search, Filter, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import problems from "@/data/problems.json";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";

type Problem = {
  title: string;
  platform: string;
  difficulty: string;
  tags: string[];
  url: string;
  description: string;
};

const ITEMS_PER_PAGE = 10;

export default function Problems() {
  const [checked, setChecked] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  const toggleCheck = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const uniqueDifficulties = ["All", ...Array.from(new Set(problems.problems.map((p: Problem) => p.difficulty)))];
  const uniquePlatforms = ["All", ...Array.from(new Set(problems.problems.map((p: Problem) => p.platform)))];
  const uniqueTags = Array.from(new Set(problems.problems.flatMap((p: Problem) => p.tags))).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const filteredProblems = problems.problems
    .filter((problem: Problem) =>
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((problem: Problem) =>
      difficultyFilter === "All" ? true : problem.difficulty === difficultyFilter
    )
    .filter((problem: Problem) =>
      platformFilter === "All" ? true : problem.platform === platformFilter
    )
    .filter((problem: Problem) =>
      selectedTags.length === 0 ? true : selectedTags.some(tag => problem.tags.includes(tag))
    );

  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProblems = filteredProblems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const solvedCount = checked.length;
  const progressPercentage = (solvedCount / problems.problems.length) * 100;

  return (
    <div className="relative min-h-screen w-full bg-black text-zinc-100 py-24 px-4 sm:px-12 md:px-24">
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:radial-gradient(circle,#262626_1px,transparent_1px)]"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c8bd2]/5 via-transparent to-[#5d6bb7]/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,139,210,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header with Progress */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-6xl font-extrabold mb-6"
            style={{
              fontFamily: "'Fira Code', monospace",
              background: "linear-gradient(135deg, #7c8bd2, #5d6bb7, #3f4b9c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            DSA Problems
          </h2>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-zinc-400">Progress</span>
              <span className="text-sm font-semibold text-[#7c8bd2]">
                {solvedCount}/{problems.problems.length} solved
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-1">{progressPercentage.toFixed(1)}% complete</p>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8 w-full">
          {/* Search Bar */}
          <div className="relative w-full lg:w-1/2 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-[#7c8bd2] w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search problems by title or description..."
              className="w-full pl-12 pr-4 py-4 bg-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-lg focus:border-[#7c8bd2]/50 focus:bg-zinc-800/80 outline-none text-white placeholder:text-zinc-400 text-base font-medium transition-all duration-300"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Basic Filters */}
          <div className="flex items-center gap-4 w-full lg:w-auto justify-center flex-wrap">
            <div className="flex items-center gap-2 text-zinc-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            {/* Difficulty Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-zinc-900/60 backdrop-blur-sm text-zinc-100 border border-zinc-700/50 rounded-lg px-4 py-3 hover:border-[#7c8bd2]/50 focus:border-[#7c8bd2]/50 transition-all duration-300 min-w-[130px] text-left font-medium">
                  {difficultyFilter}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-zinc-900 border-zinc-700">
                <DropdownMenuRadioGroup
                  value={difficultyFilter}
                  onValueChange={(value) => {
                    setDifficultyFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  {uniqueDifficulties.map((d) => (
                    <DropdownMenuRadioItem key={d} value={d} className="text-zinc-100 hover:bg-zinc-800">
                      {d}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Platform Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-zinc-900/60 backdrop-blur-sm text-zinc-100 border border-zinc-700/50 rounded-lg px-4 py-3 hover:border-[#7c8bd2]/50 focus:border-[#7c8bd2]/50 transition-all duration-300 min-w-[150px] text-left font-medium">
                  {platformFilter}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-zinc-900 border-zinc-700">
                <DropdownMenuRadioGroup
                  value={platformFilter}
                  onValueChange={(value) => {
                    setPlatformFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  {uniquePlatforms.map((p) => (
                    <DropdownMenuRadioItem key={p} value={p} className="text-zinc-100 hover:bg-zinc-800">
                      {p}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tags Filter Row */}
        <div className="w-full mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-zinc-400">Tags:</span>
            {selectedTags.length > 0 && (
              <button
                onClick={() => {
                  setSelectedTags([]);
                  setCurrentPage(1);
                }}
                className="text-xs text-[#7c8bd2] hover:text-white transition-colors font-medium"
              >
                Clear tags ({selectedTags.length})
              </button>
            )}
            {uniqueTags.length > 10 && (
              <button
                onClick={() => setShowAllTags((prev) => !prev)}
                className="text-xs text-[#7c8bd2] hover:text-white transition-colors font-medium ml-2"
              >
                {showAllTags ? 'Show less' : `Show more (${uniqueTags.length - 10} more)`}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
            {(showAllTags ? uniqueTags : uniqueTags.slice(0, 10)).map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "inline-flex items-center text-sm px-3 py-2 rounded-full font-medium border transition-all duration-300 hover:scale-105",
                    isSelected
                      ? "bg-[#7c8bd2] text-white border-[#7c8bd2] shadow-lg shadow-[#7c8bd2]/25"
                      : "bg-zinc-800/50 text-zinc-300 border-zinc-700/50 hover:border-[#7c8bd2]/50 hover:text-[#7c8bd2]"
                  )}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Enhanced Problems Table */}
        <div className="overflow-x-auto rounded-xl shadow-2xl bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50">
          <table className="min-w-full divide-y divide-zinc-800/50">
            <thead>
              <tr className="bg-zinc-900/60 backdrop-blur-sm">
                <th className="px-6 py-4 text-left text-xs font-bold text-[#7c8bd2] uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#7c8bd2] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#7c8bd2] uppercase tracking-wider">Problem</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#7c8bd2] uppercase tracking-wider">Platform</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#7c8bd2] uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#7c8bd2] uppercase tracking-wider">Tags</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#7c8bd2] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {visibleProblems.map((problem: Problem, idx: number) => {
                const globalIndex = startIndex + idx;
                const isSolved = checked.includes(globalIndex);
                return (
                  <tr key={globalIndex} className={cn(
                    "transition-all duration-300 hover:bg-[#7c8bd2]/8 group",
                    isSolved && "bg-green-500/5"
                  )}>
                    <td className="px-6 py-5 text-[#7c8bd2] font-mono text-sm font-semibold">
                      {String(globalIndex + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => toggleCheck(globalIndex)}
                        className={cn(
                          "transition-all duration-300 hover:scale-110 p-1 rounded-full",
                          isSolved ? "text-green-400 hover:text-green-300" : "text-zinc-500 hover:text-[#7c8bd2]"
                        )}
                        aria-label={isSolved ? "Mark as unsolved" : "Mark as solved"}
                      >
                        {isSolved ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <h3 className={cn(
                          "font-bold text-lg leading-tight transition-colors",
                          isSolved ? "text-green-300 line-through" : "text-zinc-100 group-hover:text-white"
                        )}>
                          {problem.title}
                        </h3>
                        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                          {problem.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#7c8bd2]/10 text-[#7c8bd2] border border-[#7c8bd2]/20">
                        {problem.platform}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2",
                        problem.difficulty === "Easy"
                          ? "bg-green-500/10 text-green-400 border-green-500/30"
                          : problem.difficulty === "Medium"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/10 text-red-400 border-red-500/30"
                      )}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {problem.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center text-xs px-2.5 py-1 bg-zinc-800/50 text-zinc-300 rounded-full font-mono border border-zinc-700/50 hover:border-[#7c8bd2]/50 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                        {problem.tags.length > 3 && (
                          <span className="inline-flex items-center text-xs px-2.5 py-1 bg-zinc-700/50 text-zinc-400 rounded-full font-mono">
                            +{problem.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        href={problem.url}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-[#7c8bd2] hover:text-white text-sm font-semibold transition-all duration-200 hover:underline group-hover:gap-3"
                      >
                        Solve
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                currentPage === 1 
                  ? "text-zinc-600 cursor-not-allowed" 
                  : "text-[#7c8bd2] hover:text-white hover:bg-[#7c8bd2]/10"
              )}
            >
              <ArrowLeft size={18} />
              Previous
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400">
                Page <span className="font-semibold text-[#7c8bd2]">{currentPage}</span> of{" "}
                <span className="font-semibold text-[#7c8bd2]">{totalPages}</span>
              </span>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-8 h-8 rounded text-sm font-medium transition-all duration-200",
                        pageNum === currentPage
                          ? "bg-[#7c8bd2] text-white"
                          : "text-zinc-400 hover:text-[#7c8bd2] hover:bg-zinc-800"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                currentPage === totalPages 
                  ? "text-zinc-600 cursor-not-allowed" 
                  : "text-[#7c8bd2] hover:text-white hover:bg-[#7c8bd2]/10"
              )}
            >
              Next
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* No Results State */}
        {filteredProblems.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 rounded-full mb-4">
              <Search className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-300 mb-2">No problems found</h3>
            <p className="text-zinc-500 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearch("");
                setDifficultyFilter("All");
                setPlatformFilter("All");
                setSelectedTags([]);
                setCurrentPage(1);
              }}
              className="px-6 py-3 bg-[#7c8bd2] text-white rounded-lg font-medium hover:bg-[#5d6bb7] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}