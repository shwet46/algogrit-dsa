"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconLogin, IconLogout, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation"; 

import type { JSX } from "react";

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(" ");
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push("/signup"); 
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
        "flex max-w-fit fixed top-4 inset-x-0 mx-auto z-50 border border-zinc-600/[0.2] rounded-full bg-zinc-800/60 backdrop-blur-md shadow-md pr-4 pl-6 py-2 items-center justify-center space-x-4",
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
              className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-700 hover:bg-zinc-600 border border-[#7c8bd2] focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]"
              aria-label="User menu"
            >
              <IconUser className="h-5 w-5 text-blue-300" />
            </button>
            {dropdownOpen && (
              <div ref={dropdownRef} className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-56 bg-gradient-to-br from-[#23243a] via-[#2e3261] to-[#5d6bb7] border border-[#7c8bd2] rounded-xl shadow-lg z-50 p-4 flex flex-col items-center animate-fade-in">
                <div className="text-sm text-white mb-2 text-center">
                  Hello, <span className="font-semibold text-blue-200">{user?.email ? user.email.split("@", 1)[0] : "User"}</span>!<br />
                  <span className="text-xs text-blue-100">have a nice day and stay focused.</span>
                </div>
                <button
                  onClick={handleClick}
                  className="mt-2 w-full border text-sm font-medium border-[#7c8bd2] text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 bg-zinc-800/80 hover:bg-[#2e3261] transition"
                  type="button"
                >
                  <IconLogout className="h-4 w-4 mr-2 text-blue-300" />
                  <span>Sign Out</span>
                </button>
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