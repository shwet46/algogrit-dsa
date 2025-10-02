"use client";

import React from "react";

export function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-zinc-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-700/50 outline-none text-white placeholder:text-zinc-500 text-sm focus:border-indigo-400/50"
      />
    </div>
  );
}