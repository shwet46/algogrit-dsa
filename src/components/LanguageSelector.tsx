"use client";

import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CODE_SNIPPETS } from "../lib/constants";

// Define types
type SupportedLanguage = keyof typeof CODE_SNIPPETS;
type LanguageName = {
  [key in SupportedLanguage]: string;
};

const LANGUAGE_NAMES: LanguageName = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  csharp: "C#",
};

interface LanguageSelectorProps {
  language: SupportedLanguage;
  onSelect: (language: SupportedLanguage) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onSelect }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-between">
          {LANGUAGE_NAMES[language]}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]">
        <DropdownMenuGroup>
          {Object.keys(CODE_SNIPPETS).map((lang) => (
            <DropdownMenuItem
              key={lang}
              className="cursor-pointer flex items-center justify-between"
              onClick={() => onSelect(lang as SupportedLanguage)}
            >
              {LANGUAGE_NAMES[lang as SupportedLanguage]}
              {language === lang && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;