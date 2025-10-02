'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';

function Hero() {
  const { user } = useAuth();
  const router = useRouter();
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'AlgoGrit dsa';
  const typingSpeed = 150;
  const pauseBeforeRestart = 2000;

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      // Pause before restarting
      const timeout = setTimeout(() => {
        setDisplayText('');
        setCurrentIndex(0);
      }, pauseBeforeRestart);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText.length]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black">
      {/* Dotted Background */}
      <div
        className={cn(
          'absolute inset-0',
          '[background-size:20px_20px]',
          '[background-image:radial-gradient(circle,#262626_1px,transparent_1px)]'
        )}
      />

      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 md:px-16 pt-28 pb-20 z-10 relative">
        {/* Main Hero Section */}
        <div className="text-center mb-16">
          <h1
            className="flex items-center justify-center gap-3 text-4xl md:text-6xl font-extrabold pb-4 mb-6 min-h-[4rem] md:min-h-[6rem]"
            style={{
              fontFamily: "'Fira Code', monospace",
              background: 'linear-gradient(135deg, #7c8bd2, #5d6bb7, #3f4b9c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <Image
              src="/code.png"
              alt="DSA Master Logo"
              width={48}
              height={48}
            />
            {displayText}
            <span
              className="inline-block w-[3px] h-[1em] ml-1"
              style={{
                backgroundColor: showCursor ? '#7c8bd2' : 'transparent',
                transition: 'background-color 0.1s ease-in-out',
              }}
            ></span>
          </h1>

          <p className="text-base md:text-xl font-normal text-neutral-300 mb-8 max-w-3xl mx-auto">
            Master Data Structures & Algorithms with problems from all major
            platforms! Practice LeetCode, Codeforces, AtCoder, and more in one
            place. Track your progress, compete with peers, and ace your coding
            interviews.
          </p>

          <div className="flex justify-center mb-8">
            <button
              className="p-[3px] relative group"
              onClick={() => {
                if (user) {
                  router.push('/problems');
                } else {
                  router.push('/signup');
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] rounded-lg" />
              <div className="px-8 py-3 bg-slate-900 rounded-[6px] relative transition duration-200 text-white hover:bg-transparent flex items-center space-x-2">
                <span>Start Practicing</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </button>
          </div>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center space-x-1">
              <CheckCircle size={16} className="text-[#7c8bd2]" />
              <span>Problems from all platforms</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle size={16} className="text-[#7c8bd2]" />
              <span>Track your progress</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle size={16} className="text-[#7c8bd2]" />
              <span>Compete with coders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;