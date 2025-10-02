'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CODE_SNIPPETS, LANGUAGE_IDS } from '../../lib/constants';
import { Check, ChevronDown } from 'lucide-react';

type SupportedLanguage = keyof typeof CODE_SNIPPETS;

const JUDGE0_DISPLAY_NAMES: Partial<Record<SupportedLanguage, string>> = {
  assembly: 'Assembly (NASM 2.14.02)',
  bash: 'Bash (5.0.0)',
  c: 'C (GCC 9.2.0)',
  cpp: 'C++ (GCC 9.2.0)',
  csharp: 'C# (Mono 6.6.0.161)',
  elixir: 'Elixir (1.9.4)',
  erlang: 'Erlang (OTP 22.2)',
  fortran: 'Fortran (GFortran 9.2.0)',
  go: 'Go (1.13.5)',
  haskell: 'Haskell (GHC 8.8.1)',
  java: 'Java (OpenJDK 13.0.1)',
  javascript: 'JavaScript (Node.js 12.14.0)',
  lua: 'Lua (5.3.5)',
  ocaml: 'OCaml (4.09.0)',
  pascal: 'Pascal (FPC 3.0.4)',
  php: 'PHP (7.4.1)',
  prolog: 'Prolog (GNU Prolog 1.4.5)',
  python: 'Python (3.8.1)',
  ruby: 'Ruby (2.7.0)',
  rust: 'Rust (1.40.0)',
  typescript: 'TypeScript (3.7.4)',
  lisp: 'Common Lisp (SBCL 2.0.0)',
};

const getDisplayName = (lang: SupportedLanguage) =>
  JUDGE0_DISPLAY_NAMES[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);

const getShortName = (lang: SupportedLanguage) =>
  (JUDGE0_DISPLAY_NAMES[lang] || lang)
    .replace(/\s*\(.*\)$/,'')
    .replace(/^cpp$/i, 'C++')
    .replace(/^csharp$/i, 'C#')
    .replace(/^ocaml$/i, 'OCaml')
    .replace(/^typescript$/i, 'TypeScript')
    .replace(/^javascript$/i, 'JavaScript')
    .replace(/^sql$/i, 'SQL');

const LANGUAGE_ICONS: Partial<Record<SupportedLanguage, string>> = {
  assembly: 'devicon-labview-plain', 
  bash: 'devicon-bash-plain',
  c: 'devicon-c-plain',
  cpp: 'devicon-cplusplus-plain',
  csharp: 'devicon-csharp-plain',
  cobol: 'devicon-cobol-plain',
  elixir: 'devicon-elixir-plain',
  erlang: 'devicon-erlang-plain',
  fortran: 'devicon-fortran-original',
  go: 'devicon-go-plain',
  haskell: 'devicon-haskell-plain',
  java: 'devicon-java-plain',
  javascript: 'devicon-javascript-plain',
  kotlin: 'devicon-kotlin-plain',
  lisp: 'devicon-lisp-plain',
  lua: 'devicon-lua-plain',
  ocaml: 'devicon-ocaml-plain',
  pascal: 'devicon-pascal-plain',
  perl: 'devicon-perl-plain',
  php: 'devicon-php-plain',
  powershell: 'devicon-powershell-plain',
  prolog: 'devicon-prolog-plain',
  python: 'devicon-python-plain',
  ruby: 'devicon-ruby-plain',
  rust: 'devicon-rust-plain',
  scala: 'devicon-scala-plain',
  sql: 'devicon-azuresql-plain',
  swift: 'devicon-swift-plain',
  typescript: 'devicon-typescript-plain',
};

interface LanguageSelectorProps {
  language: SupportedLanguage;
  onSelect: (language: SupportedLanguage) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onSelect }) => {
  const [query, setQuery] = useState('');
  useEffect(() => {
    const id = "devicon-cdn";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css";
      document.head.appendChild(link);
    }
  }, []); 

  const supportedLangs = useMemo(
    () => (Object.keys(CODE_SNIPPETS) as SupportedLanguage[]).filter((l) =>
      Object.prototype.hasOwnProperty.call(LANGUAGE_IDS, l)
    ),
    []
  );

  const popularOrder: SupportedLanguage[] = [
    'javascript',
    'python',
    'java',
    'cpp',
    'c',
    'typescript',
  ];

  const popular = useMemo(
    () => popularOrder.filter((l) => supportedLangs.includes(l)),
    [supportedLangs]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return supportedLangs;
    const q = query.toLowerCase();
    return supportedLangs.filter((l) => {
      const name = getDisplayName(l).toLowerCase();
      return name.includes(q) || l.includes(q);
    });
  }, [query, supportedLangs]);

  const filteredPopular = popular.filter((l) => filtered.includes(l));
  const filteredOthers = filtered.filter((l) => !popular.includes(l));

  const currentIcon = LANGUAGE_ICONS[language];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[260px] justify-between text-left">
          <span className="flex items-center gap-2 truncate">
            {currentIcon && <i className={`${currentIcon} text-xl`}></i>}
            <span className="truncate">{getDisplayName(language)}</span>
          </span>
          <ChevronDown className="h-4 w-4 ml-2 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[420px] mx-4 my-1 p-2">
        {/* Search */}
        <div className="p-2 pb-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search language..."
            className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]"
            aria-label="Search languages"
          />
        </div>

        {/* Lists (no scroll area) */}
        <div className="pr-2">
          {filteredPopular.length > 0 && (
            <div className="mb-2">
              <div className="px-2 pb-1 text-[11px] uppercase tracking-wide text-zinc-400">Popular</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {filteredPopular.map((lang) => {
                  const iconClass = LANGUAGE_ICONS[lang];
                  return (
                    <DropdownMenuItem
                      key={`pop-${lang}`}
                      className="cursor-pointer flex items-center justify-between gap-2"
                      onClick={() => onSelect(lang)}
                    >
                      <div className="flex items-center gap-2">
                        {iconClass && <i className={`${iconClass} text-xl`}></i>}
                        <span>{getShortName(lang)}</span>
                      </div>
                      {language === lang && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <div className="px-2 pb-1 text-[11px] uppercase tracking-wide text-zinc-400">All languages</div>
            {filteredOthers.length === 0 && filteredPopular.length === 0 ? (
              <div className="px-2 py-6 text-sm text-zinc-400">No languages match “{query}”.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {filteredOthers.map((lang) => {
                  const iconClass = LANGUAGE_ICONS[lang];
                  return (
                    <DropdownMenuItem
                      key={lang}
                      className="cursor-pointer flex items-center justify-between gap-2"
                      onClick={() => onSelect(lang)}
                    >
                      <div className="flex items-center gap-2">
                        {iconClass && <i className={`${iconClass} text-xl`}></i>}
                        <span>{getShortName(lang)}</span>
                      </div>
                      {language === lang && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;