import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  Tag,
} from 'lucide-react';

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
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [codeLang, setCodeLang] = useState('');
  const [codeBlock, setCodeBlock] = useState('');

  // Markdown toolbar handlers
  const insertMarkdown = (
    syntax:
      | 'bold'
      | 'italic'
      | 'underline'
      | 'link'
      | 'heading'
      | 'heading2'
      | 'heading3'
      | 'code'
      | 'quote'
      | 'ul'
      | 'ol'
      | 'hr'
      | 'clear'
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const selected = content.substring(start, end);
    let insert = '';

    switch (syntax) {
      case 'bold':
        insert = `**${selected || 'bold text'}**`;
        break;
      case 'italic':
        insert = `*${selected || 'italic text'}*`;
        break;
      case 'underline':
        insert = `<u>${selected || 'underline'}</u>`;
        break;
      case 'link':
        insert = `[${selected || 'link text'}](https://)`;
        break;
      case 'heading':
        insert = `# ${selected || 'Heading'}`;
        break;
      case 'heading2':
        insert = `## ${selected || 'Heading 2'}`;
        break;
      case 'heading3':
        insert = `### ${selected || 'Heading 3'}`;
        break;
      case 'code':
        insert = `\`\`\`\n${selected || 'code'}\n\`\`\``;
        break;
      case 'quote':
        insert = `> ${selected || 'quote'}`;
        break;
      case 'ul':
        insert = `- ${selected || 'list item'}`;
        break;
      case 'ol':
        insert = `1. ${selected || 'numbered item'}`;
        break;
      case 'hr':
        insert = `\n---\n`;
        break;
      case 'clear':
        const cleared = selected
          .replace(/(\*\*|__)(.*?)\1/g, '$2')
          .replace(/(\*|_)(.*?)\1/g, '$2')
          .replace(/<u>(.*?)<\/u>/g, '$1')
          .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
          .replace(/^#{1,6}\s+/gm, '')
          .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')
          .replace(/^>\s?/gm, '')
          .replace(/^(-|\*)\s+/gm, '')
          .replace(/^\d+\.\s+/gm, '')
          .replace(/^-{3,}$/gm, '');
        insert = cleared;
        break;
      default:
        break;
    }

    const newContent = before + insert + after;
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      if (syntax === 'link') {
        textarea.setSelectionRange(start + 1, start + insert.length - 11);
      } else if (syntax === 'bold' || syntax === 'italic') {
        textarea.setSelectionRange(start + 2, start + insert.length - 2);
      } else if (syntax === 'underline') {
        textarea.setSelectionRange(start + 3, start + insert.length - 4);
      } else if (syntax === 'heading') {
        textarea.setSelectionRange(start + 2, start + insert.length);
      } else if (syntax === 'heading2') {
        textarea.setSelectionRange(start + 3, start + insert.length);
      } else if (syntax === 'heading3') {
        textarea.setSelectionRange(start + 4, start + insert.length);
      } else if (syntax === 'code') {
        textarea.setSelectionRange(start + 4, start + insert.length - 4);
      } else if (syntax === 'quote' || syntax === 'ul' || syntax === 'ol') {
        textarea.setSelectionRange(
          start + insert.indexOf(selected || ''),
          start +
            insert.indexOf(selected || '') +
            (selected ? selected.length : 0)
        );
      } else if (syntax === 'clear') {
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
      console.error('Error saving note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertCodeBlock = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const lang = codeLang.trim();
    const code = codeBlock.length ? codeBlock : 'code';
    const block = `\n\n\`\`\`${lang ? lang : ''}\n${code}\n\`\`\`\n\n`;
    const newContent = before + block + after;
    setContent(newContent);
    setShowCodePanel(false);
    setCodeLang('');
    setCodeBlock('');
    setTimeout(() => {
      textarea.focus();
      const caret = start + block.length;
      textarea.setSelectionRange(caret, caret);
    }, 0);
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
        <div className="flex items-center justify-between p-5 border-b border-zinc-700/50 bg-zinc-900/80 backdrop-blur">
          <div>
            <h3 className="text-xl font-semibold text-white">Edit Note</h3>
            <p className="text-zinc-400 text-xs mt-1">
              Make changes to your note with markdown support
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="p-2 rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50 text-zinc-400 hover:text-white border border-transparent hover:border-zinc-700"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto algogrit-scrollbar"
        >
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]/50 focus:border-[#7c8bd2] transition-colors text-lg font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {/* Enhanced Markdown Toolbar */}
            <TooltipProvider>
              <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-900/70 rounded-lg border border-zinc-700">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50" onClick={() => insertMarkdown('bold')} disabled={isSubmitting} aria-label="Bold">
                      <Bold size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Bold</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50" onClick={() => insertMarkdown('italic')} disabled={isSubmitting} aria-label="Italic">
                      <Italic size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Italic</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50" onClick={() => insertMarkdown('underline')} disabled={isSubmitting} aria-label="Underline">
                      <Underline size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Underline</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50" onClick={() => insertMarkdown('link')} disabled={isSubmitting} aria-label="Link">
                      <Link size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Link</TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-zinc-700 mx-1" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50" onClick={() => insertMarkdown('heading')} disabled={isSubmitting} aria-label="Heading 1">
                      <Heading1 size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Heading 1</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50" onClick={() => insertMarkdown('heading2')} disabled={isSubmitting} aria-label="Heading 2">
                      <Heading2 size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Heading 2</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50" onClick={() => insertMarkdown('heading3')} disabled={isSubmitting} aria-label="Heading 3">
                      <Heading3 size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Heading 3</TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-zinc-700 mx-1" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-[#7c8bd2] text-white hover:opacity-90 border border-[#7c8bd2] disabled:opacity-50" onClick={() => setShowCodePanel((v) => !v)} disabled={isSubmitting} aria-label="Code Block">
                      <Code size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Code Block</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50" onClick={() => insertMarkdown('quote')} disabled={isSubmitting} aria-label="Quote">
                      <Quote size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Quote</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50" onClick={() => insertMarkdown('ul')} disabled={isSubmitting} aria-label="Bullet List">
                      <List size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Bullet List</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50" onClick={() => insertMarkdown('ol')} disabled={isSubmitting} aria-label="Numbered List">
                      <ListOrdered size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Numbered List</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 disabled:opacity-50" onClick={() => insertMarkdown('hr')} disabled={isSubmitting} aria-label="Horizontal Rule">
                      <Minus size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Horizontal Rule</TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-zinc-700 mx-1" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="h-8 w-8 grid place-items-center rounded-md bg-red-700/80 text-white hover:bg-red-600 border border-red-700 disabled:opacity-50" onClick={() => insertMarkdown('clear')} disabled={isSubmitting} aria-label="Clear formatting">
                      <Eraser size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Clear formatting</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            {showCodePanel && (
              <div className="mt-3 rounded-lg border border-zinc-700 bg-zinc-900/70 p-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs text-zinc-400 mb-1">Language (optional)</label>
                    <input
                      type="text"
                      value={codeLang}
                      onChange={(e) => setCodeLang(e.target.value)}
                      placeholder="e.g., javascript"
                      className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]/50 focus:border-[#7c8bd2]"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs text-zinc-400 mb-1">Code</label>
                    <textarea
                      value={codeBlock}
                      onChange={(e) => setCodeBlock(e.target.value)}
                      placeholder="Paste or type your code here..."
                      className="w-full h-28 rounded-md bg-zinc-900 border border-zinc-700 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]/50 focus:border-[#7c8bd2] resize-none algogrit-scrollbar font-mono text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-1.5 rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700"
                    onClick={() => {
                      setShowCodePanel(false);
                      setCodeLang('');
                      setCodeBlock('');
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-1.5 rounded-md bg-[#7c8bd2] text-white hover:bg-[#6a79c4]"
                    onClick={insertCodeBlock}
                    disabled={isSubmitting}
                  >
                    Insert
                  </button>
                </div>
              </div>
            )}

            <div
              className={`grid gap-4 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}
            >
              {/* Content Editor */}
              <div>
                <textarea
                  ref={textareaRef}
                  className="w-full h-64 rounded-lg bg-zinc-800 border border-zinc-600 px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]/50 focus:border-[#7c8bd2] transition-colors resize-none algogrit-scrollbar"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="Write your note here using Markdown..."
                />
              </div>

              {/* Preview */}
              {showPreview && (
                <div>
                  <div className="text-xs font-medium text-zinc-400 mb-2">
                    Live Preview
                  </div>
                  <div className="h-64 prose prose-invert prose-sm bg-zinc-800 border border-zinc-600 rounded-lg p-4 overflow-auto algogrit-scrollbar">
                    <style>{`.prose pre{background:#1f2937;border-radius:0.5rem;padding:0.75rem}.prose code{background:#111827;border-radius:0.375rem;padding:0.15rem 0.3rem}`}</style>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        code({ className, children, ...props }) {
                          const match = /language-([^\s]+)/.exec(className || '');
                          if (match) {
                            const lang = match[1];
                            return (
                              <div className="relative">
                                <div className="absolute top-0 right-0 m-2 rounded bg-zinc-700 text-zinc-300 text-[10px] px-2 py-0.5 border border-zinc-600">
                                  {lang}
                                </div>
                                <pre className="bg-[#1f2937] rounded-lg p-3 overflow-x-auto">
                                  <code className={className} {...props}>{children}</code>
                                </pre>
                              </div>
                            );
                          }
                          return (
                            <code className={className} {...props}>{children}</code>
                          );
                        },
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Tag size={16} />
              Tags
              <span className="text-xs text-zinc-400 font-normal">
                (select or type and press Enter)
              </span>
            </label>
            <div className="space-y-2">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-600 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#7c8bd2]/50 focus:border-[#7c8bd2] transition-colors"
                placeholder="Type a tag and press Enter..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value && !tags.includes(value)) {
                      setTags([...tags, value]);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
                disabled={isSubmitting}
                list="note-tag-suggestions"
              />
              <datalist id="note-tag-suggestions">
                {tags.map((tag) => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
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
                        onClick={() =>
                          setTags(tags.filter((t, i) => i !== index))
                        }
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
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors disabled:opacity-50 border border-zinc-700"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#7c8bd2] hover:bg-[#6a79c4] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow"
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