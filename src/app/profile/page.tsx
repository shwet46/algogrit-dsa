"use client";
import React from 'react';
import { useAuth } from '@/context/authContext';

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen mt-20 w-full mb-16 bg-black text-white py-8 px-1 xs:px-2 sm:px-4 md:px-8 lg:px-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 [background-size:20px_20px] [background-image:radial-gradient(circle,#262626_1px,transparent_1px)] opacity-10" />
      </div>

      <div className="max-w-3xl mx-auto">
        <ProfileContent />
      </div>
    </div>
  );
}

function ProfileContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="rounded-2xl border border-[#7c8bd2]/25 bg-zinc-950/40 shadow-xl p-6 text-center">
        <p className="text-zinc-300">You need to sign in to view your profile.</p>
        <a href="/signup" className="inline-block mt-4 px-4 py-2 rounded-lg border border-[#7c8bd2]/40 text-[#c6cbf5] hover:bg-zinc-900/40">Sign In</a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#7c8bd2]/25 bg-zinc-950/40 shadow-xl p-6">
      <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
      <p className="text-zinc-300 mb-6">Manage your account details</p>

      <div className="grid gap-6">
        <div className="bg-zinc-900/60 border border-[#7c8bd2]/25 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[#c6cbf5] mb-2">Account</h2>
          <div className="text-sm text-zinc-300">
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-400">User ID</span>
              <span className="font-mono">{user.uid}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-400">Email</span>
              <span>{user.email || '—'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-zinc-400">Display Name</span>
              <span>{user.displayName || '—'}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-[#7c8bd2]/25 rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[#c6cbf5] mb-2">Security</h2>
          <p className="text-sm text-zinc-400">This account uses Firebase Authentication.</p>
        </div>
      </div>
    </div>
  );
}
