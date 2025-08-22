"use client";
import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useNotes } from "@/context/notesContext";
import problems from "@/data/problems.json";
import { 
  X, 
  Bold, 
  Italic, 
  Link, 
  Code, 
  Heading1, 
  Eraser, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { cn } from "@/lib/utils";

type AddNoteFormProps = {
  onClose: () => void;
};

export const AddNoteForm: React.FC<AddNoteFormProps> = ({ onClose }) => {
  const { addNote } = useNotes();
  const allTags = Array.from(
    new Set(problems.problems.flatMap((p) => p.tags))
  ).sort();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Markdown toolbar handlers
  const insertMarkdown = (
    syntax: "bold" | "italic" | "link" | "code" | "heading" | "clear"
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const selected = content.substring(start, end);
    let insert = "";
    if (syntax === "bold") {
      insert = `**${selected || "bold text"}**`;
    } else if (syntax === "italic") {
      insert = `*${selected || "italic text"}*`;
    } else if (syntax === "link") {
      insert = `[${selected || "link text"}](https://)`;
    } else if (syntax === "code") {
      insert = `\`\`\`\n${selected || "code"}\n\`\`\``;
    } else if (syntax === "heading") {
      insert = `# ${selected || "Heading"}`;
    } else if (syntax === "clear") {
      const cleared = selected
        .replace(/(\*\*|__)(.*?)\1/g, "$2")
        .replace(/(\*|_)(.*?)\1/g, "$2")
        .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
        .replace(/^>\s?/gm, "")
        .replace(/^(-|\*)\s+/gm, "")
        .replace(/^\d+\.\s+/gm, "")
        .replace(/^-{3,}$/gm, "");
      insert = cleared;
    }
    const newContent = before + insert + after;
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      if (syntax === "link") {
        textarea.setSelectionRange(start + 1, start + insert.length - 11);
      } else if (syntax === "bold" || syntax === "italic") {
        textarea.setSelectionRange(start + 2, start + insert.length - 2);
      } else if (syntax === "heading") {
        textarea.setSelectionRange(start + 2, start + insert.length);
      } else if (syntax === "code") {
        textarea.setSelectionRange(start + 4, start + insert.length - 4);
      } else if (syntax === "clear") {
        textarea.setSelectionRange(start, start + insert.length);
      }
    }, 0);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    setIsSubmitting(true);
    try {
      await addNote({
        title: title.trim(),
        content: content.trim() || "",
        tags,
      });
      onClose();
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to save note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Custom Scrollbar Styles */}
      <style>
        {`
          /* Custom scrollbar for dark theme */
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
      <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700/50 bg-gradient-to-r from-zinc-900 to-zinc-800">
          <div>
            <h3 className="text-2xl font-bold text-white">Create New Note</h3>
            <p className="text-zinc-400 text-sm mt-1">Organize your thoughts with markdown support</p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="p-2 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50 text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto algogrit-scrollbar">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter note title..."
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]/50 focus:border-[#7c8bd2] transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Content Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-zinc-300">
                Content
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 rounded-md transition-colors text-zinc-300"
                disabled={isSubmitting}
              >
                {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
            </div>
            
            {/* Markdown Toolbar */}
            <div className="flex flex-wrap gap-2 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                title="Bold"
                onClick={() => insertMarkdown("bold")}
                disabled={isSubmitting}
              >
                <Bold size={14} />
                <span className="text-xs">Bold</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                title="Italic"
                onClick={() => insertMarkdown("italic")}
                disabled={isSubmitting}
              >
                <Italic size={14} />
                <span className="text-xs">Italic</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                title="Link"
                onClick={() => insertMarkdown("link")}
                disabled={isSubmitting}
              >
                <Link size={14} />
                <span className="text-xs">Link</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                title="Code Block"
                onClick={() => insertMarkdown("code")}
                disabled={isSubmitting}
              >
                <Code size={14} />
                <span className="text-xs">Code</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                title="Heading"
                onClick={() => insertMarkdown("heading")}
                disabled={isSubmitting}
              >
                <Heading1 size={14} />
                <span className="text-xs">Heading</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-700 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                title="Clear Formatting"
                onClick={() => insertMarkdown("clear")}
                disabled={isSubmitting}
              >
                <Eraser size={14} />
                <span className="text-xs">Clear</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Content Editor */}
              <div className={showPreview ? "lg:col-span-1" : "col-span-1"}>
                <textarea
                  ref={textareaRef}
                  className="w-full h-48 rounded-lg bg-zinc-800 border border-zinc-600 px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]/50 focus:border-[#7c8bd2] transition-colors resize-none algogrit-scrollbar"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your note... (Markdown supported)"
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Preview */}
              {showPreview && content && (
                <div className="lg:col-span-1">
                  <div className="text-xs font-medium text-zinc-400 mb-2">Preview</div>
                  <div className="h-48 prose prose-invert prose-sm bg-zinc-800 border border-zinc-600 rounded-lg p-4 overflow-auto algogrit-scrollbar">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-300">
              Tags (select or type and press Enter)
            </label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-zinc-800 rounded-lg border border-zinc-700 algogrit-scrollbar">
              {allTags.map((tag) => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => {
                      if (!isSelected) setTags([...tags, tag]);
                      else setTags(tags.filter((t) => t !== tag));
                    }}
                    disabled={isSubmitting}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm border transition-all duration-200 disabled:opacity-50",
                      isSelected
                        ? "bg-[#7c8bd2] text-white border-[#7c8bd2] shadow-md transform scale-105"
                        : "bg-zinc-700 border-zinc-600 text-zinc-300 hover:bg-zinc-600 hover:border-zinc-500 hover:text-white"
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            {/* Add custom tag input */}
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]/50 focus:border-[#7c8bd2] transition-colors"
              placeholder="Type a tag and press Enter..."
              onKeyDown={handleTagInput}
              disabled={isSubmitting}
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center px-3 py-1 bg-[#7c8bd2]/20 text-[#7c8bd2] rounded-full text-sm border border-[#7c8bd2]/30"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-2 text-[#7c8bd2] hover:text-red-500"
                      onClick={() => setTags(tags.filter((t, i) => i !== index))}
                      tabIndex={-1}
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-zinc-700/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors disabled:opacity-50 border border-zinc-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-[#7c8bd2] to-[#6a79c4] hover:from-[#5d6bb7] hover:to-[#5663a8] text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                "Create Note"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};