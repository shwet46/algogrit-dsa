"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { auth, db } from "@/firebase/config";
import { signOut, updateProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
// Removed unused ProfileHeader import (was triggering no-unused-vars lint error)
import { InfoRow } from "@/components/Profile/InfoRow";
import { FormField } from "@/components/Profile/FormField";
import { DateOfBirthPicker } from "@/components/Profile/DateOfBirthPicker";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen mt-20 w-full mb-24 text-white py-10 px-3 sm:px-6 md:px-10 lg:px-16">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-black" />
        <div className="absolute inset-0 [background-size:26px_26px] [background-image:radial-gradient(circle,#262626_1.2px,transparent_1.2px)] opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-indigo-200 to-indigo-300 bg-clip-text text-transparent">Account Dashboard</h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl">Review and manage all of the information associated with your AlgoGrit account. You can update your public profile, view authentication metadata, and sign out securely.</p>
        </header>
        <ProfileContent />
      </div>
    </div>
  );
}

type UserProfile = {
  uid: string;
  email?: string;
  emailLower: string;
  username: string;
  usernameLower: string;
  name?: string;
  dob?: string;
  createdAt?: Timestamp | Date | string;
};

type CreatedAtType = Timestamp | Date | ReturnType<typeof serverTimestamp>;

