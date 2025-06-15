"use client";

import React, { useRef, useState, useEffect } from "react";
import { Editor, OnMount } from "@monaco-editor/react";
import { CODE_SNIPPETS } from "../lib/constants";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Download, Palette } from "lucide-react";

type SupportedLanguage = keyof typeof CODE_SNIPPETS;

// Theme options similar to CodeChef
const THEME_OPTIONS = {
  "vs-dark": "Dark",
  "vs": "Light", 
  "hc-black": "High Contrast Dark",
  "hc-light": "High Contrast Light"
} as const;

type ThemeOption = keyof typeof THEME_OPTIONS;

// Custom theme definitions (you can add more)
const CUSTOM_THEMES = {
  "github-dark": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "6a737d", fontStyle: "italic" },
      { token: "keyword", foreground: "f97583" },
      { token: "string", foreground: "9ecbff" },
      { token: "number", foreground: "79b8ff" },
      { token: "type", foreground: "b392f0" },
      { token: "class", foreground: "ffab70" },
      { token: "function", foreground: "b392f0" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editor.lineHighlightBackground": "#161b22",
      "editor.selectionBackground": "#264f78",
      "editorCursor.foreground": "#c9d1d9",
      "editorLineNumber.foreground": "#6a737d",
    }
  },
  "monokai": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "75715e", fontStyle: "italic" },
      { token: "keyword", foreground: "f92672" },
      { token: "string", foreground: "e6db74" },
      { token: "number", foreground: "ae81ff" },
      { token: "type", foreground: "66d9ef" },
      { token: "class", foreground: "a6e22e" },
      { token: "function", foreground: "a6e22e" },
    ],
    colors: {
      "editor.background": "#272822",
      "editor.foreground": "#f8f8f2",
      "editor.lineHighlightBackground": "#3e3d32",
      "editor.selectionBackground": "#49483e",
      "editorCursor.foreground": "#f8f8f0",
      "editorLineNumber.foreground": "#90908a",
    }
  },
  "solarized-dark": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "586e75", fontStyle: "italic" },
      { token: "keyword", foreground: "859900" },
      { token: "string", foreground: "2aa198" },
      { token: "number", foreground: "d33682" },
      { token: "type", foreground: "268bd2" },
      { token: "class", foreground: "b58900" },
      { token: "function", foreground: "268bd2" },
    ],
    colors: {
      "editor.background": "#002b36",
      "editor.foreground": "#839496",
      "editor.lineHighlightBackground": "#073642",
      "editor.selectionBackground": "#274642",
      "editorCursor.foreground": "#839496",
      "editorLineNumber.foreground": "#586e75",
    }
  },
  "dracula": {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4", fontStyle: "italic" },
      { token: "keyword", foreground: "ff79c6" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
      { token: "type", foreground: "8be9fd" },
      { token: "class", foreground: "50fa7b" },
      { token: "function", foreground: "50fa7b" },
    ],
    colors: {
      "editor.background": "#282a36",
      "editor.foreground": "#f8f8f2",
      "editor.lineHighlightBackground": "#44475a",
      "editor.selectionBackground": "#44475a",
      "editorCursor.foreground": "#f8f8f2",
      "editorLineNumber.foreground": "#6272a4",
    }
  }
};

const ALL_THEMES = {
  ...THEME_OPTIONS,
  "github-dark": "GitHub Dark",
  "monokai": "Monokai",
  "solarized-dark": "Solarized Dark", 
  "dracula": "Dracula"
} as const;

type AllThemes = keyof typeof ALL_THEMES;

