import React from "react";
import { Trophy, Target, Zap, Sparkles } from "lucide-react";

type ProblemsStatsProps = {
  solvedCount: number;
  progressPercentage: number;
  difficultyStats: { Easy: number; Medium: number; Hard: number };
};

const ProblemsStats: React.FC<ProblemsStatsProps> = ({ solvedCount, progressPercentage, difficultyStats }) => (
  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
    {/* Total Progress */}
    <div className="bg-gradient-to-br from-[#7c8bd2]/20 to-[#5d6bb7]/20 rounded-2xl p-4 sm:p-6 md:p-8 border border-[#7c8bd2]/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#7c8bd2]/20 rounded-lg">
          <Trophy className="w-6 h-6 text-[#7c8bd2]" />
        </div>
        <h3 className="text-lg font-semibold text-[#7c8bd2]">Total Solved</h3>
      </div>
      <div className="text-3xl font-bold text-white mb-2">{solvedCount}</div>
      <div className="w-full bg-[#7c8bd2]/20 rounded-full h-2">
        <div 
          className="h-full bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <p className="text-sm text-[#7c8bd2] mt-2">{progressPercentage.toFixed(1)}% complete</p>
    </div>
    {/* Easy Problems */}
    <div className="bg-gradient-to-br from-green-500/10 to-green-700/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-green-400/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-400/20 rounded-lg">
          <Target className="w-6 h-6 text-green-300" />
        </div>
        <h3 className="text-lg font-semibold text-green-200">Easy</h3>
      </div>
      <div className="text-3xl font-bold text-white">{difficultyStats.Easy}</div>
      <p className="text-sm text-green-300">problems solved</p>
    </div>
    {/* Medium Problems */}
    <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-700/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-yellow-400/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-yellow-400/20 rounded-lg">
          <Zap className="w-6 h-6 text-yellow-300" />
        </div>
        <h3 className="text-lg font-semibold text-yellow-200">Medium</h3>
      </div>
      <div className="text-3xl font-bold text-white">{difficultyStats.Medium}</div>
      <p className="text-sm text-yellow-300">problems solved</p>
    </div>
    {/* Hard Problems */}
    <div className="bg-gradient-to-br from-red-500/10 to-pink-700/10 rounded-2xl p-4 sm:p-6 md:p-8 border border-red-400/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-400/20 rounded-lg">
          <Sparkles className="w-6 h-6 text-red-300" />
        </div>
        <h3 className="text-lg font-semibold text-red-200">Hard</h3>
      </div>
      <div className="text-3xl font-bold text-white">{difficultyStats.Hard}</div>
      <p className="text-sm text-red-300">problems solved</p>
    </div>
  </div>
);

export default ProblemsStats;
