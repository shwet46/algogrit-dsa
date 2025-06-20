"use client";
import React from "react";
import { FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { VscTerminal } from "react-icons/vsc";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-black px-6 sm:px-10 md:px-16 py-12 overflow-hidden">
      {/* Blue corner gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-transparent to-transparent opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-neutral-400">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <VscTerminal className="text-[#60a5fa]" size={26} />
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
            <li><Link href="/problems" className="hover:text-blue-400 transition-colors">Problems</Link></li>
            <li><Link href="/code-ide" className="hover:text-blue-400 transition-colors">Code-IDE</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Connect</h4>
          <div className="flex items-center gap-4">
            <a href="https://github.com/shwet46" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <FaGithub size={18} />
            </a>
            <a href="https://x.com/shwet46" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <FaXTwitter size={18} />
            </a>
            <a href="https://youtube.com/@shwet-46?si=reMyEQ0_el_OfpSv" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <FaYoutube size={18} />
            </a>
            <a href="https://www.linkedin.com/in/shweta-behera/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
              <FaLinkedin size={18} />
            </a>
            <a href="mailto:shwetabehera444@gmail.com" className="hover:text-blue-400 transition-colors">
              <MdEmail size={18} />
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