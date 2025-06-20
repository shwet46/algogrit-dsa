import React from "react";
import { Search } from "lucide-react";

type ProblemsNoResultsProps = {
  onClear: () => void;
};

const ProblemsNoResults: React.FC<ProblemsNoResultsProps> = ({ onClear }) => (
  <div className="text-center py-6 sm:py-10 md:py-20">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#7c8bd2]/20 to-[#5d6bb7]/20 rounded-2xl mb-6 border border-[#7c8bd2]/30">
      <Search className="w-10 h-10 text-[#7c8bd2]" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">No problems found</h3>
    <p className="text-[#7c8bd2] mb-8 text-lg max-w-md mx-auto">
      Try adjusting your search criteria or filter settings to find more problems
    </p>
    <button
      onClick={onClear}
      className="px-8 py-4 bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] hover:from-[#5d6bb7] hover:to-[#7c8bd2] text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      Clear all filters
    </button>
  </div>
);

export default ProblemsNoResults;
