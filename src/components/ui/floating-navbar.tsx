'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { IconLogin, IconLogout, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

import type { JSX } from 'react';

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}

export const FloatingNav = ({
  navItems,
  className,
  isLoggedIn,
  onSignInOut,
  themeToggle,
  user,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
  isLoggedIn: boolean;
  onSignInOut: () => void;
  themeToggle?: React.ReactNode;
  user?: { uid: string; email?: string | null } | null;
}) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push('/signup');
    } else {
      onSignInOut();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex max-w-fit fixed top-4 inset-x-0 mx-auto z-50 border border-zinc-600/[0.2] rounded-full bg-zinc-800/60 backdrop-blur-md shadow-md pr-4 pl-6 py-2 items-center justify-center space-x-4',
        className
      )}
    >
      {navItems.map((navItem, idx) => (
        <a
          key={`link-${idx}`}
          href={navItem.link}
          className="relative text-neutral-50 flex items-center space-x-1 hover:text-neutral-300"
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden sm:block text-sm">{navItem.name}</span>
        </a>
      ))}

      {themeToggle && <div className="flex items-center">{themeToggle}</div>}

      {isLoggedIn ? (
        <>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all duration-200 group"
              aria-label="User menu"
            >
              <IconUser className="h-5 w-5 text-zinc-300 group-hover:text-zinc-200 transition-colors" />
            </button>
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 mt-3 w-64 bg-zinc-900/95 backdrop-blur-lg border border-zinc-700/50 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200"
              >
                {/* Header with gradient accent */}
                <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 px-4 py-3 border-b border-zinc-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center ring-2 ring-zinc-500/30">
                      <IconUser className="h-5 w-5 text-zinc-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-100 truncate">
                        {user?.email ? user.email.split('@')[0] : 'User'}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {user?.email || 'Welcome back!'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      Ready to tackle some algorithms?
                      <span className="block text-xs text-zinc-400 mt-1">
                        Keep up the great work!
                      </span>
                    </p>
                  </div>

                  {/* Sign out button */}
                  <button
                    onClick={handleClick}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 group hover:shadow-lg"
                    type="button"
                  >
                    <IconLogout className="h-4 w-4 text-zinc-400 group-hover:text-zinc-300 transition-colors" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>

                {/* Bottom accent */}
                <div className="h-1 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700"></div>
              </div>
            )}
          </div>
        </>
      ) : (
        <button
          onClick={handleClick}
          className="border text-sm font-medium relative border-white/[0.2] text-white px-4 py-2 rounded-full flex items-center space-x-2"
          type="button"
        >
          <IconLogin className="h-4 w-4" />
          <span>Sign In</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
        </button>
      )}
    </motion.div>
  );
};