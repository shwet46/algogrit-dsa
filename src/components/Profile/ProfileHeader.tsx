"use client";

import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export function ProfileHeader({
  title,
  username,
}: {
  title: string;
  username: string | undefined;
}) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="h-20 w-20 flex items-center justify-center rounded-full bg-zinc-800 border-2 border-zinc-700">
        <UserCircleIcon className="h-10 w-10 text-zinc-600" />
      </div>
      <div>
        <div className="text-xl font-semibold leading-tight text-white">{title}</div>
        <div className="text-zinc-400 text-sm">@{username || "—"}</div>
      </div>
    </div>
  );
}