const CodeEditor: React.FC = () => {
  const editorRef = useRef<any>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [theme, setTheme] = useState<AllThemes>("vs-dark");
  const [fontSize, setFontSize] = useState<number>(14);
  const [mounted, setMounted] = useState<boolean>(false);
  const [monacoLoaded, setMonacoLoaded] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setValue(CODE_SNIPPETS[language]);
  }, [language]);

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();
    
    // Register custom themes when monaco is available
    if (monaco && !monacoLoaded) {
      Object.entries(CUSTOM_THEMES).forEach(([themeName, themeData]) => {
        try {
          monaco.editor.defineTheme(themeName, themeData);
        } catch (error) {
          console.warn(`Failed to define theme ${themeName}:`, error);
        }
      });
      setMonacoLoaded(true);
    }
  };

  const onSelect = (language: SupportedLanguage): void => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const onThemeChange = (selectedTheme: AllThemes): void => {
    setTheme(selectedTheme);
  };

  const onFontSizeChange = (size: string): void => {
    setFontSize(parseInt(size));
  };

  const copyCode = (): void => {
    if (value) {
      navigator.clipboard.writeText(value).catch((err) => {
        console.error('Failed to copy code:', err);
      });
    }
  };

  const downloadCode = (): void => {
    if (value) {
      const fileExtension = getFileExtension(language);
      const blob = new Blob([value], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `code.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getFileExtension = (lang: SupportedLanguage): string => {
    const extensions: Record<SupportedLanguage, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      csharp: "cs",
    };
    return extensions[lang] || "txt";
  };

  if (!mounted) {
    return (
      <Card className="w-full h-screen overflow-y-auto px-2 py-2 sm:px-4 sm:py-4">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading editor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-screen overflow-y-auto px-2 py-2 sm:px-4 sm:py-4">
      <CardHeader className="pb-4 pt-20">
        {/* Controls Row - Language selector with buttons and selectors aligned */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          {/* Language Selector */}
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium mb-2">Language</label>
            <div className="w-full">
              <LanguageSelector language={language} onSelect={onSelect} />
            </div>
          </div>
          
          {/* Font Size Selector */}
          <div className="w-20">
            <label className="block text-sm font-medium mb-2">Font Size</label>
            <Select value={fontSize.toString()} onValueChange={onFontSizeChange}>
              <SelectTrigger className="w-full h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 12, 14, 16, 18, 20, 22, 24].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Theme Selector */}
          <div className="flex-1 min-w-0 sm:max-w-xs">
            <label className="block text-sm font-medium mb-2">Theme</label>
            <Select value={theme} onValueChange={onThemeChange}>
              <SelectTrigger className="w-full h-9">
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4 flex-shrink-0" />
                  <SelectValue placeholder="Select theme" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <div className="p-1">
                  <div className="text-xs font-medium text-muted-foreground mb-1 px-2">Built-in Themes</div>
                  {Object.entries(THEME_OPTIONS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          key.includes('dark') || key === 'hc-black' ? 'bg-gray-800' : 'bg-gray-200'
                        } border`} />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="text-xs font-medium text-muted-foreground mb-1 mt-2 px-2">Custom Themes</div>
                  {Object.entries(ALL_THEMES).filter(([key]) => !THEME_OPTIONS.hasOwnProperty(key)).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          key === 'github-dark' ? 'bg-gray-900' :
                          key === 'monokai' ? 'bg-green-600' :
                          key === 'solarized-dark' ? 'bg-blue-600' :
                          key === 'dracula' ? 'bg-purple-600' : 'bg-gray-800'
                        } border`} />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons - Aligned together */}
          <div className="flex items-end gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={copyCode} className="h-9">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy code to clipboard</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={downloadCode} className="h-9">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download code file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Editor Section */}
          <div className="w-full lg:w-1/2">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Editor</h3>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <Editor
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: fontSize,
                  wordWrap: "on",
                  automaticLayout: true,
                  lineNumbers: "on",
                  scrollbar: {
                    vertical: "auto",
                    horizontal: "auto",
                  },
                  fontFamily: "'Fira Code', 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                  fontLigatures: true,
                  cursorBlinking: "smooth",
                  renderWhitespace: "selection",
                  smoothScrolling: true,
                }}
                height="70vh"
                theme={theme}
                language={language}
                defaultValue={CODE_SNIPPETS[language]}
                onMount={onMount}
                value={value}
                onChange={(value) => setValue(value || "")}
                loading={
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
                      <p className="text-xs text-gray-600">Loading Monaco Editor...</p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="w-full lg:w-1/2">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Output</h3>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-sm h-[70vh]">
              <Output editorRef={editorRef} language={language} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;