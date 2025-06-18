"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconLogin, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation"; // Import router

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
}) => {
  const router = useRouter();

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

      {/* Theme Toggle Button */}
      {themeToggle && <div className="flex items-center">{themeToggle}</div>}

      {/* Sign In/Out Button */}
      <button
        onClick={handleClick}
        className="border text-sm font-medium relative border-white/[0.2] text-white px-4 py-2 rounded-full flex items-center space-x-2"
        type="button"
      >
        {isLoggedIn ? (
          <>
            <IconLogout className="h-4 w-4" />
            <span>Sign Out</span>
          </>
        ) : (
          <>
            <IconLogin className="h-4 w-4" />
            <span>Sign In</span>
          </>
        )}
        <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
      </button>
    </motion.div>
  );
};