'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { z } from 'zod';
import { WavyBackground } from '@/components/ui/wavy-background';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    const validation = LoginSchema.safeParse({ email, password });

    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: unknown) {
      let message = 'Login failed. Please try again.';
      if (err && typeof err === 'object' && 'code' in err) {
        const code = (err as { code?: string }).code;
        message =
          code === 'auth/user-not-found'
            ? 'User not found.'
            : code === 'auth/wrong-password'
              ? 'Incorrect password.'
              : code === 'auth/invalid-email'
                ? 'Invalid email address.'
                : 'Login failed. Please try again.';
      }

      setError(message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WavyBackground containerClassName="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="w-full max-w-sm mx-auto px-6 py-12 z-10 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-indigo-300 font-black mb-3 tracking-tight">
            AlgoGrit DSA
          </h1>
          <p className="text-zinc-400 text-lg font-medium">
            Sign in to your account
          </p>
        </div>

        <div className="space-y-5">
          <InputField
            icon={<EnvelopeIcon className="h-5 w-5 text-zinc-300" />}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            icon={<LockClosedIcon className="h-5 w-5 text-zinc-300" />}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm font-medium text-center">
              {error}
            </p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-8 relative group overflow-hidden rounded-lg py-4 px-8 bg-white text-black font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 group-hover:text-white">
            {loading ? 'Logging in...' : 'Login'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-[#7c8bd2] to-[#5d6bb7] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </button>

        <div className="mt-8 text-center">
          <p className="text-zinc-400 text-base">
            Don&apos;t have an account?{' '}
            <a
              href="/signup"
              className="text-white font-semibold hover:underline hover:text-zinc-200"
            >
              Sign up
            </a>
          </p>
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-600 text-sm font-medium">
            © 2025 AlgoGrit DSA. All rights reserved.
          </p>
        </div>
      </div>
    </WavyBackground>
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
  return (
    <div className="group relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-4 bg-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-lg focus:border-indigo-400/50 focus:bg-zinc-800/80 outline-none text-white placeholder:text-zinc-400 text-base font-medium transition-all duration-300"
      />
    </div>
  );
}