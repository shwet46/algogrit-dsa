import React from 'react';
import { User } from 'lucide-react';

type ProblemsSignInPromptProps = {
  onSignIn: () => void;
};

const ProblemsSignInPrompt: React.FC<ProblemsSignInPromptProps> = ({
  onSignIn,
}) => (
  <div className="mt-8 sm:mt-10 md:mt-16 text-center rounded-2xl p-6 md:p-8 border border-[#7c8bd2]/25 bg-zinc-950/40 shadow-xl">
    <div className="flex justify-center mb-3">
      <div className="p-2 rounded-lg bg-zinc-900/60 border border-[#7c8bd2]/25">
        <User aria-hidden="true" className="w-7 h-7 text-[#c6cbf5]" />
      </div>
    </div>
    <h3 className="text-2xl font-semibold text-white mb-2">
      Track your progress
    </h3>
    <p className="text-neutral-400 text-sm sm:text-base mb-5 max-w-xl mx-auto">
      Sign in to sync solved problems and view personalized statistics across
      devices.
    </p>
    <button
      type="button"
      onClick={onSignIn}
      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#7c8bd2] hover:bg-[#6e7bd1] text-zinc-950 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7c8bd2] focus-visible:ring-offset-zinc-950"
      aria-label="Sign in to sync your progress"
    >
      Sign in to sync progress
    </button>
    <p className="mt-3 text-xs text-neutral-500">
      No spam. You can sign out anytime.
    </p>
  </div>
);

export default ProblemsSignInPrompt;