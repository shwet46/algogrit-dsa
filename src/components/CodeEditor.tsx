'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Editor, OnMount } from '@monaco-editor/react';
import { CODE_SNIPPETS } from '../lib/constants';
import LanguageSelector from './LanguageSelector';
import Output from './Output';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Copy, Download, Palette } from 'lucide-react';

type SupportedLanguage = keyof typeof CODE_SNIPPETS;

const THEME_OPTIONS = {
  'vs-dark': 'Dark',
  vs: 'Light',
  'hc-black': 'High Contrast Dark',
  'hc-light': 'High Contrast Light',
} as const;

const CUSTOM_THEMES = {
  'github-dark': {
    base: 'vs-dark' as const,
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f97583' },
      { token: 'string', foreground: '9ecbff' },
      { token: 'number', foreground: '79b8ff' },
      { token: 'type', foreground: 'b392f0' },
      { token: 'class', foreground: 'ffab70' },
      { token: 'function', foreground: 'b392f0' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#c9d1d9',
      'editor.lineHighlightBackground': '#161b22',
      'editor.selectionBackground': '#264f78',
      'editorCursor.foreground': '#c9d1d9',
      'editorLineNumber.foreground': '#6a737d',
    },
  },
  monokai: {
    base: 'vs-dark' as const,
    inherit: true,
    rules: [
      { token: 'comment', foreground: '75715e', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f92672' },
      { token: 'string', foreground: 'e6db74' },
      { token: 'number', foreground: 'ae81ff' },
      { token: 'type', foreground: '66d9ef' },
      { token: 'class', foreground: 'a6e22e' },
      { token: 'function', foreground: 'a6e22e' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#3e3d32',
      'editor.selectionBackground': '#49483e',
      'editorCursor.foreground': '#f8f8f0',
      'editorLineNumber.foreground': '#90908a',
    },
  },
  'solarized-dark': {
    base: 'vs-dark' as const,
    inherit: true,
    rules: [
      { token: 'comment', foreground: '586e75', fontStyle: 'italic' },
      { token: 'keyword', foreground: '859900' },
      { token: 'string', foreground: '2aa198' },
      { token: 'number', foreground: 'd33682' },
      { token: 'type', foreground: '268bd2' },
      { token: 'class', foreground: 'b58900' },
      { token: 'function', foreground: '268bd2' },
    ],
    colors: {
      'editor.background': '#002b36',
      'editor.foreground': '#839496',
      'editor.lineHighlightBackground': '#073642',
      'editor.selectionBackground': '#274642',
      'editorCursor.foreground': '#839496',
      'editorLineNumber.foreground': '#586e75',
    },
  },
  dracula: {
    base: 'vs-dark' as const,
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff79c6' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'type', foreground: '8be9fd' },
      { token: 'class', foreground: '50fa7b' },
      { token: 'function', foreground: '50fa7b' },
    ],
    colors: {
      'editor.background': '#282a36',
      'editor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#44475a',
      'editor.selectionBackground': '#44475a',
      'editorCursor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#6272a4',
    },
  },
};

const ALL_THEMES = {
  ...THEME_OPTIONS,
  'github-dark': 'GitHub Dark',
  monokai: 'Monokai',
  'solarized-dark': 'Solarized Dark',
  dracula: 'Dracula',
} as const;

type AllThemes = keyof typeof ALL_THEMES;

const CodeEditor: React.FC = () => {
  const editorRef = useRef<
    import('monaco-editor').editor.IStandaloneCodeEditor | null
  >(null);
  const [value, setValue] = useState<string>('');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [theme, setTheme] = useState<AllThemes>('vs-dark');
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

  const getFileExtension = (lang: SupportedLanguage): string => {
    const extensions: Record<SupportedLanguage, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      csharp: 'cs',
    };
    return extensions[lang] || 'txt';
  };

  const copyCode = (): void => {
    if (value) navigator.clipboard.writeText(value).catch(console.error);
  };

  const downloadCode = (): void => {
    if (value) {
      const ext = getFileExtension(language);
      const blob = new Blob([value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `code.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!mounted) {
    return (
      <Card className="w-full h-screen flex items-center justify-center">
        <CardContent>
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-gray-900 rounded-full mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading editor...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full min-h-screen px-4 py-6 sm:px-8 sm:py-6 bg-background">
      <CardHeader className="pb-6 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Language</label>
            <LanguageSelector language={language} onSelect={setLanguage} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Font Size</label>
            <Select
              value={fontSize.toString()}
              onValueChange={(val) => setFontSize(+val)}
            >
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
          <div>
            <label className="text-sm font-medium mb-1 block">Theme</label>
            <Select
              value={theme}
              onValueChange={(val) => setTheme(val as AllThemes)}
            >
              <SelectTrigger className="w-full h-9">
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1">
                  {Object.entries(ALL_THEMES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={copyCode}>
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy code</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={downloadCode}>
                    <Download className="h-4 w-4 mr-1" /> Download
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download file</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Editor
            </h3>
            <div className="rounded-md border shadow-sm overflow-hidden">
              <Editor
                height="62vh"
                theme={theme}
                language={language}
                defaultValue={CODE_SNIPPETS[language]}
                value={value}
                onChange={(val) => setValue(val || '')}
                onMount={onMount}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize,
                  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                  fontLigatures: true,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  cursorBlinking: 'expand',
                  smoothScrolling: true,
                }}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Output
            </h3>
            <div className="rounded-md border shadow-sm h-[62vh] overflow-auto">
              <Output editorRef={editorRef} language={language} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditor;