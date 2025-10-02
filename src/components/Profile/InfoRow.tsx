"use client";

import React from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/outline";

export function InfoRow({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string | null | undefined;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-zinc-400">{label}</span>
      <span className="flex items-center gap-2">
        <span>{value || "—"}</span>
        {onCopy && value && (
          <button
            onClick={onCopy}
            className="p-1 rounded-md hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-emerald-400" />
            ) : (
              <ClipboardDocumentIcon className="h-4 w-4" />
            )}
          </button>
        )}
      </span>
    </div>
  );
}