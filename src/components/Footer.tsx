'use client';
import React from 'react';
import { FaGithub, FaLinkedin, FaYoutube, FaStar } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Footer = () => {
  const year = new Date().getFullYear();

  const navSections: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Problems', href: '/problems' },
        { label: 'Code IDE', href: '/code-ide' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' },
      ],
    },
  ];

  const social: { href: string; label: string; icon: React.ReactNode }[] = [
    { href: 'https://github.com/shwet46', label: 'GitHub', icon: <FaGithub size={18} /> },
    { href: 'https://x.com/shwet46', label: 'Twitter / X', icon: <FaXTwitter size={18} /> },
    { href: 'https://youtube.com/@shwet-46?si=reMyEQ0_el_OfpSv', label: 'YouTube', icon: <FaYoutube size={18} /> },
    { href: 'https://www.linkedin.com/in/shweta-behera/', label: 'LinkedIn', icon: <FaLinkedin size={18} /> },
    { href: 'mailto:shwetabehera444@gmail.com', label: 'Email', icon: <MdEmail size={18} /> },
  ];

  const linkBase =
    'relative inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 rounded-sm transition-colors duration-200 hover:text-indigo-300';

  return (
    <footer className="relative z-10 mt-20 px-6 sm:px-10 md:px-16 pt-16 pb-10 overflow-hidden bg-black/95">
      {/* Decorative layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Large subtle radial glows */}
        <div className="absolute -top-32 -left-32 w-[38rem] h-[38rem] bg-[radial-gradient(circle_at_center,rgba(56,99,255,0.18),transparent_70%)]" />
        <div className="absolute top-1/3 -right-40 w-[42rem] h-[42rem] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_65%)]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.08] mix-blend-screen bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Top gradient border shimmer */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10 text-sm"
        >
          {/* Brand */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="md:col-span-5 space-y-5"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/code.png"
                alt="AlgoGrit logo"
                width={40}
                height={40}
                priority
                className="rounded-md shadow-sm shadow-black/40"
              />
              <h2
                className="text-3xl font-black tracking-tight bg-[linear-gradient(100deg,#6ea8ff,#4678d9,#3454a8)] bg-clip-text text-transparent"
                style={{ fontFamily: "'Fira Code', monospace" }}
              >
                AlgoGrit
              </h2>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-md">
              Master DSA with curated problems across major platforms. Track, practice,
              and level up your skills with focus & flow.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {social.map((s) => (
                <motion.a
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-zinc-400 hover:text-indigo-300 transition-colors"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
            <div>
              <a
                href="https://github.com/shwet46/algogrit-dsa"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-md border border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/15 px-3 py-2 text-xs font-medium text-indigo-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
              >
                <FaStar className="transition-transform group-hover:scale-110" size={14} />
                <span>Star us on GitHub</span>
              </a>
            </div>
            <p className="text-[11px] uppercase tracking-wider text-zinc-500 pt-4">
              Made with <span className="text-indigo-400" aria-hidden>♥</span>{' '}
              by <span className="font-semibold text-indigo-300">SB</span>
            </p>
          </motion.div>

          {/* Navigation Sections */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
            className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10"
          >
            {navSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-200 tracking-wide">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={linkBase}>
                        {l.label}
                        <span className="absolute left-0 -bottom-px h-px w-0 bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-300 group-hover:w-full peer-[:focus-visible]:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Divider */}
        <div className="mt-14 h-px bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent" />

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] tracking-wide text-zinc-500">
          <div className="order-2 md:order-1">© {year} AlgoGrit. All rights reserved.</div>
          <div className="order-1 md:order-2 flex items-center gap-4 text-zinc-400">
            <span className="hover:text-indigo-300 transition-colors">
              <Link href="/privacy-policy">Privacy</Link>
            </span>
            <span className="hover:text-indigo-300 transition-colors">
              <Link href="/terms-of-service">Terms</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;