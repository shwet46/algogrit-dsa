"use client";
import React from "react";
import { Github, Linkedin, Mail, Youtube, Terminal } from "lucide-react";
import Link from "next/link";

// Twitter X Icon (SVG)
const TwitterXIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.067 3H20.6l-5.922 6.76L22 21h-6.786l-4.713-6.801L5.78 21H2.233l6.478-7.396L2 3h6.933l4.293 6.223L17.067 3zm-1.1 16.286h1.88L8.09 4.572H6.09l9.878 14.714z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black px-6 sm:px-10 md:px-16 py-12 overflow-hidden">
      {/* Blue corner gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-transparent to-transparent opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-neutral-400">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Terminal className="text-[#60a5fa]" size={26} />
            <h2
              className="text-2xl font-bold bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb] bg-clip-text text-transparent"
              style={{ fontFamily: "'Fira Code', monospace" }}
            >
              AlgoGrit
            </h2>
          </div>
          <p className="text-neutral-500">
            Master DSA with questions from all major platforms. Track your
            progress, practice smart, and compete globally — all in one unified
            platform.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link href="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
            <li><Link href="/leaderboard" className="hover:text-blue-400 transition-colors">Leaderboard</Link></li>
            <li><Link href="/auth/signin" className="hover:text-blue-400 transition-colors">Sign In</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Connect</h4>
          <div className="flex items-center gap-4">
            <a href="https://github.com/shwet46" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <Github size={18} />
            </a>
            <a href="https://x.com/shwet46" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <TwitterXIcon size={18} />
            </a>
            <a href="https://youtube.com/@shwet-46?si=reMyEQ0_el_OfpSv" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <Youtube size={18} />
            </a>
            <a href="https://www.linkedin.com/in/shweta-behera/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="mailto:shwetabehera444@gmail.com" className="hover:text-blue-400 transition-colors">
              <Mail size={18} />
            </a>
          </div>
          <p className="text-xs text-neutral-500 pt-4">
            Made with 💙 by <span className="font-semibold text-blue-400">SB</span>
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative z-10 mt-12 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} AlgoGrit. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;