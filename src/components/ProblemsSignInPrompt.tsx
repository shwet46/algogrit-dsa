import React from "react";
import { User } from "lucide-react";

type ProblemsSignInPromptProps = {
  onSignIn: () => void;
};

const ProblemsSignInPrompt: React.FC<ProblemsSignInPromptProps> = ({ onSignIn }) => (
  <div className="mt-8 sm:mt-10 md:mt-16 text-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 border border-purple-500/20">
    <div className="flex justify-center mb-4">
      <User className="w-12 h-12 text-purple-400" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">Track Your Progress</h3>
    <p className="text-purple-200 text-lg mb-6 max-w-2xl mx-auto">
      Sign in to save your progress, track solved problems, and get personalized statistics across all your devices.
    </p>
    <button
      onClick={onSignIn}
      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      Get Started - Sign In
    </button>
  </div>
);

export default ProblemsSignInPrompt;
