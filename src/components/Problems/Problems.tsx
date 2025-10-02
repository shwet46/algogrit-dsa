'use client';
import React, { useState, useEffect } from 'react';
import problems from '@/data/problems.json';

import { auth, db } from '@/firebase/config';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import ProblemsHeader from './ProblemsHeader';
import ProblemsStats from './ProblemsStats';
import ProblemsFilters from './ProblemsFilters';
import ProblemsTable from './ProblemsTable';
import ProblemsPagination from './ProblemsPagination';
import ProblemsNoResults from './ProblemsNoResults';
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

const ITEMS_PER_PAGE = 10;

export default function Problems() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<number[]>([]);
  const [solvedProblemsDetails, setSolvedProblemsDetails] = useState<
    SolvedProblemDetail[]
  >([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
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
        setSolvedProblemsDetails([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserProgress = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setChecked(userData.solvedProblems || []);
        setSolvedProblemsDetails(userData.solvedProblemsDetails || []);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const getProblemDetails = (
    problemIndex: number
  ): SolvedProblemDetail | null => {
    const problem = problems.problems[problemIndex];
    if (!problem) return null;
    return {
      ...problem,
      index: problemIndex,
      solvedAt: new Date().toISOString(),
    };
  };

  const saveUserProgress = async (problemIndex: number, isSolved: boolean) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);

    try {
      if (isSolved) {
        const problemDetails = getProblemDetails(problemIndex);
        if (!problemDetails) return;

        await updateDoc(userRef, {
          solvedProblems: arrayUnion(problemIndex),
          solvedProblemsDetails: arrayUnion(problemDetails),
          lastUpdated: new Date().toISOString(),
        });

        setSolvedProblemsDetails((prev) => [...prev, problemDetails]);
      } else {
        const problemDetailToRemove = solvedProblemsDetails.find(
          (detail) => detail.index === problemIndex
        );

        if (problemDetailToRemove) {
          await updateDoc(userRef, {
            solvedProblems: arrayRemove(problemIndex),
            solvedProblemsDetails: arrayRemove(problemDetailToRemove),
            lastUpdated: new Date().toISOString(),
          });

          setSolvedProblemsDetails((prev) =>
            prev.filter((detail) => detail.index !== problemIndex)
          );
        }
      }
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'not-found'
      ) {
        const problemDetails = isSolved
          ? getProblemDetails(problemIndex)
          : null;

        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          solvedProblems: isSolved ? [problemIndex] : [],
          solvedProblemsDetails:
            isSolved && problemDetails ? [problemDetails] : [],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        });

        if (isSolved && problemDetails) {
          setSolvedProblemsDetails([problemDetails]);
        }
      } else {
        console.error('Error saving user progress:', error);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
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

  const uniqueDifficulties = [
    'All',
    ...Array.from(new Set(problems.problems.map((p: Problem) => p.difficulty))),
  ];
  const uniquePlatforms = [
    'All',
    ...Array.from(new Set(problems.problems.map((p: Problem) => p.platform))),
  ];
  const uniqueTags = Array.from(
    new Set(problems.problems.flatMap((p: Problem) => p.tags))
  ).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const filteredProblems = problems.problems
    .filter(
      (problem: Problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.description.toLowerCase().includes(search.toLowerCase())
    )
    .filter((problem: Problem) =>
      difficultyFilter === 'All'
        ? true
        : problem.difficulty === difficultyFilter
    )
    .filter((problem: Problem) =>
      platformFilter === 'All' ? true : problem.platform === platformFilter
    )
    .filter((problem: Problem) =>
      selectedTags.length === 0
        ? true
        : selectedTags.some((tag) => problem.tags.includes(tag))
    );

  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProblems = filteredProblems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const solvedCount = checked.length;
  const progressPercentage = (solvedCount / problems.problems.length) * 100;

  const getDifficultyStats = () => {
    const stats = { Easy: 0, Medium: 0, Hard: 0 };
    type Difficulty = 'Easy' | 'Medium' | 'Hard';
    checked.forEach((index) => {
      const problem = problems.problems[index];
      if (
        problem &&
        (problem.difficulty === 'Easy' ||
          problem.difficulty === 'Medium' ||
          problem.difficulty === 'Hard')
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
        <div className="w-full max-w-5xl px-6">
          <div className="space-y-6">
            <div className="h-8 w-48 bg-zinc-800/70 rounded animate-pulse" />
            <div className="rounded-2xl border border-[#7c8bd2]/25 bg-zinc-950/40 p-4 sm:p-6 shadow-xl">
              <div className="h-10 bg-zinc-800/70 rounded animate-pulse" />
            </div>
            <div className="rounded-2xl border border-[#7c8bd2]/25 bg-zinc-950/40 p-4 sm:p-6 shadow-xl">
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-zinc-800/70 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen mt-20 w-full mb-16 bg-black text-white py-8 px-1 xs:px-2 sm:px-4 md:px-8 lg:px-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 [background-size:20px_20px] [background-image:radial-gradient(circle,#262626_1px,transparent_1px)] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto">
        <ProblemsHeader />

        {user && (
          <ProblemsStats
            solvedCount={solvedCount}
            progressPercentage={progressPercentage}
            difficultyStats={difficultyStats}
            onSelectDifficulty={(difficulty) => {
              setDifficultyFilter(difficulty);
              setCurrentPage(1);
            }}
          />
        )}

        <section className="rounded-2xl border border-[#7c8bd2]/25 bg-zinc-950/40 shadow-xl mb-6">
          <div className="p-3 sm:p-4 md:p-6">
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
          </div>
        </section>

        <ProblemsTable
          visibleProblems={visibleProblems}
          checked={checked}
          startIndex={startIndex}
          toggleCheck={toggleCheck}
          loading={loading}
          getSolvedProblemWithTimestamp={(problemIndex) => {
            const visibleProblem = visibleProblems.find(
              (p, i) => startIndex + i === problemIndex
            );
            if (!visibleProblem) return undefined;
            return solvedProblemsDetails.find(
              (detail) =>
                detail.index === problemIndex &&
                detail.title === visibleProblem.title
            );
          }}
        />

        {totalPages > 1 && (
          <div className="mt-6">
            <ProblemsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}

        {filteredProblems.length === 0 && (
          <div className="rounded-2xl border border-[#7c8bd2]/25 bg-zinc-950/40 shadow-xl mt-6">
            <div className="p-6">
              <ProblemsNoResults
                onClear={() => {
                  setSearch('');
                  setDifficultyFilter('All');
                  setPlatformFilter('All');
                  setSelectedTags([]);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        )}

        {!user && <ProblemsSignInPrompt onSignIn={signInWithGoogle} />}
      </div>
    </div>
  );
}