"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Globe, Filter, Code, Bot, StickyNote } from 'lucide-react';
import { cn } from "@/lib/utils";

function Features() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

interface MousePosition {
    x: number;
    y: number;
}

interface Feature {
    id: number;
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
    stats: string;
    platforms: string[];
}

const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    setMousePosition({
        x: e.clientX,
        y: e.clientY
    });
};

  const features = [
    {
      id: 1,
      icon: Globe,
      title: "Questions from All Platforms",
      description: "Access questions from LeetCode, Codeforces, GeeksforGeeks, CSES, LightOJ, CodeChef, AtCoder, and many more platforms in one unified interface.",
      gradient: "from-[#7c8bd2] to-[#5d6bb7]",
      stats: "10+ Platforms",
      platforms: ["LeetCode", "Codeforces", "GfG", "CSES", "CodeChef"]
    },
    {
      id: 2,
      icon: Filter,
      title: "Smart Question Filtering",
      description: "Filter questions by difficulty, topics, companies, contest types, or your custom preferences to practice exactly what you need.",
      gradient: "from-[#5d6bb7] to-[#3f4b9c]",
      stats: "Advanced Filters",
      platforms: ["Difficulty", "Topics", "Companies", "Tags", "Contest"]
    },
    {
      id: 3,
      icon: Code,
      title: "Integrated Code IDE",
      description: "Built-in code editor with syntax highlighting, autocomplete, and one-click download/submit functionality directly to platforms.",
      gradient: "from-[#3f4b9c] to-[#2c3875]",
      stats: "Multi-language IDE",
      platforms: ["C++", "Java", "Python", "JavaScript", "Go"]
    },
    {
      id: 4,
      icon: Bot,
      title: "AI Code Assistant",
      description: "Get instant help with your code, debugging assistance, algorithm explanations, and optimization suggestions from our AI chatbot.",
      gradient: "from-[#2c3875] to-[#1a2454]",
      stats: "24/7 AI Help",
      platforms: ["Debug", "Explain", "Optimize", "Hints", "Solutions"]
    },
    {
      id: 5,
      icon: StickyNote,
      title: "Smart Note Taking",
      description: "Take organized notes for each question, save your approaches, bookmark important problems, and create your personal study guide.",
      gradient: "from-[#1a2454] to-[#7c8bd2]",
      stats: "Organized Notes",
      platforms: ["Bookmarks", "Tags", "Approaches", "Tips", "Review"]
    }
  ];

  return (
    <section 
      className="relative min-h-screen py-20 bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div
        className={cn(
          "absolute inset-0 transition-all duration-300 ease-out",
          "[background-size:25px_25px]",
          "[background-image:radial-gradient(circle,#262626_1px,transparent_1px)]",
        )}
        style={{
          transform: `translate(${mousePosition.x * -0.005}px, ${mousePosition.y * -0.005}px)`
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-20 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 139, 210, 0.1), transparent 50%)`
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        <div className="text-center mb-16">
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Everything you need to master data structures, algorithms, and ace your coding interviews
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                viewport={{ once: true }}
                className={cn(
                  "group relative p-8 rounded-2xl border w-full md:w-4/5 transition-all duration-300 cursor-pointer",
                  "bg-black/50 backdrop-blur-sm",
                  "border-neutral-800",
                  "hover:border-[#7c8bd2]/30 hover:shadow-xl hover:shadow-[#7c8bd2]/10",
                  "hover:-translate-y-2",
                  isEven ? "self-start" : "self-end"
                )}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  `bg-gradient-to-br ${feature.gradient}`,
                  "p-[1px]"
                )}>
                  <div className="w-full h-full rounded-2xl bg-black"></div>
                </div>

                <div className="relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-xl mb-6 flex items-center justify-center transition-all duration-300",
                    `bg-gradient-to-br ${feature.gradient}`,
                    "group-hover:scale-110 group-hover:rotate-3"
                  )}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  <div className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-4 bg-[#7c8bd2]/10 text-[#7c8bd2] border border-[#7c8bd2]/20">
                    {feature.stats}
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#7c8bd2] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-neutral-400 leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {feature.platforms.map((platform, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-md bg-[#7c8bd2]/10 text-[#7c8bd2] border border-[#7c8bd2]/20 font-mono"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>

                  <div className={cn(
                    "flex items-center text-[#7c8bd2] opacity-0 group-hover:opacity-100 transition-all duration-300",
                    "transform translate-x-0 group-hover:translate-x-2"
                  )}>
                    <span className="text-sm font-mono mr-2">explore</span>
                    <span className="text-lg">→</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <div className="text-xs font-mono text-[#7c8bd2]">
                    {String(feature.id).padStart(2, '0')}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-20">
          <div className="inline-block px-6 py-2 rounded-full text-sm font-mono bg-gradient-to-r from-[#7c8bd2]/10 to-[#5d6bb7]/10 text-[#7c8bd2] border border-[#7c8bd2]/20">
            // All-in-one platform for competitive programming
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;