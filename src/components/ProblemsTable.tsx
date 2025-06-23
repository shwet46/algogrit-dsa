import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle, Circle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../context/authContext";
import ProblemsSignInPrompt from "./ProblemsSignInPrompt";

type Problem = {
  title: string;
  platform: string;
  difficulty: string;
  tags: string[];
  url: string;
  description: string;
};

type ProblemsTableProps = {
  visibleProblems: Problem[];
  checked: number[];
  startIndex: number;
  toggleCheck: (id: number) => void;
};

const ProblemsTable: React.FC<ProblemsTableProps> = ({ visibleProblems, checked, startIndex, toggleCheck }) => {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  const handleTick = (id: number) => {
    if (!user) {
      setShowPrompt(true);
      return;
    }
    toggleCheck(id);
  };

  return (
    <>
      {/* Popup for sign in reminder */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative max-w-md w-full rounded-2xl shadow-2xl p-0 overflow-hidden border-2 border-[#7c8bd2] bg-gradient-to-br from-[#23243a] via-[#2e3261] to-[#5d6bb7]">
            <button
              className="absolute top-2 right-2 text-[#7c8bd2] hover:text-white text-2xl font-bold z-10"
              onClick={() => setShowPrompt(false)}
              aria-label="Close"
              style={{ filter: 'drop-shadow(0 0 2px #7c8bd2)' }}
            >
              ×
            </button>
            <div className="p-0">
              <ProblemsSignInPrompt onSignIn={() => { setShowPrompt(false); /* trigger your sign in flow here */ }} />
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl bg-zinc-900/40 backdrop-blur-md border border-[#7c8bd2]/30">
        <table className="min-w-full divide-y divide-[#7c8bd2]/20 text-xs sm:text-sm">
          <thead className="hidden md:table-header-group">
            <tr className="bg-gradient-to-r from-[#7c8bd2]/20 to-[#5d6bb7]/20">
              <th className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-6 text-left font-bold text-[#7c8bd2] uppercase tracking-wider">#</th>
              <th className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-6 text-left font-bold text-[#7c8bd2] uppercase tracking-wider">Status</th>
              <th className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-6 text-left font-bold text-[#7c8bd2] uppercase tracking-wider">Problem</th>
              <th className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-6 text-left font-bold text-[#7c8bd2] uppercase tracking-wider">Platform</th>
              <th className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-6 text-left font-bold text-[#7c8bd2] uppercase tracking-wider">Difficulty</th>
              <th className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-6 text-left font-bold text-[#7c8bd2] uppercase tracking-wider">Tags</th>
              <th className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-6 text-left font-bold text-[#7c8bd2] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#7c8bd2]/10">
            {visibleProblems.map((problem, idx) => {
              const globalIndex = startIndex + idx;
              const isSolved = checked.includes(globalIndex);
              return (
                <tr key={globalIndex} className={cn(
                  "transition-all duration-300 hover:bg-gradient-to-r hover:from-[#7c8bd2]/10 hover:to-[#5d6bb7]/10 group block md:table-row w-full mb-4 md:mb-0 rounded-xl md:rounded-none bg-zinc-900/60 md:bg-transparent p-4 md:p-0",
                  isSolved && "bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                )}>
                  <td colSpan={7} className="block md:hidden p-0">
                    <div className="flex flex-col gap-2 p-4 rounded-xl border border-[#7c8bd2]/20 bg-zinc-900/80">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-lg font-bold text-[#7c8bd2]">{String(globalIndex + 1).padStart(3, '0')}</span>
                        <button
                          onClick={() => handleTick(globalIndex)}
                          className={cn(
                            "transition-all duration-300 hover:scale-125 p-2 rounded-full",
                            isSolved 
                              ? "text-green-400 hover:text-green-300 bg-green-500/10" 
                              : "text-[#7c8bd2] hover:text-[#5d6bb7] hover:bg-[#7c8bd2]/10"
                          )}
                          aria-label={isSolved ? "Mark as unsolved" : "Mark as solved"}
                        >
                          {isSolved ? (
                            <CheckCircle className="w-7 h-7" />
                          ) : (
                            <Circle className="w-7 h-7" />
                          )}
                        </button>
                      </div>
                      <h3 className={cn(
                        "font-bold text-xl leading-tight transition-colors",
                        isSolved 
                          ? "text-green-300 line-through opacity-75" 
                          : "text-white group-hover:text-[#7c8bd2]"
                      )}>{problem.title}</h3>
                      <p className="text-sm text-neutral-300 line-clamp-2 leading-relaxed max-w-md">{problem.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#7c8bd2]/20 to-[#5d6bb7]/20 text-[#7c8bd2] border border-[#7c8bd2]/30">{problem.platform}</span>
                        <span className={cn(
                          "inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border-2",
                          problem.difficulty === "Easy"
                            ? "bg-green-500/20 text-green-300 border-green-500/40"
                            : problem.difficulty === "Medium"
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                            : "bg-red-500/20 text-red-300 border-red-500/40"
                        )}>{problem.difficulty}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 max-w-sm">
                        {problem.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center text-xs px-3 py-1.5 bg-zinc-800/60 text-[#7c8bd2] rounded-lg font-mono border border-[#7c8bd2]/30 hover:border-[#5d6bb7]/50 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                        {problem.tags.length > 3 && (
                          <span className="inline-flex items-center text-xs px-3 py-1.5 bg-zinc-700/60 text-neutral-400 rounded-lg font-mono">
                            +{problem.tags.length - 3}
                          </span>
                        )}
                      </div>
                      <Link
                        href={problem.url}
                        target="_blank"
                        className="inline-flex items-center gap-3 text-[#7c8bd2] hover:text-white text-sm font-bold transition-all duration-200 hover:underline group-hover:gap-4 bg-[#7c8bd2]/10 hover:bg-[#5d6bb7]/20 px-4 py-2 rounded-xl mt-2"
                      >
                        Solve
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-6 hidden md:table-cell text-[#7c8bd2] font-mono text-lg font-bold">
                    {String(globalIndex + 1).padStart(3, '0')}
                  </td>
                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-6 hidden md:table-cell">
                    <button
                      onClick={() => handleTick(globalIndex)}
                      className={cn(
                        "transition-all duration-300 hover:scale-125 p-2 rounded-full",
                        isSolved 
                          ? "text-green-400 hover:text-green-300 bg-green-500/10" 
                          : "text-[#7c8bd2] hover:text-[#5d6bb7] hover:bg-[#7c8bd2]/10"
                      )}
                      aria-label={isSolved ? "Mark as unsolved" : "Mark as solved"}
                    >
                      {isSolved ? (
                        <CheckCircle className="w-7 h-7" />
                      ) : (
                        <Circle className="w-7 h-7" />
                      )}
                    </button>
                  </td>
                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-6 hidden md:table-cell">
                    <div className="space-y-2">
                      <h3 className={cn(
                        "font-bold text-xl leading-tight transition-colors",
                        isSolved 
                          ? "text-green-300 line-through opacity-75" 
                          : "text-white group-hover:text-[#7c8bd2]"
                      )}>{problem.title}</h3>
                      <p className="text-sm text-neutral-300 line-clamp-2 leading-relaxed max-w-md">{problem.description}</p>
                    </div>
                  </td>
                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-6 hidden md:table-cell">
                    <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#7c8bd2]/20 to-[#5d6bb7]/20 text-[#7c8bd2] border border-[#7c8bd2]/30">{problem.platform}</span>
                  </td>
                  <td className={cn(
                    "px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-6 hidden md:table-cell"
                  )}>
                    <span className={cn(
                      "inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border-2",
                      problem.difficulty === "Easy"
                        ? "bg-green-500/20 text-green-300 border-green-500/40"
                        : problem.difficulty === "Medium"
                        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                        : "bg-red-500/20 text-red-300 border-red-500/40"
                    )}>{problem.difficulty}</span>
                  </td>
                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-6 hidden md:table-cell">
                    <div className="flex flex-wrap gap-2 max-w-sm">
                      {problem.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-xs px-3 py-1.5 bg-zinc-800/60 text-[#7c8bd2] rounded-lg font-mono border border-[#7c8bd2]/30 hover:border-[#5d6bb7]/50 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 3 && (
                        <span className="inline-flex items-center text-xs px-3 py-1.5 bg-zinc-700/60 text-neutral-400 rounded-lg font-mono">
                          +{problem.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-6 hidden md:table-cell">
                    <Link
                      href={problem.url}
                      target="_blank"
                      className="inline-flex items-center gap-3 text-[#7c8bd2] hover:text-white text-sm font-bold transition-all duration-200 hover:underline group-hover:gap-4 bg-[#7c8bd2]/10 hover:bg-[#5d6bb7]/20 px-4 py-2 rounded-xl"
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
    </>
  );
};

export default ProblemsTable;
