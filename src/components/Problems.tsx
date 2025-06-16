"use client";
import React, { useState } from "react";
import { CheckCircle, Circle, ArrowLeft, ArrowRight, Search } from "lucide-react";
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

  const toggleCheck = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const uniqueDifficulties = ["All", ...Array.from(new Set(problems.problems.map((p: Problem) => p.difficulty)))];
  const uniquePlatforms = ["All", ...Array.from(new Set(problems.problems.map((p: Problem) => p.platform)))];

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
    );

  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProblems = filteredProblems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="relative min-h-screen w-full bg-black text-zinc-100 py-24 px-4 sm:px-12 md:px-24">
      {/* Dotted Background */}
      <div
        className={cn(
          "absolute inset-0 -z-10",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(circle,#262626_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] -z-10" />
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl md:text-6xl font-extrabold text-center mb-12"
          style={{
            fontFamily: "'Fira Code', monospace",
            background: "linear-gradient(135deg, #7c8bd2, #5d6bb7, #3f4b9c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Problems
        </h2>
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center w-full md:w-1/2 bg-zinc-900 rounded-lg px-4 py-2 shadow-sm border border-zinc-800">
            <Search className="text-[#7c8bd2] w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Search problems..."
              className="bg-transparent outline-none w-full text-zinc-100 placeholder-[#7c8bd2]"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto justify-center">
            {/* Difficulty Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 shadow-sm hover:border-[#7c8bd2] focus:border-[#7c8bd2] transition-colors min-w-[120px] text-left flex items-center justify-between">
                  {difficultyFilter}
                  <svg className="ml-2 w-4 h-4 text-[#7c8bd2]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup
                  value={difficultyFilter}
                  onValueChange={(value) => {
                    setDifficultyFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  {uniqueDifficulties.map((d) => (
                    <DropdownMenuRadioItem key={d} value={d}>
                      {d}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Platform Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 shadow-sm hover:border-[#7c8bd2] focus:border-[#7c8bd2] transition-colors min-w-[150px] text-left flex items-center justify-between">
                  {platformFilter}
                  <svg className="ml-2 w-4 h-4 text-[#7c8bd2]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup
                  value={platformFilter}
                  onValueChange={(value) => {
                    setPlatformFilter(value);
                    setCurrentPage(1);
                  }}
                >
                  {uniquePlatforms.map((p) => (
                    <DropdownMenuRadioItem key={p} value={p}>
                      {p}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Problems Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg bg-zinc-900/80 backdrop-blur-md">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead>
              <tr className="bg-zinc-900/80">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7c8bd2] uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7c8bd2] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7c8bd2] uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7c8bd2] uppercase tracking-wider">Platform</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7c8bd2] uppercase tracking-wider">Difficulty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7c8bd2] uppercase tracking-wider">Tags</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7c8bd2] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {visibleProblems.map((problem: Problem, idx: number) => {
                const globalIndex = startIndex + idx;
                return (
                  <tr key={globalIndex} className="hover:bg-[#7c8bd2]/10 transition-colors">
                    <td className="px-4 py-3 text-[#7c8bd2] font-mono text-xs">{globalIndex + 1}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleCheck(globalIndex)}
                        className="text-[#7c8bd2] hover:scale-110 transition-transform"
                        aria-label={checked.includes(globalIndex) ? "Mark as unsolved" : "Mark as solved"}
                      >
                        {checked.includes(globalIndex) ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-100">
                      <span className="block text-base leading-tight">{problem.title}</span>
                      <span className="block text-xs text-zinc-400 mt-1 line-clamp-2">{problem.description}</span>
                    </td>
                    <td className="px-4 py-3 text-[#7c8bd2] font-mono text-xs">{problem.platform}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-bold border",
                        problem.difficulty === "Easy"
                          ? "bg-[#7c8bd2]/10 text-[#7c8bd2] border-zinc-700"
                          : problem.difficulty === "Medium"
                          ? "bg-[#5d6bb7]/10 text-[#5d6bb7] border-zinc-700"
                          : "bg-[#3f4b9c]/10 text-[#3f4b9c] border-zinc-700"
                      )}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-zinc-800 text-[#7c8bd2] rounded-full font-mono border border-zinc-700"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={problem.url}
                        target="_blank"
                        className="text-[#7c8bd2] text-xs font-semibold hover:underline group-hover:underline transition-colors"
                      >
                        Solve &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-[#7c8bd2] hover:text-white disabled:opacity-40"
            >
              <ArrowLeft size={16} />
              Prev
            </button>
            <span className="text-sm text-[#7c8bd2]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 text-[#7c8bd2] hover:text-white disabled:opacity-40"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        )}
        {filteredProblems.length === 0 && (
          <p className="text-center text-[#7c8bd2] mt-10">
            No problems found.
          </p>
        )}
      </div>
    </div>
  );
}