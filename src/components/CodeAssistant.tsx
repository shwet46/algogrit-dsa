'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, X, Trash2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useAuth } from '@/context/authContext';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

export default function CodeAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  // Persist history in localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!initializedRef.current) {
      try {
        const raw = localStorage.getItem('algogrit-assistant-history');
        if (raw) {
          const parsed = JSON.parse(raw) as Message[];
          setMessages(parsed);
        }
      } catch {
        console.warn('Failed to load assistant history');
      }
      initializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('algogrit-assistant-history', JSON.stringify(messages));
    } catch {
      console.warn('Failed to save assistant history');
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If backend provided a fallback reply, still show it but mark as degraded
        const fallback = data.reply as string | undefined;
        const errMsg = data.error || `Service unavailable (status ${res.status})`;
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text:
              (fallback || "Sorry, I couldn't generate a response.") +
              `\n\n> Notice: ${errMsg}.`,
          },
        ]);
      } else {
        const botReply = data.reply || "Sorry, I couldn't generate a response.";
        setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
      }
    } catch (err) {
      console.error('API error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Failed to get response from AI assistant.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [prompt, loading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' && !e.shiftKey) || (e.key === 'Enter' && e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      // ctrl/cmd + k clears
      e.preventDefault();
      if (!loading) setMessages([]);
    }
  };

  const copyToClipboard = (code: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    } else {
      const ta = document.createElement('textarea');
      ta.value = code; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch {} finally { document.body.removeChild(ta); }
    }
  };

  const panelVariants = {
    hidden: { opacity: 0, x: 60 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: 60, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
  } as const;

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style>
        {`
          .algogrit-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #7c8bd2 #23272f;
          }
          .algogrit-scrollbar::-webkit-scrollbar {
            width: 8px;
            background: #23272f;
          }
          .algogrit-scrollbar::-webkit-scrollbar-thumb {
            background: #7c8bd2;
            border-radius: 8px;
          }
          .algogrit-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #6a79c4;
          }
        `}
      </style>
      {/* Floating trigger button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          aria-expanded={open}
          aria-controls="algogrit-assistant-panel"
          onClick={() => {
            if (!user) {
              window.location.href = '/signup';
              return;
            }
            setOpen((o) => !o);
          }}
          className="relative p-4 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-zinc-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200 group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
        >
          {/* Removed glow overlays */}
          <div className="relative z-10 flex items-center justify-center">
            <Bot size={20} className="group-hover:rotate-6 transition-transform" />
          </div>
        </button>
      </div>

      {/* Slide-up Section Panel */}
      <AnimatePresence>
        {open && user && (
          <motion.section
            id="algogrit-assistant-panel"
            role="region"
            aria-label="Code Assistant"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={panelVariants}
            className="fixed top-0 right-0 z-50 flex flex-col shadow-lg border-l border-indigo-400/20 h-screen w-[92vw] sm:w-[400px] md:w-[480px] bg-zinc-950/90"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between gap-4 px-5 py-4 border-b border-indigo-400/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 flex items-center justify-center shadow ring-1 ring-white/10">
                  <Bot size={22} className="text-zinc-100" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-zinc-100 tracking-wide">AlgoGrit Assistant</span>
                  <span className="text-[11px] text-indigo-300/70 uppercase tracking-wider font-mono">
                    {loading ? 'Thinking…' : 'Ready'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => !loading && setMessages([])}
                  disabled={loading || messages.length === 0}
                  aria-label="Clear conversation"
                  className="p-2 rounded-md text-zinc-300 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close assistant"
                  className="p-2 rounded-md text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto algogrit-scrollbar px-4 py-4 space-y-3">
                  {messages.length === 0 && !loading && (
                    <div className="mx-auto mt-10 max-w-lg text-center text-zinc-500 text-sm leading-relaxed">
                      <p className="mb-4 font-medium text-zinc-300">Ask anything about DSA.</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {['Explain quicksort partition logic', 'When to use BFS vs DFS?', 'Optimize this DP solution', 'Edge cases for binary search?'].map((s) => (
                          <button
                            key={s}
                            onClick={() => setPrompt(s)}
                            className="text-left px-3 py-2 rounded-md bg-zinc-800/60 hover:bg-zinc-800/90 border border-zinc-700/60 text-xs text-zinc-300 hover:text-zinc-100 transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-center'} w-full`}
                    >
                      {msg.sender === 'user' ? (
                        <div
                          className="group relative px-4 py-2 max-w-[80%] rounded-lg whitespace-pre-wrap text-sm leading-relaxed bg-gradient-to-br from-zinc-800 to-zinc-700 text-zinc-100 border border-zinc-600/40 rounded-br-none"
                          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                        >
                          {msg.text}
                        </div>
                      ) : (
                        <div
                          className="group relative w-full max-w-[720px] mx-auto whitespace-pre-wrap text-sm leading-relaxed text-zinc-200 space-y-3 px-2 sm:px-4"
                          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                        >
                          <div className="prose prose-invert max-w-none break-words prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-a:text-indigo-300 hover:prose-a:text-indigo-200 prose-strong:text-zinc-100 prose-li:text-zinc-300 prose-pre:text-left text-sm">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              rehypePlugins={[rehypeHighlight]}
                              components={{
                                code({ className, children, ...props }) {
                                  const match = /language-([^\s]+)/.exec(className || '');
                                  const codeText = String(children).trim();
                                  if (match) {
                                    const lang = match[1];
                                    return (
                                      <div className="relative my-3 group/code">
                                        <span className="absolute top-2 right-2 z-10 rounded bg-zinc-900/80 text-zinc-400 text-[10px] px-2 py-0.5 border border-zinc-700 font-mono">
                                          {lang}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => copyToClipboard(codeText)}
                                          className="absolute top-2 right-14 opacity-0 group-hover/code:opacity-100 transition-opacity text-zinc-400 hover:text-indigo-300"
                                          aria-label="Copy code"
                                        >
                                          <Copy size={14} />
                                        </button>
                                        <pre className="bg-zinc-900/70 rounded-md p-3 pt-8 overflow-x-auto border border-zinc-700 shadow-sm text-[12px]">
                                          <code className={className} {...props}>{children}</code>
                                        </pre>
                                      </div>
                                    );
                                  }
                                  return (
                                    <code className={`${className ?? ''} bg-zinc-800/80 border border-zinc-700 rounded px-1 py-0.5`} {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                a: (props) => (
                                  <a className="text-indigo-300 underline underline-offset-4" target="_blank" rel="noopener noreferrer" {...props} />
                                ),
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex items-center gap-2 text-indigo-300/70 text-sm pl-1">
                      <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                      Thinking...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {/* Composer */}
                <div className="border-t border-indigo-400/10 bg-zinc-950/70 px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800/70 text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 border border-zinc-700/70 focus:border-indigo-400/60 transition-colors font-mono"
                      placeholder="Ask AlgoGrit... (Ctrl+Enter to send)"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      aria-label="Prompt"
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!prompt.trim() || loading}
                    className={`relative px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${
                      !prompt.trim() || loading
                        ? 'bg-zinc-700/50 text-zinc-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-zinc-100 hover:from-indigo-400 hover:to-indigo-600 shadow-md hover:shadow-indigo-500/25'
                    }`}
                    aria-label="Send message"
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      <Send size={14} />
                      <span className="hidden sm:inline">Send</span>
                    </span>
                    {!(!prompt.trim() || loading) && (
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-indigo-400/0 via-indigo-300/20 to-indigo-400/0" />
                    )}
                  </button>
                </div>
              </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}