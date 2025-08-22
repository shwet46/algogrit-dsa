"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/authContext";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function CodeAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const botReply = data.reply || "Sorry, I couldn't generate a response.";

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("API error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Failed to get response from AI assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
      {/* Floating button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => {
            if (!user) {
              window.location.href = "/signup";
              return;
            }
            setOpen(!open);
          }}
          className="relative p-4 bg-gradient-to-br from-[#7c8bd2] via-[#5d6bb7] to-[#3f4b9c] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2] via-[#5d6bb7] to-[#3f4b9c] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#7c8bd2] to-[#5d6bb7] blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300 rounded-full scale-150"></div>
          <div className="relative z-10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <Bot size={22} />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-0 group-hover:opacity-100"></div>
        </button>
      </div>

      {/* Chat window */}
      {open && user && (
        <div className="fixed bottom-24 right-2 w-[96vw] sm:w-[420px] md:w-[520px] lg:w-[600px] xl:w-[700px] max-h-[90vh] z-50 bg-zinc-900/90 backdrop-blur-lg border border-[#5d6bb7]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-[#7c8bd2] via-[#5d6bb7] to-[#3f4b9c] text-white px-5 py-4 font-semibold text-lg flex items-center gap-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2]/20 to-[#3f4b9c]/20 animate-pulse"></div>
            <Bot className="text-white relative z-10" />
            <span className="relative z-10">AlgoGrit DSA Assistant</span>
          </div>

          <div className="flex-1 px-4 py-3 overflow-y-auto text-sm algogrit-scrollbar">
            {messages.length === 0 && (
              <div className="text-zinc-400 italic mt-4 text-center">
                Ask me about recursion, graphs, DP, or any DSA topic.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`my-2 flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 max-w-[80%] rounded-lg whitespace-pre-wrap text-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-zinc-800 to-zinc-700 text-white rounded-br-none border border-[#5d6bb7]/20"
                      : "bg-gradient-to-r from-[#5d6bb7]/10 to-[#3f4b9c]/10 text-zinc-300 border border-[#5d6bb7]/30 rounded-bl-none max-h-[350px] overflow-y-auto"
                  }`}
                  style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                >
                  {msg.sender === "bot" ? (
                    <ReactMarkdown
                      components={{
                        strong: (props) => (
                          <strong className="font-bold text-white" {...props} />
                        ),
                        em: (props) => (
                          <em className="italic text-[#7c8bd2]" {...props} />
                        ),
                        code: (props) => (
                          <code className="bg-zinc-800 px-1 py-0.5 rounded text-[#7c8bd2] font-mono break-words whitespace-pre-wrap inline-block max-w-full overflow-x-auto" {...props} />
                        ),
                        pre: (props) => (
                          <pre className="bg-zinc-900 rounded p-2 my-2 overflow-x-auto text-xs" style={{ maxWidth: '100%' }} {...props} />
                        ),
                        ul: (props) => <ul className="list-disc ml-5" {...props} />,
                        ol: (props) => <ol className="list-decimal ml-5" {...props} />,
                        li: (props) => <li className="mb-1" {...props} />,
                        a: (props) => (
                          <a
                            className="text-[#7c8bd2] underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          />
                        ),
                        p: (props) => <p className="mb-2" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-transparent bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] bg-clip-text animate-pulse text-left pl-1">
                AlgoGrit is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-3 border-t border-[#5d6bb7]/20 bg-zinc-950 flex items-center gap-2">
            <input
              className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c8bd2] border border-zinc-700 focus:border-[#7c8bd2] transition-colors"
              placeholder="e.g., How does Dijkstra's algorithm work?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={!prompt.trim()}
              className={`relative p-2.5 rounded-lg text-white transition-all duration-300 group overflow-hidden ${
                !prompt.trim()
                  ? "opacity-50 cursor-not-allowed bg-gray-600"
                  : "bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] hover:from-[#5d6bb7] hover:to-[#3f4b9c] shadow-lg hover:shadow-xl"
              }`}
            >
              {prompt.trim() && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2] to-[#3f4b9c] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300 scale-150"></div>
                </>
              )}
              <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-200">
                <Send size={14} />
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
}