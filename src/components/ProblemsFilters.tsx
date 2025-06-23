import React from "react";
import { Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ProblemsFiltersProps = {
  search: string;
  setSearch: (v: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (v: string) => void;
  platformFilter: string;
  setPlatformFilter: (v: string) => void;
  uniqueDifficulties: string[];
  uniquePlatforms: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  uniqueTags: string[];
  showAllTags: boolean;
  setShowAllTags: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTag: (tag: string) => void;
  setCurrentPage: (n: number) => void;
};

const ProblemsFilters: React.FC<ProblemsFiltersProps> = ({
  search,
  setSearch,
  difficultyFilter,
  setDifficultyFilter,
  platformFilter,
  setPlatformFilter,
  uniqueDifficulties,
  uniquePlatforms,
  selectedTags,
  setSelectedTags,
  uniqueTags,
  showAllTags,
  setShowAllTags,
  toggleTag,
  setCurrentPage
}) => (
  <>
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 w-full">
      <div className="relative w-full lg:w-1/2 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 md:pl-6 flex items-center pointer-events-none z-20 drop-shadow-[0_2px_8px_rgba(124,139,210,0.5)]">
          <Search className="text-[#7c8bd2] w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <input
          type="text"
          placeholder="Search problems by title or description..."
          className="w-full pl-10 sm:pl-12 md:pl-16 pr-3 sm:pr-4 md:pr-6 py-3 sm:py-4 md:py-5 bg-zinc-900/60 backdrop-blur-sm border border-[#7c8bd2]/30 rounded-lg sm:rounded-xl md:rounded-2xl focus:border-[#7c8bd2]/60 focus:bg-zinc-800/80 outline-none text-white placeholder:text-[#7c8bd2] text-sm sm:text-base md:text-lg font-medium transition-all duration-300 focus:shadow-lg focus:shadow-[#7c8bd2]/10"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="flex items-center gap-4 w-full lg:w-auto justify-center flex-wrap">
        <div className="flex items-center gap-3 text-zinc-400">
          <Filter className="w-5 h-5" />
          <span className="text-sm font-semibold">Filters:</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-zinc-900/60 backdrop-blur-sm text-zinc-100 border border-zinc-700/50 rounded-xl px-5 py-3 hover:border-[#7c8bd2]/50 focus:border-[#7c8bd2]/50 transition-all duration-300 min-w-[140px] text-left font-semibold">
              {difficultyFilter}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-zinc-900 border-zinc-700 rounded-xl">
            <DropdownMenuRadioGroup
              value={difficultyFilter}
              onValueChange={value => {
                setDifficultyFilter(value);
                setCurrentPage(1);
              }}
            >
              {uniqueDifficulties.map(d => (
                <DropdownMenuRadioItem key={d} value={d} className="text-zinc-100 hover:bg-zinc-800 rounded-lg">
                  {d}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-zinc-900/60 backdrop-blur-sm text-zinc-100 border border-zinc-700/50 rounded-xl px-5 py-3 hover:border-[#7c8bd2]/50 focus:border-[#7c8bd2]/50 transition-all duration-300 min-w-[160px] text-left font-semibold">
              {platformFilter}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-zinc-900 border-zinc-700 rounded-xl">
            <DropdownMenuRadioGroup
              value={platformFilter}
              onValueChange={value => {
                setPlatformFilter(value);
                setCurrentPage(1);
              }}
            >
              {uniquePlatforms.map(p => (
                <DropdownMenuRadioItem key={p} value={p} className="text-zinc-100 hover:bg-zinc-800 rounded-lg">
                  {p}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div className="w-full mb-8 sm:mb-10">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <span className="text-sm sm:text-base md:text-lg font-semibold text-[#7c8bd2]">Filter by topics:</span>
        {selectedTags.length > 0 && (
          <button
            onClick={() => {
              setSelectedTags([]);
              setCurrentPage(1);
            }}
            className="text-sm text-[#7c8bd2] hover:text-white transition-colors font-semibold bg-[#7c8bd2]/10 px-3 py-1.5 rounded-lg"
          >
            Clear ({selectedTags.length})
          </button>
        )}
        {uniqueTags.length > 12 && (
          <button
            onClick={() => setShowAllTags((prev: boolean) => !prev)}
            className="text-sm text-[#7c8bd2] hover:text-white transition-colors font-semibold"
          >
            {showAllTags ? 'Show less' : `Show more (${uniqueTags.length - 12} more)`}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3 max-w-full">
        {(showAllTags ? uniqueTags : uniqueTags.slice(0, 12)).map(tag => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "inline-flex items-center text-sm px-4 py-2.5 rounded-xl font-semibold border transition-all duration-300 hover:scale-105",
                isSelected
                  ? "bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] text-white border-[#7c8bd2] shadow-lg shadow-[#7c8bd2]/25"
                  : "bg-zinc-800/50 text-[#7c8bd2] border-[#7c8bd2]/30 hover:border-[#7c8bd2]/60 hover:text-[#5d6bb7]"
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  </>
);

export default ProblemsFilters;
