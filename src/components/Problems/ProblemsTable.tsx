import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Circle, ExternalLink, Copy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/authContext';
import ProblemsSignInPrompt from './ProblemsSignInPrompt';

type Problem = {
  title: string;
  platform: string;
  difficulty: string;
  tags: string[];
  url: string;
  description: string;
};

type SolvedProblemDetail = {
  title: string;
  platform: string;
  difficulty: string;
  tags: string[];
  url: string;
  description: string;
  index: number;
  solvedAt: string;
};

type ProblemsTableProps = {
  visibleProblems: Problem[];
  checked: number[];
  startIndex: number;
  toggleCheck: (id: number) => void;
  loading?: boolean;
  getSolvedProblemWithTimestamp?: (
    problemIndex: number
  ) => SolvedProblemDetail | undefined;
};

const ProblemsTable: React.FC<ProblemsTableProps & { loading?: boolean }> = ({
  visibleProblems,
  checked,
  startIndex,
  toggleCheck,
  loading,
  getSolvedProblemWithTimestamp,
}) => {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const handleTick = (id: number) => {
    if (!user) {
      setShowPrompt(true);
      return;
    }
    toggleCheck(id);
  };

  const handleCopy = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch {
      // no-op
    }
  };

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl bg-zinc-950/40 backdrop-blur-md border border-[#7c8bd2]/25">
        <div className="p-4 md:p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-6"
              >
                <div className="h-6 bg-zinc-800/70 rounded md:col-span-1" />
                <div className="h-6 bg-zinc-800/70 rounded md:col-span-2" />
                <div className="h-6 bg-zinc-800/70 rounded md:col-span-1" />
                <div className="h-6 bg-zinc-800/70 rounded md:col-span-1" />
                <div className="h-6 bg-zinc-800/70 rounded md:col-span-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Popup for sign in */}
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
              <ProblemsSignInPrompt
                onSignIn={() => {
                  setShowPrompt(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl bg-zinc-900/40 backdrop-blur-md border border-[#7c8bd2]/25">
        <table className="min-w-full divide-y divide-[#7c8bd2]/15 text-xs sm:text-sm">
          <caption className="sr-only">
            Practice problems table with status, platform, difficulty, tags, and
            actions
          </caption>
          <thead className="hidden md:table-header-group sticky top-0 z-20 backdrop-blur bg-zinc-800/70 border-b border-[#7c8bd2]/20">
            <tr>
              <th
                scope="col"
                className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-5 text-left font-semibold text-[#c6cbf5] uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-5 text-left font-semibold text-[#c6cbf5] uppercase tracking-wider"
              >
                Problem
              </th>
              <th
                scope="col"
                className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-5 text-left font-semibold text-[#c6cbf5] uppercase tracking-wider"
              >
                Platform
              </th>
              <th
                scope="col"
                className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-5 text-left font-semibold text-[#c6cbf5] uppercase tracking-wider"
              >
                Difficulty
              </th>
              <th
                scope="col"
                className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-5 text-left font-semibold text-[#c6cbf5] uppercase tracking-wider"
              >
                Tags
              </th>
              <th
                scope="col"
                className="px-1 sm:px-2 md:px-4 lg:px-8 py-2 sm:py-3 md:py-5 text-left font-semibold text-[#c6cbf5] uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#7c8bd2]/10">
            {visibleProblems.map((problem, idx) => {
              const globalIndex = startIndex + idx;
              const solvedDetail = getSolvedProblemWithTimestamp?.(globalIndex);
              const isSolved = getSolvedProblemWithTimestamp
                ? Boolean(solvedDetail)
                : checked.includes(globalIndex);
              const isEvenRow = idx % 2 === 1;

              return (
                <tr
                  key={globalIndex}
                  className={cn(
                    'transition-colors duration-200 group block md:table-row w-full mb-3 md:mb-0 rounded-xl md:rounded-none bg-zinc-900/60 md:bg-transparent p-4 md:p-0',

                    !isSolved && isEvenRow && 'md:bg-zinc-900/20',
                    'hover:bg-zinc-900/70 md:hover:bg-zinc-900/40',
                    isSolved && 'md:border-l-4 md:border-l-emerald-400/50'
                  )}
                >
                  <td colSpan={6} className="block md:hidden p-0">
                    <div className="flex flex-col gap-2 p-4 rounded-xl border border-[#7c8bd2]/20 bg-zinc-950/70">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">
                          {isSolved && solvedDetail?.solvedAt && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-emerald-300" />
                              Solved on {formatDate(solvedDetail.solvedAt)}
                            </span>
                          )}
                        </span>
                        <button
                          onClick={() => handleTick(globalIndex)}
                          className={cn(
                            'transition-transform duration-150 hover:scale-110 p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-zinc-950',
                            isSolved
                              ? 'text-emerald-300 bg-emerald-500/10'
                              : 'text-[#c6cbf5] hover:bg-[#7c8bd2]/10'
                          )}
                          aria-label={
                            isSolved ? 'Mark as unsolved' : 'Mark as solved'
                          }
                          aria-pressed={isSolved}
                          title={
                            isSolved ? 'Unmark as solved' : 'Mark as solved'
                          }
                        >
                          {isSolved ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                      <h3
                        className={cn(
                          'font-semibold text-lg leading-tight',
                          isSolved ? 'text-neutral-300' : 'text-white'
                        )}
                      >
                        {problem.title}
                      </h3>
                      <p className="text-sm text-neutral-300/90 leading-relaxed max-w-md">
                        {problem.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-[#c6cbf5] border border-[#7c8bd2]/40 bg-zinc-900/60">
                          {problem.platform}
                        </span>
                        <span
                          className={cn(
                            'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border',
                            problem.difficulty === 'Easy'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : problem.difficulty === 'Medium'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          )}
                        >
                          {problem.difficulty}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 max-w-sm">
                        {problem.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center text-[11px] px-2.5 py-1 bg-zinc-900/70 text-[#c6cbf5] rounded-md border border-[#7c8bd2]/30"
                          >
                            {tag}
                          </span>
                        ))}
                        {problem.tags.length > 3 && (
                          <span className="inline-flex items-center text-[11px] px-2.5 py-1 bg-zinc-800/70 text-neutral-400 rounded-md">
                            +{problem.tags.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Link
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#c6cbf5] hover:text-white text-sm font-medium transition-colors bg-zinc-900/60 hover:bg-zinc-800/60 px-3 py-2 rounded-lg"
                          title="Open problem in a new tab"
                        >
                          Solve
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleCopy(problem.url, globalIndex)}
                          className="inline-flex items-center gap-2 text-neutral-300 hover:text-white text-sm font-medium transition-colors bg-zinc-900/60 hover:bg-zinc-800/60 px-3 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-zinc-950"
                          title="Copy problem link"
                        >
                          <Copy className="w-4 h-4" />
                          {copiedIndex === globalIndex ? 'Copied' : 'Copy'}
                          <span
                            className="sr-only"
                            aria-live="polite"
                            role="status"
                          >
                            {copiedIndex === globalIndex
                              ? 'Link copied to clipboard'
                              : ''}
                          </span>
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Desktop cells */}
                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-5 hidden md:table-cell align-middle">
                    <button
                      onClick={() => handleTick(globalIndex)}
                      className={cn(
                        'transition-transform duration-150 hover:scale-110 p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-zinc-950',
                        isSolved
                          ? 'text-emerald-300 bg-emerald-500/10'
                          : 'text-[#c6cbf5] hover:bg-[#7c8bd2]/10'
                      )}
                      aria-label={
                        isSolved ? 'Mark as unsolved' : 'Mark as solved'
                      }
                      aria-pressed={isSolved}
                      title={isSolved ? 'Unmark as solved' : 'Mark as solved'}
                    >
                      {isSolved ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>
                  </td>

                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-5 hidden md:table-cell align-middle">
                    <div className="space-y-1.5">
                      <h3
                        className={cn(
                          'font-semibold text-base',
                          isSolved ? 'text-neutral-300' : 'text-white'
                        )}
                      >
                        {problem.title}
                      </h3>
                      <p className="text-[13px] text-neutral-300/90 leading-relaxed max-w-xl">
                        {problem.description}
                      </p>
                      {isSolved && solvedDetail?.solvedAt && (
                        <div className="text-xs text-neutral-400 inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-300" />
                          Solved on {formatDate(solvedDetail.solvedAt)}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-5 hidden md:table-cell align-middle">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-[#c6cbf5] border border-[#7c8bd2]/40 bg-zinc-900/60">
                      {problem.platform}
                    </span>
                  </td>

                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-5 hidden md:table-cell align-middle">
                    <span
                      className={cn(
                        'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border',
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : problem.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      )}
                    >
                      {problem.difficulty}
                    </span>
                  </td>

                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-5 hidden md:table-cell align-middle">
                    <div className="flex flex-wrap gap-2 max-w-sm">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center text-[11px] px-2.5 py-1 bg-zinc-900/70 text-[#c6cbf5] rounded-md border border-[#7c8bd2]/30"
                        >
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 3 && (
                        <span className="inline-flex items-center text-[11px] px-2.5 py-1 bg-zinc-800/70 text-neutral-400 rounded-md">
                          +{problem.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-1 sm:px-2 md:px-4 lg:px-8 py-4 sm:py-5 hidden md:table-cell align-middle">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#c6cbf5] hover:text-white text-sm font-medium transition-colors bg-zinc-900/60 hover:bg-zinc-800/60 px-3 py-2 rounded-lg"
                        title="Open problem in a new tab"
                      >
                        Solve
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleCopy(problem.url, globalIndex)}
                        className="inline-flex items-center gap-2 text-neutral-300 hover:text-white text-sm font-medium transition-colors bg-zinc-900/60 hover:bg-zinc-800/60 px-3 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-zinc-950"
                        title="Copy problem link"
                      >
                        <Copy className="w-4 h-4" />
                        {copiedIndex === globalIndex ? 'Copied' : 'Copy'}
                        <span
                          className="sr-only"
                          aria-live="polite"
                          role="status"
                        >
                          {copiedIndex === globalIndex
                            ? 'Link copied to clipboard'
                            : ''}
                        </span>
                      </button>
                    </div>
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
