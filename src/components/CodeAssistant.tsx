"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send } from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function CodeAssistant() {
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

    // Dummy AI logic - replace with actual API call
    const botReply = `Good question! Let's approach "${userMessage}" using DSA techniques like dynamic programming, trees, or graph traversal.`;

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="relative p-4 bg-gradient-to-br from-[#7c8bd2] via-[#5d6bb7] to-[#3f4b9c] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2] via-[#5d6bb7] to-[#3f4b9c] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full animate-pulse"></div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7c8bd2] to-[#5d6bb7] blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300 rounded-full scale-150"></div>
          
          {/* Icon */}
          <div className="relative z-10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <Bot size={22} />
          </div>
          
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-0 group-hover:opacity-100"></div>
        </button>
      </div>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-4 w-[90vw] sm:w-[500px] md:w-[560px] max-h-[80vh] z-50 bg-zinc-900/90 backdrop-blur-lg border border-[#5d6bb7]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header with enhanced gradient */}
          <div className="bg-gradient-to-r from-[#7c8bd2] via-[#5d6bb7] to-[#3f4b9c] text-white px-5 py-4 font-semibold text-lg flex items-center gap-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2]/20 to-[#3f4b9c]/20 animate-pulse"></div>
            <Bot className="text-white relative z-10" />
            <span className="relative z-10">AlgoGrit DSA Assistant</span>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-3 overflow-y-auto text-sm scrollbar-thin scrollbar-thumb-[#5d6bb7]/60 scrollbar-track-transparent">
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
                      : "bg-gradient-to-r from-[#5d6bb7]/10 to-[#3f4b9c]/10 text-zinc-300 border border-[#5d6bb7]/30 rounded-bl-none"
                  }`}
                >
                  {msg.text}
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

          {/* Input with enhanced send button */}
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