import React from "react";

const ProblemsHeader = () => (
  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4 md:gap-6">
    <div>
      <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-black mb-3 sm:mb-4" style={{ fontFamily: "'Fira Code', monospace", background: 'linear-gradient(135deg, #7c8bd2, #5d6bb7, #3f4b9c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        Problems
      </h1>
      <p className="text-neutral-300 text-sm xs:text-base sm:text-lg md:text-xl max-w-2xl">
        Master Data Structures & Algorithms with our curated problem collection
      </p>
    </div>
  </div>
);

export default ProblemsHeader;