function isTimestamp(val: unknown): val is Timestamp {
  return (
    typeof val === "object" &&
    val !== null &&
    "toDate" in (val as Record<string, unknown>) &&
    typeof (val as Timestamp).toDate === "function"
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [copiedField, setCopiedField] = useState<null | "uid" | "email" | "username">(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ username: "", name: "", dob: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    let ignore = false;
    const load = async () => {
      try {
        setLoadingProfile(true);
        const refDoc = doc(db, "users", user.uid);
        const snap = await getDoc(refDoc);
        if (!ignore) {
          const data = (snap.exists() ? (snap.data() as UserProfile) : { email: user.email ?? undefined }) as UserProfile;
          setProfile(data);
          setForm({
            username: data?.username || "",
            name: data?.name || user.displayName || "",
            dob: data?.dob || "",
          });
        }
      } finally {
        setLoadingProfile(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [user]);

  const copy = async (label: "uid" | "email" | "username", value?: string | null) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const doSignOut = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  const handleSave = async () => {
    if (!user) return;
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const normalizedUsername = form.username.trim();
      if (!normalizedUsername) {
        throw new Error("Username is required.");
      }
      if (normalizedUsername && normalizedUsername !== profile?.username) {
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(normalizedUsername)) {
          throw new Error("Username must be 3-20 characters (letters, numbers, underscores).");
        }
        const unameDoc = await getDoc(doc(db, "usernames", normalizedUsername.toLowerCase()));
        if (unameDoc.exists()) {
          const owner = (unameDoc.data() as { uid?: string }).uid;
          if (owner && owner !== user.uid) throw new Error("Username is already taken.");
        }
      }

      const createdAtForWrite: CreatedAtType = (() => {
        const v = profile?.createdAt;
        if (!v) return serverTimestamp();
        if (v instanceof Date) return v;
        if (typeof v === "string") {
          const d = new Date(v);
          return isNaN(d.getTime()) ? serverTimestamp() : d;
        }
        if (isTimestamp(v)) return v;
        return serverTimestamp();
      })();
      const createdAtForState: string | Date | Timestamp | undefined = (() => {
        const v = profile?.createdAt;
        if (!v) return new Date();
        return v as string | Date | Timestamp;
      })();

      const emailLower = (user.email ?? profile?.email ?? "").toLowerCase();
      if (!emailLower) {
        throw new Error("Email is missing on your account. Please sign out and sign in again.");
      }

      const payload: {
        uid: string;
        email?: string;
        emailLower: string;
        username: string;
        usernameLower: string;
        name: string;
        createdAt: CreatedAtType;
        dob?: string;
      } = {
        uid: user.uid,
        email: user.email ?? profile?.email ?? "",
        emailLower,
        username: normalizedUsername || profile?.username || "",
        usernameLower: (normalizedUsername || profile?.username || "").toLowerCase(),
        name: form.name.trim(),
        createdAt: createdAtForWrite,
      };

      if (form.dob) {
        payload.dob = form.dob;
      }

      const batch = writeBatch(db);
      batch.set(doc(db, "users", user.uid), payload, { merge: true });

      const oldUsernameLower = (profile?.username || "").toLowerCase();
      const newUsernameLower = payload.usernameLower;
      if (oldUsernameLower && oldUsernameLower !== newUsernameLower) {
        batch.delete(doc(db, "usernames", oldUsernameLower));
      }
      batch.set(doc(db, "usernames", newUsernameLower), {
        uid: user.uid,
        usernameLower: newUsernameLower,
      });

      batch.set(doc(db, "emails", emailLower), {
        uid: user.uid,
        emailLower,
      });

      await batch.commit();

      await updateProfile(user, {
        displayName: payload.name,
      });

      const newProfileForState: UserProfile = {
        uid: payload.uid,
        email: payload.email,
        emailLower: payload.emailLower,
        username: payload.username,
        usernameLower: payload.usernameLower,
        name: payload.name,
        createdAt: createdAtForState,
        ...(payload.dob ? { dob: payload.dob } : {}),
      };
      setProfile(newProfileForState);
      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (e: unknown) {
      console.error("Profile save failed:", e);
      const code = (e && typeof e === "object" && "code" in e) ? ` (${String((e as { code?: unknown }).code)})` : "";
      setError((e instanceof Error ? e.message : "Failed to update profile.") + code);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-2xl border border-[#7c8bd2]/25 bg-zinc-950/40 shadow-xl p-6 text-center">
        <p className="text-zinc-300">You need to sign in to view your profile.</p>
        <a
          href="/login"
          className="inline-block mt-4 px-4 py-2 rounded-lg border border-indigo-400/40 text-indigo-300 hover:bg-indigo-500/10"
        >
          Sign In
        </a>
      </div>
    );
  }

  // Firebase auth metadata (live, not stored in Firestore)
  // If auth metadata is needed later, access via user.metadata (removed unused variable that triggered lint error)
  // (Metadata retained if needed for future, but not displayed now)
  // const creationTime = authMeta?.creationTime ? new Date(authMeta.creationTime) : undefined;
  // const lastSignInTime = authMeta?.lastSignInTime ? new Date(authMeta.lastSignInTime) : undefined;
  // const providers = user.providerData?.map(p => p?.providerId).filter(Boolean) || [];
  const photoURL = user.photoURL || undefined;

  return (
    <div className="rounded-2xl border border-indigo-400/15 bg-zinc-950/60 shadow-[0_0_0_1px_rgba(120,131,255,0.15)] backdrop-blur-sm p-6 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="relative w-24 h-24 shrink-0 rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-zinc-800 via-zinc-800 to-zinc-900 flex items-center justify-center overflow-hidden shadow-inner">
          {photoURL ? (
            <Image
              src={photoURL}
              alt="Avatar"
              fill
              sizes="96px"
              className="object-cover"
              priority
            />
          ) : (
            <span className="text-3xl font-semibold text-indigo-200">
              {(profile?.name || user.displayName || profile?.username || user.email || "?").slice(0,1).toUpperCase()}
            </span>
          )}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5" />
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-indigo-100 flex items-center gap-3">{profile?.name || user.displayName || profile?.username || "Your profile"}
            {user.emailVerified && <span className="text-[10px] uppercase bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">Verified</span>}
          </h2>
          <p className="text-sm text-zinc-400">Manage your personal details below.</p>
        </div>
      </div>

      <section className="bg-zinc-900/60 border border-indigo-400/15 rounded-xl p-5 sm:p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 mb-4">Profile Details</h3>
        {loadingProfile && !profile ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-zinc-800 rounded" />
            <div className="h-4 bg-zinc-800 rounded w-2/3" />
            <div className="h-4 bg-zinc-800 rounded w-1/3" />
          </div>
        ) : !editing ? (
          <div className="space-y-2">
            <InfoRow label="Username" value={profile?.username || "—"} onCopy={() => copy("username", profile?.username)} copied={copiedField === "username"} />
            <InfoRow label="Email" value={user.email || "—"} onCopy={() => copy("email", user.email)} copied={copiedField === "email"} />
            <InfoRow label="Name" value={profile?.name || user.displayName || "—"} />
            <InfoRow label="Date of Birth" value={profile?.dob || "—"} />
            <div className="pt-4 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-lg border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/10 text-sm"
              >
                Edit profile
              </button>
              <button
                onClick={doSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 text-sm"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Username" type="text" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder="your_handle" />
              <FormField label="Name" type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" />
              <DateOfBirthPicker value={form.dob} onChange={(v) => setForm((f) => ({ ...f, dob: v }))} />
            </div>
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg border border-zinc-700/50 text-zinc-400 hover:bg-zinc-800 text-sm">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 text-sm disabled:opacity-50">
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                onClick={doSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 text-sm"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </section>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
            {success}
        </div>
      )}

    
    </div>
  );
}

// Removed unused helper function formatDate (lint no-unused-vars)