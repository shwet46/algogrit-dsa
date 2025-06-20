"use client";
import React, { useState, useEffect } from "react";
import problems from "@/data/problems.json";

import { auth, db } from "@/firebase/config"; 
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User as FirebaseUser 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from "firebase/firestore";

import ProblemsHeader from "./ProblemsHeader";
import ProblemsStats from "./ProblemsStats";
import ProblemsFilters from "./ProblemsFilters";
import ProblemsTable from "./ProblemsTable";
import ProblemsPagination from "./ProblemsPagination";
import ProblemsNoResults from "./ProblemsNoResults";
import ProblemsSignInPrompt from "./ProblemsSignInPrompt";

type Problem = {
  title: string;
  platform: string;
  difficulty: string;
  tags: string[];
  url: string;
  description: string;
};

const ITEMS_PER_PAGE = 10;

export default function Problems() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await loadUserProgress(user.uid);
      } else {
        setChecked([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserProgress = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setChecked(userData.solvedProblems || []);
      }
    } catch (error) {
      console.error("Error loading user progress:", error);
    }
  };

  const saveUserProgress = async (problemIndex: number, isSolved: boolean) => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      
      if (isSolved) {
        await updateDoc(userRef, {
          solvedProblems: arrayUnion(problemIndex),
          lastUpdated: new Date().toISOString()
        });
      } else {
        await updateDoc(userRef, {
          solvedProblems: arrayRemove(problemIndex),
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === 'not-found') {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          solvedProblems: isSolved ? [problemIndex] : [],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        });
      } else {
        console.error("Error saving user progress:", error);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const toggleCheck = async (id: number) => {
    const wasSolved = checked.includes(id);
    const newChecked = wasSolved 
      ? checked.filter((i) => i !== id) 
      : [...checked, id];
    
    setChecked(newChecked);
    
    if (user) {
      await saveUserProgress(id, !wasSolved);
    }
  };

  const uniqueDifficulties = ["All", ...Array.from(new Set(problems.problems.map((p: Problem) => p.difficulty)))];
  const uniquePlatforms = ["All", ...Array.from(new Set(problems.problems.map((p: Problem) => p.platform)))];
  const uniqueTags = Array.from(new Set(problems.problems.flatMap((p: Problem) => p.tags))).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const filteredProblems = problems.problems
    .filter((problem: Problem) =>
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((problem: Problem) =>
      difficultyFilter === "All" ? true : problem.difficulty === difficultyFilter
    )
    .filter((problem: Problem) =>
      platformFilter === "All" ? true : problem.platform === platformFilter
    )
    .filter((problem: Problem) =>
      selectedTags.length === 0 ? true : selectedTags.some(tag => problem.tags.includes(tag))
    );

  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProblems = filteredProblems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const solvedCount = checked.length;
  const progressPercentage = (solvedCount / problems.problems.length) * 100;

  const getDifficultyStats = () => {
    const stats = { Easy: 0, Medium: 0, Hard: 0 };
    type Difficulty = "Easy" | "Medium" | "Hard";
    checked.forEach(index => {
      const problem = problems.problems[index];
      if (
        problem &&
        (problem.difficulty === "Easy" ||
          problem.difficulty === "Medium" ||
          problem.difficulty === "Hard")
      ) {
        stats[problem.difficulty as Difficulty]++;
      }
    });
    return stats;
  };

  const difficultyStats = getDifficultyStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7c8bd2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen mt-20 w-full mb-16 bg-black text-white py-6 px-1 xs:px-2 sm:px-4 md:px-8 lg:px-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 [background-size:20px_20px] [background-image:radial-gradient(circle,#262626_1px,transparent_1px)] opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto">
        <ProblemsHeader />

        {user && (
          <ProblemsStats
            solvedCount={solvedCount}
            progressPercentage={progressPercentage}
            difficultyStats={difficultyStats}
          />
        )}

        <ProblemsFilters
          search={search}
          setSearch={setSearch}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
          platformFilter={platformFilter}
          setPlatformFilter={setPlatformFilter}
          uniqueDifficulties={uniqueDifficulties}
          uniquePlatforms={uniquePlatforms}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          uniqueTags={uniqueTags}
          showAllTags={showAllTags}
          setShowAllTags={setShowAllTags}
          toggleTag={toggleTag}
          setCurrentPage={setCurrentPage}
        />

        <ProblemsTable
          visibleProblems={visibleProblems}
          checked={checked}
          startIndex={startIndex}
          toggleCheck={toggleCheck}
        />

        {totalPages > 1 && (
          <ProblemsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}

        {filteredProblems.length === 0 && (
          <ProblemsNoResults
            onClear={() => {
              setSearch("");
              setDifficultyFilter("All");
              setPlatformFilter("All");
              setSelectedTags([]);
              setCurrentPage(1);
            }}
          />
        )}

        {!user && (
          <ProblemsSignInPrompt onSignIn={signInWithGoogle} />
        )}
      </div>
    </div>
  );
}