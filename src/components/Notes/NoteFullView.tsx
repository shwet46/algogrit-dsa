import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CalendarDays, Pencil, X } from 'lucide-react';
import type { Note } from './NoteEditForm';

interface NoteFullViewProps {
  note: Note;
  onClose: () => void;
  onEdit?: () => void;
}

export default function NoteFullView({
  note,
  onClose,
  onEdit,
}: NoteFullViewProps) {
  if (!note) return null;

  let createdAtStr = '';
  if (
    note.createdAt &&
    typeof note.createdAt === 'object' &&
    note.createdAt !== null &&
    typeof (note.createdAt as { toDate?: unknown }).toDate === 'function'
  ) {
    createdAtStr = (note.createdAt as unknown as { toDate: () => Date })
      .toDate()
      .toLocaleString();
  } else if (note.createdAt instanceof Date) {
    createdAtStr = note.createdAt.toLocaleString();
  } else if (
    typeof note.createdAt === 'string' ||
    typeof note.createdAt === 'number'
  ) {
    createdAtStr = String(note.createdAt);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <Card className="relative w-full max-w-4xl h-[92vh] max-h-[92vh] overflow-hidden border border-border bg-card text-card-foreground shadow-2xl flex flex-col p-0 gap-0">
        {/* Header Section */}
        <CardHeader className="border-b border-border bg-background/80 backdrop-blur px-6 sm:px-8 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                {note.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4 flex-shrink-0" />
                <span>{createdAtStr}</span>
              </CardDescription>
            </div>

            <CardAction className="flex items-center gap-2 flex-shrink-0">
              {onEdit && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onEdit}
                        aria-label="Edit note"
                        className=""
                      >
                        <Pencil className="size-4" />
                        <span className="hidden sm:inline ml-2">Edit</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit this note</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onClose}
                      aria-label="Close"
                      className=""
                    >
                      <X className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Close</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardAction>
          </div>
        </CardHeader>

        {/* Content Section */}
        <div className="min-h-0 flex-1">
          <ScrollArea className="h-full min-h-0">
            <div className="px-6 sm:px-8 py-6">
              {/* Tags */}
              {note.tags?.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {note.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Markdown Content */}
              <div className="prose prose-invert max-w-none break-words prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-([^\s]+)/.exec(className || '');
                      
                      if (match) {
                        const lang = match[1];
                        return (
                          <div className="relative my-4">
                            <span className="absolute top-3 right-3 z-10 rounded-md bg-background/80 text-muted-foreground text-xs px-2.5 py-1 border border-border font-mono">
                              {lang}
                            </span>
                            <pre className="bg-muted rounded-lg p-4 pt-10 overflow-x-auto border border-border shadow-sm">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        );
                      }

                      return (
                        <code
                          className={`${className ?? ''} bg-muted border border-border rounded px-1 py-0.5 text-sm`}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {note.content}
                </ReactMarkdown>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-border bg-background/60 backdrop-blur">
          <Button variant="ghost" onClick={onClose} className="">
            Close
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>
              <Pencil className="size-4 mr-2" />
              Edit Note
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}