import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

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
  setCurrentPage,
}) => (
  <>
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 w-full">
      <div className="relative w-full lg:w-1/2 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 md:pl-5 flex items-center pointer-events-none z-10">
          <Search className="text-[#c6cbf5] w-5 h-5 sm:w-5 sm:h-5" />
        </div>
        <label htmlFor="problems-search" className="sr-only">
          Search problems
        </label>
        <input
          id="problems-search"
          type="text"
          placeholder="Search problems by title or description"
          className="w-full pl-10 sm:pl-11 md:pl-12 pr-10 py-3 sm:py-3 bg-zinc-950/40 border border-[#7c8bd2]/25 rounded-lg text-white placeholder:text-neutral-400 text-sm sm:text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 caret-[#7c8bd2]"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCurrentPage(1);
            }}
            className="absolute inset-y-0 right-0 pr-2 flex items-center text-neutral-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-md"
            aria-label="Clear search"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto justify-center flex-wrap">
        <span className="inline-flex items-center gap-2 rounded-lg border border-[#7c8bd2]/25 bg-zinc-950/40 px-3.5 py-2.5 text-sm text-[#c6cbf5] hover:border-[#7c8bd2]/40 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="bg-zinc-950/40 text-zinc-100 border border-[#7c8bd2]/25 rounded-lg px-3.5 py-2.5 hover:bg-zinc-900/40 hover:text-[#c6cbf5] hover:border-[#7c8bd2]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 min-w-[160px] text-left text-sm font-medium"
              aria-label="Select difficulty"
            >
              {difficultyFilter}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-zinc-950/95 border border-[#7c8bd2]/25 rounded-lg shadow-xl min-w-[160px] backdrop-blur-sm"
          >
            <DropdownMenuRadioGroup
              value={difficultyFilter}
              onValueChange={(value) => {
                setDifficultyFilter(value);
                setCurrentPage(1);
              }}
            >
              {uniqueDifficulties.map((d) => (
                <DropdownMenuRadioItem
                  key={d}
                  value={d}
                  className="text-zinc-100 text-sm focus:bg-[#7c8bd2]/10 focus:text-white data-[state=checked]:text-[#c6cbf5] data-[state=checked]:bg-[#7c8bd2]/10 rounded-md"
                >
                  {d}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="bg-zinc-950/40 text-zinc-100 border border-[#7c8bd2]/25 rounded-lg px-3.5 py-2.5 hover:bg-zinc-900/40 hover:text-[#c6cbf5] hover:border-[#7c8bd2]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 min-w-[160px] text-left text-sm font-medium"
              aria-label="Select platform"
            >
              {platformFilter}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-zinc-950/95 border border-[#7c8bd2]/25 rounded-lg shadow-xl min-w-[160px] backdrop-blur-sm"
          >
            <DropdownMenuRadioGroup
              value={platformFilter}
              onValueChange={(value) => {
                setPlatformFilter(value);
                setCurrentPage(1);
              }}
            >
              {uniquePlatforms.map((p) => (
                <DropdownMenuRadioItem
                  key={p}
                  value={p}
                  className="text-zinc-100 text-sm focus:bg-[#7c8bd2]/10 focus:text-white data-[state=checked]:text-[#c6cbf5] data-[state=checked]:bg-[#7c8bd2]/10 rounded-md"
                >
                  {p}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div className="w-full mb-8 sm:mb-10">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
        <span className="inline-flex items-center gap-2 rounded-md border border-[#7c8bd2]/25 bg-zinc-950/40 px-2.5 py-1 text-[11px] text-[#c6cbf5]">
          Topics
        </span>
        {selectedTags.length > 0 && (
          <button
            onClick={() => {
              setSelectedTags([]);
              setCurrentPage(1);
            }}
            className="text-xs sm:text-sm text-[#c6cbf5] hover:text-white transition-colors font-medium bg-zinc-950/40 border border-[#7c8bd2]/25 hover:border-[#7c8bd2]/40 px-2.5 py-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Clear ({selectedTags.length})
          </button>
        )}
        {uniqueTags.length > 12 && (
          <button
            onClick={() => setShowAllTags((prev: boolean) => !prev)}
            className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors font-medium"
          >
            {showAllTags
              ? 'Show less'
              : `Show more (${uniqueTags.length - 12} more)`}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-2.5 max-w-full">
        {(showAllTags ? uniqueTags : uniqueTags.slice(0, 12)).map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                'inline-flex items-center text-[12px] sm:text-sm px-3 py-1.5 rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
                isSelected
                  ? 'bg-zinc-900/60 text-[#c6cbf5] border-[#7c8bd2]/40 hover:border-[#7c8bd2]/60'
                  : 'bg-zinc-950/40 text-neutral-300 border-[#7c8bd2]/25 hover:text-white hover:bg-zinc-900/40 hover:border-[#7c8bd2]/40'
              )}
              aria-pressed={isSelected}
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