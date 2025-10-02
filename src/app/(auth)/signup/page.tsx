'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';

import { z } from 'zod';
import { WavyBackground } from '@/components/ui/wavy-background';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const SignupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters.')
    .max(20, 'Username must be at most 20 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Use only letters, numbers, and underscore.'),
  email: z.string().trim().email('Invalid email address.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .max(100, 'Password is too long.'),
});

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setError('');

    const validation = SignupSchema.safeParse({ username, email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const normalizedUsername = username.trim();
      const usernameLower = normalizedUsername.toLowerCase();
      const normalizedEmail = email.trim().toLowerCase();
      const usernameDoc = await getDoc(doc(db, 'usernames', usernameLower));
      if (usernameDoc.exists()) {
        setError('Username is already taken. Please choose another.');
        setLoading(false);
        return;
      }

      const emailDoc = await getDoc(doc(db, 'emails', normalizedEmail));
      if (emailDoc.exists()) {
        setError('Email is already in use. Please sign in or use a different email.');
        setLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );
      const user = userCredential.user;

      try {
        const batch = writeBatch(db);

        batch.set(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          emailLower: normalizedEmail,
          username: normalizedUsername,
          usernameLower,
          createdAt: serverTimestamp(),
        });

        batch.set(doc(db, 'usernames', usernameLower), {
          uid: user.uid,
          usernameLower,
          emailLower: normalizedEmail,
        });

        batch.set(doc(db, 'emails', normalizedEmail), {
          uid: user.uid,
          emailLower: normalizedEmail,
        });

        await batch.commit();
      } catch (error) {
        await user.delete();
        throw new Error(
          'Failed to create user profile: ' +
            (error instanceof Error ? error.message : 'Please try again.')
        );
      }

      await signOut(auth);
      router.push('/login');
    } catch (err: unknown) {
      let message = 'Signup failed. Please try again.';
      if (err && typeof err === 'object' && 'code' in err) {
        const code = (err as { code?: string }).code;
        message =
          code === 'auth/email-already-in-use'
            ? 'Email is already in use.'
            : code === 'auth/invalid-email'
              ? 'Invalid email address.'
              : code === 'auth/weak-password'
                ? 'Password should be at least 6 characters.'
                : 'Signup failed. Please try again.';
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSignup();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <WavyBackground containerClassName="absolute inset-0 w-full h-full">
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md mx-auto py-8">
            {/* Card container */}
            <div className="relative backdrop-blur-md bg-zinc-900/50 border border-zinc-800/60 rounded-xl shadow-2xl p-8 md:p-10">
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Image
                        src="/code.png"
                        alt="AlgoGrit DSA logo"
                        width={40}
                        height={40}
                        className="rounded-md shadow-sm"
                        priority
                      />
                      <h1 className="text-4xl md:text-5xl text-indigo-300 font-black tracking-tight">
                        AlgoGrit DSA
                      </h1>
                    </div>
                    <p className="text-zinc-400 text-lg font-medium">Create your account</p>
                  </div>

                {/* Form */}
                <div className="space-y-4" onKeyPress={handleKeyPress}>
                  <InputField
                    icon={<UserIcon className="h-5 w-5" />}
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <InputField
                    icon={<EnvelopeIcon className="h-5 w-5" />}
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputField
                    icon={<LockClosedIcon className="h-5 w-5" />}
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Error message */}
                {error && (
                  <div className="mt-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm font-medium text-center">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full mt-7 relative group overflow-hidden rounded-lg py-3.5 px-8 bg-zinc-100 text-black font-bold text-base transition-all duration-200 hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/20 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                {/* Footer */}
                <div className="mt-7 text-center">
                  <p className="text-zinc-400 text-sm">
                    Already have an account?{' '}
                    <a
                      href="/login"
                      className="text-white font-semibold hover:underline hover:text-zinc-200 transition-colors duration-150"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 text-center">
              <p className="text-zinc-600 text-xs font-medium">
                © 2025 AlgoGrit DSA. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </WavyBackground>
    </div>
  );
}

function InputField({
  icon,
  placeholder,
  type,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <div className={`transition-colors duration-200 ${isFocused ? 'text-indigo-300' : 'text-zinc-300'}`}>
          {icon}
        </div>
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-lg focus:border-indigo-400/50 focus:bg-zinc-800/80 outline-none text-white placeholder:text-zinc-400 text-base font-medium transition-all duration-200"
      />
    </div>
  );
}