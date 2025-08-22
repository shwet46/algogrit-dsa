import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  Heading1, 
  Heading2, 
  Heading3, 
  Code, 
  Quote, 
  List, 
  ListOrdered, 
  Minus, 
  Eraser,
  Eye,
  EyeOff,
  Save,
  X,
  Tag
} from "lucide-react";

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date; // changed from any to Date
};

type Props = {
  note: Note;
  onSave: (n: Note) => void;
  onCancel: () => void;
};

export default function NoteEditForm({ note, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Markdown toolbar handlers
  const insertMarkdown = (
    syntax:
      | "bold"
      | "italic"
      | "underline"
      | "link"
      | "heading"
      | "heading2"
      | "heading3"
      | "code"
      | "quote"
      | "ul"
      | "ol"
      | "hr"
      | "clear"
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const selected = content.substring(start, end);
    let insert = "";
    
    switch (syntax) {
      case "bold":
        insert = `**${selected || "bold text"}**`;
        break;
      case "italic":
        insert = `*${selected || "italic text"}*`;
        break;
      case "underline":
        insert = `<u>${selected || "underline"}</u>`;
        break;
      case "link":
        insert = `[${selected || "link text"}](https://)`;
        break;
      case "heading":
        insert = `# ${selected || "Heading"}`;
        break;
      case "heading2":
        insert = `## ${selected || "Heading 2"}`;
        break;
      case "heading3":
        insert = `### ${selected || "Heading 3"}`;
        break;
      case "code":
        insert = `\`\`\`\n${selected || "code"}\n\`\`\``;
        break;
      case "quote":
        insert = `> ${selected || "quote"}`;
        break;
      case "ul":
        insert = `- ${selected || "list item"}`;
        break;
      case "ol":
        insert = `1. ${selected || "numbered item"}`;
        break;
      case "hr":
        insert = `\n---\n`;
        break;
      case "clear":
        const cleared = selected
          .replace(/(\*\*|__)(.*?)\1/g, "$2")
          .replace(/(\*|_)(.*?)\1/g, "$2")
          .replace(/<u>(.*?)<\/u>/g, "$1")
          .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
          .replace(/^#{1,6}\s+/gm, "")
          .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
          .replace(/^>\s?/gm, "")
          .replace(/^(-|\*)\s+/gm, "")
          .replace(/^\d+\.\s+/gm, "")
          .replace(/^-{3,}$/gm, "");
        insert = cleared;
        break;
      default:
        break;
    }
    
    const newContent = before + insert + after;
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      if (syntax === "link") {
        textarea.setSelectionRange(start + 1, start + insert.length - 11);
      } else if (syntax === "bold" || syntax === "italic") {
        textarea.setSelectionRange(start + 2, start + insert.length - 2);
      } else if (syntax === "underline") {
        textarea.setSelectionRange(start + 3, start + insert.length - 4);
      } else if (syntax === "heading") {
        textarea.setSelectionRange(start + 2, start + insert.length);
      } else if (syntax === "heading2") {
        textarea.setSelectionRange(start + 3, start + insert.length);
      } else if (syntax === "heading3") {
        textarea.setSelectionRange(start + 4, start + insert.length);
      } else if (syntax === "code") {
        textarea.setSelectionRange(start + 4, start + insert.length - 4);
      } else if (syntax === "quote" || syntax === "ul" || syntax === "ol") {
        textarea.setSelectionRange(
          start + insert.indexOf(selected || ""),
          start + insert.indexOf(selected || "") + (selected ? selected.length : 0)
        );
      } else if (syntax === "clear") {
        textarea.setSelectionRange(start, start + insert.length);
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      onSave({ ...note, title, content, tags });
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
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
      <div className="bg-zinc-900 border border-zinc-700/50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-700/50 bg-gradient-to-r from-zinc-900 to-zinc-800">
          <div>
            <h3 className="text-2xl font-bold text-white">Edit Note</h3>
            <p className="text-zinc-400 text-sm mt-1">Make changes to your note with markdown support</p>
          </div>
          <button 
            type="button" 
            onClick={onCancel} 
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
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]/50 focus:border-[#7c8bd2] transition-colors text-lg font-semibold"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Note title..."
            />
          </div>

          {/* Content Section */}
          <div className="space-y-3">
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
            
            {/* Enhanced Markdown Toolbar */}
            <div className="flex flex-wrap gap-1 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="flex gap-1">
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Bold"
                  onClick={() => insertMarkdown("bold")}
                  disabled={isSubmitting}
                >
                  <Bold size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Italic"
                  onClick={() => insertMarkdown("italic")}
                  disabled={isSubmitting}
                >
                  <Italic size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Underline"
                  onClick={() => insertMarkdown("underline")}
                  disabled={isSubmitting}
                >
                  <Underline size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Link"
                  onClick={() => insertMarkdown("link")}
                  disabled={isSubmitting}
                >
                  <Link size={16} />
                </button>
              </div>
              
              <div className="w-px h-8 bg-zinc-600 mx-1"></div>
              
              <div className="flex gap-1">
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Heading 1"
                  onClick={() => insertMarkdown("heading")}
                  disabled={isSubmitting}
                >
                  <Heading1 size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Heading 2"
                  onClick={() => insertMarkdown("heading2")}
                  disabled={isSubmitting}
                >
                  <Heading2 size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Heading 3"
                  onClick={() => insertMarkdown("heading3")}
                  disabled={isSubmitting}
                >
                  <Heading3 size={16} />
                </button>
              </div>
              
              <div className="w-px h-8 bg-zinc-600 mx-1"></div>
              
              <div className="flex gap-1">
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Code Block"
                  onClick={() => insertMarkdown("code")}
                  disabled={isSubmitting}
                >
                  <Code size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Quote"
                  onClick={() => insertMarkdown("quote")}
                  disabled={isSubmitting}
                >
                  <Quote size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Bullet List"
                  onClick={() => insertMarkdown("ul")}
                  disabled={isSubmitting}
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Numbered List"
                  onClick={() => insertMarkdown("ol")}
                  disabled={isSubmitting}
                >
                  <ListOrdered size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-md bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors disabled:opacity-50"
                  title="Horizontal Rule"
                  onClick={() => insertMarkdown("hr")}
                  disabled={isSubmitting}
                >
                  <Minus size={16} />
                </button>
              </div>
              
              <div className="w-px h-8 bg-zinc-600 mx-1"></div>
              
              <button
                type="button"
                className="p-2 rounded-md bg-red-700 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                title="Clear Formatting"
                onClick={() => insertMarkdown("clear")}
                disabled={isSubmitting}
              >
                <Eraser size={16} />
              </button>
            </div>

            <div className={`grid gap-4 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Content Editor */}
              <div>
                <textarea
                  ref={textareaRef}
                  className="w-full h-64 rounded-lg bg-zinc-800 border border-zinc-600 px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]/50 focus:border-[#7c8bd2] transition-colors resize-none algogrit-scrollbar"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Write your note here using Markdown..."
                />
              </div>
              
              {/* Preview */}
              {showPreview && (
                <div>
                  <div className="text-xs font-medium text-zinc-400 mb-2">Live Preview</div>
                  <div className="h-64 prose prose-invert prose-sm bg-zinc-800 border border-zinc-600 rounded-lg p-4 overflow-auto algogrit-scrollbar">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Tag size={16} />
              Tags
              <span className="text-xs text-zinc-400 font-normal">(select or type and press Enter)</span>
            </label>
            <div className="space-y-2">
              {/* Tag input with add-on-enter and tag suggestions */}
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]/50 focus:border-[#7c8bd2] transition-colors"
                placeholder="Type a tag and press Enter..."
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value && !tags.includes(value)) {
                      setTags([...tags, value]);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
                disabled={isSubmitting}
                list="note-tag-suggestions"
              />
              {/* Tag suggestions (optional, can be removed if not needed) */}
              <datalist id="note-tag-suggestions">
                {tags.map(tag => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
              {/* Tag display and remove */}
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-zinc-700/50">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors disabled:opacity-50 border border-zinc-600"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#7c8bd2] to-[#6a79c4] hover:from-[#5d6bb7] hover:to-[#5663a8] text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}