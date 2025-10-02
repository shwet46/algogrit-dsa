import React from 'react';

type ProblemsStatsProps = {
  solvedCount: number;
  progressPercentage: number;
  difficultyStats: { Easy: number; Medium: number; Hard: number };
  onSelectDifficulty?: (difficulty: 'All' | 'Easy' | 'Medium' | 'Hard') => void;
};

const ProblemsStats: React.FC<ProblemsStatsProps> = ({
  solvedCount,
  progressPercentage,
  difficultyStats,
  onSelectDifficulty,
}) => (
  <div
    role="group"
    aria-labelledby="problems-stats-title"
    className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
  >
    <h2 id="problems-stats-title" className="sr-only">
      Your problem solving stats
    </h2>

    {/* Total Progress*/}
    <div
      className="rounded-2xl p-4 sm:p-6 md:p-8 border border-[#7c8bd2]/25 bg-zinc-950/40 shadow-xl transition-colors hover:bg-zinc-900/40 cursor-pointer focus-within:ring-2 focus-within:ring-[#7c8bd2] focus-within:ring-offset-2 focus-within:ring-offset-zinc-950"
      role="button"
      tabIndex={0}
      aria-label="Show all problems"
      onClick={() => onSelectDifficulty?.('All')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectDifficulty?.('All');
        }
      }}
    >
      <h3 className="text-lg font-semibold text-[#c6cbf5] mb-4">Total Solved</h3>
      <div className="text-3xl font-semibold text-white mb-3 tabular-nums">
        {solvedCount}
      </div>
      <div
        className="w-full bg-zinc-800/60 rounded-full h-2"
        role="progressbar"
        aria-valuenow={Math.max(
          0,
          Math.min(100, Math.round(progressPercentage))
        )}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Overall progress"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400/70 via-[#7c8bd2]/70 to-[#5d6bb7]/70 transition-[width] duration-500"
          style={{
            width: `${Math.max(0, Math.min(100, progressPercentage))}%`,
          }}
        />
      </div>
      <p className="text-xs text-neutral-400 mt-2">
        {progressPercentage.toFixed(1)}% complete
      </p>
    </div>

    {/* Easy Problems */}
    <div
      className="rounded-2xl p-4 sm:p-6 md:p-8 border border-emerald-400/25 bg-zinc-950/40 shadow-xl transition-colors hover:bg-zinc-900/40 cursor-pointer focus-within:ring-2 focus-within:ring-[#7c8bd2] focus-within:ring-offset-2 focus-within:ring-offset-zinc-950"
      role="button"
      tabIndex={0}
      aria-label="Show Easy problems"
      onClick={() => onSelectDifficulty?.('Easy')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectDifficulty?.('Easy');
        }
      }}
    >
      <h3 className="text-lg font-semibold text-emerald-200 mb-4">Easy</h3>
      <div className="text-3xl font-semibold text-white tabular-nums">
        {difficultyStats.Easy}
      </div>
      <p className="text-xs text-neutral-400">problems solved</p>
    </div>

    {/* Medium Problems */}
    <div
      className="rounded-2xl p-4 sm:p-6 md:p-8 border border-amber-400/25 bg-zinc-950/40 shadow-xl transition-colors hover:bg-zinc-900/40 cursor-pointer focus-within:ring-2 focus-within:ring-[#7c8bd2] focus-within:ring-offset-2 focus-within:ring-offset-zinc-950"
      role="button"
      tabIndex={0}
      aria-label="Show Medium problems"
      onClick={() => onSelectDifficulty?.('Medium')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectDifficulty?.('Medium');
        }
      }}
    >
      <h3 className="text-lg font-semibold text-amber-200 mb-4">Medium</h3>
      <div className="text-3xl font-semibold text-white tabular-nums">
        {difficultyStats.Medium}
      </div>
      <p className="text-xs text-neutral-400">problems solved</p>
    </div>

    {/* Hard Problems */}
    <div
      className="rounded-2xl p-4 sm:p-6 md:p-8 border border-rose-400/25 bg-zinc-950/40 shadow-xl transition-colors hover:bg-zinc-900/40 cursor-pointer focus-within:ring-2 focus-within:ring-[#7c8bd2] focus-within:ring-offset-2 focus-within:ring-offset-zinc-950"
      role="button"
      tabIndex={0}
      aria-label="Show Hard problems"
      onClick={() => onSelectDifficulty?.('Hard')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectDifficulty?.('Hard');
        }
      }}
    >
      <h3 className="text-lg font-semibold text-rose-200 mb-4">Hard</h3>
      <div className="text-3xl font-semibold text-white tabular-nums">
        {difficultyStats.Hard}
      </div>
      <p className="text-xs text-neutral-400">problems solved</p>
    </div>
  </div>
);

export default ProblemsStats;